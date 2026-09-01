import { ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ProductsService, Product } from '../services/products';
import { catchError, of } from 'rxjs';

export const productResolver: ResolveFn<Product | null> = (route, state) => {
  const productsService = inject(ProductsService);
  const router = inject(Router);
  const productId = route.paramMap.get('id');

  if (!productId) {
    router.navigate(['/products']);
    return of(null);
  }

  return productsService.getProduct(productId).pipe(
    catchError(() => {
      router.navigate(['/products']);
      return of(null);
    })
  );
};

