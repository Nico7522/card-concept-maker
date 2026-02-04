import { Component, input, output } from '@angular/core';
import { Passive } from '../../../model/passive-type';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-passive-details-modal',
  imports: [NgOptimizedImage],

  templateUrl: './passive-details-modal.component.html',
  styleUrl: './passive-details-modal.component.css',
})
export class PassiveDetailsModalComponent {
  attack = input.required<number>();
  defense = input.required<number>();
  passiveDetails = input.required<Passive>();
  close = output();
  onClose() {
    this.close.emit();
  }
}
