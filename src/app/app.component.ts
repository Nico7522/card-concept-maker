import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorToastService } from '~/src/shared/services/error-toast-service/error-toast.service';
import { HeaderComponent } from '~/src/shared/ui/header/header.component';
import { ErrorToastComponent } from '~/src/shared/ui/error-toast/error-toast.component';
import { RouterService } from '../shared/services/router/router.service';
import { LoaderComponent } from '../shared/ui/loader/loader.component';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
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
