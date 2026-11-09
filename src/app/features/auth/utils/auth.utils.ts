import { HttpErrorResponse } from '@angular/common/http';

type Params = Record<string, unknown>;
type Translate = (key: string, params?: Params) => string;
interface ApiErrorBody {
  message?: unknown;
  errors?: unknown;
  errorCode?: unknown;
  errorParams?: unknown;
}

const STATUS_KEYS: Readonly<Record<number, string>> = {
  409: 'errors.conflict',
  429: 'errors.tooManyRequests',
};

function asNonEmptyString(value: unknown): string | undefined {
  return typeof value === 'string' && value ? value : undefined;
}

function translateOrUndefined(
  translate: Translate,
  key: string,
  params?: Params,
): string | undefined {
  const text = translate(key, params);
  return text && text !== key ? text : undefined;
}

function resolveTranslatedError(
  body: ApiErrorBody | null,
  translate: Translate,
  enrichParams?: (code: string, params: Params) => Params,
): string | undefined {
  const code = asNonEmptyString(body?.errorCode);
  if (!code) return undefined;

  const raw =
    body?.errorParams && typeof body.errorParams === 'object'
      ? (body.errorParams as Params)
      : {};
  const params = enrichParams ? enrichParams(code, raw) : raw;

  return translateOrUndefined(translate, `errors.codes.${code}`, params);
}

function resolveFirstErrorMessage(
  body: ApiErrorBody | null,
): string | undefined {
  const errors = body?.errors;
  const firstError = Array.isArray(errors) ? errors[0] : undefined;

  return asNonEmptyString(firstError) ?? asNonEmptyString(body?.message);
}

export function extractErrorMessage(
  error: unknown,
  translate: Translate,
  fallbackKey: string,
  enrichParams?: (code: string, params: Params) => Params,
): string {
  if (!(error instanceof HttpErrorResponse)) return translate(fallbackKey);
  if (error.status === 0) return translate('errors.network');
  if (error.status >= 500) return translate(fallbackKey);

  const body = error.error as ApiErrorBody | null;
  const translatedError = resolveTranslatedError(body, translate, enrichParams);
  if (translatedError) return translatedError;

  const statusKey = STATUS_KEYS[error.status];
  if (statusKey) {
    const statusMessage = translateOrUndefined(translate, statusKey);
    if (statusMessage) return statusMessage;
  }

  const firstErrorMessage = resolveFirstErrorMessage(body);
  if (firstErrorMessage) return firstErrorMessage;

  return translate(fallbackKey);
}

export function safeReturnUrl(url: string | null, fallback = '/'): string {
  return url && url.startsWith('/') && !url.startsWith('//') ? url : fallback;
}