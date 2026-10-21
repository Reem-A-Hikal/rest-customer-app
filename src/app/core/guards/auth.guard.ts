import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isSignedIn()
    ? true
    : router.createUrlTree(['/signin'], {
        queryParams: { returnUrl: state.url },
      });
};
