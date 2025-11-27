import { inject } from '@angular/core';
import {
  collection,
  collectionData,
  Firestore,
  query,
  where,
} from '@angular/fire/firestore';
import { ResolveFn } from '@angular/router';
import { catchError, map, take, throwError } from 'rxjs';
import { Card } from '~/src/shared/model';

export const getCardsResolver: ResolveFn<Card[]> = (route, state) => {
  const firestore = inject(Firestore);
  const cardsCollection = collection(firestore, 'cards');

  const q = query(
    cardsCollection,
    where('creatorId', '==', route.params['id'])
  );

  return collectionData(q, { idField: 'id' }).pipe(
    take(1),
    map((data) => {
      return data as Card[];
    }),
    catchError(() => {
      return throwError(
        () => new Error('An error occurred while fetching cards')
      );
    })
  );
};
