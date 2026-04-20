import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealDetailPage } from './meal-detail-page';

describe('MealDetailPage', () => {
  let component: MealDetailPage;
  let fixture: ComponentFixture<MealDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealDetailPage],
    }).compileComponents();

    fixture = TestBed.createComponent(MealDetailPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
