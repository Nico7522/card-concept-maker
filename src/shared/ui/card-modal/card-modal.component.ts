import { Component, input, model, output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroArrowLeft,
  heroArrowLongRight,
  heroChevronDoubleLeft,
  heroChevronDoubleRight,
  heroMagnifyingGlassPlus,
} from '@ng-icons/heroicons/outline';
import { Character, Passive, SuperAttack } from '~/src/shared/model';

@Component({
  selector: 'app-card-modal',
  imports: [NgIconComponent],
  viewProviders: [
    provideIcons({
      heroArrowLeft,
      heroArrowLongRight,
      heroChevronDoubleRight,
      heroChevronDoubleLeft,
      heroMagnifyingGlassPlus,
    }),
  ],
  templateUrl: './card-modal.component.html',
  styleUrl: './card-modal.component.css',
})
export class CardModalComponent {
  private readonly titles = [
    'Card Details',
    'Categories',
    'Passive Skill Details',
  ];
  characterInfo = input.required<Character>();
  passiveDetails = input.required<Passive>();
  superAttackInfo = input.required<SuperAttack>();
  showedPart = model(1);
  title = model<string>();
  close = output();
  showNextPart() {
    this.showedPart.update((val) => val + 1);
    this.title.set(this.titles[this.showedPart() - 1]);
  }

  showPreviousPart() {
    this.showedPart.update((val) => val - 1);
    this.title.set(this.titles[this.showedPart() - 1]);
  }

  onCloseModal() {
    this.close.emit();
  }
}
