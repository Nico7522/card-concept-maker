import {
  APP_INITIALIZER,
  ApplicationConfig,
  isDevMode,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { inject } from '@vercel/analytics';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { setLogLevel, LogLevel } from '@angular/fire';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    {
      provide: provideAppInitializer(() => {}),
      useFactory: () => {
        inject({ mode: isDevMode() ? 'development' : 'production' });
      },
    },
    provideFirebaseApp(() => initializeApp(environment)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
};
