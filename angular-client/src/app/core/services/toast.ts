import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  readonly toasts = signal<ToastMessage[]>([]);

  show(text: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', durationMs = 4000) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, type, text };
    
    this.toasts.update((current) => [...current, newToast]);

    setTimeout(() => {
      this.remove(id);
    }, durationMs);
  }

  success(text: string, durationMs = 4000) {
    this.show(text, 'success', durationMs);
  }

  error(text: string, durationMs = 5000) {
    this.show(text, 'error', durationMs);
  }

  info(text: string, durationMs = 4000) {
    this.show(text, 'info', durationMs);
  }

  remove(id: string) {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }
}

export { ToastService as Toast };

