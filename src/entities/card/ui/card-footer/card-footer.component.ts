import { Component, model } from '@angular/core';
import { ActiveIndexDirective } from '../active-index.directive';
import { DisplayedPart } from '../../model/displayed-part-type';

@Component({
  selector: 'app-card-footer',
  imports: [ActiveIndexDirective],
  templateUrl: './card-footer.component.html',
  styleUrl: './card-footer.component.css',
})
export class CardFooterComponent {
  showedParts = model.required<DisplayedPart[]>();
  displayedPartsIndex = model.required<number>();

  switchDisplayedParts(direction: 'left' | 'right') {
    this.displayedPartsIndex.update((val) =>
      direction === 'left'
        ? val === 0
          ? this.showedParts().length - 1
          : val - 1
        : val === this.showedParts().length - 1
          ? 0
          : val + 1,
    );
  }
}
