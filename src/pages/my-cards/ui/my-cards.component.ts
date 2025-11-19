import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Card } from '~/src/shared/model/card-interface';
import { RouterService } from '~/src/shared/services/router/router.service';

@Component({
  selector: 'app-my-cards',
  imports: [AsyncPipe, RouterModule],
  templateUrl: './my-cards.component.html',
  styleUrl: './my-cards.component.css',
})
export class MyCardsComponent {
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #routerService = inject(RouterService);
  isLoading = this.#routerService.loading;

  cards$ = this.#activatedRoute.data.pipe(
    map((data) => {
      const cards = data['cards'] as Card[];
      return cards;
    })
  );
}
