import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { deactivateGuard } from './deactivate-guard';
import { DepartmentForm } from '../../pages/department-page/department-form/department-form';

describe('deactivateGuard', () => {
  // `CanDeactivateFn` is generic in the component it guards, and the CLI scaffolds `unknown`
  // because it cannot know which one. The guard reads `component.departmentForm`, so the test
  // harness has to name the same component the guard is declared against.
  const executeGuard: CanDeactivateFn<DepartmentForm> = (...guardParameters) =>
    TestBed.runInInjectionContext(() => deactivateGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
