import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { catchError, EMPTY, take } from 'rxjs';
import { version } from '../../../../package.json';
import { ErrorToastService, AuthService } from '../../api';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  readonly #authService = inject(AuthService);
  readonly #errorToastService = inject(ErrorToastService);
  user$ = this.#authService.user$;
  version = version;

  async loginWithGoogle() {
    this.#authService
      .login()
      .pipe(
        take(1),
        catchError((error) => {
          const err = error as Error;
          if (err.message.includes('auth/popup-closed-by-user')) {
            return EMPTY;
          }
          this.#errorToastService.showToast(
            'Error during login. Please try again.'
          );
          return EMPTY;
        })
      )
      .subscribe();
  }

  async logout() {
    this.#authService.logout().pipe(take(1)).subscribe();
  }
}
