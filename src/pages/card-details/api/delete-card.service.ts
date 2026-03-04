import {
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  Firestore,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import {
  catchError,
  from,
  map,
  Observable,
  switchMap,
  throwError,
} from 'rxjs';
import { Card } from '~/src/entities/card';

@Injectable({
  providedIn: 'root',
})
export class DeleteCardService {
  readonly #injector = inject(Injector);
  readonly #firestore = inject(Firestore);
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

  #unlinkTransformedCardFromBase(baseCardId: string): Observable<void> {
    const baseCardRef = doc(this.#firestore, 'cards', baseCardId);
    return from(
      runInInjectionContext(this.#injector, () =>
        updateDoc(baseCardRef, {
          'characterInfo.activeSkill.transformedCardId': deleteField(),
        }),
      ),
    );
  }

  #unlinkBaseCardFromTransformed(transformedCardId: string): Observable<void> {
    const transformedCardRef = doc(
      this.#firestore,
      'cards',
      transformedCardId,
    );
    return from(
      runInInjectionContext(this.#injector, () =>
        updateDoc(transformedCardRef, {
          'characterInfo.activeSkill.baseCardId': deleteField(),
        }),
      ),
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

        // Current card is the transformed one → unlink base, then delete
        if (baseCardId) {
          return this.#unlinkTransformedCardFromBase(baseCardId).pipe(
            switchMap(() => this.deleteCard(cardId)),
          );
        }

        // Current card is the base one → unlink transformed, then delete
        if (transformedCardId) {
          return this.#unlinkBaseCardFromTransformed(transformedCardId).pipe(
            switchMap(() => this.deleteCard(cardId)),
          );
        }

        // Standalone card → delete directly
        return this.deleteCard(cardId);
      }),
      catchError(() => throwError(() => new Error('Failed to delete card'))),
    );
  }
}
