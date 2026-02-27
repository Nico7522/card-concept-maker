import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { catchError, map, Observable, of, switchMap } from 'rxjs';

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
    const { mainForm, mainArtwork, mode, existingCardId, transformedForm, transformedArtwork } = params;

    if (mode === 'existing' && existingCardId) {
      const cardData = this.#buildCard(mainForm, existingCardId);
      return this.#persistNewCard(cardData, mainArtwork);
    }

    if (mode === 'new' && transformedForm) {
      return this.#createWithNewTransformation(mainForm, mainArtwork, transformedForm, transformedArtwork);
    }

    return this.createCard({ mainForm, mainArtwork });
  }

  // --- Update ---

  updateCard(params: UpdateCardParams): Observable<{ id: string }> {
    const { cardId, mainForm, mainArtwork, currentArtwork } = params;
    const cardData = this.#buildCard(mainForm);

    return this.#cardApiService.updateCard(cardId, cardData).pipe(
      switchMap(() => this.#handleArtwork(cardId, mainArtwork, currentArtwork)),
      map(() => ({ id: cardId })),
    );
  }

  updateCardWithTransformation(
    params: UpdateCardWithTransformationParams,
  ): Observable<{ id: string }> {
    const { cardId, mainForm, mainArtwork, currentArtwork, mode, existingCardId, transformedForm, transformedArtwork, hasTransformation } = params;

    if (!hasTransformation) {
      const cardData = this.#buildCard(mainForm, undefined);
      const charInfo = cardData.characterInfo;
      if (charInfo?.activeSkill) {
        charInfo.activeSkill.transformedCardId = undefined;
      }
      return this.#cardApiService.updateCard(cardId, cardData).pipe(
        switchMap(() => this.#handleArtwork(cardId, mainArtwork, currentArtwork)),
        map(() => ({ id: cardId })),
      );
    }

    if (mode === 'existing' && existingCardId) {
      const cardData = this.#buildCard(mainForm, existingCardId);
      return this.#cardApiService.updateCard(cardId, cardData).pipe(
        switchMap(() => this.#handleArtwork(cardId, mainArtwork, currentArtwork)),
        map(() => ({ id: cardId })),
      );
    }

    if (mode === 'new' && transformedForm) {
      return this.#updateWithNewTransformation(
        cardId, mainForm, mainArtwork, currentArtwork, transformedForm, transformedArtwork,
      );
    }

    return this.updateCard({ cardId, mainForm, mainArtwork, currentArtwork });
  }

  // --- Private helpers ---

  #buildCard(form: FormGroup<CardForm>, transformedCardId?: string): Card {
    const user = this.#authService.user();
    return buildCardData(
      form,
      {
        categories: this.#gameDataService.categories(),
        links: this.#gameDataService.links(),
        passiveConditionActivation: this.#gameDataService.passiveConditionActivation(),
      },
      { displayName: user?.displayName ?? null, uid: user?.uid ?? '' },
      transformedCardId,
    );
  }

  #persistNewCard(cardData: Card, artwork: FormData | null): Observable<{ id: string }> {
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
    const transformedCardData = this.#buildCard(transformedForm);

    return this.#cardApiService.createCard(transformedCardData).pipe(
      switchMap((docRef) => this.#handleArtwork(docRef.id, transformedArtwork)),
      switchMap((transformedCardId) => {
        const mainCardData = this.#buildCard(mainForm, transformedCardId);
        return this.#persistNewCard(mainCardData, mainArtwork);
      }),
    );
  }

  #updateWithNewTransformation(
    cardId: string,
    mainForm: FormGroup<CardForm>,
    mainArtwork: FormData | null,
    currentArtwork: string | null,
    transformedForm: FormGroup<CardForm>,
    transformedArtwork: FormData | null,
  ): Observable<{ id: string }> {
    const transformedCardData = this.#buildCard(transformedForm);

    return this.#cardApiService.createCard(transformedCardData).pipe(
      switchMap((docRef) => this.#handleArtwork(docRef.id, transformedArtwork)),
      switchMap((transformedCardId) => {
        const mainCardData = this.#buildCard(mainForm, transformedCardId);
        return this.#cardApiService.updateCard(cardId, mainCardData).pipe(
          switchMap(() => this.#handleArtwork(cardId, mainArtwork, currentArtwork)),
        );
      }),
      map(() => ({ id: cardId })),
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
      catchError(() => {
        this.#errorToastService.showToast('Artwork could not be saved');
        return of(cardId);
      }),
    );
  }
}
