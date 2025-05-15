import { Component, input, signal } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroArrowLeft, heroArrowLongRight } from '@ng-icons/heroicons/outline';
@Component({
  selector: 'app-card',
  imports: [NgIconComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
  viewProviders: [
    provideIcons({
      heroArrowLeft,
      heroArrowLongRight,
    }),
  ],
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
    links: string[];
  }>();

  passiveDetails = input.required<
    {
      passiveConditionActivation: string;
      effect: { description: string; imageSrc: string }[];
    }[]
  >();
  isFirstPartShow = signal(true);
  title = signal('Card Details');
  showFirstPart(value: boolean) {
    this.isFirstPartShow.set(value);
    this.title.set(value ? 'Card Details' : 'Passive Card Details');
  }
}
