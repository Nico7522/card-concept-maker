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
  User,
} from '@angular/fire/auth';
import { catchError, from, map, switchMap, throwError } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { environment } from '~/src/environments/environment';
import { ApiResponse } from '../../model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #auth = inject(Auth);
  readonly #googleProvider = new GoogleAuthProvider();
  readonly #injector = inject(Injector);
  readonly #httpClient = inject(HttpClient);

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
   * Call loginWithGoogle function, get the current user, get his token and send it to the backend.
   * @returns A observable with the token
   */
  login() {
    return from(this.loginWithGoogle()).pipe(
      switchMap((user) =>
        from(this.getIdToken(user, false)).pipe(
          switchMap((idToken) =>
            this.sendFirebaseToken(idToken).pipe(
              map((res) => {
                console.log('data : ', res);

                localStorage.setItem('token', res.data.token);
                return res.data.token;
              }),
            ),
          ),
        ),
      ),
      catchError((err) => {
        this.logout();
        return throwError(() => err);
      }),
    );
  }

  /**
   * @param user The current user
   * @param forceRefresh Indicate if the token must be refreshed or not
   * @returns A observable holding the token
   */
  getIdToken(user: User, forceRefresh: boolean) {
    return from(user.getIdToken(forceRefresh));
  }

  /**
   * Call the signOut function from firebase auth and logout
   * @returns A observable of void
   */
  logout() {
    return from(this.signOut());
  }

  /**
   * Send the Firebase token to the back end.
   * @param idToken The token from firebase
   * @returns A observable of { data: string, message: string, success: boolean }
   */
  sendFirebaseToken(idToken: string) {
    return this.#httpClient.post<ApiResponse<{ token: string }>>(
      `${environment.backendUrl}/api/generate-token`,
      {
        idToken,
      },
    );
  }
}
