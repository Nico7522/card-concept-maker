import { Routes } from '@angular/router';
import { CreateCardComponent } from '../pages/create-card/ui/create-card.component';
import { canUpdateGuard } from '../features/can-update';
import { hasUnsavedChangesGuard } from '../features/unsaved-changes';
import { getCardsResolver } from '../pages/my-cards/api/get-cards.resolver';
import { getCardResolver } from '../shared/api/card-resolver/get-card.resolver';
import { canAccessGuard } from '../features/can-access';

export const routes: Routes = [
  {
    path: '',
    component: CreateCardComponent,
    canDeactivate: [hasUnsavedChangesGuard],
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
    canActivate: [canAccessGuard],
    resolve: { cards: getCardsResolver },
  },

  {
    path: 'card/:id/update',
    loadComponent: () =>
      import('../pages/update-card/ui/update-card.component').then(
        (m) => m.UpdateCardComponent
      ),
    canActivate: [canUpdateGuard],
    canDeactivate: [hasUnsavedChangesGuard],
    resolve: { card: getCardResolver },
  },
  {
    path: 'report',
    loadComponent: () =>
      import('../pages/report/ui/report.component').then(
        (m) => m.ReportComponent
      ),
  },
];
