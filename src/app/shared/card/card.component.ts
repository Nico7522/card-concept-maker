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
import { Character } from '../../types/character.type';
import { Passive } from '../../types/passive.type';
import { SuperAttackDetailsComponent } from '../../components/super-attack-details/super-attack-details.component';
import { SuperAttack } from '../../types/super-attack.type';
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
  characterInfo = input.required<Character>();
  passiveDetails = input.required<Passive>();
  superAttackInfo = input.required<SuperAttack>();
  private readonly titles = [
    'Card Details',
    'Categories',
    'Passive Skill Details',
  ];

  showedPart = signal(1);
  title = linkedSignal(() => this.titles[this.showedPart() - 1]);
  modal = viewChild.required('modal', { read: ViewContainerRef });
  modalRef: ComponentRef<CardModalComponent> | null = null;
  saDetails = viewChild.required('sadetails', { read: ViewContainerRef });
  saDetailsRef: ComponentRef<SuperAttackDetailsComponent> | null = null;
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
        inputBinding('superAttackInfo', this.superAttackInfo),

        twoWayBinding('showedPart', this.showedPart),
        twoWayBinding('title', this.title),
        outputBinding('close', () => {
          if (this.modalRef) {
            this.modalRef.destroy();
          }
          document.querySelector('body')?.classList.remove('overflow-y-hidden');
        }),
      ],
    });
    document.querySelector('body')?.classList.add('overflow-y-hidden');
    this.modalRef = componentRef;
  }

  openSuperAttackDetails() {
    const componentRef = this.saDetails().createComponent(
      SuperAttackDetailsComponent,
      {
        bindings: [
          inputBinding('characterInfo', this.characterInfo),
          inputBinding('superAttackInfo', this.superAttackInfo),

          outputBinding('close', () => {
            if (this.saDetailsRef) {
              this.saDetailsRef.destroy();
            }
          }),
        ],
      }
    );
    this.saDetailsRef = componentRef;
  }

  ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.destroy();
    }

    if (this.saDetailsRef) {
      this.saDetailsRef.destroy();
    }
  }
}
