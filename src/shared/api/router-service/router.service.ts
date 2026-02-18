import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  readonly #router = inject(Router);

  isRouterLoading = toSignal(
    this.#router.events.pipe(
      filter(
        (e) =>
          e instanceof NavigationStart ||
          e instanceof NavigationEnd ||
          e instanceof NavigationCancel ||
          e instanceof NavigationError,
      ),
      map((e) => e instanceof NavigationStart),
    ),
  );
  constructor() {
    // this.#router.events
    //   .pipe(
    //     filter(
    //       (e) =>
    //         e instanceof NavigationStart ||
    //         e instanceof NavigationEnd ||
    //         e instanceof NavigationCancel ||
    //         e instanceof NavigationError
    //     ),
    //     takeUntilDestroyed()
    //   )
    //   .subscribe((e) => {
    //     if (e instanceof NavigationStart) {
    //       this.#loadingService.start();
    //     } else {
    //       this.#loadingService.stop();
    //     }
    //   });
  }
}
