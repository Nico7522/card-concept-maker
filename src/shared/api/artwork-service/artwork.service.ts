import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { collection, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { from, Observable, switchMap } from 'rxjs';
import { environment } from '~/src/environments/environment';
import { AuthService } from '../auth-service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ArtworkService {
  readonly #injector = inject(Injector);
  readonly #firestore = inject(Firestore);
  readonly #cardsCollection = collection(this.#firestore, 'cards');
  readonly #httpClient = inject(HttpClient);
  readonly #authService = inject(AuthService);

  /**
   * Uploads an artwork image to the server.
   * @param artwork - The artwork image to upload.
   * @returns An observable of the filename.
   */
  patchArtworkImage(artwork: FormData) {
    return this.#withAuthHeaders((headers) =>
      this.#httpClient.post<{ filename: string }>(
        `${environment.apiUrl}/upload`,
        artwork,
        { headers },
      ),
    );
  }

  /**
   * Updates the artwork name in the database.
   * @param cardId - The ID of the card to update.
   * @param artworkName - The new artwork name.
   * @returns An observable of void.
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

  /**
   * Deletes an artwork from the server.
   * @param artwork - The filename of the artwork to delete.
   * @returns An observable of void.
   */
  deleteArtwork(artwork: string) {
    return this.#withAuthHeaders((headers) =>
      this.#httpClient.delete(`${environment.apiUrl}/delete`, {
        headers,
        body: {
          filename: artwork,
        },
      }),
    );
  }

  /**
   * Runs an API request with the Firebase ID token of the current user
   * in the Authorization header, so the API can check who owns the files.
   * Only the image upload and delete requests need it: images stay public to read.
   */
  #withAuthHeaders<T>(
    request: (headers: HttpHeaders) => Observable<T>,
  ): Observable<T> {
    return this.#authService.getIdToken().pipe(
      switchMap((token) =>
        request(
          token
            ? new HttpHeaders({ Authorization: `Bearer ${token}` })
            : new HttpHeaders(),
        ),
      ),
    );
  }
}
