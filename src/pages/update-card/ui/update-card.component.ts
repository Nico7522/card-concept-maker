import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
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
import { catchError, combineLatest, EMPTY, filter, map, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ActivatedRoute, Router } from '@angular/router';
import {
  AuthService,
  ErrorToastService,
  GameDataService,
  LoadingService,
  UserCardsService,
} from '~/src/shared/api';
import {
  CardFormComponent,
  CardForm,
  TransformationChangedEvent,
  TransformationMode,
  TransformationSelectorComponent,
  UpdateCardService,
  patchCardForm,
} from '~/src/features/card-form';
import { Card } from '~/src/entities/card';
import { AsyncPipe } from '@angular/common';
import { HasUnsavedChanges } from '~/src/features/unsaved-changes';

@Component({
  selector: 'app-update-card-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CardFormComponent,
    AsyncPipe,
    TransformationSelectorComponent,
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
export class UpdateCardComponent implements HasUnsavedChanges, AfterViewInit {
  readonly #updateCardService = inject(UpdateCardService);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #authService = inject(AuthService);
  readonly #errorToastService = inject(ErrorToastService);
  readonly #gameDataService = inject(GameDataService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #loadingService = inject(LoadingService);
  readonly #userCardsService = inject(UserCardsService);

  // Form state
  cardForm = new FormGroup({});
  transformedCardForm = new FormGroup({});

  // Signals
  isError = signal(false);
  card = signal<Card | null>(null);
  transformedCard = signal<Card | null>(null);
  artwork = signal<FormData | null>(null);
  transformedArtwork = signal<FormData | null>(null);
  isFormSubmitted = signal(false);

  // Transformation state
  hasTransformation = signal(false);
  transformationMode = signal<TransformationMode>('existing');
  selectedExistingCardId = signal<string | null>(null);
  userCards = signal<Card[]>([]);

  // Computed
  showTransformationSection = computed(() => this.hasTransformation());
  isNewCardMode = computed(() => this.transformationMode() === 'new');

  // Initial values for edit mode (from existing card data)
  initialTransformationMode = computed<TransformationMode>(() => {
    const card = this.card();
    const transformedCardId =
      card?.characterInfo?.activeSkill?.transformedCardId;
    return transformedCardId ? 'existing' : 'new';
  });

  initialExistingCardId = computed(() => {
    const card = this.card();
    return card?.characterInfo?.activeSkill?.transformedCardId ?? null;
  });

  card$ = this.#activatedRoute.data.pipe(
    map((data) => {
      const baseCard = data['card']['baseCard'];
      const transformedCard = data['card']['transformedCard'];
      this.card.set(baseCard);
      this.transformedCard.set(transformedCard);

      // Initialize transformation state from existing data
      const transformedCardId =
        baseCard?.characterInfo?.activeSkill?.transformedCardId;
      if (transformedCardId) {
        this.hasTransformation.set(true);
        this.transformationMode.set('existing');
        this.selectedExistingCardId.set(transformedCardId);
        this.#loadUserCards();
      }

      return baseCard;
    }),
  );
  onSubmit() {
    this.isFormSubmitted.set(true);

    const nestedCardForm = this.cardForm.get(
      'cardForm',
    ) as FormGroup<CardForm> | null;
    if (!nestedCardForm?.valid) return;

    // Validate transformed form if needed
    if (this.hasTransformation() && this.isNewCardMode()) {
      const transformedForm = this.transformedCardForm.get(
        'transformedCardForm',
      ) as FormGroup<CardForm> | null;
      if (!transformedForm?.valid) {
        return;
      }
    }

    const user = this.#authService.user();
    if (!user) return;

    this.#loadingService.start();

    const cardId = this.#activatedRoute.snapshot.params['id'];
    const card = this.card();

    const transformedForm =
      this.hasTransformation() && this.isNewCardMode()
        ? (this.transformedCardForm.get(
            'transformedCardForm',
          ) as unknown as FormGroup<CardForm>)
        : null;

    const request$ = this.hasTransformation()
      ? this.#updateCardService.updateCardWithTransformation({
          cardId,
          mainForm: nestedCardForm,
          mainArtwork: this.artwork(),
          currentArtwork: card?.artwork ?? null,
          mode: this.transformationMode(),
          existingCardId: this.selectedExistingCardId(),
          transformedForm,
          transformedArtwork: this.transformedArtwork(),
          hasTransformation: this.hasTransformation(),
        })
      : this.#updateCardService.updateCard({
          cardId,
          mainForm: nestedCardForm,
          mainArtwork: this.artwork(),
          currentArtwork: card?.artwork ?? null,
        });

    request$
      .pipe(
        take(1),
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
    const mainFormDirty = this.cardForm.dirty;
    const transformedFormDirty =
      this.hasTransformation() &&
      this.isNewCardMode() &&
      this.transformedCardForm.dirty;
    return (mainFormDirty || transformedFormDirty) && !this.isFormSubmitted();
  }

  // Event handlers
  handleArtwork(formData: FormData) {
    this.artwork.set(formData);
  }

  handleTransformationChanged(event: TransformationChangedEvent) {
    this.hasTransformation.set(event.hasTransformation);
    if (event.hasTransformation) {
      this.#loadUserCards();
    }
  }

  handleTransformationModeChanged(mode: TransformationMode) {
    this.transformationMode.set(mode);
    if (mode === 'existing') {
      this.selectedExistingCardId.set(null);
    }
  }

  handleTransformedArtwork(formData: FormData) {
    this.transformedArtwork.set(formData);
  }

  #loadUserCards() {
    const userId = this.#authService.user()?.uid;
    if (userId) {
      this.#userCardsService
        .getCardsByUserId(userId)
        .pipe(take(1))
        .subscribe((cards) => {
          this.userCards.set(cards);
        });
    }
  }
}
