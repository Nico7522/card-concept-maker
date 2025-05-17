import { Component, input, signal } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroArrowLeft,
  heroArrowLongRight,
  heroChevronDoubleLeft,
  heroChevronDoubleRight,
} from '@ng-icons/heroicons/outline';
import { UbButtonDirective } from '~/components/ui/button';
@Component({
  selector: 'app-card',
  imports: [NgIconComponent, UbButtonDirective],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
  viewProviders: [
    provideIcons({
      heroArrowLeft,
      heroArrowLongRight,
      heroChevronDoubleRight,
      heroChevronDoubleLeft,
    }),
  ],
  host: {
    class: 'w-full m-auto mb-10',
  },
})
export class CardComponent {
  characterInfo = input.required<{
    stats: {
      attack: number;
      defense: number;
      hp: number;
    };
    leaderSkill: string;
    superAttack: string;
    isLegendaryCharacter: boolean;
    categories: string[];
    links: string[];
  }>();
  titles = ['Card Details', 'Categories', 'Passive Skill Details'];

  passiveDetails = input.required<
    {
      passiveConditionActivation: string;
      effect: { description: string; imageSrc: string }[];
    }[]
  >();
  showedPart = signal(1);
  title = signal('Card Details');

  showNextPart() {
    this.showedPart.update((val) => val + 1);
    this.title.set(this.titles[this.showedPart() - 1]);
  }

  showPreviousPart() {
    this.showedPart.update((val) => val - 1);
    this.title.set(this.titles[this.showedPart() - 1]);
  }
}
