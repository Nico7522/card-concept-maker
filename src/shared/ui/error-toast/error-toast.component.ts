import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorToastService } from '~/src/shared/api';

@Component({
  selector: 'app-error-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './error-toast.component.html',
  styleUrl: './error-toast.component.css',
})
export class ErrorToastComponent implements OnInit, OnDestroy {
  readonly #errorToastService = inject(ErrorToastService);
  message = this.#errorToastService.message;
  isVisible = this.#errorToastService.isVisible;
  isClosing = signal(false);
  private closeTimeoutId?: ReturnType<typeof setTimeout>;
  private hideToastTimeoutId?: ReturnType<typeof setTimeout>;
  ngOnInit() {
    this.closeTimeoutId = setTimeout(() => {
      this.close();
    }, 5000);
  }

  ngOnDestroy() {
    if (this.closeTimeoutId) {
      clearTimeout(this.closeTimeoutId);
    }
    if (this.hideToastTimeoutId) {
      clearTimeout(this.hideToastTimeoutId);
    }
  }

  close() {
    this.isClosing.set(true);
    this.hideToastTimeoutId = setTimeout(() => {
      this.#errorToastService.hideToast();
    }, 100);
  }
}
