import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { ProductFormComponent } from './features/products/product-form/product-form.component';
import { ProductDetailComponent } from './features/products/product-detail/product-detail.component';
import { DashboardComponent } from './features/dashboard/dashboard';
import { AboutComponent } from './features/about/about';

import { authGuard } from './core/guards/auth-guard-guard';
import { loginGuard } from './core/guards/login-guard-guard';
import { productResolver } from './core/resolvers/product-resolver';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [loginGuard] },
  { path: 'products', component: HomeComponent },
  { path: 'products/new', component: ProductFormComponent, canActivate: [authGuard] },
  { path: 'products/:id', component: ProductDetailComponent, resolve: { product: productResolver } },
  { path: 'products/:id/edit', component: ProductFormComponent, canActivate: [authGuard], resolve: { product: productResolver } },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: 'products' }
];
