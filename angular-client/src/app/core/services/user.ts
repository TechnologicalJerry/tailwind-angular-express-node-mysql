import { Injectable, inject } from '@angular/core';
import { AuthService, User as UserInterface } from './auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly auth = inject(AuthService);

  getCurrentUser(): UserInterface | null {
    return this.auth.currentUser();
  }
}

export { UserService as User };

