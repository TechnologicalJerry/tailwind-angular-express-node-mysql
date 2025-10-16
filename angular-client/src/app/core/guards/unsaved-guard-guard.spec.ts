import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { unsavedGuardGuard } from './unsaved-guard-guard';

describe('unsavedGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => unsavedGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
