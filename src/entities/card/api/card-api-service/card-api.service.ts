import {
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import {
  addDoc,
  collection,
  deleteField,
  doc,
  Firestore,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import {
  catchError,
  from,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { Card } from '../../model/card-interface';

const ACTIVE_SKILL_PATH = 'characterInfo.activeSkill';
const NOT_FOUND_CODE = 'not-found';

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

  /**
   * Marks an existing card as the transformed form of a base card.
   * The rest of its active skill is kept as is.
   * @param transformedCardId - The card that becomes the transformed form.
   * @param baseCardId - The base card it transforms from.
   */
  linkToBaseCard(
    transformedCardId: string,
    baseCardId: string,
  ): Observable<void> {
    const ref = doc(this.#firestore, 'cards', transformedCardId);
    return from(runInInjectionContext(this.#injector, () => getDoc(ref))).pipe(
      switchMap((snapshot) => {
        if (!snapshot.exists()) {
          return throwError(() => new Error('Card not found'));
        }
        const activeSkill = (snapshot.data() as Card).characterInfo
          ?.activeSkill;
        return from(
          runInInjectionContext(this.#injector, () =>
            updateDoc(ref, {
              [ACTIVE_SKILL_PATH]: {
                activeSkillName: '',
                activeSkillCondition: '',
                activeSkillEffect: '',
                ...activeSkill,
                baseCardId,
              },
            }),
          ),
        );
      }),
    );
  }

  /**
   * Removes the link to its base card from a transformed card.
   * Does nothing if the transformed card no longer exists.
   */
  unlinkFromBaseCard(transformedCardId: string): Observable<void> {
    return this.#removeActiveSkillField(transformedCardId, 'baseCardId');
  }

  /**
   * Removes the link to its transformed card from a base card.
   * Does nothing if the base card no longer exists.
   */
  unlinkFromTransformedCard(baseCardId: string): Observable<void> {
    return this.#removeActiveSkillField(baseCardId, 'transformedCardId');
  }

  #removeActiveSkillField(
    cardId: string,
    field: 'baseCardId' | 'transformedCardId',
  ): Observable<void> {
    const ref = doc(this.#firestore, 'cards', cardId);
    return from(
      runInInjectionContext(this.#injector, () =>
        updateDoc(ref, { [`${ACTIVE_SKILL_PATH}.${field}`]: deleteField() }),
      ),
    ).pipe(
      catchError((error: { code?: string }) =>
        error?.code === NOT_FOUND_CODE
          ? of(undefined)
          : throwError(() => error),
      ),
    );
  }
}
