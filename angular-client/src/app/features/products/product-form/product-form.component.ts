import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService, Product } from '../../../core/services/products';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="form-container glass-panel">
      <div class="form-header">
        <h1 class="gradient-text">{{ isEditMode() ? 'Edit Product' : 'Create New Product' }}</h1>
        <p>List product items to synchronize with Express MySQL backend</p>
      </div>

      <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="product-form">
        <div class="form-group">
          <label class="form-label" for="title">Product Title</label>
          <input
            id="title"
            type="text"
            formControlName="title"
            class="form-input"
            placeholder="e.g. Canon EOS 1500D DSLR Camera"
          />
          @if (productForm.get('title')?.touched && productForm.get('title')?.invalid) {
            <span class="form-error">Product title is required</span>
          }
        </div>

        <div class="form-group">
          <label class="form-label" for="price">Price ($ USD)</label>
          <input
            id="price"
            type="number"
            step="0.01"
            formControlName="price"
            class="form-input"
            placeholder="879.99"
          />
          @if (productForm.get('price')?.touched && productForm.get('price')?.invalid) {
            <span class="form-error">Valid positive price is required</span>
          }
        </div>

        <div class="form-group">
          <label class="form-label" for="image">Image URL</label>
          <input
            id="image"
            type="url"
            formControlName="image"
            class="form-input"
            placeholder="https://images.unsplash.com/photo-..."
          />
          @if (productForm.get('image')?.touched && productForm.get('image')?.invalid) {
            <span class="form-error">Image URL is required</span>
          }
        </div>

        <div class="form-group">
          <label class="form-label" for="description">Detailed Description (Min. 120 chars)</label>
          <textarea
            id="description"
            rows="5"
            formControlName="description"
            class="form-textarea"
            placeholder="Designed for owners who want impressive results straight out of the box. Capture magic moments no matter your level with the EOS 1500D camera."
          ></textarea>
          <div class="char-counter" [class.valid]="(productForm.get('description')?.value?.length || 0) >= 120">
            {{ productForm.get('description')?.value?.length || 0 }} / 120 characters required
          </div>
          @if (productForm.get('description')?.touched && productForm.get('description')?.invalid) {
            <span class="form-error">Description must be at least 120 characters long</span>
          }
        </div>

        <div class="form-actions">
          <a routerLink="/products" class="btn btn-secondary">Cancel</a>
          <button type="submit" [disabled]="productForm.invalid || loading()" class="btn btn-primary">
            @if (loading()) {
              Saving...
            } @else {
              {{ isEditMode() ? 'Update Product' : 'Publish Product' }}
            }
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 680px;
      margin: 2rem auto;
      padding: 2.5rem;
      border-radius: var(--radius-lg);
    }
    .form-header {
      margin-bottom: 2rem;
      h1 { font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; }
      p { color: var(--text-secondary); font-size: 0.95rem; }
    }
    .char-counter {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
      text-align: right;
      &.valid { color: var(--accent-emerald); }
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
      border-top: 1px solid var(--border-color);
      padding-top: 1.5rem;
    }
  `]
})
export class ProductFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productsService = inject(ProductsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly isEditMode = signal(false);
  readonly loading = signal(false);
  readonly productId = signal<string | null>(null);

  readonly productForm = this.fb.group({
    title: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0.01)]],
    image: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(120)]]
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.productId.set(id);
      
      const resolvedProduct: Product | null = this.route.snapshot.data['product'];
      if (resolvedProduct) {
        this.productForm.patchValue({
          title: resolvedProduct.title,
          price: resolvedProduct.price,
          image: resolvedProduct.image,
          description: resolvedProduct.description
        });
      } else {
        this.productsService.getProduct(id).subscribe({
          next: (p) => {
            this.productForm.patchValue({
              title: p.title,
              price: p.price,
              image: p.image,
              description: p.description
            });
          }
        });
      }
    }
  }

  onSubmit() {
    if (this.productForm.invalid) return;

    this.loading.set(true);
    const formVal = this.productForm.value;
    const payload = {
      title: formVal.title!,
      price: formVal.price!,
      image: formVal.image!,
      description: formVal.description!
    };

    if (this.isEditMode() && this.productId()) {
      this.productsService.updateProduct(this.productId()!, payload).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/products', this.productId()]);
        },
        error: () => this.loading.set(false)
      });
    } else {
      this.productsService.createProduct(payload).subscribe({
        next: (created) => {
          this.loading.set(false);
          this.router.navigate(['/products']);
        },
        error: () => this.loading.set(false)
      });
    }
  }
}
