import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import {
  catchError,
  finalize,
  map,
  Observable,
  shareReplay,
  switchMap,
  throwError,
} from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

const AUTH_PATHS = [
  '/Account/login',
  '/Account/register',
  '/Account/refresh-token',
  '/Account/logout',
];

/** The API answers an unusable refresh token with 400/401/403. */
const SESSION_ENDING_STATUSES = new Set([400, 401, 403]);

let refresh$: Observable<string> | null = null;

function isAuthEndpoint(url: string): boolean {
  const lower = url.toLowerCase();
  return AUTH_PATHS.some((path) => lower.includes(path.toLowerCase()));
}

function withToken(
  req: HttpRequest<unknown>,
  token: string,
): HttpRequest<unknown> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

function sharedRefresh(auth: AuthService): Observable<string> {
  refresh$ ??= auth.refreshToken().pipe(
    map((res) => res.token),
    finalize(() => (refresh$ = null)),
    shareReplay({ bufferSize: 1, refCount: false }),
  );

  return refresh$;
}

export const authInterceptor: HttpInterceptorFn = (
  req,
  next: HttpHandlerFn,
) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (isAuthEndpoint(req.url)) return next(req);

  const token = auth.getToken();
  const authorizedReq = token ? withToken(req, token) : req;

  return next(authorizedReq).pipe(
    catchError((error: unknown) => {
      const isUnauthorized =
        error instanceof HttpErrorResponse && error.status === 401;

      if (!isUnauthorized || !auth.getRefreshToken()) {
        return throwError(() => error);
      }

      return sharedRefresh(auth).pipe(
        catchError((refreshError: unknown) => {
          const sessionIsDead =
            refreshError instanceof HttpErrorResponse &&
            SESSION_ENDING_STATUSES.has(refreshError.status);

          if (sessionIsDead) {
            auth.clearSession();
            void router.navigate(['/signin'], {
              queryParams: { returnUrl: router.url },
            });
          }
          return throwError(() => refreshError);
        }),
        switchMap((newToken) => next(withToken(req, newToken))),
      );
    }),
  );
};
