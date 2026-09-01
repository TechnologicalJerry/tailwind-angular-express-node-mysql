import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { ToastService } from '../services/toast';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (authService.isAuthenticated()) {
    return true;
  }

  toast.info('Please log in to access this page');
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

export { authGuardGuard as authGuard };

