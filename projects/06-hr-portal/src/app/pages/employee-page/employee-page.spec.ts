import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { EmployeePage } from './employee-page';

describe('EmployeePage', () => {
  let component: EmployeePage;
  let fixture: ComponentFixture<EmployeePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeePage],
      // Routed page: the unit injects `ActivatedRoute` (or renders `routerLink`), which only
      // exists once a Router is provided. The empty route list keeps navigation out of scope.
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
