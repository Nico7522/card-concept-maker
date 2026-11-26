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
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { ArtworkService } from '~/src/shared/api';
import { Card } from '../../model/card-interface';
import { CardApiService } from '../card-api-service/card-api.service';

@Injectable({
  providedIn: 'root',
})
export class DeleteCardService {
  readonly #injector = inject(Injector);
  readonly #firestore = inject(Firestore);
  readonly #cardApiService = inject(CardApiService);
  readonly #artworkService = inject(ArtworkService);
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

        // Remove the link from the other card first, so no reference to the deleted card remains
        const unlink$ = baseCardId
          ? this.#cardApiService.unlinkFromTransformedCard(baseCardId)
          : transformedCardId
            ? this.#cardApiService.unlinkFromBaseCard(transformedCardId)
            : of(undefined);

        return unlink$.pipe(
          switchMap(() => this.deleteCard(cardId)),
          switchMap(() => this.#deleteArtwork(card.artwork)),
        );
      }),
      catchError(() => throwError(() => new Error('Failed to delete card'))),
    );
  }

  /**
   * Deletes the artwork file of a deleted card from the server.
   * The card is already deleted at this point, so a failure here
   * (file already missing, server unavailable) must not fail the deletion.
   */
  #deleteArtwork(artwork: string | null | undefined): Observable<void> {
    if (!artwork) {
      return of(undefined);
    }
    return this.#artworkService.deleteArtwork(artwork).pipe(
      map(() => undefined),
      catchError(() => of(undefined)),
    );
  }
}
