import { inject } from '@angular/core';
import { collection, doc, docData, Firestore } from '@angular/fire/firestore';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of, switchMap, take } from 'rxjs';
import { Card } from '~/src/entities/card';
import { AuthService } from '~/src/shared/api';

export const canUpdateGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const firestore = inject(Firestore);
  const router = inject(Router);
  const cardsCollection = collection(firestore, 'cards');

  return docData(doc(cardsCollection, route.params['id']), {
    idField: 'id',
  }).pipe(
    take(1),
    map((card) => {
      if (!card) {
        return null;
      }
      return card as Card;
    }),
    switchMap((card) => {
      if (!card) {
        return of(router.createUrlTree(['/']));
      }
      return authService.user$.pipe(
        take(1),
        map((user) => {
          if (card.creatorId === user?.uid) {
            return true;
          }
          return router.createUrlTree(['/']);
        }),
      );
    }),
    catchError(() => of(router.createUrlTree(['/']))),
  );
};
