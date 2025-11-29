import {
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { collection, deleteDoc, doc, Firestore } from '@angular/fire/firestore';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeleteCardService {
  readonly #injector = inject(Injector);
  readonly #firestore = inject(Firestore);
  readonly #cardsCollection = collection(this.#firestore, 'cards');

  deleteCard(cardId: string) {
    return from(
      runInInjectionContext(this.#injector, () => {
        return deleteDoc(doc(this.#cardsCollection, cardId));
      })
    );
  }
}
