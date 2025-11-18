import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../shared/services/auth-service/auth.service';
import { AsyncPipe } from '@angular/common';
import { catchError, EMPTY, finalize, switchMap, tap } from 'rxjs';
import { LoaderComponent } from '../../shared/ui/loader/loader.component';
import { RouterModule } from '@angular/router';
import { ErrorFetchingComponent } from '../../shared/ui/error-fetching/error-fetching.component';
import { CardService } from '~/src/shared/services/card-service/card.service';

@Component({
  selector: 'app-my-cards',
  imports: [AsyncPipe, LoaderComponent, RouterModule, ErrorFetchingComponent],
  templateUrl: './my-cards.component.html',
  styleUrl: './my-cards.component.css',
})
export class MyCardsComponent {
  readonly #cardService = inject(CardService);
  readonly #authService = inject(AuthService);
  isLoading = signal(true);
  isError = signal(false);
  cards$ = this.#authService.user$.pipe(
    switchMap((user) => {
      return this.#cardService.getCardsFromCreatorId(user?.uid ?? '').pipe(
        tap((cards) => {
          this.isLoading.set(false);
        }),
        catchError(() => {
          this.isError.set(true);
          this.isLoading.set(false);
          return EMPTY;
        })
      );
    })
  );
}
