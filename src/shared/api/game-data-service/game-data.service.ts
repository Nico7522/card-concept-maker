import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { defer, from, shareReplay } from 'rxjs';
import { Category, Link } from '../../model';

@Injectable({ providedIn: 'root' })
export class GameDataService {
  // Lazy-loaded et mis en cache automatiquement
  readonly categories$ = defer(() =>
    from(
      import('~/public/data/categories.json').then(
        (m) => (m.default as { categories: Category[] }).categories
      )
    )
  ).pipe(shareReplay(1));
  readonly categories = toSignal(this.categories$, { initialValue: [] });

  readonly links$ = defer(() =>
    from(
      import('~/public/data/links.json').then(
        (m) => (m.default as { links: Link[] }).links
      )
    )
  ).pipe(shareReplay(1));
  readonly links = toSignal(this.links$, { initialValue: [] });
}
