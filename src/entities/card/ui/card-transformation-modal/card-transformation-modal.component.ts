import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Card } from '../../model/card-interface';

@Component({
  selector: 'app-card-transformation-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './card-transformation-modal.component.html',
  styleUrl: './card-transformation-modal.component.css',
})
export class CardTransformationModalComponent {
  baseCard = input.required<Card>();
  transformedCard = input.required<Card>();
  switchToTransformedCard = output<void>();
  switchToBaseCard = output<void>();
  close = output();

  onClose() {
    this.close.emit();
  }

  onSwitchToTransformedCard() {
    this.switchToTransformedCard.emit();
  }

  onSwitchToBaseCard() {
    this.switchToBaseCard.emit();
  }
}
