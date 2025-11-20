import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { catchError, EMPTY, take } from 'rxjs';
import { version } from '../../../../package.json';
import { ErrorToastService } from '../../api/error-toast-service/error-toast.service';
import { AuthService } from '../../api/auth-service/auth.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);
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
