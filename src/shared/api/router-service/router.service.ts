import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { filter } from 'rxjs';
import { LoadingService } from '../loading-service/loading.service';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  readonly #router = inject(Router);
  readonly #loadingService = inject(LoadingService);

  constructor() {
    this.#router.events
      .pipe(
        filter(
          (e) =>
            e instanceof NavigationStart ||
            e instanceof NavigationEnd ||
            e instanceof NavigationCancel ||
            e instanceof NavigationError
        ),
        takeUntilDestroyed()
      )
      .subscribe((e) => {
        if (e instanceof NavigationStart) {
          this.#loadingService.start();
        } else {
          this.#loadingService.stop();
        }
      });
  }
}
