import { inject } from '@angular/core';
import { collection, doc, docData, Firestore } from '@angular/fire/firestore';
import { ResolveFn, Router } from '@angular/router';
import { catchError, map, of, take, throwError } from 'rxjs';
import { Card } from '../..';

export const getCardResolver: ResolveFn<Card> = (route) => {
  const firestore = inject(Firestore);
  const router = inject(Router);
  const cardsCollection = collection(firestore, 'cards');
  return docData(doc(cardsCollection, route.params['id']), {
    idField: 'id',
  }).pipe(
    take(1),
    map((data) => {
      if (!data) {
        throw new Error();
      }
      return data as Card;
    }),
    catchError(() => {
      return throwError(() => new Error('Card not found'));
    }),
  );
};
