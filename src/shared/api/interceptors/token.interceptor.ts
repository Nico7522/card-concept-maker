import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { AuthService } from '../auth-service/auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('token');

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        const user = authService.user();
        if (user) {
          return authService.getIdToken(user, true).pipe(
            switchMap((idToken) => {
              return authService.sendFirebaseToken(idToken).pipe(
                switchMap((res) => {
                  localStorage.setItem('token', res.data.token);
                  const newReq = req.clone({
                    setHeaders: { Authorization: `Bearer ${res.data.token}` },
                  });
                  return next(newReq);
                }),
              );
            }),
          );
        }
        return throwError(() => error);
      }
      return throwError(() => error);
    }),
  );
};
