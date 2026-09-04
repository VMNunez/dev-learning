import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DashboardPanel } from './dashboard-panel';

describe('DashboardPanel', () => {
  let component: DashboardPanel;
  let fixture: ComponentFixture<DashboardPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPanel],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPanel);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Recent Employees');
    fixture.componentRef.setInput('link', '/employees');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
