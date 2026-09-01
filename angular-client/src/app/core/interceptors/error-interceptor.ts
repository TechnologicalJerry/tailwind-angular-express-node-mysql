import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { tap, catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        const newAccessToken = event.headers.get('x-access-token');
        if (newAccessToken) {
          const currentRefreshToken = authService.getRefreshToken() || '';
          authService.setTokens({ accessToken: newAccessToken, refreshToken: currentRefreshToken });
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.clearSession('Session expired. Please log in again.');
      }
      return throwError(() => error);
    })
  );
};

