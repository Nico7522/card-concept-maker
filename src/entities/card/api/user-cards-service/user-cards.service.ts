import {
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import {
  collection,
  Firestore,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import {
  catchError,
  from,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';
import { Card } from '../../model/card-interface';
import { AuthService } from '~/src/shared/api';

@Injectable({
  providedIn: 'root',
})
export class UserCardsService {
  readonly #injector = inject(Injector);
  readonly #firestore = inject(Firestore);
  readonly #authService = inject(AuthService);

  #getCardsByUserId(userId: string): Observable<Card[]> {
    const cardsCollection = collection(this.#firestore, 'cards');
    const q = query(cardsCollection, where('creatorId', '==', userId));
    return from(runInInjectionContext(this.#injector, () => getDocs(q))).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Card),
      ),
      map((cards) =>
        cards.filter(
          (card) =>
            !card.characterInfo?.activeSkill?.transformedCardId &&
            !card.characterInfo?.activeSkill?.baseCardId,
        ),
      ),
      catchError(() => of([])),
    );
  }

  // Follows the auth state (never completes): the cards are fetched again when
  // the user changes, and on every new subscription once all previous
  // subscribers are gone (refCount), so the list is never stale between pages.
  userCards$: Observable<Card[]> = this.#authService.user$.pipe(
    switchMap((user) => (user ? this.#getCardsByUserId(user.uid) : of([]))),
    shareReplay({ refCount: true, bufferSize: 1 }),
  );
}
