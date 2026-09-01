import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from './api';
import { ToastService } from './toast';
import { tap, catchError, Observable, of, throwError } from 'rxjs';

export interface User {
  id: number;
  email: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserSession {
  id: number;
  user_id: number;
  valid: boolean;
  user_agent: string;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly currentUser = signal<User | null>(this.loadStoredUser());
  readonly isAuthenticated = computed(() => !!this.currentUser() && !!this.getAccessToken());

  private loadStoredUser(): User | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      const stored = localStorage.getItem('user_data');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  getAccessToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem('refresh_token');
  }

  setTokens(tokens: AuthTokens) {
    if (!isPlatformBrowser(this.platformId)) return;
    if (tokens.accessToken) {
      localStorage.setItem('access_token', tokens.accessToken);
    }
    if (tokens.refreshToken) {
      localStorage.setItem('refresh_token', tokens.refreshToken);
    }
  }

  setCurrentUser(user: User) {
    this.currentUser.set(user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user_data', JSON.stringify(user));
    }
  }

  register(userData: { name: string; email: string; password: string; passwordConfirmation: string }): Observable<User> {
    return this.api.post<User>('/users', userData).pipe(
      tap((user) => {
        this.toast.success(`Account created for ${user.name}! Please login.`);
      }),
      catchError((err) => {
        const errorMsg = typeof err.error === 'string' ? err.error : (err.error?.message || 'Registration failed');
        this.toast.error(errorMsg);
        return throwError(() => err);
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<AuthTokens> {
    return this.api.post<AuthTokens>('/sessions', credentials).pipe(
      tap((tokens) => {
        this.setTokens(tokens);
        // Estimate user object from email & decoded JWT claims if available
        const decodedUser: User = {
          id: this.decodeJwtUserId(tokens.accessToken) || 1,
          email: credentials.email,
          name: credentials.email.split('@')[0]
        };
        this.setCurrentUser(decodedUser);
        this.toast.success(`Welcome back, ${decodedUser.name}!`);
      }),
      catchError((err) => {
        const errorMsg = typeof err.error === 'string' ? err.error : (err.error?.message || 'Invalid email or password');
        this.toast.error(errorMsg);
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    if (this.getAccessToken()) {
      this.api.delete<AuthTokens>('/sessions').subscribe({
        next: () => this.clearSession('Logged out successfully'),
        error: () => this.clearSession('Session ended')
      });
    } else {
      this.clearSession('Logged out');
    }
  }

  clearSession(message?: string): void {
    this.currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
    }
    if (message) {
      this.toast.info(message);
    }
  }

  getUserSessions(): Observable<UserSession[]> {
    return this.api.get<UserSession[]>('/sessions');
  }

  deleteSession(): Observable<any> {
    return this.api.delete('/sessions');
  }

  private decodeJwtUserId(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || null;
    } catch {
      return null;
    }
  }
}

export { AuthService as Auth };

