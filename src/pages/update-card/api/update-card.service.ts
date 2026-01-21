import {
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { Card } from '~/src/entities/card';
import { ArtworkService } from '~/src/shared/api';

@Injectable({
  providedIn: 'root',
})
export class UpdateCardService {
  readonly #injector = inject(Injector);
  readonly #firestore = inject(Firestore);
  readonly #artworkService = inject(ArtworkService);
  patchCard(id: string, data: Partial<Card>) {
    return from(
      runInInjectionContext(this.#injector, () => {
        const ref = doc(this.#firestore, `cards/${id}`);
        return updateDoc(ref, data);
      })
    );
  }
}
