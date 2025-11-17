import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map, switchMap, of } from 'rxjs';
import { AuthService } from '~/src/shared/services/auth-service/auth.service';
import { CardService } from '~/src/shared/services/card-service/card.service';

export const canAccessGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const cardService = inject(CardService);

  const cardId = route.paramMap.get('id');

  if (!cardId) {
    return of(false);
  }

  return authService.user$.pipe(
    switchMap((user) => {
      return cardService.getCardById(cardId).pipe(
        map((card) => {
          return card?.creatorId === user?.uid;
        })
      );
    })
  );
};
