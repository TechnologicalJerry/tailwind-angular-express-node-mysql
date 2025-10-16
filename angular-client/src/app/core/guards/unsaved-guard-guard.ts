import { CanActivateFn } from '@angular/router';

export const unsavedGuardGuard: CanActivateFn = (route, state) => {
  return true;
};
