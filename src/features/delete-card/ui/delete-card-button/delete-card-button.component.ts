import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  inject,
  input,
  output,
  outputBinding,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroTrash } from '@ng-icons/heroicons/outline';
import { catchError, EMPTY, take, tap } from 'rxjs';
import { ErrorToastService } from '~/src/shared/api';
import { DeleteCardService } from '~/src/entities/card';
import { DeleteConfirmationModalComponent } from './delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-delete-card-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIconComponent],
  template: `
    <button
      type="button"
      class="dokkan-btn dokkan-btn--danger"
      aria-label="Delete card"
      [disabled]="isDeleting()"
      (click)="openModal()"
    >
      <ng-icon name="heroTrash" class="h-5 w-5" />
      <span class="hidden sm:inline">Delete</span>
    </button>
    <ng-container #modalContainer />
  `,
  viewProviders: [provideIcons({ heroTrash })],
})
export class DeleteCardButtonComponent {
  readonly #deleteCardService = inject(DeleteCardService);
  readonly #errorToastService = inject(ErrorToastService);

  readonly cardId = input.required<string>();
  readonly deleted = output<void>();

  readonly modalContainer = viewChild.required('modalContainer', {
    read: ViewContainerRef,
  });

  readonly isDeleting = signal(false);

  #modalRef: ComponentRef<DeleteConfirmationModalComponent> | null = null;

  openModal() {
    const id = this.cardId();
    if (!id) return;

    this.#modalRef = this.modalContainer().createComponent(
      DeleteConfirmationModalComponent,
      {
        bindings: [
          outputBinding('confirm', (confirmed: boolean) => {
            if (confirmed) {
              this.isDeleting.set(true);
              this.#deleteCardService
                .delete(id)
                .pipe(
                  take(1),
                  tap(() => {
                    this.deleted.emit();
                    this.isDeleting.set(false);
                  }),
                  catchError(() => {
                    this.#errorToastService.showToast(
                      'An error occurred while deleting the card',
                      { persistent: true },
                    );
                    this.isDeleting.set(false);
                    return EMPTY;
                  }),
                )
                .subscribe();
            }
            this.#modalRef?.destroy();
            this.#modalRef = null;
          }),
        ],
      },
    );
  }
}
