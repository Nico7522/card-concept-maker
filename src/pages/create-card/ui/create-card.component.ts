import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  inject,
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
import { HasUnsavedChanges } from '~/src/features/unsaved-changes';
import {
  CardForm,
  CardFormComponent,
  CardPersistenceService,
  TransformationSelectorComponent,
  createCardFormPageState,
  generateCard,
} from '~/src/features/card-form';
import { CardComponent, UserCardsService } from '~/src/entities/card';

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
  isExistingCardMode = this.formState.isExistingCardMode;
  userCards$ = this.formState.userCards$;
  handleArtwork = this.formState.handleArtwork;
  handleTransformedArtwork = this.formState.handleTransformedArtwork;
  handleTransformationChanged = this.formState.handleTransformationChanged;

  card = viewChild.required('card', { read: ViewContainerRef });
  componentRefs: ComponentRef<CardComponent> | null = null;

  onSubmit() {
    const validated = this.formState.validateForms();
    if (!validated) return;

    if (this.#authService.user() !== null) {
      this.#createCardForAuthenticatedUser(validated.mainForm);
    } else {
      this.#previewCardForGuest(validated.mainForm);
    }
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
    return this.formState.hasUnsavedChanges();
  }
}
