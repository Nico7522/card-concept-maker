import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import {
  heroArchiveBoxXMark,
  heroArrowLeft,
  heroArrowLongRight,
  heroPlus,
} from '@ng-icons/heroicons/outline';
import { catchError, EMPTY, filter, map, of, switchMap, take } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../shared/api/auth-service/auth.service';
import { LoaderComponent } from '../../../shared/ui/loader/loader.component';
import { ErrorToastService } from '../../../shared/api/error-toast-service/error-toast.service';
import patchCardForm from '../../../app/helpers/patch-card-form';
import generateCard from '../../../app/helpers/generate-card';
import { CardFormComponent } from '../../../widgets/ui/card-form/card-form.component';
import { CardForm } from '~/src/widgets/model/card-form-interface';
import { Card } from '~/src/shared/model/card-interface';
import { AsyncPipe } from '@angular/common';
import { UpdateCardService } from '../api/update-card.service';
import { HasUnsavedChanges } from '~/src/features/model/has-unsavec-changes-interface';
import { ArtworkService } from '~/src/shared/api/artwork-service/artwork.service';

@Component({
  selector: 'app-update-card-form',
  imports: [ReactiveFormsModule, LoaderComponent, CardFormComponent, AsyncPipe],
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
export class UpdateCardComponent implements HasUnsavedChanges {
  readonly #updateCardService = inject(UpdateCardService);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #authService = inject(AuthService);
  readonly #errorToastService = inject(ErrorToastService);
  readonly #artworkService = inject(ArtworkService);
  isLoading = signal(true);
  isError = signal(false);
  card = signal<Card | null>(null);
  cardForm = new FormGroup({});
  artwork = signal<FormData | null>(null);
  isFormSubmitted = signal(false);
  card$ = this.#activatedRoute.data.pipe(
    map((data) => {
      const card = data['card'] as Card;
      this.card.set(card);
      this.isLoading.set(false);
      return card;
    })
  );
  onSubmit() {
    this.isFormSubmitted.set(true);
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
        this.#updateCardService
          .patchCard(this.#activatedRoute.snapshot.params['id'], {
            creatorName: this.#authService.user()?.displayName ?? '',
            creatorId: this.#authService.user()?.uid ?? '',
            cardName: nestedCardForm.get('cardName')?.value ?? '',
            artwork: nestedCardForm.get('artwork')?.value ?? null,
            characterInfo: characterInfo(),
            passiveDetails: passiveDetails(),
            superAttackInfo: superAttackInfo(),
          })
          .pipe(
            take(1),
            switchMap((data) => {
              if (this.artwork()) {
                return this.#artworkService
                  .patchArtworkImage(this.artwork() as FormData)
                  .pipe(
                    switchMap((response) => {
                      return this.#artworkService.patchArtworkName(
                        this.card()?.id ?? '',
                        response.filename
                      );
                    })
                  );
              }
              return of(data);
            }),
            catchError((err) => {
              console.log(err);
              this.isLoading.set(false);
              this.#errorToastService.showToast(
                'An error occurred while updating the card'
              );
              return EMPTY;
            })
          )
          .subscribe(() => {
            this.isLoading.set(false);
            console.log('ici');

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
    if (nestedCardForm && this.card()) {
      patchCardForm(nestedCardForm, this.card() as Card);
    }
  }

  hasUnsavedChanges(): boolean {
    return this.cardForm.dirty && !this.isFormSubmitted();
  }

  handleArtwork(formData: FormData) {
    this.artwork.set(formData);
  }
}
