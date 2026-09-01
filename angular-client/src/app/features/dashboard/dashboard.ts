import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, UserSession } from '../../core/services/auth';
import { ToastService } from '../../core/services/toast';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  readonly sessions = signal<UserSession[]>([]);
  readonly loading = signal(true);

  ngOnInit() {
    this.loadSessions();
  }

  loadSessions() {
    this.loading.set(true);
    this.auth.getUserSessions().subscribe({
      next: (list) => {
        this.sessions.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  revokeCurrentSession() {
    if (confirm('Revoke your current session? You will be logged out.')) {
      this.auth.deleteSession().subscribe({
        next: () => {
          this.toast.info('Session revoked');
          this.auth.clearSession();
        }
      });
    }
  }
}

export { DashboardComponent as Dashboard };
