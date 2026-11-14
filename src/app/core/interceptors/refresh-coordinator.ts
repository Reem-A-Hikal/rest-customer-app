import { firstValueFrom, Observable } from 'rxjs';

export interface RefreshDeps {
  getToken(): string | null;
  refresh(): Observable<{ token: string }>;
}

export type WithLock = <T>(task: () => Promise<T>) => Promise<T>;

const LOCK_NAME = 'rest-auth-refresh';

export const withCrossTabLock: WithLock = (task) =>
  typeof navigator !== 'undefined' && navigator.locks
    ? navigator.locks.request(LOCK_NAME, task)
    : task();

export function refreshOnce(
  deps: RefreshDeps,
  staleToken: string | null,
  withLock: WithLock = withCrossTabLock,
): Promise<string> {
  return withLock(async () => {
    const current = deps.getToken();
    if (current && current !== staleToken) return current;

    const response = await firstValueFrom(deps.refresh());
    return response.token;
  });
}
