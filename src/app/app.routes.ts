import { Routes } from '@angular/router';
import { CreateCardComponent } from '../pages/create-card/ui/create-card.component';
import { canAccessGuard } from '../features/guards/can-access.guard';
import { getCardsResolver } from '../pages/my-cards/api/get-cards.resolver';
import { getCardResolver } from '../shared/api/card-resolver/get-card.resolver';

export const routes: Routes = [
  {
    path: '',
    component: CreateCardComponent,
  },
  {
    path: 'card/:id',
    loadComponent: () =>
      import('../pages/card-details/ui/card-details.component').then(
        (m) => m.CardDetailsComponent
      ),
    resolve: { card: getCardResolver },
  },
  {
    path: 'user/:id/cards',
    loadComponent: () =>
      import('../pages/my-cards/ui/my-cards.component').then(
        (m) => m.MyCardsComponent
      ),
    resolve: { cards: getCardsResolver },
  },

  {
    path: 'card/:id/update',
    loadComponent: () =>
      import('../pages/update-card/ui/update-card.component').then(
        (m) => m.UpdateCardComponent
      ),
    canActivate: [canAccessGuard],
    resolve: { card: getCardResolver },
  },
];
