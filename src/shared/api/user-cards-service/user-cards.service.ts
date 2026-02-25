import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  Firestore,
  query,
  where,
} from '@angular/fire/firestore';
import { catchError, map, Observable, of } from 'rxjs';
import { Card } from '~/src/entities/card';

@Injectable({
  providedIn: 'root',
})
export class UserCardsService {
  readonly #firestore = inject(Firestore);

  getCardsByUserId(userId: string): Observable<Card[]> {
    const cardsCollection = collection(this.#firestore, 'cards');
    const q = query(cardsCollection, where('creatorId', '==', userId));

    return collectionData(q, { idField: 'id' }).pipe(
      map((data) => data as Card[]),
      catchError(() => of([]))
    );
  }
}
