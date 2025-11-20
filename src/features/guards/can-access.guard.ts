import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, switchMap, of } from 'rxjs';
import { AuthService } from '~/src/shared/api/auth-service/auth.service';
import { CardService } from '~/src/shared/api/card-service/card.service';

export const canAccessGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const cardService = inject(CardService);
  const router = inject(Router);

  const cardId = route.paramMap.get('id');

  if (!cardId) {
    router.navigate(['/']);
    return false;
  }

  return authService.user$.pipe(
    switchMap((user) => {
      return cardService.getCardById(cardId).pipe(
        map((card) => {
          if (card?.creatorId === user?.uid) {
            return true;
          }
          router.navigate(['/']);
          return false;
        })
      );
    })
  );
};
