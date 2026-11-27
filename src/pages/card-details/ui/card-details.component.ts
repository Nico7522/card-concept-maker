import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroArrowLeft,
  heroArrowLongRight,
  heroChevronDoubleRight,
  heroChevronDoubleLeft,
  heroMagnifyingGlassPlus,
  heroPencilSquare,
  heroClipboard,
  heroCheck,
} from '@ng-icons/heroicons/outline';
import { catchError, EMPTY, map, shareReplay, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { LoaderComponent } from '~/src/shared/ui';
import { AuthService } from '~/src/shared/api';
import { DeleteCardButtonComponent } from '~/src/features/delete-card';
import { CardComponent, ResolvedCard } from '~/src/entities/card';

const SHARE_BASE_URL = 'https://dokkan-card-maker.com/card/';

@Component({
  selector: 'app-card-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIconComponent,
    AsyncPipe,
    LoaderComponent,
    RouterModule,
    CardComponent,
    DeleteCardButtonComponent,
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
      heroPencilSquare,
      heroClipboard,
      heroCheck,
    }),
  ],
})
export class CardDetailsComponent {
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);
  isLoading = signal(true);
  isError = signal(false);
  isCopied = signal(false);
  creatorId = signal<string | null>(null);
  selectedCard = signal<'base' | 'transformed'>('base');
  resolvedCard = signal<ResolvedCard | null>(null);

  // The card currently displayed (base or transformed form): the title,
  // share link, update and delete actions always target this card
  displayedCard = computed(() => {
    const resolvedCard = this.resolvedCard();
    if (!resolvedCard) return null;
    return this.selectedCard() === 'transformed' && resolvedCard.transformedCard
      ? resolvedCard.transformedCard
      : resolvedCard.baseCard;
  });
  shareLink = computed(() => SHARE_BASE_URL + (this.displayedCard()?.id ?? ''));

  card$ = this.#activatedRoute.data.pipe(
    map((data) => data['card'] as ResolvedCard),
    tap((resolvedCard) => {
      const { currentCard, transformedCard } = resolvedCard;
      this.resolvedCard.set(resolvedCard);
      this.creatorId.set(currentCard.creatorId ?? null);
      this.isLoading.set(false);
      const cardToDisplay =
        transformedCard && transformedCard.id === currentCard.id
          ? 'transformed'
          : 'base';
      this.selectedCard.set(cardToDisplay);
    }),
    catchError(() => {
      this.isError.set(true);
      this.isLoading.set(false);
      return EMPTY;
    }),
    shareReplay({ refCount: true, bufferSize: 1 }),
  );
  canUpdate$ = this.card$.pipe(
    switchMap(({ baseCard }) => {
      return this.#authService.user$.pipe(
        map((user) => user?.uid === baseCard.creatorId),
      );
    }),
  );

  onCardDeleted() {
    this.#router.navigate(['user', this.creatorId(), 'cards']);
  }

  copyShareLink() {
    navigator.clipboard.writeText(this.shareLink()).then(() => {
      this.isCopied.set(true);
      setTimeout(() => this.isCopied.set(false), 2000);
    });
  }
}
