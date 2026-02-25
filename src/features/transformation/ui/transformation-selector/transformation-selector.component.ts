import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';

import { CardFormComponent } from '~/src/features/card-form';
import { Card } from '~/src/entities/card';
import { TransformationMode } from '../../model/transformation-mode.type';

@Component({
  selector: 'app-transformation-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NgSelectComponent, CardFormComponent],
  templateUrl: './transformation-selector.component.html',
  styleUrl: './transformation-selector.component.css',
})
export class TransformationSelectorComponent {
  userCards = input.required<Card[]>();
  transformedCardForm = input.required<FormGroup>();

  modeChanged = output<TransformationMode>();
  existingCardSelected = model<string | null>(null);
  transformedArtwork = output<FormData>();

  mode = signal<TransformationMode>('new');
  selectedCardId = signal<string | null>(null);

  showNewCardForm = computed(() => this.mode() === 'new');
  showExistingCardSelector = computed(() => this.mode() === 'existing');

  onModeChange(newMode: TransformationMode) {
    this.mode.set(newMode);
    this.modeChanged.emit(newMode);
    if (newMode === 'existing') {
      this.selectedCardId.set(null);
      this.existingCardSelected.set(null);
    }
  }

  onExistingCardSelected(card: Card | null) {
    const cardId = card?.id ?? null;
    this.selectedCardId.set(cardId);
    this.existingCardSelected.set(cardId);
  }

  onTransformedArtwork(formData: FormData) {
    this.transformedArtwork.emit(formData);
  }
}
