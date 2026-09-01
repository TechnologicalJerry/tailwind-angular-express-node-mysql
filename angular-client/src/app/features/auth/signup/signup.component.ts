import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const passwordConfirmation = control.get('passwordConfirmation');

  if (!password || !passwordConfirmation) return null;
  return password.value === passwordConfirmation.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-card glass-panel">
      <div class="auth-header">
        <h1 class="gradient-text">Create Account</h1>
        <p>Join Nexus Store to start listing & trading products</p>
      </div>

      <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="auth-form">
        <div class="form-group">
          <label class="form-label" for="name">Full Name</label>
          <input
            id="name"
            type="text"
            formControlName="name"
            class="form-input"
            placeholder="Jane Doe"
          />
          @if (signupForm.get('name')?.touched && signupForm.get('name')?.invalid) {
            <span class="form-error">Name is required</span>
          }
        </div>

        <div class="form-group">
          <label class="form-label" for="email">Email Address</label>
          <input
            id="email"
            type="email"
            formControlName="email"
            class="form-input"
            placeholder="jane.doe@example.com"
          />
          @if (signupForm.get('email')?.touched && signupForm.get('email')?.invalid) {
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
            placeholder="Min. 6 characters"
          />
          @if (signupForm.get('password')?.touched && signupForm.get('password')?.invalid) {
            <span class="form-error">Password must be at least 6 characters</span>
          }
        </div>

        <div class="form-group">
          <label class="form-label" for="passwordConfirmation">Confirm Password</label>
          <input
            id="passwordConfirmation"
            type="password"
            formControlName="passwordConfirmation"
            class="form-input"
            placeholder="Repeat password"
          />
          @if (signupForm.hasError('passwordMismatch') && signupForm.get('passwordConfirmation')?.touched) {
            <span class="form-error">Passwords do not match</span>
          }
        </div>

        <button type="submit" [disabled]="signupForm.invalid || loading()" class="btn btn-primary btn-block">
          @if (loading()) {
            Creating Account...
          } @else {
            Register Account →
          }
        </button>
      </form>

      <div class="auth-footer">
        <p>Already have an account? <a routerLink="/login" class="auth-link">Log in</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-card {
      max-width: 460px;
      margin: 3rem auto;
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
export class SignupComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);

  readonly signupForm = this.fb.group({
    name: ['Jane Doe', [Validators.required]],
    email: ['jane.doe@example.com', [Validators.required, Validators.email]],
    password: ['stringPassword123', [Validators.required, Validators.minLength(6)]],
    passwordConfirmation: ['stringPassword123', [Validators.required]]
  }, { validators: passwordMatchValidator });

  onSubmit() {
    if (this.signupForm.invalid) return;

    this.loading.set(true);
    const formVal = this.signupForm.value;

    this.auth.register({
      name: formVal.name!,
      email: formVal.email!,
      password: formVal.password!,
      passwordConfirmation: formVal.passwordConfirmation!
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/login']);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
