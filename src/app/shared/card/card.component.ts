import {
  Component,
  ComponentRef,
  input,
  inputBinding,
  linkedSignal,
  outputBinding,
  signal,
  twoWayBinding,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroArrowLeft,
  heroArrowLongRight,
  heroChevronDoubleLeft,
  heroChevronDoubleRight,
  heroMagnifyingGlassPlus,
} from '@ng-icons/heroicons/outline';
import { UbButtonDirective } from '~/components/ui/button';
import { CardModalComponent } from '../../components/card-modal/card-modal.component';
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
      heroMagnifyingGlassPlus,
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
    ultraSuperAttack?: string;
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
  private readonly titles = [
    'Card Details',
    'Categories',
    'Passive Skill Details',
  ];

  showedPart = signal(1);
  title = linkedSignal(() => this.titles[this.showedPart() - 1]);
  modal = viewChild.required('modal', { read: ViewContainerRef });
  componentRefs: ComponentRef<CardModalComponent> | null = null;
  showNextPart() {
    this.showedPart.update((val) => val + 1);
  }

  showPreviousPart() {
    this.showedPart.update((val) => val - 1);
  }

  openModal() {
    const componentRef = this.modal().createComponent(CardModalComponent, {
      bindings: [
        inputBinding('characterInfo', this.characterInfo),
        inputBinding('passiveDetails', this.passiveDetails),
        twoWayBinding('showedPart', this.showedPart),
        twoWayBinding('title', this.title),
        outputBinding('close', () => {
          if (this.componentRefs) {
            this.componentRefs.destroy();
          }
          document.querySelector('body')?.classList.remove('overflow-y-hidden');
        }),
      ],
    });
    document.querySelector('body')?.classList.add('overflow-y-hidden');
    this.componentRefs = componentRef;
  }
}
