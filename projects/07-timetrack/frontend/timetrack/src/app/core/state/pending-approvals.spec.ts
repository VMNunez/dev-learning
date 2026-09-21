import { TestBed } from '@angular/core/testing';

import { PendingApprovals } from './pending-approvals';

describe('PendingApprovals', () => {
  let service: PendingApprovals;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PendingApprovals);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
