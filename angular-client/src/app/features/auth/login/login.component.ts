import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-card glass-panel">
      <div class="auth-header">
        <h1 class="gradient-text">Welcome Back</h1>
        <p>Sign in to your account to manage products & sessions</p>
      </div>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
        <div class="form-group">
          <label class="form-label" for="email">Email Address</label>
          <input
            id="email"
            type="email"
            formControlName="email"
            class="form-input"
            placeholder="jane.doe@example.com"
          />
          @if (loginForm.get('email')?.touched && loginForm.get('email')?.invalid) {
            <span class="form-error">Valid email is required</span>
          }
        </div>

        <div class="form-group">
          <label class="form-label" for="password">Password</label>
          <input
            id="password"
            type="password"
            formControlName="password"
            class="form-input"
            placeholder="••••••••"
          />
          @if (loginForm.get('password')?.touched && loginForm.get('password')?.invalid) {
            <span class="form-error">Password is required</span>
          }
        </div>

        <button type="submit" [disabled]="loginForm.invalid || loading()" class="btn btn-primary btn-block">
          @if (loading()) {
            Logging in...
          } @else {
            Sign In →
          }
        </button>
      </form>

      <div class="auth-footer">
        <p>Don't have an account? <a routerLink="/signup" class="auth-link">Sign up now</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-card {
      max-width: 440px;
      margin: 4rem auto;
      padding: 2.5rem;
      border-radius: var(--radius-lg);
    }
    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
      h1 { font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; }
      p { color: var(--text-secondary); font-size: 0.9rem; }
    }
    .auth-form { margin-bottom: 1.5rem; }
    .btn-block { width: 100%; margin-top: 1rem; }
    .auth-footer {
      text-align: center;
      font-size: 0.9rem;
      color: var(--text-secondary);
      border-top: 1px solid var(--border-color);
      padding-top: 1.25rem;
    }
    .auth-link { color: var(--accent-indigo); font-weight: 600; }
    .auth-link:hover { text-decoration: underline; }
  `]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(false);

  readonly loginForm = this.fb.group({
    email: ['jane.doe@example.com', [Validators.required, Validators.email]],
    password: ['stringPassword123', [Validators.required]]
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    const { email, password } = this.loginForm.value;

    this.auth.login({ email: email!, password: password! }).subscribe({
      next: () => {
        this.loading.set(false);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/products';
        this.router.navigateByUrl(returnUrl);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
