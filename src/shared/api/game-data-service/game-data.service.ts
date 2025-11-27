import { Injectable } from '@angular/core';
import { defer, from, shareReplay } from 'rxjs';

interface Category {
  value: number;
  categoryName: string;
}

interface Link {
  value: number;
  linkName: string;
  description: string;
}

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

  readonly links$ = defer(() =>
    from(
      import('~/public/data/links.json').then(
        (m) => (m.default as { links: Link[] }).links
      )
    )
  ).pipe(shareReplay(1));
}
