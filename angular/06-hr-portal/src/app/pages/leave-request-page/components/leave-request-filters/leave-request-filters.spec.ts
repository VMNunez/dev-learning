import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestFilters } from './leave-request-filters';

describe('LeaveRequestFilters', () => {
  let component: LeaveRequestFilters;
  let fixture: ComponentFixture<LeaveRequestFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveRequestFilters],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveRequestFilters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
