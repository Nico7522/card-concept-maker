import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';

import { CardFormComponent } from '../card-form.component';
import { Card } from '~/src/entities/card';
import { TransformationMode } from '../../model/transformation-mode.type';

@Component({
  selector: 'app-transformation-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, NgSelectComponent, CardFormComponent],
  templateUrl: './transformation-selector.component.html',
  styleUrl: './transformation-selector.component.css',
})
export class TransformationSelectorComponent {
  // Required inputs
  userCards = input.required<Card[]>();
  transformedCardForm = input.required<FormGroup>();

  // Optional inputs for edit mode
  initialMode = input<TransformationMode>('new');
  initialExistingCardId = input<string | null>(null);

  // Outputs
  modeChanged = output<TransformationMode>();
  existingCardSelected = model<string | null>(null);
  transformedArtwork = output<FormData>();

  // Internal state
  mode = signal<TransformationMode>('new');
  selectedCardId = signal<string | null>(null);
  isInitialized = signal(false);

  // Computed
  showNewCardForm = computed(() => this.mode() === 'new');
  showExistingCardSelector = computed(() => this.mode() === 'existing');

  // Find the selected card object for ng-select
  selectedCard = computed(() => {
    const cardId = this.selectedCardId();
    if (!cardId) return null;
    return this.userCards().find((card) => card.id === cardId) ?? null;
  });

  constructor() {
    // Initialize from inputs when they change (for edit mode)
    effect(() => {
      const initMode = this.initialMode();
      const initCardId = this.initialExistingCardId();

      if (!this.isInitialized()) {
        this.mode.set(initMode);
        if (initCardId) {
          this.selectedCardId.set(initCardId);
          this.existingCardSelected.set(initCardId);
        }
        this.isInitialized.set(true);
      }
    });
  }

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
