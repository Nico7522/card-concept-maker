import {
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  user,
} from '@angular/fire/auth';
import { catchError, defer, from, Observable, of, throwError } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #auth = inject(Auth);
  readonly #googleProvider = new GoogleAuthProvider();
  readonly #injector = inject(Injector);

  // Observable holding the current user
  user$ = user(this.#auth);

  // Signal holding the current user
  user = toSignal(this.user$);

  /**
   * Call the signInWithPopup function and login with Google
   * @returns A promise of user
   */
  private async loginWithGoogle() {
    return await runInInjectionContext(this.#injector, async () => {
      try {
        const result = await signInWithPopup(this.#auth, this.#googleProvider);
        return result.user;
      } catch (error) {
        const errorMessage = (error as Error).message;
        throw new Error(errorMessage);
      }
    });
  }

  /**
   * Call the signOut function and logout
   */
  private async signOut() {
    return await runInInjectionContext(this.#injector, async () => {
      try {
        await signOut(this.#auth);
      } catch (error) {
        const errorMessage = (error as Error).message;
        throw new Error(errorMessage);
      }
    });
  }

  /**
   * Call loginWithGoogle function and login with Google
   * @returns An observable of the logged in user
   */
  login() {
    return from(this.loginWithGoogle()).pipe(
      catchError((err) => {
        this.logout();
        return throwError(() => err);
      }),
    );
  }

  /**
   * Call the signOut function from firebase auth and logout
   * @returns A observable of void
   */
  logout() {
    return from(this.signOut());
  }

  /**
   * Gets the Firebase ID token of the current user, to authenticate requests to the API.
   * The Firebase SDK caches the token and refreshes it automatically when it expires.
   * @returns An observable of the token, or null if no user is logged in
   */
  getIdToken(): Observable<string | null> {
    return defer(() => {
      const currentUser = this.#auth.currentUser;
      return currentUser ? from(currentUser.getIdToken()) : of(null);
    });
  }

}
