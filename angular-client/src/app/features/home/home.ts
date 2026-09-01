import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductsService, Product } from '../../core/services/products';
import { AuthService } from '../../core/services/auth';

const DEMO_PRODUCTS: Product[] = [
  {
    id: 1,
    product_id: 'product_canon1500d',
    user_id: 1,
    title: 'Canon EOS 1500D DSLR Camera with 18-55mm Lens',
    description: 'Designed for first-time DSLR owners who want impressive results straight out of the box. Capture magic moments with 24.1 MP sensor, Canon Camera Connect app integration, and built-in feature guide.',
    price: 879.99,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    product_id: 'product_macbookm3',
    user_id: 1,
    title: 'MacBook Pro 16" M3 Max Space Black',
    description: 'The ultimate pro laptop. Featuring a 16-core CPU, 40-core GPU, up to 128GB unified memory, Liquid Retina XDR display with up to 1600 nits peak brightness, and up to 22 hours battery life.',
    price: 3499.00,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    product_id: 'product_sonywh1000',
    user_id: 2,
    title: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise canceling headphones with two processors and 8 microphones. Precise voice pickup technology with AI algorithm for ultra-clear call quality.',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString()
  }
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  readonly auth = inject(AuthService);

  readonly products = signal<Product[]>([]);
  readonly loading = signal<boolean>(true);
  readonly searchQuery = signal<string>('');
  readonly maxPriceFilter = signal<number>(5000);

  readonly filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const maxPrice = this.maxPriceFilter();

    return this.products().filter((p) => {
      const matchesSearch = !query || p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
      const matchesPrice = p.price <= maxPrice;
      return matchesSearch && matchesPrice;
    });
  });

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading.set(true);
    this.productsService.getProducts().subscribe({
      next: (list) => {
        this.loading.set(false);
        this.products.set(list.length > 0 ? list : DEMO_PRODUCTS);
      },
      error: () => {
        this.loading.set(false);
        // Display fallback demo catalog if server is fresh / offline
        this.products.set(DEMO_PRODUCTS);
      }
    });
  }

  deleteProduct(productId: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productsService.deleteProduct(productId).subscribe({
        next: () => {
          this.products.update((list) => list.filter((p) => p.product_id !== productId));
        }
      });
    }
  }

  handleImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80';
  }
}

export { HomeComponent as Home };
