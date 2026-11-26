import { computed, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserCardsService } from '~/src/entities/card';
import { CardForm } from '../model/card-form-interface';
import { TransformationMode } from '../model/transformation-mode.type';
import { TransformationChangedEvent } from '../ui/card-form.component';

export function createCardFormPageState(userCardsService: UserCardsService) {
  const cardForm = new FormGroup({});
  const transformedCardForm = new FormGroup({});
  const artwork = signal<FormData | null>(null);
  const transformedArtwork = signal<FormData | null>(null);
  const isFormSubmitted = signal(false);
  // Set on every submit click, valid or not: shows errors that don't rely on `dirty`
  const hasSubmitAttempt = signal(false);
  const hasTransformation = signal(false);
  const transformationMode = signal<TransformationMode>('existing');
  const selectedExistingCardId = signal<string | null>(null);

  const showTransformationSection = computed(() => hasTransformation());
  const isExistingCardMode = computed(
    () => transformationMode() === 'existing',
  );
  const userCards$ = userCardsService.userCards$;
  // "Select an existing card" mode without a selected card
  const isTransformationSelectionMissing = computed(
    () =>
      hasTransformation() && !isExistingCardMode() && !selectedExistingCardId(),
  );

  function getNestedForm(): FormGroup<CardForm> | null {
    return cardForm.get('cardForm') as FormGroup<CardForm> | null;
  }

  function getTransformedForm(): FormGroup<CardForm> | null {
    if (!hasTransformation() || !isExistingCardMode()) return null;
    return transformedCardForm.get(
      'transformedCardForm',
    ) as FormGroup<CardForm> | null;
  }

  function validateForms(): {
    mainForm: FormGroup<CardForm>;
    transformedForm: FormGroup<CardForm> | null;
  } | null {
    hasSubmitAttempt.set(true);

    const mainForm = getNestedForm();
    const hasTransformedForm = hasTransformation() && isExistingCardMode();
    const isValid =
      !!mainForm?.valid &&
      (!hasTransformedForm || !!getTransformedForm()?.valid) &&
      !isTransformationSelectionMissing();

    if (!mainForm || !isValid) {
      // Every error message is shown on `dirty`: reveal them all at once
      cardForm.markAllAsDirty();
      if (hasTransformedForm) transformedCardForm.markAllAsDirty();
      return null;
    }

    // Only once valid: an invalid attempt must keep the unsaved changes warning
    isFormSubmitted.set(true);

    return {
      mainForm,
      transformedForm: getTransformedForm(),
    };
  }

  function hasUnsavedChanges(): boolean {
    const mainDirty = cardForm.dirty;
    const transDirty =
      hasTransformation() && isExistingCardMode() && transformedCardForm.dirty;
    return (mainDirty || transDirty) && !isFormSubmitted();
  }

  return {
    cardForm,
    transformedCardForm,
    artwork,
    transformedArtwork,
    isFormSubmitted,
    hasSubmitAttempt,
    hasTransformation,
    transformationMode,
    selectedExistingCardId,

    showTransformationSection,
    isExistingCardMode,
    isTransformationSelectionMissing,
    userCards$,

    handleArtwork: (fd: FormData) => artwork.set(fd),
    handleTransformedArtwork: (fd: FormData) => transformedArtwork.set(fd),
    handleTransformationChanged: (e: TransformationChangedEvent) =>
      hasTransformation.set(e.hasTransformation),

    getNestedForm,
    getTransformedForm,
    validateForms,
    hasUnsavedChanges,
  };
}

export type CardFormPageState = ReturnType<typeof createCardFormPageState>;
