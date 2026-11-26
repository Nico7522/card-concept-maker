import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ElementRef,
  inject,
  Injector,
  inputBinding,
  OnDestroy,
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
import { AsyncPipe } from '@angular/common';
import { catchError, EMPTY, take } from 'rxjs';
import { Router } from '@angular/router';

import {
  AuthService,
  ErrorToastService,
  GameDataService,
  LoadingService,
} from '~/src/shared/api';
import {
  HasUnsavedChanges,
  warnBeforeUnload,
} from '~/src/features/unsaved-changes';
import {
  CardForm,
  CardFormComponent,
  CardPersistenceService,
  TransformationSelectorComponent,
  createCardFormPageState,
  scrollToFirstInvalidField,
} from '~/src/features/card-form';
import { buildGuestPreviewCard } from '../lib/build-guest-preview-card';
import { Card, CardComponent, UserCardsService } from '~/src/entities/card';

@Component({
  selector: 'app-create-card-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CardFormComponent,
    TransformationSelectorComponent,
    AsyncPipe,
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
  readonly #cardPersistenceService = inject(CardPersistenceService);
  readonly #errorToastService = inject(ErrorToastService);
  readonly #router = inject(Router);
  readonly #gameDataService = inject(GameDataService);
  readonly #loadingService = inject(LoadingService);
  readonly #elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #injector = inject(Injector);

  readonly formState = createCardFormPageState(inject(UserCardsService));

  constructor() {
    // Closing the tab or reloading with unsaved changes asks for confirmation
    warnBeforeUnload(this);
  }

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
  userCards$ = this.formState.userCards$;
  handleArtwork = this.formState.handleArtwork;
  handleTransformedArtwork = this.formState.handleTransformedArtwork;
  handleTransformationChanged = this.formState.handleTransformationChanged;

  card = viewChild.required('card', { read: ViewContainerRef });
  componentRefs: ComponentRef<CardComponent> | null = null;

  onSubmit() {
    const validated = this.formState.validateForms();
    if (!validated) {
      this.#scrollToFirstInvalidField();
      return;
    }

    if (this.#authService.user() !== null) {
      this.#createCardForAuthenticatedUser(validated.mainForm);
    } else {
      this.#ShowPreviewCardForGuest(
        validated.mainForm,
        validated.transformedForm ?? undefined,
      );
    }
  }

  // After the error messages are rendered, bring the first invalid field into view
  #scrollToFirstInvalidField() {
    afterNextRender(
      () => scrollToFirstInvalidField(this.#elementRef.nativeElement),
      { injector: this.#injector },
    );
  }

  #createCardForAuthenticatedUser(mainForm: FormGroup<CardForm>) {
    this.#loadingService.start();

    const transformedForm = this.formState.getTransformedForm();

    const request$ = this.hasTransformation()
      ? this.#cardPersistenceService.createCardWithTransformation({
          mainForm,
          mainArtwork: this.artwork(),
          mode: this.transformationMode(),
          existingCardId: this.selectedExistingCardId(),
          transformedForm,
          transformedArtwork: this.transformedArtwork(),
        })
      : this.#cardPersistenceService.createCard({
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

  #ShowPreviewCardForGuest(
    form: FormGroup<CardForm>,
    transformedForm?: FormGroup<CardForm>,
  ) {
    const categories = this.#gameDataService.categories();
    const links = this.#gameDataService.links();
    const passiveConditionActivation =
      this.#gameDataService.passiveConditionActivation();

    const baseCard = buildGuestPreviewCard(
      form,
      categories,
      links,
      passiveConditionActivation,
    );
    const transformedCard: Card | null = transformedForm
      ? buildGuestPreviewCard(
          transformedForm,
          categories,
          links,
          passiveConditionActivation,
        )
      : null;

    if (this.componentRefs) {
      this.componentRefs.destroy();
    }

    const componentRef = this.card().createComponent(CardComponent, {
      bindings: [
        inputBinding('baseCard', () => baseCard),
        inputBinding('transformedCard', () => transformedCard),
      ],
    });

    this.componentRefs = componentRef;
  }

  ngOnDestroy() {
    this.componentRefs?.destroy();
  }

  hasUnsavedChanges() {
    return this.formState.hasUnsavedChanges();
  }
}
