import { Component, computed, input, model, output } from '@angular/core';
import { Card } from '../..';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-card-header',
  imports: [NgOptimizedImage],
  templateUrl: './card-header.component.html',
  styleUrl: './card-header.component.css',
})
export class CardHeaderComponent {
  card = input.required<Card>();
  cardRarityIcon = computed(() =>
    this.card().characterInfo?.isLegendaryCharacter
      ? 'cha_rare_sm_lr.png'
      : 'cha_rare_sm_ur.png'
  );
  cardTypeIcon = computed(() =>
    this.card().characterInfo?.type && this.card().characterInfo?.class
      ? '/' +
        this.card().characterInfo?.class +
        this.card().characterInfo?.type +
        '.png'
      : ''
  );

  isAmodalOpen = input.required<boolean>();
  openDomainDetailsModal = output<void>();

  showDomainDetailsModal() {
    this.openDomainDetailsModal.emit();
  }
}
