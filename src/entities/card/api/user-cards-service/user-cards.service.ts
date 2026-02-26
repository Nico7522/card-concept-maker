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
import { catchError, from, map, Observable, of } from 'rxjs';
import { Card } from '../../model/card-interface';

@Injectable({
  providedIn: 'root',
})
export class UserCardsService {
  readonly #injector = inject(Injector);
  readonly #firestore = inject(Firestore);

  getCardsByUserId(userId: string): Observable<Card[]> {
    const cardsCollection = collection(this.#firestore, 'cards');
    const q = query(cardsCollection, where('creatorId', '==', userId));

    return from(
      runInInjectionContext(this.#injector, () => getDocs(q)),
    ).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Card),
      ),
      map((cards) =>
        cards.filter(
          (card) => !card.characterInfo?.activeSkill?.transformedCardId,
        ),
      ),
      catchError(() => of([])),
    );
  }
}
