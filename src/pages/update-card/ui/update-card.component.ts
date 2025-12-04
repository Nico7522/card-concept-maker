import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import {
  heroArchiveBoxXMark,
  heroArrowLeft,
  heroArrowLongRight,
  heroPlus,
} from '@ng-icons/heroicons/outline';
import {
  catchError,
  combineLatest,
  EMPTY,
  filter,
  finalize,
  map,
  of,
  switchMap,
  take,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ActivatedRoute, Router } from '@angular/router';
import {
  AuthService,
  ErrorToastService,
  GameDataService,
  ArtworkService,
} from '~/src/shared/api';
import { LoaderComponent } from '~/src/shared/ui';
import patchCardForm from '~/src/app/helpers/patch-card-form';
import generateCard from '~/src/app/helpers/generate-card';
import { CardFormComponent, CardForm } from '~/src/widgets/card-form';
import { Card } from '~/src/shared/model';
import { AsyncPipe } from '@angular/common';
import { UpdateCardService } from '../api/update-card.service';
import { HasUnsavedChanges } from '~/src/features/unsaved-changes';

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
export class UpdateCardComponent implements HasUnsavedChanges, AfterViewInit {
  readonly #updateCardService = inject(UpdateCardService);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #authService = inject(AuthService);
  readonly #errorToastService = inject(ErrorToastService);
  readonly #artworkService = inject(ArtworkService);
  readonly #gameDataService = inject(GameDataService);
  readonly #destroyRef = inject(DestroyRef);
  isLoading = signal(true);
  isError = signal(false);
  card = signal<Card | null>(null);
  artwork = signal<FormData | null>(null);
  isFormSubmitted = signal(false);
  cardForm = new FormGroup({});
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
    if (!nestedCardForm?.valid) return;

    const user = this.#authService.user();
    if (!user) return;

    const cardId = this.#activatedRoute.snapshot.params['id'];
    const card = this.card();
    const { characterInfo, passiveDetails, superAttackInfo } = generateCard(
      nestedCardForm,
      this.#gameDataService.categories(),
      this.#gameDataService.links(),
      this.#gameDataService.passiveConditionActivation()
    );

    this.isLoading.set(true);

    this.#updateCardService
      .patchCard(cardId, {
        creatorName: user.displayName ?? '',
        creatorId: user.uid ?? '',
        cardName: nestedCardForm.get('cardName')?.value ?? '',
        artwork: nestedCardForm.get('artwork')?.value ?? null,
        characterInfo: characterInfo(),
        passiveDetails: passiveDetails(),
        superAttackInfo: superAttackInfo(),
      })
      .pipe(
        switchMap(() =>
          this.handleArtworkUpload(card?.id ?? '', card?.artwork ?? null)
        ),
        catchError(() => {
          this.#errorToastService.showToast(
            'An error occurred while updating the card'
          );
          return EMPTY;
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe(() => {
        this.#router.navigate(['/card', cardId]);
      });
  }

  ngAfterViewInit(): void {
    const nestedCardForm = this.cardForm.get(
      'cardForm'
    ) as FormGroup<CardForm> | null;

    // Attendre que toutes les données soient chargées avant de patcher le formulaire
    combineLatest([
      this.card$.pipe(filter((card) => !!card)),
      this.#gameDataService.categories$,
      this.#gameDataService.links$,
      this.#gameDataService.passiveConditionActivation$,
      this.#gameDataService.effectDuration$,
    ])
      .pipe(take(1), takeUntilDestroyed(this.#destroyRef))
      .subscribe(
        ([
          card,
          categories,
          links,
          passiveConditionActivation,
          effectDuration,
        ]) => {
          if (nestedCardForm) {
            patchCardForm(
              nestedCardForm,
              card,
              categories,
              links,
              passiveConditionActivation,
              effectDuration
            );
          }
        }
      );
  }

  hasUnsavedChanges(): boolean {
    return this.cardForm.dirty && !this.isFormSubmitted();
  }

  handleArtwork(formData: FormData) {
    this.artwork.set(formData);
  }

  private handleArtworkUpload(cardId: string, currentArtwork: string | null) {
    const artwork = this.artwork();
    if (!artwork) return of(null);

    return this.#artworkService.patchArtworkImage(artwork).pipe(
      switchMap((response) =>
        this.#artworkService.patchArtworkName(cardId, response.filename)
      ),
      switchMap(() =>
        currentArtwork
          ? this.#artworkService.deleteArtwork(currentArtwork)
          : of(null)
      )
    );
  }
}
