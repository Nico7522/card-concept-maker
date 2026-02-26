import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { catchError, from, map, Observable, throwError } from 'rxjs';
import { Card } from '../../model/card-interface';

@Injectable({
  providedIn: 'root',
})
export class GetTransformedCardService {
  readonly #injector = inject(Injector);
  readonly #firestore = inject(Firestore);

  getCardById(cardId: string): Observable<Card | null> {
    const cardDoc = doc(this.#firestore, 'cards', cardId);

    return from(
      runInInjectionContext(this.#injector, () => getDoc(cardDoc)),
    ).pipe(
      map((snapshot) =>
        snapshot.exists()
          ? ({ id: snapshot.id, ...snapshot.data() } as Card)
          : null,
      ),
      catchError(() => throwError(() => new Error('Card not found'))),
    );
  }
}
