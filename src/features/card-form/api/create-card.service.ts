import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { catchError, map, Observable, of, switchMap } from 'rxjs';

import { Card, CardApiService } from '~/src/entities/card';
import { CardForm } from '../model/card-form-interface';
import { TransformationMode } from '../model/transformation-mode.type';
import { generateCard } from '../lib/generate-card';
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
export class CreateCardService {
  readonly #authService = inject(AuthService);
  readonly #cardApiService = inject(CardApiService);
  readonly #artworkService = inject(ArtworkService);
  readonly #gameDataService = inject(GameDataService);
  readonly #errorToastService = inject(ErrorToastService);

  createCard(params: CreateCardParams): Observable<{ id: string }> {
    const { mainForm, mainArtwork } = params;
    const data = mainForm.getRawValue();
    const { characterInfo, passiveDetails, superAttackInfo } =
      this.#generateCardData(mainForm);

    const cardData: Card = {
      creatorName: this.#authService.user()?.displayName ?? '',
      creatorId: this.#authService.user()?.uid ?? '',
      cardName: data.cardName,
      characterInfo: characterInfo(),
      passiveDetails: passiveDetails(),
      superAttackInfo: superAttackInfo(),
    };

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

    if (mode === 'existing' && existingCardId) {
      return this.#createMainCardWithExistingTransformation(
        mainForm,
        mainArtwork,
        existingCardId,
      );
    }

    if (mode === 'new' && transformedForm) {
      return this.#createMainCardWithNewTransformation(
        mainForm,
        mainArtwork,
        transformedForm,
        transformedArtwork,
      );
    }

    return this.createCard({ mainForm, mainArtwork });
  }

  #createMainCardWithExistingTransformation(
    mainForm: FormGroup<CardForm>,
    mainArtwork: FormData | null,
    existingCardId: string,
  ): Observable<{ id: string }> {
    const data = mainForm.getRawValue();
    const { characterInfo, passiveDetails, superAttackInfo } =
      this.#generateCardData(mainForm);

    const charInfo = characterInfo();
    if (charInfo?.activeSkill) {
      charInfo.activeSkill.transformedCardId = existingCardId;
    }

    const cardData: Card = {
      creatorName: this.#authService.user()?.displayName ?? '',
      creatorId: this.#authService.user()?.uid ?? '',
      cardName: data.cardName,
      characterInfo: charInfo,
      passiveDetails: passiveDetails(),
      superAttackInfo: superAttackInfo(),
    };

    return this.#cardApiService.createCard(cardData).pipe(
      switchMap((docRef) => this.#handleArtwork(docRef.id, mainArtwork)),
      map((id) => ({ id })),
    );
  }

  #createMainCardWithNewTransformation(
    mainForm: FormGroup<CardForm>,
    mainArtwork: FormData | null,
    transformedForm: FormGroup<CardForm>,
    transformedArtwork: FormData | null,
  ): Observable<{ id: string }> {
    const transformedData = transformedForm.getRawValue();
    const {
      characterInfo: transformedCharInfo,
      passiveDetails: transformedPassive,
      superAttackInfo: transformedSuper,
    } = this.#generateCardData(transformedForm);

    const transformedCardData: Card = {
      creatorName: this.#authService.user()?.displayName ?? '',
      creatorId: this.#authService.user()?.uid ?? '',
      cardName: transformedData.cardName,
      characterInfo: transformedCharInfo(),
      passiveDetails: transformedPassive(),
      superAttackInfo: transformedSuper(),
    };

    return this.#cardApiService.createCard(transformedCardData).pipe(
      switchMap((transformedDocRef) =>
        this.#handleArtwork(transformedDocRef.id, transformedArtwork),
      ),
      switchMap((transformedCardId) => {
        const mainData = mainForm.getRawValue();
        const { characterInfo, passiveDetails, superAttackInfo } =
          this.#generateCardData(mainForm);

        const charInfo = characterInfo();
        if (charInfo?.activeSkill) {
          charInfo.activeSkill.transformedCardId = transformedCardId;
        }

        const mainCardData: Card = {
          creatorName: this.#authService.user()?.displayName ?? '',
          creatorId: this.#authService.user()?.uid ?? '',
          cardName: mainData.cardName,
          characterInfo: charInfo,
          passiveDetails: passiveDetails(),
          superAttackInfo: superAttackInfo(),
        };

        return this.#cardApiService
          .createCard(mainCardData)
          .pipe(
            switchMap((mainDocRef) =>
              this.#handleArtwork(mainDocRef.id, mainArtwork),
            ),
          );
      }),
      map((id) => ({ id })),
    );
  }

  #generateCardData(form: FormGroup<CardForm>) {
    return generateCard(
      form,
      this.#gameDataService.categories(),
      this.#gameDataService.links(),
      this.#gameDataService.passiveConditionActivation(),
    );
  }

  #handleArtwork(cardId: string, artwork: FormData | null): Observable<string> {
    if (!artwork) {
      return of(cardId);
    }

    return this.#artworkService.patchArtworkImage(artwork).pipe(
      switchMap((response) =>
        this.#artworkService.patchArtworkName(cardId, response.filename),
      ),
      map(() => cardId),
      catchError(() => {
        this.#errorToastService.showToast('Artwork could not be created');
        return of(cardId);
      }),
    );
  }
}
