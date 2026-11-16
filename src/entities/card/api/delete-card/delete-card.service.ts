import {
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
} from '@angular/fire/firestore';
import {
  catchError,
  from,
  map,
  Observable,
  switchMap,
  throwError,
} from 'rxjs';
import { Card } from '../../model/card-interface';
import { CardApiService } from '../card-api-service/card-api.service';

@Injectable({
  providedIn: 'root',
})
export class DeleteCardService {
  readonly #injector = inject(Injector);
  readonly #firestore = inject(Firestore);
  readonly #cardApiService = inject(CardApiService);
  readonly #cardsCollection = collection(this.#firestore, 'cards');

  #getCardById(cardId: string): Observable<Card | null> {
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

  deleteCard(cardId: string): Observable<void> {
    return from(
      runInInjectionContext(this.#injector, () =>
        deleteDoc(doc(this.#cardsCollection, cardId)),
      ),
    );
  }

  delete(cardId: string): Observable<void> {
    return this.#getCardById(cardId).pipe(
      switchMap((card) => {
        if (!card) {
          return throwError(() => new Error('Card not found'));
        }

        const baseCardId = card.characterInfo?.activeSkill?.baseCardId;
        const transformedCardId =
          card.characterInfo?.activeSkill?.transformedCardId;

        if (baseCardId) {
          return this.#cardApiService
            .unlinkFromTransformedCard(baseCardId)
            .pipe(switchMap(() => this.deleteCard(cardId)));
        }

        if (transformedCardId) {
          return this.#cardApiService
            .unlinkFromBaseCard(transformedCardId)
            .pipe(switchMap(() => this.deleteCard(cardId)));
        }

        return this.deleteCard(cardId);
      }),
      catchError(() => throwError(() => new Error('Failed to delete card'))),
    );
  }
}
