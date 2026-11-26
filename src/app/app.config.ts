import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  RedirectCommand,
  Router,
  withComponentInputBinding,
  withNavigationErrorHandler,
} from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { ErrorToastService } from '../shared/api/error-toast-service/error-toast.service';
import { provideHttpClient } from '@angular/common/http';
import {
  provideAnalytics,
  getAnalytics,
  ScreenTrackingService,
  UserTrackingService,
  Analytics,
} from '@angular/fire/analytics';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Analytics only runs in production. With provideAnalytics, the tracking
    // services are not started automatically: they must be injected once.
    provideAppInitializer(() => {
      if (!isDevMode()) {
        inject(Analytics);
        inject(ScreenTrackingService);
        inject(UserTrackingService);
      }
    }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withNavigationErrorHandler((error) => {
        const router = inject(Router);
        const errorToastService = inject(ErrorToastService);
        errorToastService.showToast(
          error?.error?.message ?? 'An error occurred, try later',
        );
        return new RedirectCommand(router.parseUrl('/'));
      }),
    ),
    provideFirebaseApp(() => initializeApp(environment)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideAnalytics(() => getAnalytics()),
    provideHttpClient(),
    ScreenTrackingService,
    UserTrackingService,
  ],
};
