import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorToastService {
  #isVisible = signal(false);
  isVisible = this.#isVisible.asReadonly();
  #message = signal<string>('');
  message = this.#message.asReadonly();
  constructor() {}

  showToast(message: string) {
    this.#isVisible.set(true);
    this.#message.set(message);
  }

  hideToast() {
    this.#isVisible.set(false);
  }
}
