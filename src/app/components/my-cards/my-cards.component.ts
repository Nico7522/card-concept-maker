import { Component, inject, signal } from '@angular/core';
import { CardService } from '../../services/card.service';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe } from '@angular/common';
import { catchError, EMPTY, finalize, switchMap, tap } from 'rxjs';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { RouterModule } from '@angular/router';
import { ErrorFetchingComponent } from '../../shared/error-fetching/error-fetching.component';

@Component({
  selector: 'app-my-cards',
  imports: [AsyncPipe, LoaderComponent, RouterModule, ErrorFetchingComponent],
  templateUrl: './my-cards.component.html',
  styleUrl: './my-cards.component.css',
})
export class MyCardsComponent {
  cardService = inject(CardService);
  authService = inject(AuthService);
  isLoading = signal(true);
  isError = signal(false);
  cards$ = this.authService.user$.pipe(
    switchMap((user) => {
      return this.cardService.getCardsFromCreatorId(user?.uid ?? '').pipe(
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
