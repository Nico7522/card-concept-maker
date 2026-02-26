import {
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Card } from '../../model/card-interface';

@Injectable({
  providedIn: 'root',
})
export class CardApiService {
  readonly #injector = inject(Injector);
  readonly #firestore = inject(Firestore);
  readonly #cardsCollection = collection(this.#firestore, 'cards');

  createCard(card: Card): Observable<{ id: string }> {
    return from(
      runInInjectionContext(this.#injector, () =>
        addDoc(this.#cardsCollection, card),
      ),
    );
  }

  updateCard(id: string, data: Partial<Card>): Observable<void> {
    return from(
      runInInjectionContext(this.#injector, () => {
        const ref = doc(this.#firestore, `cards/${id}`);
        return updateDoc(ref, data);
      }),
    );
  }
}
