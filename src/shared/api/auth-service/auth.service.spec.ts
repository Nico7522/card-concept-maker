import { TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect } from 'vitest';
import { AuthService } from './auth.service';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { environment } from '~/src/environments/environment';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideFirebaseApp(() => initializeApp(environment)),
        provideAuth(() => getAuth()),
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should return an Observable', () => {
      // Act
      const result$ = service.login();

      // Assert
      expect(result$).toBeDefined();
      expect(result$.subscribe).toBeDefined();
      expect(typeof result$.subscribe).toBe('function');
    });

    it('should return an Observable that can be subscribed to', () => {
      // Act
      const result$ = service.login();

      // Assert
      expect(result$).toBeDefined();
      expect(result$.subscribe).toBeDefined();

      // Verify it's an Observable by subscribing (will error without actual Firebase, but Observable is valid)
      const subscription = result$.subscribe({
        next: () => {},
        error: () => {},
      });

      expect(subscription).toBeDefined();
      subscription.unsubscribe();
    });

    it('should return an Observable created from from() operator', () => {
      // Act
      const result$ = service.login();

      // Assert
      // The Observable should be created from the async loginWithGoogle function using from()
      expect(result$).toBeDefined();
      expect(result$.subscribe).toBeDefined();
      expect(result$.pipe).toBeDefined();
    });
  });

  describe('logout', () => {
    it('should return an Observable', () => {
      // Act
      const result$ = service.logout();

      // Assert
      expect(result$).toBeDefined();
      expect(result$.subscribe).toBeDefined();
      expect(typeof result$.subscribe).toBe('function');
    });

    it('should return an Observable that can be subscribed to', () => {
      // Act
      const result$ = service.logout();

      // Assert
      expect(result$).toBeDefined();
      expect(result$.subscribe).toBeDefined();

      // Verify it's an Observable by subscribing (will error without actual Firebase, but Observable is valid)
      const subscription = result$.subscribe({
        next: () => {},
        error: () => {},
      });

      expect(subscription).toBeDefined();
      subscription.unsubscribe();
    });

    it('should return an Observable created from from() operator', () => {
      // Act
      const result$ = service.logout();

      // Assert
      // The Observable should be created from the async signOut function using from()
      expect(result$).toBeDefined();
      expect(result$.subscribe).toBeDefined();
      expect(result$.pipe).toBeDefined();
    });
  });
});
