import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  readonly #count = signal(0);
  readonly loading = computed(() => this.#count() > 0);

  start(): void {
    this.#count.update((c) => c + 1);
  }

  stop(): void {
    this.#count.update((c) => Math.max(0, c - 1));
  }
}
