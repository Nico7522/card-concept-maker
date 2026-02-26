import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  computed,
  inject,
  inputBinding,
  OnDestroy,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import {
  heroArchiveBoxXMark,
  heroArrowLeft,
  heroArrowLongRight,
  heroPlus,
} from '@ng-icons/heroicons/outline';
import { catchError, EMPTY, take } from 'rxjs';
import { Router } from '@angular/router';

import {
  AuthService,
  ErrorToastService,
  GameDataService,
  LoadingService,
  UserCardsService,
} from '~/src/shared/api';
import { HasUnsavedChanges } from '~/src/features/unsaved-changes';
import {
  CardForm,
  CardFormComponent,
  CreateCardService,
  TransformationChangedEvent,
  TransformationMode,
  TransformationSelectorComponent,
  generateCard,
} from '~/src/features/card-form';
import { Card, CardComponent } from '~/src/entities/card';

@Component({
  selector: 'app-create-card-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CardFormComponent,
    TransformationSelectorComponent,
  ],
  templateUrl: './create-card.component.html',
  styleUrl: './create-card.component.css',
  viewProviders: [
    provideIcons({
      heroArchiveBoxXMark,
      heroArrowLeft,
      heroArrowLongRight,
      heroPlus,
    }),
  ],
})
export class CreateCardComponent implements OnDestroy, HasUnsavedChanges {
  readonly #authService = inject(AuthService);
  readonly #createCardService = inject(CreateCardService);
  readonly #errorToastService = inject(ErrorToastService);
  readonly #router = inject(Router);
  readonly #gameDataService = inject(GameDataService);
  readonly #loadingService = inject(LoadingService);
  readonly #userCardsService = inject(UserCardsService);

  // Form state
  cardForm = new FormGroup({});
  transformedCardForm = new FormGroup({});

  // Signals
  artwork = signal<FormData | null>(null);
  transformedArtwork = signal<FormData | null>(null);
  isFormSubmitted = signal(false);
  title = signal('Card Details');

  // Transformation state
  hasTransformation = signal(false);
  transformationMode = signal<TransformationMode>('new');
  selectedExistingCardId = signal<string | null>(null);
  userCards = signal<Card[]>([]);

  // Computed
  showTransformationSection = computed(() => this.hasTransformation());
  isNewCardMode = computed(() => this.transformationMode() === 'new');

  // View refs
  card = viewChild.required('card', { read: ViewContainerRef });
  componentRefs: ComponentRef<CardComponent> | null = null;

  onSubmit() {
    this.isFormSubmitted.set(true);

    const nestedCardForm = this.cardForm.get(
      'cardForm',
    ) as FormGroup<CardForm> | null;
    if (!nestedCardForm?.valid) {
      return;
    }

    // Validate transformed form if needed
    if (this.hasTransformation() && this.isNewCardMode()) {
      const transformedForm = this.transformedCardForm.get(
        'transformedCardForm',
      ) as FormGroup<CardForm> | null;
      if (!transformedForm?.valid) {
        return;
      }
    }

    if (this.#authService.user() !== null) {
      this.#createCardForAuthenticatedUser(nestedCardForm);
    } else {
      this.#previewCardForGuest(nestedCardForm);
    }
  }

  #createCardForAuthenticatedUser(mainForm: FormGroup<CardForm>) {
    this.#loadingService.start();

    const transformedForm =
      this.hasTransformation() && this.isNewCardMode()
        ? (this.transformedCardForm.get(
            'transformedCardForm',
          ) as unknown as FormGroup<CardForm>)
        : null;

    const request$ = this.hasTransformation()
      ? this.#createCardService.createCardWithTransformation({
          mainForm,
          mainArtwork: this.artwork(),
          mode: this.transformationMode(),
          existingCardId: this.selectedExistingCardId(),
          transformedForm,
          transformedArtwork: this.transformedArtwork(),
        })
      : this.#createCardService.createCard({
          mainForm,
          mainArtwork: this.artwork(),
        });

    request$
      .pipe(
        take(1),
        catchError(() => {
          this.#loadingService.stop();
          this.#errorToastService.showToast(
            'An error occurred while creating the card',
          );
          return EMPTY;
        }),
      )
      .subscribe((result) => {
        this.#router.navigate(['/card', result.id]);
        this.#loadingService.stop();
      });
  }

  #previewCardForGuest(form: FormGroup<CardForm>) {
    const { characterInfo, passiveDetails, superAttackInfo } = generateCard(
      form,
      this.#gameDataService.categories(),
      this.#gameDataService.links(),
      this.#gameDataService.passiveConditionActivation(),
    );

    if (this.componentRefs) {
      this.componentRefs.destroy();
    }

    const componentRef = this.card().createComponent(CardComponent, {
      bindings: [
        inputBinding('card', () => ({
          characterInfo: characterInfo(),
          passiveDetails: passiveDetails(),
          superAttackInfo: superAttackInfo(),
        })),
      ],
    });

    this.componentRefs = componentRef;
  }

  ngOnDestroy() {
    this.componentRefs?.destroy();
  }

  hasUnsavedChanges() {
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
