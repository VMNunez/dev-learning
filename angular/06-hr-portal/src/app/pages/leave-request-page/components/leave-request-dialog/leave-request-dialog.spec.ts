import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestDialog } from './leave-request-dialog';

describe('LeaveRequestDialog', () => {
  let component: LeaveRequestDialog;
  let fixture: ComponentFixture<LeaveRequestDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveRequestDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveRequestDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
