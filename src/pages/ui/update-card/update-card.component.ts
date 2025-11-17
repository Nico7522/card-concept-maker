import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UbButtonDirective } from '~/components/ui/button';
import { provideIcons } from '@ng-icons/core';
import {
  heroArchiveBoxXMark,
  heroArrowLeft,
  heroArrowLongRight,
  heroPlus,
} from '@ng-icons/heroicons/outline';
import { catchError, EMPTY, filter, map, of, switchMap, take } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth-service/auth.service';
import { LoaderComponent } from '../../../shared/ui/loader/loader.component';
import { ErrorToastService } from '../../../shared/services/error-toast-service/error-toast.service';
import patchCardForm from '../../../app/helpers/patch-card-form';
import generateCard from '../../../app/helpers/generate-card';
import { CardFormComponent } from '../../../widgets/ui/card-form/card-form.component';
import { CardService } from '~/src/shared/services/card-service/card.service';
import { CardForm } from '~/src/widgets/model/card-form-interface';

@Component({
  selector: 'app-update-card-form',
  imports: [
    ReactiveFormsModule,
    UbButtonDirective,
    LoaderComponent,
    CardFormComponent,
  ],
  templateUrl: './update-card.component.html',
  styleUrl: './update-card.component.css',
  viewProviders: [
    provideIcons({
      heroArchiveBoxXMark,
      heroArrowLeft,
      heroArrowLongRight,
      heroPlus,
    }),
  ],
})
export class UpdateCardComponent implements AfterViewInit {
  readonly #cardService = inject(CardService);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #authService = inject(AuthService);
  readonly #errorToastService = inject(ErrorToastService);
  isLoading = signal(true);
  isError = signal(false);

  cardForm = new FormGroup({});

  onSubmit() {
    const nestedCardForm = this.cardForm.get(
      'cardForm'
    ) as FormGroup<CardForm> | null;
    if (!nestedCardForm) {
      return;
    }
    if (nestedCardForm.valid) {
      const { characterInfo, passiveDetails, superAttackInfo } =
        generateCard(nestedCardForm);

      if (this.#authService.user() !== null) {
        this.isLoading.set(true);
        this.#cardService
          .patchCard(this.#activatedRoute.snapshot.params['id'], {
            creatorName: this.#authService.user()?.displayName ?? '',
            creatorId: this.#authService.user()?.uid ?? '',
            cardName: nestedCardForm.get('cardName')?.value ?? '',
            characterInfo: characterInfo(),
            passiveDetails: passiveDetails(),
            superAttackInfo: superAttackInfo(),
          })
          .pipe(
            take(1),
            catchError(() => {
              this.isLoading.set(false);
              this.#errorToastService.showToast(
                'An error occurred while updating the card'
              );
              return EMPTY;
            })
          )
          .subscribe(() => {
            this.isLoading.set(false);
            this.#router.navigate([
              '/card',
              this.#activatedRoute.snapshot.params['id'],
            ]);
          });
      }
    }
  }

  ngAfterViewInit(): void {
    const nestedCardForm = this.cardForm.get(
      'cardForm'
    ) as FormGroup<CardForm> | null;
    if (nestedCardForm) {
      this.#activatedRoute.params
        .pipe(
          take(1),
          switchMap((params) => {
            const id = params['id'];
            return this.#cardService.getCardById(id);
          }),
          map((card) => {
            patchCardForm(nestedCardForm, card);
            this.isLoading.set(false);
            return card;
          }),
          catchError(() => {
            this.isLoading.set(false);
            this.#errorToastService.showToast('Card not found');
            return EMPTY;
          })
        )
        .subscribe();
    }
  }
}
