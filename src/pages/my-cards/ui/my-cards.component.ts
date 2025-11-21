import { Component, inject } from '@angular/core';
import { AsyncPipe, NgClass, SlicePipe } from '@angular/common';
import { map } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Card } from '../../../shared/model/card-interface';
import { RouterService } from '../../../shared/api/router/router.service';

@Component({
  selector: 'app-my-cards',
  imports: [AsyncPipe, RouterModule, NgClass, SlicePipe],
  templateUrl: './my-cards.component.html',
  styleUrl: './my-cards.component.css',
})
export class MyCardsComponent {
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #routerService = inject(RouterService);

  cards$ = this.#activatedRoute.data.pipe(
    map((data) => {
      const cards = data['cards'] as Card[];
      return cards;
    })
  );
}
