import { HttpErrorResponse } from '@angular/common/http';

export function extractErrorMessage(
  error: unknown,
  translate: (key: string) => string,
  fallbackKey: string,
): string {
  if (!(error instanceof HttpErrorResponse)) return translate(fallbackKey);
  if (error.status === 0) return translate('errors.network');

  const body = error.error as { message?: unknown; errors?: unknown } | null;
  const errors = body?.errors;
  const firstError = Array.isArray(errors) ? errors[0] : undefined;

  if (typeof firstError === 'string' && firstError) return firstError;
  if (typeof body?.message === 'string' && body.message) return body.message;

  return translate(fallbackKey);
}
export function safeReturnUrl(url: string | null, fallback = '/'): string {
  return url && url.startsWith('/') && !url.startsWith('//') ? url : fallback;
}
