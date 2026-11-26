import {
  AfterViewInit,
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
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
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

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
  scrollToFirstInvalidField,
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
  readonly #injector = inject(Injector);
  readonly #elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly transformationSection = viewChild('transformationSection', {
    read: ElementRef<HTMLElement>,
  });
  #hasScrolledToTransformation = false;

  readonly formState = createCardFormPageState(inject(UserCardsService));

  cardForm = this.formState.cardForm;
  transformedCardForm = this.formState.transformedCardForm;
  artwork = this.formState.artwork;
  transformedArtwork = this.formState.transformedArtwork;
  isFormSubmitted = this.formState.isFormSubmitted;
  hasSubmitAttempt = this.formState.hasSubmitAttempt;
  isTransformationSelectionMissing =
    this.formState.isTransformationSelectionMissing;
  hasTransformation = this.formState.hasTransformation;
  transformationMode = this.formState.transformationMode;
  selectedExistingCardId = this.formState.selectedExistingCardId;
  showTransformationSection = this.formState.showTransformationSection;
  isExistingCardMode = this.formState.isExistingCardMode;
  handleArtwork = this.formState.handleArtwork;
  handleTransformedArtwork = this.formState.handleTransformedArtwork;
  handleTransformationChanged = this.formState.handleTransformationChanged;

  isError = signal(false);
  card = signal<Card | null>(null);
  transformedCard = signal<Card | null>(null);

  // Cards selectable as the transformed form of the card being edited:
  // - the card being edited is excluded (a card can't transform into itself)
  // - the currently linked card is kept, even though it is filtered out of the
  //   user's cards for already having a link, so it stays displayed as selected
  userCards$ = combineLatest([
    this.formState.userCards$,
    toObservable(this.card),
    toObservable(this.transformedCard),
  ]).pipe(
    map(([userCards, card, transformedCard]) => {
      const selectableCards = userCards.filter(
        (userCard) => userCard.id !== card?.id,
      );
      const isLinkedCardMissing =
        transformedCard &&
        !selectableCards.some((userCard) => userCard.id === transformedCard.id);
      return isLinkedCardMissing
        ? [transformedCard, ...selectableCards]
        : selectableCards;
    }),
  );

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
    if (!validated) {
      this.#scrollToFirstInvalidField();
      return;
    }

    const user = this.#authService.user();
    if (!user) return;

    this.#loadingService.start();

    const urlCardId: string = this.#activatedRoute.snapshot.params['id'];
    const baseCard = this.card();
    const transformedCard = this.transformedCard();
    const transformedForm = this.formState.getTransformedForm();

    // Always use baseCard.id for updates (URL might be transformed card's ID)
    const baseCardId = baseCard?.id ?? urlCardId;

    // transformedCardId: either selected from dropdown (mode 'select') or existing linked card (mode 'existing')
    const transformedCardId =
      this.transformationMode() === 'select'
        ? this.selectedExistingCardId()
        : transformedCard?.id ?? null;

    const previousTransformedCardId = transformedCard?.id ?? null;

    const request$ = this.hasTransformation()
      ? this.#cardPersistenceService.updateCardWithTransformation({
          baseCardId,
          mainForm: validated.mainForm,
          mainArtwork: this.artwork(),
          currentArtwork: baseCard?.artwork ?? null,
          mode: this.transformationMode(),
          transformedCardId,
          transformedForm,
          transformedArtwork: this.transformedArtwork(),
          currentTransformedArtwork: transformedCard?.artwork ?? null,
          previousTransformedCardId,
        })
      : this.#cardPersistenceService.updateCard({
          baseCardId,
          mainForm: validated.mainForm,
          mainArtwork: this.artwork(),
          currentArtwork: baseCard?.artwork ?? null,
          previousTransformedCardId,
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
        this.#router.navigate(['/card', baseCardId]);
        this.#loadingService.stop();
      });
  }

  ngAfterViewInit(): void {
    this.#loadingService.start();
    const nestedCardForm = this.formState.getNestedForm();
    const transformedCardForm = this.formState.getTransformedForm();
    combineLatest([
      this.card$.pipe(filter((card) => !!card)),
      this.#gameDataService.categories$,
      this.#gameDataService.links$,
      this.#gameDataService.passiveConditionActivation$,
      this.#gameDataService.effectDuration$,
      this.#authService.user$.pipe(filter((user) => !!user)),
    ])
      .pipe(takeUntilDestroyed(this.#destroyRef))
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
          if (transformedCardForm && this.transformedCard()) {
            patchCardForm(
              transformedCardForm,
              this.transformedCard() as Card,
              categories,
              links,
              passiveConditionActivation,
              effectDuration,
            );
          }
          this.#loadingService.stop();
          this.#scrollToTransformationIfOpenedFromIt();
        },
      );
  }

  // After the error messages are rendered, bring the first invalid field into view
  #scrollToFirstInvalidField() {
    afterNextRender(
      () => scrollToFirstInvalidField(this.#elementRef.nativeElement),
      { injector: this.#injector },
    );
  }

  // When the update page is opened from the transformed card, scroll to its form
  #scrollToTransformationIfOpenedFromIt() {
    const urlCardId: string = this.#activatedRoute.snapshot.params['id'];
    const isOpenedFromTransformedCard =
      !!this.transformedCard() && this.transformedCard()?.id === urlCardId;
    if (!isOpenedFromTransformedCard || this.#hasScrolledToTransformation) {
      return;
    }
    this.#hasScrolledToTransformation = true;
    afterNextRender(
      () =>
        this.transformationSection()?.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        }),
      { injector: this.#injector },
    );
  }

  hasUnsavedChanges(): boolean {
    return this.formState.hasUnsavedChanges();
  }
}
