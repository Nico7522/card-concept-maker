import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '~/src/shared/api';
import { map, of, switchMap } from 'rxjs';

export const canAccessGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.user$.pipe(
    map((user) => {
      if (!user) {
        return false;
      }
      if (user.uid !== route.params['id']) {
        router.navigate(['/']);
        return false;
      }
      return true;
    })
  );
};
