import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthResponse, AuthUser } from '../auth/model/auth.model';
import { ApiService } from './api.service';
import { RegisterRequest } from '../auth/model/Register.model';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from '../auth/model/login.model';

const TOKEN_KEY = 'rest_customer_token';
const REFRESH_TOKEN_KEY = 'rest_customer_refresh_token';
const USER_KEY = 'rest_customer_user';

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly api = inject(ApiService);

  private readonly userSignal = signal<AuthUser | null>(
    localStorage.getItem(REFRESH_TOKEN_KEY) ? readStoredUser() : null,
  );

  readonly user = this.userSignal.asReadonly();

  readonly isSignedIn = computed(() => this.userSignal() !== null);

  register(model: RegisterRequest): Observable<null> {
    return this.api.post<null>('/Account/register', model);
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.api
      .post<AuthResponse>('/Account/login', credentials)
      .pipe(tap((response) => this.saveSession(response)));
  }

  refreshToken(): Observable<AuthResponse> {
    return this.api
      .post<AuthResponse>('/Account/refresh-token', {
        refreshToken: this.getRefreshToken(),
      })
      .pipe(tap((response) => this.saveSession(response)));
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();

    if (refreshToken) {
      this.api
        .post<void>('/Account/logout', { refreshToken })
        .subscribe({ error: () => {} });
    }

    this.clearSession();
  }

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.userSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  private saveSession(response: AuthResponse): void {
    const user: AuthUser = {
      id: response.userId,
      fullName: response.fullName,
      email: response.email,
      role: response.role,
    };

    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.userSignal.set(user);
  }
}
