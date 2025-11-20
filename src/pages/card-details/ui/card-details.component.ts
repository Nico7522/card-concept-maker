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
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroArrowLeft,
  heroArrowLongRight,
  heroChevronDoubleRight,
  heroChevronDoubleLeft,
  heroMagnifyingGlassPlus,
} from '@ng-icons/heroicons/outline';
import { SuperAttackDetailsComponent } from '../../../shared/ui/super-attack-details/super-attack-details.component';
import { catchError, EMPTY, map, shareReplay, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { LoaderComponent } from '../../../shared/ui/loader/loader.component';
import { ErrorFetchingComponent } from '../../../shared/ui/error-fetching/error-fetching.component';
import { SuperAttack } from '../../../shared/model/super-attack-interface';
import { Character } from '../../../shared/model/character-interface';
import { AuthService } from '../../../shared/api/auth-service/auth.service';
import { Card } from '../../../shared/model/card-interface';
import { UbButtonDirective } from '~/components/ui/button';

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
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #authService = inject(AuthService);
  isLoading = signal(true);
  isError = signal(false);
  characterInfo = signal<Character | null>(null);
  superAttackInfo = signal<SuperAttack | null>(null);
  cardId = signal<string | null>(null);

  card$ = this.#activatedRoute.data.pipe(
    map((data) => data['card'] as Card),
    tap((card) => {
      this.characterInfo.set(card.characterInfo);
      this.superAttackInfo.set(card.superAttackInfo);
      this.cardId.set(card.id ?? '');
      this.isLoading.set(false);
    }),
    catchError(() => {
      this.isError.set(true);
      this.isLoading.set(false);
      return EMPTY;
    }),
    shareReplay({ refCount: true, bufferSize: 1 })
  );
  canUpdate$ = this.card$.pipe(
    switchMap((card) => {
      return this.#authService.user$.pipe(
        map((user) => user?.uid === card.creatorId)
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
