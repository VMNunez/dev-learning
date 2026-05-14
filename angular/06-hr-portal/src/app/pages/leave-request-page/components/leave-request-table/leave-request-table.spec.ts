import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestTable } from './leave-request-table';

describe('LeaveRequestTable', () => {
  let component: LeaveRequestTable;
  let fixture: ComponentFixture<LeaveRequestTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveRequestTable],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveRequestTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
