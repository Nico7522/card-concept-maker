import {
  computed,
  inject,
  Injectable,
  linkedSignal,
  signal,
} from '@angular/core';
import { RouterService } from '../router-service/router.service';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  readonly #routerService = inject(RouterService);
  readonly loading = linkedSignal(
    () => this.#routerService.isRouterLoading() ?? false,
  );

  start(): void {
    this.loading.set(true);
  }

  stop(): void {
    this.loading.set(false);
  }
}
