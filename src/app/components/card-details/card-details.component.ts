import {
  Component,
  ComponentRef,
  inject,
  inputBinding,
  linkedSignal,
  outputBinding,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { CardService } from '../../services/card.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroArrowLeft,
  heroArrowLongRight,
  heroChevronDoubleRight,
  heroChevronDoubleLeft,
  heroMagnifyingGlassPlus,
} from '@ng-icons/heroicons/outline';
import { UbButtonDirective } from '~/components/ui/button';
import { SuperAttackDetailsComponent } from '../super-attack-details/super-attack-details.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, finalize, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { Character } from '../../types/character.type';
import { SuperAttack } from '../../types/super-attack.type';
import { ErrorFetchingComponent } from '../../shared/error-fetching/error-fetching.component';

@Component({
  selector: 'app-card-details',
  imports: [
    NgIconComponent,
    UbButtonDirective,
    AsyncPipe,
    LoaderComponent,
    RouterModule,
    ErrorFetchingComponent,
  ],
  templateUrl: './card-details.component.html',
  styleUrl: './card-details.component.css',
  viewProviders: [
    provideIcons({
      heroArrowLeft,
      heroArrowLongRight,
      heroChevronDoubleRight,
      heroChevronDoubleLeft,
      heroMagnifyingGlassPlus,
    }),
  ],
})
export class CardDetailsComponent {
  private readonly titles = [
    'Card Details',
    'Categories',
    'Passive Skill Details',
  ];
  cardService = inject(CardService);
  activatedRoute = inject(ActivatedRoute);
  isLoading = signal(true);
  isError = signal(false);
  characterInfo = signal<Character | null>(null);
  superAttackInfo = signal<SuperAttack | null>(null);
  cardId = signal<string | null>(null);
  card$ = this.activatedRoute.params.pipe(
    switchMap((params) => {
      const id = params['id'];
      return this.cardService.getCardById(id).pipe(
        tap((card) => {
          this.characterInfo.set(card.characterInfo);
          this.superAttackInfo.set(card.superAttackInfo);
          this.cardId.set(id);
          this.isLoading.set(false);
        }),
        catchError(() => {
          this.isError.set(true);
          this.isLoading.set(false);
          return EMPTY;
        })
      );
    })
  );

  showedPart = signal(1);
  title = linkedSignal(() => this.titles[this.showedPart() - 1]);
  saDetails = viewChild.required('saDetails', { read: ViewContainerRef });
  saDetailsRef: ComponentRef<SuperAttackDetailsComponent> | null = null;
  showNextPart() {
    this.showedPart.update((val) => val + 1);
  }

  showPreviousPart() {
    this.showedPart.update((val) => val - 1);
  }

  openSuperAttackDetails() {
    const componentRef = this.saDetails().createComponent(
      SuperAttackDetailsComponent,
      {
        bindings: [
          inputBinding('characterInfo', () => this.characterInfo()),
          inputBinding('superAttackInfo', () => this.superAttackInfo()),
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
    if (this.saDetailsRef) {
      this.saDetailsRef.destroy();
    }
  }

  getRarityImage(characterInfo: Character | null): string {
    if (!characterInfo) return '';
    return characterInfo.isLegendaryCharacter
      ? 'cha_rare_sm_ur.png'
      : 'cha_rare_sm_lr.png';
  }

  getClassTypeImage(characterInfo: Character | null): string {
    if (!characterInfo) return '';
    return characterInfo.class === 'super'
      ? `super${characterInfo.type}.png`
      : `extreme${characterInfo.type}.png`;
  }
}
