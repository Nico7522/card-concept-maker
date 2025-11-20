import {
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { Card } from '~/src/shared/model/card-interface';

@Injectable({
  providedIn: 'root',
})
export class CreateCardService {
  readonly #injector = inject(Injector);
  readonly #firestore = inject(Firestore);
  readonly #cardsCollection = collection(this.#firestore, 'cards');

  createCard(card: Card) {
    return from(
      runInInjectionContext(this.#injector, () => {
        return addDoc(this.#cardsCollection, card);
      })
    );
  }
}
