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
  const hasTransformation = signal(false);
  const transformationMode = signal<TransformationMode>('new');
  const selectedExistingCardId = signal<string | null>(null);

  const showTransformationSection = computed(() => hasTransformation());
  const isNewCardMode = computed(() => transformationMode() === 'new');
  const userCards$ = userCardsService.userCards$;

  function getNestedForm(): FormGroup<CardForm> | null {
    return cardForm.get('cardForm') as FormGroup<CardForm> | null;
  }

  function getTransformedForm(): FormGroup<CardForm> | null {
    if (!hasTransformation() || !isNewCardMode()) return null;
    return transformedCardForm.get(
      'transformedCardForm',
    ) as FormGroup<CardForm> | null;
  }

  function validateForms(): {
    mainForm: FormGroup<CardForm>;
    transformedForm: FormGroup<CardForm> | null;
  } | null {
    isFormSubmitted.set(true);

    const mainForm = getNestedForm();
    if (!mainForm?.valid) return null;

    if (hasTransformation() && isNewCardMode()) {
      const transformed = getTransformedForm();
      if (!transformed?.valid) return null;
    }

    return {
      mainForm,
      transformedForm: getTransformedForm(),
    };
  }

  function hasUnsavedChanges(): boolean {
    const mainDirty = cardForm.dirty;
    const transDirty =
      hasTransformation() && isNewCardMode() && transformedCardForm.dirty;
    return (mainDirty || transDirty) && !isFormSubmitted();
  }

  return {
    cardForm,
    transformedCardForm,
    artwork,
    transformedArtwork,
    isFormSubmitted,
    hasTransformation,
    transformationMode,
    selectedExistingCardId,

    showTransformationSection,
    isNewCardMode,
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
