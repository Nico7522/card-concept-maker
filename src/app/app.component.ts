import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { ErrorToastComponent } from './shared/error-toast/error-toast.component';
import { ErrorToastService } from './services/error-toast.service';
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
