// auth.service.ts
import {
  inject,
  Injectable,
  signal,
  computed,
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
import { from, Observable, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import runAsyncInInjectionContext from '../helpers/firebase-helper';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private googleProvider = new GoogleAuthProvider();
  private injector = inject(Injector);
  // Observable holding the current user
  user$ = user(this.auth);
  // Signal holding the current user
  user = toSignal(this.user$);

  /**
   * Call the signInWithPopup function and login with Google
   * @returns The user after login
   */
  private async loginWithGoogle() {
    return await runAsyncInInjectionContext(this.injector, async () => {
      try {
        const result = await signInWithPopup(this.auth, this.googleProvider);
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
    await signOut(this.auth);
  }

  /**
   * Call the loginWithGoogle function from the firebase auth and login with Google
   * @returns The user after login
   */
  login() {
    return from(this.loginWithGoogle());
  }

  /**
   * Call the signOut function from firebase auth and logout
   * @returns The user after logout
   */
  logout() {
    return from(this.signOut());
  }
}
