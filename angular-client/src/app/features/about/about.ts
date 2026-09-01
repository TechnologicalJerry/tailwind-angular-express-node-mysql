import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="about-container glass-panel">
      <div class="about-header">
        <span class="badge">Architecture Overview</span>
        <h1 class="gradient-text">Angular 21 + Express MySQL Platform</h1>
        <p>Fullstack web application powered by modern Angular Signals, RxJS, Express REST API, and MySQL.</p>
      </div>

      <div class="tech-grid">
        <div class="tech-card glass-panel">
          <div class="tech-icon">🅰️</div>
          <h3>Angular 21 Frontend</h3>
          <p>Built with Standalone components, modern Signals reactivity, functional Route Guards, and HTTP Interceptors for JWT authentication.</p>
        </div>

        <div class="tech-card glass-panel">
          <div class="tech-icon">🚀</div>
          <h3>Express 5 Backend</h3>
          <p>TypeScript REST server utilizing Zod schema validation, Swagger documentation, Prometheus metrics, and JWT access/refresh token pairs.</p>
        </div>

        <div class="tech-card glass-panel">
          <div class="tech-icon">🐬</div>
          <h3>MySQL Persistence</h3>
          <p>Relational database with schema tables for Users, Sessions, and Products connected via high-performance connection pool.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .about-container {
      max-width: 900px;
      margin: 3rem auto;
      padding: 3rem;
      border-radius: var(--radius-lg);
    }
    .about-header {
      text-align: center;
      margin-bottom: 3rem;
      .badge {
        display: inline-block;
        padding: 0.35rem 0.9rem;
        background: rgba(99, 102, 241, 0.15);
        color: var(--accent-indigo);
        border-radius: var(--radius-full);
        font-size: 0.85rem;
        font-weight: 600;
        margin-bottom: 1rem;
      }
      h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 0.75rem; }
      p { color: var(--text-secondary); font-size: 1.05rem; max-width: 600px; margin: 0 auto; }
    }
    .tech-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
    }
    .tech-card {
      padding: 1.75rem;
      border-radius: var(--radius-md);
      .tech-icon { font-size: 2.2rem; margin-bottom: 1rem; }
      h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem; }
      p { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6; }
    }
  `]
})
export class AboutComponent {}

export { AboutComponent as About };
