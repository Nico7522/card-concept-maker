import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
import { UbButtonDirective } from '~/components/ui/button';
import { DeleteCardButtonComponent } from '~/src/features/delete-card';
import { CardComponent, ResolvedCard } from '~/src/entities/card';

@Component({
  selector: 'app-card-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIconComponent,
    UbButtonDirective,
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
  cardId = signal<string | null>(null);
  creatorId = signal<string | null>(null);
  selectedCard = signal<'base' | 'transformed'>('base');
  card$ = this.#activatedRoute.data.pipe(
    map((data) => data['card'] as ResolvedCard),
    tap(({ currentCard }) => {
      this.cardId.set(currentCard.id ?? '');
      this.creatorId.set(currentCard.creatorId ?? null);
      this.isLoading.set(false);
      const cardToDisplay = currentCard.characterInfo?.activeSkill?.baseCardId
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
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      this.isCopied.set(true);
      setTimeout(() => this.isCopied.set(false), 2000);
    });
  }
}
