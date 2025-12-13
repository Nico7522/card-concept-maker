import { inject } from '@angular/core';
import { collection, doc, docData, Firestore } from '@angular/fire/firestore';
import { CanActivateFn } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { AuthService } from '~/src/shared/api';
import { Card } from '~/src/shared/model';

export const canUpdateGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const firestore = inject(Firestore);
  const cardsCollection = collection(firestore, 'cards');
  return docData(doc(cardsCollection, route.params['id']), {
    idField: 'id',
  }).pipe(
    map((card) => {
      if (!card) {
        throw new Error('Card not found');
      }
      return card as Card;
    }),
    switchMap((card) => {
      return authService.user$.pipe(
        map((user) => {
          if (card?.creatorId === user?.uid) {
            return true;
          }
          throw new Error('Unauthorized');
        })
      );
    })
  );
};
