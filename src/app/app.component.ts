import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorToastService } from '~/src/shared/services/error-toast-service/error-toast.service';
import { HeaderComponent } from '~/src/shared/ui/header/header.component';
import { ErrorToastComponent } from '~/src/shared/ui/error-toast/error-toast.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, ErrorToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  readonly #errorToastService = inject(ErrorToastService);
  isVisible = this.#errorToastService.isVisible;
}
