import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { catchError, from, isObservable, map, of, switchMap, take } from 'rxjs';
import { getCardResolver, ResolvedCard } from '~/src/entities/card';
import { AuthService } from '~/src/shared/api';

/**
 * Resolves the card to update and checks that the current user owns it.
 * Replaces a separate guard + resolver so the card is only read once from Firestore.
 * Redirects to the home page if the card doesn't exist or isn't owned by the user.
 */
export const canUpdateCardResolver: ResolveFn<ResolvedCard> = (
  route,
  state,
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const redirectHome = new RedirectCommand(router.parseUrl('/'));

  const resolvedCard = getCardResolver(route, state);
  const resolvedCard$ = isObservable(resolvedCard)
    ? resolvedCard
    : from(Promise.resolve(resolvedCard));

  return resolvedCard$.pipe(
    take(1),
    switchMap((result) => {
      if (result instanceof RedirectCommand) {
        return of(result);
      }
      return authService.user$.pipe(
        take(1),
        map((user) =>
          result.currentCard.creatorId === user?.uid ? result : redirectHome,
        ),
      );
    }),
    catchError(() => of(redirectHome)),
  );
};
