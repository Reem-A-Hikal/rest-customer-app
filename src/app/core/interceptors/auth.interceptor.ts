import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import {
  catchError,
  defer,
  finalize,
  Observable,
  of,
  shareReplay,
  switchMap,
  throwError,
} from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { refreshOnce } from './refresh-coordinator';

const AUTH_PATHS = [
  '/account/login',
  '/account/register',
  '/account/refresh-token',
  '/account/logout',
];
let refresh$: Observable<string> | null = null;

function isAuthEndpoint(url: string): boolean {
  const lower = url.toLowerCase();
  return AUTH_PATHS.some((path) => lower.includes(path));
}

function withToken(
  req: HttpRequest<unknown>,
  token: string,
): HttpRequest<unknown> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

function isSessionRejected(error: unknown): boolean {
  return (
    error instanceof HttpErrorResponse &&
    (error.status === 401 || error.status === 403)
  );
}

function sharedRefresh(
  auth: AuthService,
  staleToken: string | null,
): Observable<string> {
  refresh$ ??= defer(() =>
    refreshOnce(
      {
        getToken: () => auth.getToken(),
        refresh: () => auth.refreshToken(),
      },
      staleToken,
    ),
  ).pipe(
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

      return sharedRefresh(auth, token).pipe(
        catchError((refreshError: unknown) => {
          const latest = auth.getToken();
          if (latest && latest !== token && auth.getRefreshToken()) {
            return of(latest);
          }

          if (isSessionRejected(refreshError)) {
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
