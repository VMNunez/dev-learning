import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LeaveRequestPage } from './leave-request-page';

describe('LeaveRequestPage', () => {
  let component: LeaveRequestPage;
  let fixture: ComponentFixture<LeaveRequestPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveRequestPage],
      // Routed page: the unit injects `ActivatedRoute` (or renders `routerLink`), which only
      // exists once a Router is provided. The empty route list keeps navigation out of scope.
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveRequestPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
