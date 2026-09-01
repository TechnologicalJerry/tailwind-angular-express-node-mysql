import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const accessToken = authService.getAccessToken();
  const refreshToken = authService.getRefreshToken();

  let headers = req.headers;

  if (accessToken) {
    headers = headers.set('Authorization', `Bearer ${accessToken}`);
  }
  if (refreshToken) {
    headers = headers.set('x-refresh', refreshToken);
  }

  const authReq = req.clone({ headers });
  return next(authReq);
};

