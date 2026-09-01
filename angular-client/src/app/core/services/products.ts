import { Injectable, inject } from '@angular/core';
import { ApiService } from './api';
import { ToastService } from './toast';
import { Observable, tap, catchError, throwError } from 'rxjs';

export interface Product {
  id: number;
  product_id: string;
  user_id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductPayload {
  title: string;
  description: string;
  price: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);

  getProducts(): Observable<Product[]> {
    return this.api.get<Product[]>('/products').pipe(
      catchError((err) => {
        // Fallback or toast error
        this.toast.error('Failed to load products');
        return throwError(() => err);
      })
    );
  }

  getProduct(productId: string): Observable<Product> {
    return this.api.get<Product>(`/products/${productId}`).pipe(
      catchError((err) => {
        this.toast.error('Product not found');
        return throwError(() => err);
      })
    );
  }

  createProduct(data: CreateProductPayload): Observable<Product> {
    return this.api.post<Product>('/products', data).pipe(
      tap((product) => {
        this.toast.success(`Product "${product.title}" created successfully!`);
      }),
      catchError((err) => {
        const errorMsg = typeof err.error === 'string' ? err.error : (err.error?.message || 'Failed to create product');
        this.toast.error(errorMsg);
        return throwError(() => err);
      })
    );
  }

  updateProduct(productId: string, data: Partial<CreateProductPayload>): Observable<Product> {
    return this.api.put<Product>(`/products/${productId}`, data).pipe(
      tap((product) => {
        this.toast.success(`Product updated successfully!`);
      }),
      catchError((err) => {
        const errorMsg = typeof err.error === 'string' ? err.error : (err.error?.message || 'Failed to update product');
        this.toast.error(errorMsg);
        return throwError(() => err);
      })
    );
  }

  deleteProduct(productId: string): Observable<void> {
    return this.api.delete<void>(`/products/${productId}`).pipe(
      tap(() => {
        this.toast.success('Product deleted successfully');
      }),
      catchError((err) => {
        const errorMsg = typeof err.error === 'string' ? err.error : (err.error?.message || 'Failed to delete product');
        this.toast.error(errorMsg);
        return throwError(() => err);
      })
    );
  }
}

export { ProductsService as Products };

