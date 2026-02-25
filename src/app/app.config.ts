import {
  ApplicationConfig,
  inject as angularInject,
  inject,
  isDevMode,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  Router,
  withComponentInputBinding,
  withNavigationErrorHandler,
} from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { ErrorToastService } from '../shared/api/error-toast-service/error-toast.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  provideAnalytics,
  getAnalytics,
  ScreenTrackingService,
  UserTrackingService,
  Analytics,
} from '@angular/fire/analytics';
import { environment } from '../environments/environment';
import { authInterceptor } from '../shared/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAppInitializer(() => {
      if (!isDevMode()) {
        const analytics = inject(Analytics);
      }
    }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withNavigationErrorHandler((error) => {
        const router = angularInject(Router);
        const errorToastService = angularInject(ErrorToastService);
        if (error?.error?.message) {
          errorToastService.showToast(error.error.message);
        } else {
          errorToastService.showToast('An error occurred, try later');
        }
        router.navigate(['/']);
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
