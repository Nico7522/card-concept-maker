import {
  Binding,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  computed,
  input,
  inputBinding,
  OnDestroy,
  outputBinding,
  signal,
  Type,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
  heroArrowLeft,
  heroArrowLongRight,
  heroChevronDoubleLeft,
  heroChevronDoubleRight,
  heroMagnifyingGlassPlus,
} from '@ng-icons/heroicons/outline';

import { NgOptimizedImage } from '@angular/common';
import { environment } from '~/src/environments/environment';
import { SuperAttackDetailsModalComponent } from './super-attack-details-modal/super-attack-details-modal.component';
import { Card } from '..';
import { DomainModalComponent } from './domain-modal/domain-modal.component';
import { CardHeaderComponent } from './card-header/card-header.component';
import { CardFooterComponent } from './card-footer/card-footer.component';
import { CardPassivePartComponent } from './card-passive-part/card-passive-part.component';
import { CardStatsPartComponent } from './card-stats-part/card-stats-part.component';
import { DisplayedPart } from '../model/displayed-part-type';
import { CardLinksPartComponent } from './card-links-part/card-links-part.component';
import { CardCategoriesPartComponent } from './card-categories-part/card-categories-part.component';
import { PassiveDetailsModalComponent } from './card-passive-part/passive-details-modal/passive-details-modal.component';

type GlobalModal =
  | PassiveDetailsModalComponent
  | SuperAttackDetailsModalComponent
  | DomainModalComponent;

@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgOptimizedImage,
    CardHeaderComponent,
    CardFooterComponent,
    CardPassivePartComponent,
    CardStatsPartComponent,
    CardLinksPartComponent,
    CardCategoriesPartComponent,
  ],
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
export class CardComponent implements OnDestroy {
  showedParts = signal<DisplayedPart[]>([
    'stats',
    'passive',
    'links',
    'categories',
  ]);
  displayedPartsIndex = signal<number>(0);
  isAmodalOpen = signal(false);
  imageSize = signal<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  displayedParts = computed(
    () => this.showedParts()[this.displayedPartsIndex()],
  );
  displayArtworkFullScreen = computed(
    () => this.imageSize().width >= 1400 && this.imageSize().height >= 1800,
  );
  card = input.required<Card>();
  readonly imgUrl = computed(
    () => environment.apiUrl + '/' + this.card().artwork,
  );

  globalModal = viewChild.required('globalModal', {
    read: ViewContainerRef,
  });
  globalModalRef: ComponentRef<GlobalModal> | null = null;

  onSuperAttackDetailsModalOpen() {
    this.isAmodalOpen.set(true);
    const componentRef = this.globalModal().createComponent(
      SuperAttackDetailsModalComponent,
      {
        bindings: [
          inputBinding('characterInfo', () => this.card().characterInfo),
          inputBinding('superAttackInfo', () => this.card().superAttackInfo),
          outputBinding('close', () => {
            this.isAmodalOpen.set(false);

            if (this.globalModalRef) {
              this.globalModalRef.destroy();
            }
          }),
        ],
      },
    );
    this.globalModalRef = componentRef;
  }

  onDomainDetailsModalOpen() {
    this.isAmodalOpen.set(true);
    const componentRef = this.globalModal().createComponent(
      DomainModalComponent,
      {
        bindings: [
          inputBinding('domain', () => this.card().characterInfo?.domain),
          outputBinding('close', () => {
            this.isAmodalOpen.set(false);
            if (this.globalModalRef) {
              this.globalModalRef.destroy();
            }
          }),
        ],
      },
    );
    this.globalModalRef = componentRef;
  }
  onPassiveDetailsModalOpen() {
    this.isAmodalOpen.set(true);
    const componentRef = this.globalModal().createComponent(
      PassiveDetailsModalComponent,
      {
        bindings: [
          inputBinding('passiveDetails', () => this.card().passiveDetails),
          inputBinding(
            'attack',
            () => this.card().characterInfo?.stats?.attack,
          ),
          inputBinding(
            'defense',
            () => this.card().characterInfo?.stats?.defense,
          ),
          outputBinding('close', () => {
            this.isAmodalOpen.set(false);
            if (this.globalModalRef) {
              this.globalModalRef.destroy();
            }
          }),
        ],
      },
    );
    this.globalModalRef = componentRef;
  }
  ngOnDestroy() {
    if (this.globalModalRef) {
      this.globalModalRef.destroy();
    }
  }

  onImageLoad(img: Event) {
    const image = img.target as HTMLImageElement;
    this.imageSize.set({
      width: image.naturalWidth,
      height: image.naturalHeight,
    });
  }
}
