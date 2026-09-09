import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DepartmentForm } from './department-form';

describe('DepartmentForm', () => {
  let component: DepartmentForm;
  let fixture: ComponentFixture<DepartmentForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentForm],
      // Routed page: the unit injects `ActivatedRoute` (or renders `routerLink`), which only
      // exists once a Router is provided. The empty route list keeps navigation out of scope.
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
