import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';

import { Card } from '~/src/entities/card';
import { TransformationMode } from '../../model/transformation-mode.type';
import { CardFormComponent } from '../card-form.component';
import { CardForm } from '../../model/card-form-interface';

@Component({
  selector: 'app-transformation-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgSelectComponent,
    CardFormComponent,
  ],
  templateUrl: './transformation-selector.component.html',
  styleUrl: './transformation-selector.component.css',
})
export class TransformationSelectorComponent {
  // Required inputs
  userCards = input.required<Card[]>();
  transformedCardForm = input.required<FormGroup>();

  // Two-way bindings
  mode = model<TransformationMode>('existing');
  selectedCardId = model<string | null>(null);

  // Outputs
  transformedArtwork = output<FormData>();

  // Computed
  showExistingCardForm = computed(() => this.mode() === 'existing');
  showCardSelector = computed(() => this.mode() === 'select');

  // Find the selected card object for ng-select
  selectedCard = computed(() => {
    const cardId = this.selectedCardId();
    if (!cardId) return null;
    return this.userCards().find((card) => card.id === cardId) ?? null;
  });

  onExistingCardSelected(card: Card | null) {
    this.selectedCardId.set(card?.id ?? null);
  }

  onTransformedArtwork(formData: FormData) {
    this.transformedArtwork.emit(formData);
  }
}
