import { Routes } from '@angular/router';
import { CreateCardComponent } from '../pages/create-card/create-card.component';
import { canAccessGuard } from '../features/guards/can-access.guard';
import { getCardResolver } from '../pages/card-details/api/get-card.resolver';

export const routes: Routes = [
  {
    path: '',
    component: CreateCardComponent,
  },
  {
    path: 'my-cards',
    loadComponent: () =>
      import('../pages/my-cards/my-cards.component').then(
        (m) => m.MyCardsComponent
      ),
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
    path: 'card/:id/update',
    loadComponent: () =>
      import('../pages/update-card/update-card.component').then(
        (m) => m.UpdateCardComponent
      ),
    canActivate: [canAccessGuard],
  },
];
