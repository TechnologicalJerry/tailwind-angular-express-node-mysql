import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService, Product } from '../../../core/services/products';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (loading()) {
      <div class="loading-state glass-panel">
        <div class="spinner"></div>
        <p>Loading product details...</p>
      </div>
    } @else if (product()) {
      <div class="detail-container">
        <div class="back-nav">
          <a routerLink="/products" class="btn btn-secondary btn-sm">← Back to Catalog</a>
        </div>

        <div class="detail-card glass-panel">
          <div class="image-col">
            <img [src]="product()?.image" [alt]="product()?.title" (error)="handleImageError($event)" class="detail-image" />
          </div>

          <div class="info-col">
            <div class="badge-row">
              <span class="product-badge">ID: {{ product()?.product_id }}</span>
              <span class="price-pill">$ {{ product()?.price | number:'1.2-2' }}</span>
            </div>

            <h1 class="product-title">{{ product()?.title }}</h1>
            <p class="product-description">{{ product()?.description }}</p>

            <div class="meta-box glass-panel">
              <div class="meta-item">
                <span class="meta-label">Publisher User ID</span>
                <span class="meta-val">#{{ product()?.user_id }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Created At</span>
                <span class="meta-val">{{ product()?.created_at | date:'medium' }}</span>
              </div>
            </div>

            @if (auth.isAuthenticated() && (auth.currentUser()?.id === product()?.user_id || auth.currentUser()?.id === 1)) {
              <div class="owner-toolbar">
                <a [routerLink]="['/products', product()?.product_id, 'edit']" class="btn btn-primary">
                  ✏️ Edit Product
                </a>
                <button (click)="onDelete()" class="btn btn-danger">
                  🗑️ Delete Product
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .detail-container {
      max-width: 1000px;
      margin: 1.5rem auto;
    }
    .back-nav { margin-bottom: 1.5rem; }
    .detail-card {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2.5rem;
      padding: 2.5rem;
      border-radius: var(--radius-lg);
    }
    .detail-image {
      width: 100%;
      height: 400px;
      object-fit: cover;
      border-radius: var(--radius-md);
    }
    .badge-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    .product-badge {
      font-size: 0.85rem;
      color: var(--accent-indigo);
      background: rgba(99, 102, 241, 0.15);
      padding: 0.3rem 0.75rem;
      border-radius: var(--radius-full);
    }
    .price-pill {
      font-family: var(--font-heading);
      font-weight: 800;
      font-size: 1.6rem;
      color: var(--accent-emerald);
    }
    .product-title {
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 1.25rem;
    }
    .product-description {
      color: var(--text-secondary);
      line-height: 1.7;
      margin-bottom: 2rem;
    }
    .meta-box {
      display: flex;
      gap: 2rem;
      padding: 1rem 1.5rem;
      margin-bottom: 2rem;
    }
    .meta-label { font-size: 0.75rem; color: var(--text-muted); display: block; }
    .meta-val { font-weight: 600; font-size: 0.95rem; }
    .owner-toolbar {
      display: flex;
      gap: 1rem;
    }
    @media (max-width: 768px) {
      .detail-card { grid-template-columns: 1fr; }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productsService = inject(ProductsService);
  readonly auth = inject(AuthService);

  readonly product = signal<Product | null>(null);
  readonly loading = signal(true);

  ngOnInit() {
    const resolvedProduct: Product | null = this.route.snapshot.data['product'];
    if (resolvedProduct) {
      this.product.set(resolvedProduct);
      this.loading.set(false);
    } else {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.productsService.getProduct(id).subscribe({
          next: (p) => {
            this.product.set(p);
            this.loading.set(false);
          },
          error: () => this.loading.set(false)
        });
      }
    }
  }

  onDelete() {
    const p = this.product();
    if (!p) return;

    if (confirm('Are you sure you want to delete this product?')) {
      this.productsService.deleteProduct(p.product_id).subscribe({
        next: () => this.router.navigate(['/products'])
      });
    }
  }

  handleImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80';
  }
}
