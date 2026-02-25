import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, NgClass, SlicePipe } from '@angular/common';
import { map } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Card } from '~/src/entities/card';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-cards',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, RouterModule, NgClass, SlicePipe],
  templateUrl: './my-cards.component.html',
  styleUrl: './my-cards.component.css',
})
export class MyCardsComponent {
  readonly #activatedRoute = inject(ActivatedRoute);
  http = inject(HttpClient);

  cards$ = this.#activatedRoute.data.pipe(
    map((data) => {
      const cards = data['cards'] as Card[];
      return cards;
    }),
  );
}
