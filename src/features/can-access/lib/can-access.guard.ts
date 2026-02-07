import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '~/src/shared/api';
import { map, take } from 'rxjs';

export const canAccessGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.user$.pipe(
    take(1),
    map((user) => {
      if (user?.uid !== route.params['id']) {
        return router.createUrlTree(['/']);
      }
      return true;
    }),
  );
};
