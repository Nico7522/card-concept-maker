import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { map, Observable, of, switchMap } from 'rxjs';

import { Card } from '~/src/entities/card';
import { CardForm } from '../model/card-form-interface';
import {
  UpdateCardParams,
  UpdateCardWithTransformationParams,
} from '../model/update-card-params.interface';
import { generateCard } from '../lib/generate-card';
import {
  ArtworkService,
  AuthService,
  CardApiService,
  GameDataService,
} from '~/src/shared/api';

@Injectable({
  providedIn: 'root',
})
export class UpdateCardService {
  readonly #authService = inject(AuthService);
  readonly #cardApiService = inject(CardApiService);
  readonly #artworkService = inject(ArtworkService);
  readonly #gameDataService = inject(GameDataService);

  updateCard(params: UpdateCardParams): Observable<{ id: string }> {
    const { cardId, mainForm, mainArtwork, currentArtwork } = params;
    const data = mainForm.getRawValue();
    const { characterInfo, passiveDetails, superAttackInfo } =
      this.#generateCardData(mainForm);

    const cardData: Partial<Card> = {
      creatorName: this.#authService.user()?.displayName ?? '',
      creatorId: this.#authService.user()?.uid ?? '',
      cardName: data.cardName,
      characterInfo: characterInfo(),
      passiveDetails: passiveDetails(),
      superAttackInfo: superAttackInfo(),
    };

    return this.#cardApiService.updateCard(cardId, cardData).pipe(
      switchMap(() => this.#handleArtwork(cardId, mainArtwork, currentArtwork)),
      map(() => ({ id: cardId }))
    );
  }

  updateCardWithTransformation(
    params: UpdateCardWithTransformationParams
  ): Observable<{ id: string }> {
    const {
      cardId,
      mainForm,
      mainArtwork,
      currentArtwork,
      mode,
      existingCardId,
      transformedForm,
      transformedArtwork,
      hasTransformation,
    } = params;

    if (!hasTransformation) {
      return this.#updateCardRemoveTransformation(
        cardId,
        mainForm,
        mainArtwork,
        currentArtwork
      );
    }

    if (mode === 'existing' && existingCardId) {
      return this.#updateCardWithExistingTransformation(
        cardId,
        mainForm,
        mainArtwork,
        currentArtwork,
        existingCardId
      );
    }

    if (mode === 'new' && transformedForm) {
      return this.#updateCardWithNewTransformation(
        cardId,
        mainForm,
        mainArtwork,
        currentArtwork,
        transformedForm,
        transformedArtwork
      );
    }

    return this.updateCard({ cardId, mainForm, mainArtwork, currentArtwork });
  }

  #updateCardRemoveTransformation(
    cardId: string,
    mainForm: FormGroup<CardForm>,
    mainArtwork: FormData | null,
    currentArtwork: string | null
  ): Observable<{ id: string }> {
    const data = mainForm.getRawValue();
    const { characterInfo, passiveDetails, superAttackInfo } =
      this.#generateCardData(mainForm);

    const charInfo = characterInfo();
    if (charInfo?.activeSkill) {
      charInfo.activeSkill.transformedCardId = undefined;
    }

    const cardData: Partial<Card> = {
      creatorName: this.#authService.user()?.displayName ?? '',
      creatorId: this.#authService.user()?.uid ?? '',
      cardName: data.cardName,
      characterInfo: charInfo,
      passiveDetails: passiveDetails(),
      superAttackInfo: superAttackInfo(),
    };

    return this.#cardApiService.updateCard(cardId, cardData).pipe(
      switchMap(() => this.#handleArtwork(cardId, mainArtwork, currentArtwork)),
      map(() => ({ id: cardId }))
    );
  }

  #updateCardWithExistingTransformation(
    cardId: string,
    mainForm: FormGroup<CardForm>,
    mainArtwork: FormData | null,
    currentArtwork: string | null,
    existingCardId: string
  ): Observable<{ id: string }> {
    const data = mainForm.getRawValue();
    const { characterInfo, passiveDetails, superAttackInfo } =
      this.#generateCardData(mainForm);

    const charInfo = characterInfo();
    if (charInfo?.activeSkill) {
      charInfo.activeSkill.transformedCardId = existingCardId;
    }

    const cardData: Partial<Card> = {
      creatorName: this.#authService.user()?.displayName ?? '',
      creatorId: this.#authService.user()?.uid ?? '',
      cardName: data.cardName,
      characterInfo: charInfo,
      passiveDetails: passiveDetails(),
      superAttackInfo: superAttackInfo(),
    };

    return this.#cardApiService.updateCard(cardId, cardData).pipe(
      switchMap(() => this.#handleArtwork(cardId, mainArtwork, currentArtwork)),
      map(() => ({ id: cardId }))
    );
  }

  #updateCardWithNewTransformation(
    cardId: string,
    mainForm: FormGroup<CardForm>,
    mainArtwork: FormData | null,
    currentArtwork: string | null,
    transformedForm: FormGroup<CardForm>,
    transformedArtwork: FormData | null
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
        this.#handleArtwork(transformedDocRef.id, transformedArtwork, null)
      ),
      switchMap((transformedCardId) => {
        const mainData = mainForm.getRawValue();
        const { characterInfo, passiveDetails, superAttackInfo } =
          this.#generateCardData(mainForm);

        const charInfo = characterInfo();
        if (charInfo?.activeSkill) {
          charInfo.activeSkill.transformedCardId = transformedCardId;
        }

        const mainCardData: Partial<Card> = {
          creatorName: this.#authService.user()?.displayName ?? '',
          creatorId: this.#authService.user()?.uid ?? '',
          cardName: mainData.cardName,
          characterInfo: charInfo,
          passiveDetails: passiveDetails(),
          superAttackInfo: superAttackInfo(),
        };

        return this.#cardApiService.updateCard(cardId, mainCardData).pipe(
          switchMap(() =>
            this.#handleArtwork(cardId, mainArtwork, currentArtwork)
          )
        );
      }),
      map(() => ({ id: cardId }))
    );
  }

  #generateCardData(form: FormGroup<CardForm>) {
    return generateCard(
      form,
      this.#gameDataService.categories(),
      this.#gameDataService.links(),
      this.#gameDataService.passiveConditionActivation()
    );
  }

  #handleArtwork(
    cardId: string,
    artwork: FormData | null,
    currentArtwork: string | null
  ): Observable<string> {
    if (!artwork) {
      return of(cardId);
    }

    return this.#artworkService.patchArtworkImage(artwork).pipe(
      switchMap((response) =>
        this.#artworkService.patchArtworkName(cardId, response.filename)
      ),
      switchMap(() =>
        currentArtwork
          ? this.#artworkService.deleteArtwork(currentArtwork)
          : of(null)
      ),
      map(() => cardId)
    );
  }
}
