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
  filter,
  from,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  take,
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

  userCards$ = this.#authService.user$.pipe(
    filter((user) => !!user),
    take(1),
    switchMap((user) => this.#getCardsByUserId(user!.uid)),
    shareReplay({ refCount: true, bufferSize: 1 }),
  );
}
