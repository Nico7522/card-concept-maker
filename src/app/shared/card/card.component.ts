import { Component, input, signal } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroArrowLeft, heroArrowLongRight } from '@ng-icons/heroicons/outline';
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
    }),
  ],
  host: {
    class: 'w-full m-auto',
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

  passiveDetails = input.required<
    {
      passiveConditionActivation: string;
      effect: { description: string; imageSrc: string }[];
    }[]
  >();
  isFirstPartShow = signal(true);
  array = [
    {
      value: 1,
      title: 'Card Details',
    },
    {
      value: 2,
      title: 'Links and Categories',
    },
    {
      value: 3,
      title: 'Passive Skill Details',
    },
  ];
  showedPart = signal(1);
  title = signal('Card Details');
  showFirstPart(value: boolean) {
    this.isFirstPartShow.set(value);
    this.title.set(value ? 'Card Details' : 'Passive Card Details');
  }

  showNextPart() {
    this.showedPart.update((val) => val + 1);
  }

  showPreviousPart() {
    this.showedPart.update((val) => val - 1);
  }
}
