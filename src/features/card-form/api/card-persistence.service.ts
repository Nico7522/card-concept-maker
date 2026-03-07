import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';

import { Card, CardApiService } from '~/src/entities/card';
import { CardForm } from '../model/card-form-interface';
import { TransformationMode } from '../model/transformation-mode.type';
import {
  UpdateCardParams,
  UpdateCardWithTransformationParams,
} from '../model/update-card-params.interface';
import { buildCardData } from '../lib/build-card-data';
import {
  ArtworkService,
  AuthService,
  ErrorToastService,
  GameDataService,
} from '~/src/shared/api';

export interface CreateCardParams {
  mainForm: FormGroup<CardForm>;
  mainArtwork: FormData | null;
}

export interface CreateCardWithTransformationParams extends CreateCardParams {
  mode: TransformationMode;
  existingCardId: string | null;
  transformedForm: FormGroup<CardForm> | null;
  transformedArtwork: FormData | null;
}

@Injectable({
  providedIn: 'root',
})
export class CardPersistenceService {
  readonly #authService = inject(AuthService);
  readonly #cardApiService = inject(CardApiService);
  readonly #artworkService = inject(ArtworkService);
  readonly #gameDataService = inject(GameDataService);
  readonly #errorToastService = inject(ErrorToastService);

  // --- Create ---

  createCard(params: CreateCardParams): Observable<{ id: string }> {
    const { mainForm, mainArtwork } = params;
    const cardData = this.#buildCard(mainForm);

    return this.#cardApiService.createCard(cardData).pipe(
      switchMap((docRef) => this.#handleArtwork(docRef.id, mainArtwork)),
      map((id) => ({ id })),
    );
  }

