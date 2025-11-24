import { HttpClient } from '@angular/common/http';
import {
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { collection, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { environment } from '~/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ArtworkService {
  readonly #injector = inject(Injector);
  readonly #firestore = inject(Firestore);
  readonly #cardsCollection = collection(this.#firestore, 'cards');
  readonly #httpClient = inject(HttpClient);

  /**
   * Uploads an artwork image to the server.
   * @param artwork - The artwork image to upload.
   * @returns An observable of the uploaded artwork.
   */
  patchArtworkImage(artwork: FormData) {
    return this.#httpClient.post<{ filename: string }>(
      `${environment.apiUrl}`,
      artwork
    );
  }

  /**
   * Updates the artwork name in the database.
   * @param cardId - The ID of the card to update.
   * @param artworkName - The new artwork name.
   * @returns An observable of the updated artwork.
   */
  patchArtworkName(cardId: string, artworkName: string) {
    return from(
      runInInjectionContext(this.#injector, () => {
        return updateDoc(doc(this.#cardsCollection, cardId), {
          artwork: artworkName,
        });
      })
    );
  }
}
