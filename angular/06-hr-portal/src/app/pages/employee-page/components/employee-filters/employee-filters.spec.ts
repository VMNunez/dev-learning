import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeFilters } from './employee-filters';

describe('EmployeeFilters', () => {
  let component: EmployeeFilters;
  let fixture: ComponentFixture<EmployeeFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeFilters],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeFilters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
