import {
  AfterViewInit,
  ChangeDetectionStrategy,
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
  LoadingService,
} from '~/src/shared/api';
import { CardFormComponent, CardForm } from '~/src/features/card-form';
import { Card } from '~/src/entities/card';
import { AsyncPipe } from '@angular/common';
import { UpdateCardService } from '../api/update-card.service';
import { HasUnsavedChanges } from '~/src/features/unsaved-changes';
import generateCard from '~/src/features/card-form/lib/generate-card';
import patchCardForm from '~/src/features/card-form/lib/patch-card-form';

@Component({
  selector: 'app-update-card-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CardFormComponent, AsyncPipe],
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
  readonly #loadingService = inject(LoadingService);
  isError = signal(false);
  card = signal<Card | null>(null);
  artwork = signal<FormData | null>(null);
  isFormSubmitted = signal(false);
  cardForm = new FormGroup({});
  card$ = this.#activatedRoute.data.pipe(
    map((data) => {
      this.card.set(data['card']['baseCard']);
      return data['card']['baseCard'];
    }),
  );
  onSubmit() {
    this.isFormSubmitted.set(true);

    const nestedCardForm = this.cardForm.get(
      'cardForm',
    ) as FormGroup<CardForm> | null;
    if (!nestedCardForm?.valid) return;

    const user = this.#authService.user();
    if (!user) return;

    this.#loadingService.start();

    const cardId = this.#activatedRoute.snapshot.params['id'];
    const card = this.card();
    const { characterInfo, passiveDetails, superAttackInfo } = generateCard(
      nestedCardForm,
      this.#gameDataService.categories(),
      this.#gameDataService.links(),
      this.#gameDataService.passiveConditionActivation(),
    );

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
          this.handleArtworkUpload(card?.id ?? '', card?.artwork ?? null),
        ),
        catchError(() => {
          this.#errorToastService.showToast(
            'An error occurred while updating the card',
          );
          this.#loadingService.stop();
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.#router.navigate(['/card', cardId]);
        this.#loadingService.stop();
      });
  }

  ngAfterViewInit(): void {
    this.#loadingService.start();
    const nestedCardForm = this.cardForm.get(
      'cardForm',
    ) as FormGroup<CardForm> | null;

    combineLatest([
      this.card$.pipe(filter((card) => !!card)),
      this.#gameDataService.categories$,
      this.#gameDataService.links$,
      this.#gameDataService.passiveConditionActivation$,
      this.#gameDataService.effectDuration$,
      this.#authService.user$.pipe(filter((user) => !!user)),
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
              effectDuration,
            );
          }
          this.#loadingService.stop();
        },
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
        this.#artworkService.patchArtworkName(cardId, response.filename),
      ),
      switchMap(() =>
        currentArtwork
          ? this.#artworkService.deleteArtwork(currentArtwork)
          : of(null),
      ),
    );
  }
}
