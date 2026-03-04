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
import { UbButtonDirective } from '~/components/ui/button';
import { DeleteCardService } from '~/src/entities/card';
import { DeleteConfirmationModalComponent } from './delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-delete-card-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIconComponent, UbButtonDirective],
  template: `
    <button
      ubButton
      size="sm"
      class="cursor-pointer flex items-center gap-2 bg-red-900/80 hover:bg-red-800 border border-red-600/50 text-red-100 px-4 py-2 rounded font-bold uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-red-500/20"
      [disabled]="isDeleting()"
      (click)="openModal()"
    >
      <ng-icon name="heroTrash" class="h-4 w-4" />
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
