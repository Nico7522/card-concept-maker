import { FormGroup } from '@angular/forms';
import { CardForm } from './card-form-interface';
import { TransformationMode } from './transformation-mode.type';

export interface UpdateCardParams {
  baseCardId: string;
  mainForm: FormGroup<CardForm>;
  mainArtwork: FormData | null;
  currentArtwork: string | null;
}

export interface UpdateCardWithTransformationParams extends UpdateCardParams {
  mode: TransformationMode;
  transformedCardId: string | null;
  transformedForm: FormGroup<CardForm> | null;
  transformedArtwork: FormData | null;
  hasTransformation: boolean;
  currentTransformedArtwork: string | null;
}
