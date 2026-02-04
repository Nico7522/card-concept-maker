import { Component, model, output } from '@angular/core';

@Component({
  selector: 'app-card-passive-part',
  imports: [],
  templateUrl: './card-passive-part.component.html',
  styleUrl: './card-passive-part.component.css',
})
export class CardPassivePartComponent {
  isPassiveDetailsShown = model(false);
  openPassiveDetailsModal = output<void>();
  showFullPassiveDetails() {
    this.isPassiveDetailsShown.set(true);
    this.openPassiveDetailsModal.emit();
  }
}
