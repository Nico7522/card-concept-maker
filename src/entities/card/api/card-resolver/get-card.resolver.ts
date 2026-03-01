import { inject } from '@angular/core';
import { collection, doc, docData, Firestore } from '@angular/fire/firestore';
import { ResolveFn } from '@angular/router';
import { catchError, map, of, switchMap, take, throwError } from 'rxjs';
import { Card } from '../..';
import { GetTransformedCardService } from '../get-transformed-card/get-transformed-card.service';

export const getCardResolver: ResolveFn<{
  baseCard: Card;
  transformedCard: Card | null;
  currentCard: Card;
}> = (route) => {
  const firestore = inject(Firestore);
  const getTransformedCardService = inject(GetTransformedCardService);
  const cardsCollection = collection(firestore, 'cards');
  return docData(doc(cardsCollection, route.params['id']), {
    idField: 'id',
  }).pipe(
    take(1),
    switchMap((data) => {
      if (!data) {
        throw new Error();
      }
      // Get the current card
      const card = data as Card;
      // Get the transformed card id if it exists
      const transformedCardId =
        card.characterInfo?.activeSkill?.transformedCardId;
      // Get the base card id if it exists
      const baseCardId = card.characterInfo?.activeSkill?.baseCardId;
      // If the base card id exists and the transformed card id is null, get the base card
      if (baseCardId && !transformedCardId) {
        return getTransformedCardService.getCardById(baseCardId).pipe(
          map((baseCard) => ({
            baseCard: baseCard as Card,
            transformedCard: card,
            currentCard: card,
          })),
        );
      }
      // If the transformed card id exists and the base card id is null, get the transformed card
      if (transformedCardId && !baseCardId) {
        return getTransformedCardService.getCardById(transformedCardId).pipe(
          map((transformedCard) => ({
            baseCard: card,
            transformedCard,
            currentCard: card,
          })),
        );
      }

      // If the base card id and the transformed card id don't exist, return the card
      return of({
        baseCard: card,
        transformedCard: null,
        currentCard: card,
      });
    }),
    catchError(() => {
      return throwError(() => new Error('Card not found'));
    }),
  );
};
