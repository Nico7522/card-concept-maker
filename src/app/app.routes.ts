import { Routes } from '@angular/router';
import { CreateCardFormComponent } from './components/create-card-form/create-card-form.component';

export const routes: Routes = [
  {
    path: '',
    component: CreateCardFormComponent,
  },
  {
    path: 'my-cards',
    loadComponent: () =>
      import('./components/my-cards/my-cards.component').then(
        (m) => m.MyCardsComponent
      ),
  },
  {
    path: 'card/:id',
    loadComponent: () =>
      import('./components/card-details/card-details.component').then(
        (m) => m.CardDetailsComponent
      ),
  },
  {
    path: 'card/:id/update',
    loadComponent: () =>
      import('./components/update-card-form/update-card-form.component').then(
        (m) => m.UpdateCardFormComponent
      ),
  },
];
