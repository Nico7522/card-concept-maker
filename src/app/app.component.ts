import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ErrorToastService } from '~/src/shared/api/error-toast-service/error-toast.service';
import {
  HeaderComponent,
  FooterComponent,
  ErrorToastComponent,
  LoaderComponent,
} from '~/src/shared/ui';
import { RouterService } from '../shared/api/router-service/router.service';
import { Analytics, logEvent } from '@angular/fire/analytics';

const BANNER_DISMISSED_KEY =
  'high-compatibility-link-issue-banner-dismissed-v1';

@Component({
  selector: 'app-root',
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
  analytics = inject(Analytics);
  isVisible = this.#errorToastService.isVisible;
  isLoading = this.#routerService.loading;

}
