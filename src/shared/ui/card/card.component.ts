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
import { CardModalComponent } from '../card-modal/card-modal.component';
import { SuperAttackDetailsComponent } from '../super-attack-details/super-attack-details.component';
import { Card } from '~/src/shared/model';
import { NgOptimizedImage } from '@angular/common';
import { environment } from '~/src/environments/environment';
@Component({
  selector: 'app-card',
  imports: [NgIconComponent, UbButtonDirective, NgOptimizedImage],
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
    class: 'w-full',
  },
})
export class CardComponent {

  card = input.required<Card>();
  readonly apiUrl = environment.apiUrl + '/';
  private readonly titles = [
    'Card Details',
    'Categories',
    'Passive Skill Details',
    'Artwork',
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
        inputBinding('characterInfo', () => this.card().characterInfo),
        inputBinding('passiveDetails', () => this.card().passiveDetails),
        inputBinding('superAttackInfo', () => this.card().superAttackInfo),

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
          inputBinding('characterInfo', () => this.card().characterInfo),
          inputBinding('superAttackInfo', () => this.card().superAttackInfo),
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
