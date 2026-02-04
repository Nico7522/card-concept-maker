import { Component, model, output } from '@angular/core';

@Component({
  selector: 'app-card-passive-part',
  imports: [],
  templateUrl: './card-passive-part.component.html',
  styleUrl: './card-passive-part.component.css',
})
export class CardPassivePartComponent {
  isPassiveDetailsModalOpen = model(false);
  openPassiveDetailsModal = output<void>();
  showFullPassiveDetails() {
    this.isPassiveDetailsModalOpen.set(true);
    this.openPassiveDetailsModal.emit();
  }
}
