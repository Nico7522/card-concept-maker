import { inject } from '@angular/core';
import { collection, doc, docData, Firestore } from '@angular/fire/firestore';
import { ResolveFn } from '@angular/router';
import { map } from 'rxjs';
import { Card } from '~/src/shared/model/card-interface';

export const getCardResolver: ResolveFn<Card> = (route, state) => {
  const firestore = inject(Firestore);
  const cardsCollection = collection(firestore, 'cards');
  return docData(doc(cardsCollection, route.params['id']), {
    idField: 'id',
  }).pipe(map((data) => data as Card));
};
