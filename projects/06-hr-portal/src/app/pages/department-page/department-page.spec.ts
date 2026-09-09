import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DepartmentPage } from './department-page';

describe('DepartmentPage', () => {
  let component: DepartmentPage;
  let fixture: ComponentFixture<DepartmentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentPage],
      // Routed page: the unit injects `ActivatedRoute` (or renders `routerLink`), which only
      // exists once a Router is provided. The empty route list keeps navigation out of scope.
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
