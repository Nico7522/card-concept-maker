import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  ErrorToastService,
  LoadingService,
  RouterService,
} from '~/src/shared/api';
import {
  HeaderComponent,
  FooterComponent,
  ErrorToastComponent,
  LoaderComponent,
} from '~/src/shared/ui';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    ErrorToastComponent,
    LoaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  readonly #errorToastService = inject(ErrorToastService);
  readonly #loadingService = inject(LoadingService);

  isVisible = this.#errorToastService.isVisible;
  isLoading = this.#loadingService.loading;

  // RouterService must be injected to activate its constructor (router event listener)
  readonly #routerService = inject(RouterService);
}