  createCardWithTransformation(
    params: CreateCardWithTransformationParams,
  ): Observable<{ id: string }> {
    const {
      mainForm,
      mainArtwork,
      mode,
      existingCardId,
      transformedForm,
      transformedArtwork,
    } = params;

    if (mode === 'select' && existingCardId) {
      const cardData = this.#buildCard(mainForm, {
        transformedCardId: existingCardId,
      });
      return this.#persistNewCard(cardData, mainArtwork);
    }

    if (mode === 'existing' && transformedForm) {
      return this.#createWithNewTransformation(
        mainForm,
        mainArtwork,
        transformedForm,
        transformedArtwork,
      );
    }

    return this.createCard({ mainForm, mainArtwork });
  }

  // --- Update ---

  updateCard(params: UpdateCardParams): Observable<{ id: string }> {
    const { baseCardId, mainForm, mainArtwork, currentArtwork } = params;
    const cardData = this.#buildCard(mainForm);

    return this.#cardApiService.updateCard(baseCardId, cardData).pipe(
      switchMap(() =>
        this.#handleArtwork(baseCardId, mainArtwork, currentArtwork),
      ),
      map(() => ({ id: baseCardId })),
    );
  }

  updateCardWithTransformation(
    params: UpdateCardWithTransformationParams,
  ): Observable<{ id: string }> {
    const {
      baseCardId,
      mainForm,
      mainArtwork,
      currentArtwork,
      mode,
      transformedCardId,
      transformedForm,
      transformedArtwork,
      hasTransformation,
      currentTransformedArtwork,
    } = params;

    if (!hasTransformation) {
      const cardData = this.#buildCard(mainForm, undefined);
      const charInfo = cardData.characterInfo;
      if (charInfo?.activeSkill) {
        charInfo.activeSkill.transformedCardId = undefined;
      }
      return this.#cardApiService.updateCard(baseCardId, cardData).pipe(
        switchMap(() =>
          this.#handleArtwork(baseCardId, mainArtwork, currentArtwork),
        ),
        map(() => ({ id: baseCardId })),
      );
    }

    // Mode 'select': link to an existing card (no form, just the ID)
    if (mode === 'select' && transformedCardId) {
      const cardData = this.#buildCard(mainForm, { transformedCardId });
      return this.#cardApiService.updateCard(baseCardId, cardData).pipe(
        switchMap(() =>
          this.#handleArtwork(baseCardId, mainArtwork, currentArtwork),
        ),
        map(() => ({ id: baseCardId })),
      );
    }

    // Mode 'existing': create or update the transformed card with form data
    if (mode === 'existing' && transformedForm) {
      return this.#updateWithTransformation(
        baseCardId,
        mainForm,
        mainArtwork,
        currentArtwork,
        transformedForm,
        transformedArtwork,
        transformedCardId,
        currentTransformedArtwork,
      );
    }

    return this.updateCard({
      baseCardId,
      mainForm,
      mainArtwork,
      currentArtwork,
    });
  }

  // --- Private helpers ---

  #buildCard(
    form: FormGroup<CardForm>,
    linkIds?: { transformedCardId?: string; baseCardId?: string },
  ): Card {
    const user = this.#authService.user();
    return buildCardData(
      form,
      {
        categories: this.#gameDataService.categories(),
        links: this.#gameDataService.links(),
        passiveConditionActivation:
          this.#gameDataService.passiveConditionActivation(),
      },
      { displayName: user?.displayName ?? null, uid: user?.uid ?? '' },
      linkIds,
    );
  }

  #persistNewCard(
    cardData: Card,
    artwork: FormData | null,
  ): Observable<{ id: string }> {
    return this.#cardApiService.createCard(cardData).pipe(
      switchMap((docRef) => this.#handleArtwork(docRef.id, artwork)),
      map((id) => ({ id })),
    );
  }

  #createWithNewTransformation(
    mainForm: FormGroup<CardForm>,
    mainArtwork: FormData | null,
    transformedForm: FormGroup<CardForm>,
    transformedArtwork: FormData | null,
  ): Observable<{ id: string }> {
    // 1. Create the base card first (without transformedCardId)
    const mainCardData = this.#buildCard(mainForm);

    return this.#cardApiService.createCard(mainCardData).pipe(
      switchMap((mainDocRef) =>
        this.#handleArtwork(mainDocRef.id, mainArtwork).pipe(
          map((mainCardId) => mainCardId),
        ),
      ),
      switchMap((mainCardId) => {
        // 2. Create the transformed card with baseCardId
        const transformedCardData = this.#buildCard(transformedForm, {
          baseCardId: mainCardId,
        });

        return this.#cardApiService.createCard(transformedCardData).pipe(
          switchMap((transformedDocRef) =>
            this.#handleArtwork(transformedDocRef.id, transformedArtwork),
          ),
          switchMap((transformedCardId) => {
            // 3. Update the base card with transformedCardId
            const updatedMainCardData = this.#buildCard(mainForm, {
              transformedCardId,
            });
            return this.#cardApiService
              .updateCard(mainCardId, updatedMainCardData)
              .pipe(map(() => ({ id: mainCardId })));
          }),
        );
      }),
    );
  }

  #updateWithTransformation(
    baseCardId: string,
    mainForm: FormGroup<CardForm>,
    mainArtwork: FormData | null,
    currentArtwork: string | null,
    transformedForm: FormGroup<CardForm>,
    transformedArtwork: FormData | null,
    existingTransformedCardId: string | null,
    currentTransformedArtwork: string | null,
  ): Observable<{ id: string }> {
    // Build transformed card data with baseCardId preserved
    const transformedCardData = this.#buildCard(transformedForm, {
      baseCardId,
    });

    // If transformed card already exists, update it; otherwise create new
    const transformedCard$ = existingTransformedCardId
      ? this.#cardApiService
          .updateCard(existingTransformedCardId, transformedCardData)
          .pipe(
            switchMap(() =>
              this.#handleArtwork(
                existingTransformedCardId,
                transformedArtwork,
                currentTransformedArtwork,
              ),
            ),
          )
      : this.#cardApiService
          .createCard(transformedCardData)
          .pipe(
            switchMap((docRef) =>
              this.#handleArtwork(docRef.id, transformedArtwork),
            ),
          );

    return transformedCard$.pipe(
      switchMap((transformedId) => {
        const mainCardData = this.#buildCard(mainForm, {
          transformedCardId: transformedId,
        });
        return this.#cardApiService
          .updateCard(baseCardId, mainCardData)
          .pipe(
            switchMap(() =>
              this.#handleArtwork(baseCardId, mainArtwork, currentArtwork),
            ),
          );
      }),
      map(() => ({ id: baseCardId })),
    );
  }

  #handleArtwork(
    cardId: string,
    artwork: FormData | null,
    currentArtwork: string | null = null,
  ): Observable<string> {
    if (!artwork) {
      return of(cardId);
    }

    return this.#artworkService.patchArtworkImage(artwork).pipe(
      switchMap((response) =>
        this.#artworkService.patchArtworkName(cardId, response.filename),
      ),
      switchMap(() =>
        currentArtwork
          ? this.#artworkService.deleteArtwork(currentArtwork)
          : of(null),
      ),
      map(() => cardId),
      catchError((err) => {
        // If the previous image is not found, new image is still uploaded, so we can return the cardId
        if (err.error.error === 'File not found') return of(cardId);

        // Otherwise, throw the error
        this.#errorToastService.showToast('Artwork could not be saved');
        return of(cardId);
      }),
    );
  }
}
