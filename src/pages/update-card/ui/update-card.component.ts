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
import { catchError, combineLatest, EMPTY, filter, map, take, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ActivatedRoute, Router } from '@angular/router';
import {
  AuthService,
  ErrorToastService,
  GameDataService,
  LoadingService,
} from '~/src/shared/api';
import {
  CardFormComponent,
  CardForm,
  CardPersistenceService,
  patchCardForm,
  TransformationSelectorComponent,
  createCardFormPageState,
} from '~/src/features/card-form';
import { Card, UserCardsService } from '~/src/entities/card';
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
  readonly #cardPersistenceService = inject(CardPersistenceService);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #authService = inject(AuthService);
  readonly #errorToastService = inject(ErrorToastService);
  readonly #gameDataService = inject(GameDataService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #loadingService = inject(LoadingService);

  readonly formState = createCardFormPageState(inject(UserCardsService));

  cardForm = this.formState.cardForm;
  transformedCardForm = this.formState.transformedCardForm;
  artwork = this.formState.artwork;
  transformedArtwork = this.formState.transformedArtwork;
  isFormSubmitted = this.formState.isFormSubmitted;
  hasTransformation = this.formState.hasTransformation;
  transformationMode = this.formState.transformationMode;
  selectedExistingCardId = this.formState.selectedExistingCardId;
  showTransformationSection = this.formState.showTransformationSection;
  isNewCardMode = this.formState.isNewCardMode;
  userCards$ = this.formState.userCards$;
  handleArtwork = this.formState.handleArtwork;
  handleTransformedArtwork = this.formState.handleTransformedArtwork;
  handleTransformationChanged = this.formState.handleTransformationChanged;

  isError = signal(false);
  card = signal<Card | null>(null);
  transformedCard = signal<Card | null>(null);

  card$ = this.#activatedRoute.data.pipe(
    tap((data) => {
      const baseCard = data['card']['baseCard'];
      const transformedCard = data['card']['transformedCard'];
      this.card.set(baseCard);
      this.transformedCard.set(transformedCard);

      const transformedCardId =
        baseCard?.characterInfo?.activeSkill?.transformedCardId;
      if (transformedCardId) {
        this.hasTransformation.set(true);
        this.transformationMode.set('existing');
        this.selectedExistingCardId.set(transformedCardId);
      }
    }),
    map((data) => data['card']['baseCard']),
  );

  onSubmit() {
    const validated = this.formState.validateForms();
    if (!validated) return;

    const user = this.#authService.user();
    if (!user) return;

    this.#loadingService.start();

    const cardId = this.#activatedRoute.snapshot.params['id'];
    const card = this.card();
    const transformedForm = this.formState.getTransformedForm();

    const request$ = this.hasTransformation()
      ? this.#cardPersistenceService.updateCardWithTransformation({
          cardId,
          mainForm: validated.mainForm,
          mainArtwork: this.artwork(),
          currentArtwork: card?.artwork ?? null,
          mode: this.transformationMode(),
          existingCardId: this.selectedExistingCardId(),
          transformedForm,
          transformedArtwork: this.transformedArtwork(),
          hasTransformation: this.hasTransformation(),
        })
      : this.#cardPersistenceService.updateCard({
          cardId,
          mainForm: validated.mainForm,
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
    const nestedCardForm = this.formState.getNestedForm();

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
    return this.formState.hasUnsavedChanges();
  }
}
