import {
  Component,
  ComponentRef,
  inject,
  outputBinding,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroArrowLeft,
  heroArrowLongRight,
  heroChevronDoubleRight,
  heroChevronDoubleLeft,
  heroMagnifyingGlassPlus,
  heroPencilSquare,
  heroTrash,
} from '@ng-icons/heroicons/outline';
import {
  catchError,
  EMPTY,
  map,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { LoaderComponent } from '~/src/shared/ui';
import { AuthService, ErrorToastService } from '~/src/shared/api';
import { Card } from '~/src/shared/model';
import { UbButtonDirective } from '~/components/ui/button';
import { DeleteConfirmationModalComponent } from './delete-confirmation-modal/delete-confirmation-modal.component';
import { DeleteCardService } from '../api/delete-card.service';
import { environment } from '~/src/environments/environment';
import { CardComponent } from '~/src/shared/ui/card/card.component';

@Component({
  selector: 'app-card-details',
  imports: [
    NgIconComponent,
    UbButtonDirective,
    AsyncPipe,
    LoaderComponent,
    RouterModule,
    CardComponent,
  ],
  templateUrl: './card-details.component.html',
  styleUrl: './card-details.component.css',
  viewProviders: [
    provideIcons({
      heroArrowLeft,
      heroArrowLongRight,
      heroChevronDoubleRight,
      heroChevronDoubleLeft,
      heroMagnifyingGlassPlus,
      heroPencilSquare,
      heroTrash,
    }),
  ],
})
export class CardDetailsComponent {
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #authService = inject(AuthService);
  readonly #deleteCardService = inject(DeleteCardService);
  readonly #errorToastService = inject(ErrorToastService);
  readonly #router = inject(Router);
  readonly apiUrl = environment.apiUrl + '/';
  isLoading = signal(true);
  isError = signal(false);
  cardId = signal<string | null>(null);

  card$ = this.#activatedRoute.data.pipe(
    map((data) => data['card'] as Card),
    tap((card) => {
      this.cardId.set(card.id ?? '');
      this.isLoading.set(false);
    }),
    catchError(() => {
      this.isError.set(true);
      this.isLoading.set(false);
      return EMPTY;
    }),
    shareReplay({ refCount: true, bufferSize: 1 })
  );
  canUpdate$ = this.card$.pipe(
    switchMap((card) => {
      return this.#authService.user$.pipe(
        map((user) => user?.uid === card.creatorId)
      );
    })
  );
  confirmationDelete = viewChild.required('confirmationDelete', {
    read: ViewContainerRef,
  });
  confirmationDeleteRef: ComponentRef<DeleteConfirmationModalComponent> | null =
    null;

  ngOnDestroy() {
    if (this.confirmationDeleteRef) {
      this.confirmationDeleteRef.destroy();
    }
  }

  openDeleteConfirmationModal() {
    const componentRef = this.confirmationDelete().createComponent(
      DeleteConfirmationModalComponent,
      {
        bindings: [
          outputBinding('confirm', (result: boolean) => {
            if (result) {
              this.isLoading.set(true);
              this.#deleteCardService
                .deleteCard(this.cardId() ?? '')
                .pipe(
                  take(1),
                  tap(() => {
                    this.#router.navigate(['/']);
                    this.isLoading.set(false);
                  }),
                  catchError(() => {
                    this.#errorToastService.showToast(
                      'An error occurred while deleting the card'
                    );
                    this.isLoading.set(false);
                    return EMPTY;
                  })
                )
                .subscribe();
            }
            componentRef.destroy();
          }),
        ],
      }
    );
    this.confirmationDeleteRef = componentRef;
  }
}
