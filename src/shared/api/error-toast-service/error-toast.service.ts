import { Injectable, signal } from '@angular/core';

export interface ToastOptions {
  /**
   * Keeps the toast until the user closes it. For failures the user must not
   * miss (e.g. a card or artwork that could not be saved).
   */
  persistent?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorToastService {
  #isVisible = signal(false);
  isVisible = this.#isVisible.asReadonly();
  #message = signal<string>('');
  message = this.#message.asReadonly();
  #isPersistent = signal(false);
  isPersistent = this.#isPersistent.asReadonly();
  // Changes on every call, even with the same message: restarts the auto-dismiss timer
  #toastId = signal(0);
  toastId = this.#toastId.asReadonly();

  showToast(message: string, options: ToastOptions = {}) {
    this.#message.set(message);
    this.#isPersistent.set(options.persistent ?? false);
    this.#toastId.update((id) => id + 1);
    this.#isVisible.set(true);
  }

  hideToast() {
    this.#isVisible.set(false);
  }
}
