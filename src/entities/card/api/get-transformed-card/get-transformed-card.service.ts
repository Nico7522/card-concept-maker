import { inject, Injectable } from '@angular/core';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Card } from '../../model/card-interface';

@Injectable({
  providedIn: 'root',
})
export class GetTransformedCardService {
  readonly #firestore = inject(Firestore);

  getCardById(cardId: string): Observable<Card | null> {
    const cardDoc = doc(this.#firestore, 'cards', cardId);

    return docData(cardDoc, { idField: 'id' }).pipe(
      map((data) => data as Card),
      catchError(() => throwError(() => new Error('Card not found'))),
    );
  }
}
