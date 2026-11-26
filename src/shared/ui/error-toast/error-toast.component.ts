import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnDestroy,
  signal,
  untracked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorToastService } from '~/src/shared/api';

const AUTO_DISMISS_DELAY_MS = 8000;
const CLOSE_ANIMATION_MS = 100;

@Component({
  selector: 'app-error-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './error-toast.component.html',
  styleUrl: './error-toast.component.css',
})
export class ErrorToastComponent implements OnDestroy {
  readonly #errorToastService = inject(ErrorToastService);
  message = this.#errorToastService.message;
  isVisible = this.#errorToastService.isVisible;
  isPersistent = this.#errorToastService.isPersistent;
  isClosing = signal(false);
  #closeTimeoutId?: ReturnType<typeof setTimeout>;
  #hideToastTimeoutId?: ReturnType<typeof setTimeout>;

  constructor() {
    // A new toast (even while one is displayed) restarts the timer
    effect(() => {
      this.#errorToastService.toastId();
      untracked(() => {
        clearTimeout(this.#hideToastTimeoutId);
        this.isClosing.set(false);
        this.#startAutoDismiss();
      });
    });
  }

  ngOnDestroy() {
    clearTimeout(this.#closeTimeoutId);
    clearTimeout(this.#hideToastTimeoutId);
  }

  // Hovering or focusing the toast pauses the timer, so it can be read in full
  pauseAutoDismiss() {
    clearTimeout(this.#closeTimeoutId);
  }

  resumeAutoDismiss() {
    if (!this.isClosing()) this.#startAutoDismiss();
  }

  close() {
    clearTimeout(this.#closeTimeoutId);
    this.isClosing.set(true);
    this.#hideToastTimeoutId = setTimeout(() => {
      this.#errorToastService.hideToast();
    }, CLOSE_ANIMATION_MS);
  }

  #startAutoDismiss() {
    clearTimeout(this.#closeTimeoutId);
    if (this.isPersistent()) return;
    this.#closeTimeoutId = setTimeout(() => this.close(), AUTO_DISMISS_DELAY_MS);
  }
}
