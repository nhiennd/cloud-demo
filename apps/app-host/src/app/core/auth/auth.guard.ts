import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GoogleAuthService } from './google-auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(GoogleAuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Open login modal and redirect to home
  authService.openLoginModal();
  return router.createUrlTree(['/']);
};
