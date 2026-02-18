import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorToastService, LoadingService } from '~/src/shared/api';
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
}
