import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorToastService } from '~/src/shared/api/error-toast-service/error-toast.service';
import {
  HeaderComponent,
  FooterComponent,
  ErrorToastComponent,
  LoaderComponent,
} from '~/src/shared/ui';
import { RouterService } from '../shared/api/router-service/router.service';

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
  readonly #routerService = inject(RouterService);
  isVisible = this.#errorToastService.isVisible;
  isLoading = this.#routerService.loading;
}
