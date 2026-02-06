import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { catchError, EMPTY, take } from 'rxjs';
import { version } from '~/package.json';
import { ErrorToastService, AuthService } from '../../api';
import { DokkanStyleButtonComponent } from './dokkan-style-button/dokkan-style-button.component';
@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, AsyncPipe, DokkanStyleButtonComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  readonly #authService = inject(AuthService);
  readonly #errorToastService = inject(ErrorToastService);
  user$ = this.#authService.user$;
  version = version;
  menuOpen = signal(false);

  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

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
