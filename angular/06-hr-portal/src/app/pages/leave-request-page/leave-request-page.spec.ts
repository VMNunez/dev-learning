import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestPage } from './leave-request-page';

describe('LeaveRequestPage', () => {
  let component: LeaveRequestPage;
  let fixture: ComponentFixture<LeaveRequestPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveRequestPage],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveRequestPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
