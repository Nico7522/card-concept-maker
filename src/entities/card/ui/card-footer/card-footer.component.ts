import { Component, model } from '@angular/core';
import { ActiveIndexDirective } from '../active-index.directive';

@Component({
  selector: 'app-card-footer',
  imports: [ActiveIndexDirective],
  templateUrl: './card-footer.component.html',
  styleUrl: './card-footer.component.css',
})
export class CardFooterComponent {
  showedParts = model.required<('stats' | 'passive')[]>();
  displayedPartsIndex = model.required<number>();

  switchDisplayedParts() {
    this.displayedPartsIndex.update((val) => val === this.showedParts().length - 1 ? 0 : val + 1);
  }


}
