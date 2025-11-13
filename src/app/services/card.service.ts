import {
  inject,
  Injectable,
  Injector,
  NgZone,
  runInInjectionContext,
} from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { catchError, EMPTY, from, map } from 'rxjs';
import { Card } from '../types/card.type';
import runAsyncInInjectionContext from '../helpers/firebase-helper';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  firestore = inject(Firestore);
  zone = inject(NgZone);
  injector = inject(Injector);
  cardsCollection = collection(this.firestore, 'cards');
  constructor() {}

  /**
   * Get all cards from the firebase database by creator id
   * @param creatorId - The id of the creator
   * @returns All cards from the creator id
   */
  async getCardsByCreatorId(creatorId: string) {
    return await runAsyncInInjectionContext(this.injector, async () => {
      const q = query(
        this.cardsCollection,
        where('creatorId', '==', creatorId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Card)
      );
    });
  }

  /**
   * Add a card to the firebase database
   * @param card - The card to add
   * @returns The added card
   */
  private async addCard(card: Card) {
    return await addDoc(this.cardsCollection, card);
  }

  /**
   * Update a card in the firebase database
   * @param id - The id of the card to update
   * @param card - The card to update
   * @returns The updated card
   */
  private async updateCard(id: string, card: Card) {
    return await runAsyncInInjectionContext(this.injector, async () => {
      return await updateDoc(doc(this.cardsCollection, id), card);
    });
  }

  /**
   * Get a card from the firebase database
   * @param id - The id of the card to get
   * @returns The card
   */
  private async getCard(id: string) {
    return await runAsyncInInjectionContext(this.injector, async () => {
      return await getDoc(doc(this.cardsCollection, id));
    });
  }

  /**
   * Call the addCard function and insert the card into the database
   * @param card - The card to create
   * @returns A observable of the created card reference
   */
  createCard(card: Card) {
    return from(this.addCard(card));
  }

  /**
   * Call the updateCard function and update the card in the database
   * @param id - The id of the card to update
   * @param card - The card to update
   * @returns The updated card
   */
  patchCard(id: string, card: Card) {
    return from(this.updateCard(id, card));
  }

  /**
   * Call the getCard function and get the card from the database
   * @param id - The id of the card to get
   * @returns A observable of the card
   */
  getCardById(id: string) {
    return from(this.getCard(id)).pipe(map((doc) => doc.data() as Card));
  }

  /**
   * Call the getCardsFromCreatorId function and get all cards from the creator id
   * @param creatorId - The id of the creator
   * @returns A observable of all cards from the creator id
   */
  getCardsFromCreatorId(creatorId: string) {
    return from(this.getCardsByCreatorId(creatorId));
  }
}
