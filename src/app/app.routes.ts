import { Routes } from '@angular/router';
import { CreateCardComponent } from '../pages/ui/create-card/create-card.component';

export const routes: Routes = [
  {
    path: '',
    component: CreateCardComponent,
  },
  {
    path: 'my-cards',
    loadComponent: () =>
      import('../pages/ui/my-cards/my-cards.component').then(
        (m) => m.MyCardsComponent
      ),
  },
  {
    path: 'card/:id',
    loadComponent: () =>
      import('../pages/ui/card-details/card-details.component').then(
        (m) => m.CardDetailsComponent
      ),
  },
  {
    path: 'card/:id/update',
    loadComponent: () =>
      import('../pages/ui/update-card/update-card.component').then(
        (m) => m.UpdateCardComponent
      ),
  },
];
