import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { Card } from '../../model/card-interface';
import { environment } from '~/src/environments/environment';

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

  selectedCard = model<'base' | 'transformed'>('base');

  baseCardThumbnail = computed(
    () => 'cha' + this.baseCard().characterInfo?.type + '.png',
  );

  transformedCardThumbnail = computed(
    () => 'cha' + this.transformedCard().characterInfo?.type + '.png',
  );

  baseCardArtwork = computed(() => {
    const artwork = this.baseCard().artwork;
    return artwork ? `${environment.apiUrl}/${artwork}` : null;
  });

  transformedCardArtwork = computed(() => {
    const artwork = this.transformedCard().artwork;
    return artwork ? `${environment.apiUrl}/${artwork}` : null;
  });

  switchToTransformedCard = output<void>();
  switchToBaseCard = output<void>();
  close = output();

  onClose() {
    this.close.emit();
  }

  onSwitchToTransformedCard() {
    this.selectedCard.set('transformed');
    this.switchToTransformedCard.emit();
  }

  onSwitchToBaseCard() {
    this.selectedCard.set('base');
    this.switchToBaseCard.emit();
  }
}
