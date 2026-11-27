import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { map } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Card } from '~/src/entities/card';
import { environment } from '~/src/environments/environment';
import { buildCardTiles } from '../lib/build-card-tiles';

@Component({
  selector: 'app-my-cards',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, DecimalPipe, RouterModule],
  templateUrl: './my-cards.component.html',
  styleUrl: './my-cards.component.css',
})
export class MyCardsComponent {
  readonly #activatedRoute = inject(ActivatedRoute);

  tiles$ = this.#activatedRoute.data.pipe(
    map((data) => buildCardTiles(data['cards'] as Card[], environment.apiUrl)),
  );
}
