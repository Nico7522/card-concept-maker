import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  DOCUMENT,
  ElementRef,
  inject,
  output,
  viewChild,
} from '@angular/core';

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Confirmation dialog following the WAI-ARIA alert dialog pattern:
 * focus starts on the least destructive action (Cancel), stays inside the
 * dialog while it is open, Escape closes it, and focus goes back to the
 * element that opened it.
 */
@Component({
  selector: 'app-delete-confirmation-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrl: './delete-confirmation-modal.component.css',
  host: {
    '(document:keydown.escape)': 'onClose()',
  },
})
export class DeleteConfirmationModalComponent {
  readonly #document = inject(DOCUMENT);

  confirm = output<boolean>();

  readonly dialog = viewChild.required('dialog', { read: ElementRef });
  readonly cancelButton = viewChild.required('cancelButton', {
    read: ElementRef,
  });

  // Captured at creation, before the dialog takes the focus
  readonly #previouslyFocusedElement = this.#document
    .activeElement as HTMLElement | null;

  constructor() {
    afterNextRender(() =>
      (this.cancelButton().nativeElement as HTMLElement).focus(),
    );
    inject(DestroyRef).onDestroy(() =>
      this.#previouslyFocusedElement?.focus(),
    );
  }

  onConfirm() {
    this.confirm.emit(true);
  }

  onClose() {
    this.confirm.emit(false);
  }

  // Keeps Tab / Shift+Tab inside the dialog
  onKeydown(event: KeyboardEvent) {
    if (event.key !== 'Tab') return;

    const focusableElements = Array.from(
      (this.dialog().nativeElement as HTMLElement).querySelectorAll<HTMLElement>(
        FOCUSABLE_SELECTOR,
      ),
    );
    if (focusableElements.length === 0) return;

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    const activeElement = this.#document.activeElement;

    if (event.shiftKey && activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
