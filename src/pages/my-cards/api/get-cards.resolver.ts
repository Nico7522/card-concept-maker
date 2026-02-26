import { inject, Injector, runInInjectionContext } from '@angular/core';
import {
  collection,
  Firestore,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { ResolveFn } from '@angular/router';
import { catchError, from, map, throwError } from 'rxjs';
import { Card } from '~/src/entities/card';

export const getCardsResolver: ResolveFn<Card[]> = (route, state) => {
  const injector = inject(Injector);
  const firestore = inject(Firestore);
  const cardsCollection = collection(firestore, 'cards');

  const q = query(
    cardsCollection,
    where('creatorId', '==', route.params['id']),
  );

  return from(
    runInInjectionContext(injector, () => getDocs(q)),
  ).pipe(
    map((snapshot) =>
      snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Card,
      ),
    ),
    catchError(() => {
      return throwError(
        () => new Error('An error occurred while fetching cards'),
      );
    }),
  );
};
