import { Routes } from '@angular/router';
import { CreateCardComponent } from '../pages/create-card/ui/create-card.component';
import { canUpdateCardResolver } from '../features/can-update';
import { hasUnsavedChangesGuard } from '../features/unsaved-changes';
import { getCardsResolver } from '../pages/my-cards/api/get-cards.resolver';
import { getCardResolver } from '../entities/card/api/card-resolver/get-card.resolver';
import { canAccessGuard } from '../features/can-access';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'create',
    pathMatch: 'full',
  },
  {
    path: 'create',
    component: CreateCardComponent,
    title: 'Create a card | Dokkan Card Maker',
  },
  {
    path: 'card/:id',
    loadComponent: () =>
      import('../pages/card-details/ui/card-details.component').then(
        (m) => m.CardDetailsComponent,
      ),
    resolve: { card: getCardResolver },
    title: 'Card details | Dokkan Card Maker',
  },
  {
    path: 'card/:id/update',
    loadComponent: () =>
      import('../pages/update-card/ui/update-card.component').then(
        (m) => m.UpdateCardComponent,
      ),
    canDeactivate: [hasUnsavedChangesGuard],
    // Ownership check is done in the resolver to read the card only once
    resolve: { card: canUpdateCardResolver },
    title: 'Update a card | Dokkan Card Maker',
  },
  {
    path: 'user/:id/cards',
    loadComponent: () =>
      import('../pages/my-cards/ui/my-cards.component').then(
        (m) => m.MyCardsComponent,
      ),
    canActivate: [canAccessGuard],
    resolve: { cards: getCardsResolver },
    title: 'My cards | Dokkan Card Maker',
  },
  {
    path: 'support',
    loadComponent: () =>
      import('../pages/support/ui/support.component').then(
        (m) => m.SupportComponent,
      ),
    title: 'Support | Dokkan Card Maker',
  },
  {
    path: 'report',
    loadComponent: () =>
      import('../pages/report/ui/report.component').then(
        (m) => m.ReportComponent,
      ),
    title: 'Report | Dokkan Card Maker',
  },
  {
    path: '**',
    redirectTo: 'create',
  },
];
