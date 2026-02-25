import { inject } from '@angular/core';
import { collection, doc, docData, Firestore } from '@angular/fire/firestore';
import { ResolveFn } from '@angular/router';
import { catchError, map, of, switchMap, take, throwError } from 'rxjs';
import { Card } from '../..';
import { GetTransformedCardService } from '../get-transformed-card/get-transformed-card.service';

export const getCardResolver: ResolveFn<{
  baseCard: Card;
  transformedCard: Card | null;
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
      const card = data as Card;
      const transformedCardId =
        card.characterInfo?.activeSkill?.transformedCardId;

      if (transformedCardId) {
        return getTransformedCardService.getCardById(transformedCardId).pipe(
          map((transformedCard) => ({
            baseCard: card,
            transformedCard,
          })),
        );
      }

      return of({
        baseCard: card,
        transformedCard: null,
      });
    }),
    catchError(() => {
      return throwError(() => new Error('Card not found'));
    }),
  );
};
