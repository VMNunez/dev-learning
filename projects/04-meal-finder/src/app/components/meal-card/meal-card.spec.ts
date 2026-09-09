import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MealCard } from './meal-card';
import type { Meal } from '../../models/meal.model';

const meal: Meal = {
  idMeal: '52772',
  strMeal: 'Teriyaki Chicken Casserole',
  strCategory: 'Chicken',
  strArea: 'Japanese',
  strInstructions: 'Preheat oven to 350F.',
  strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpsxx.jpg',
  strYoutube: 'https://www.youtube.com/watch?v=4aZr5hZXP_s',
};

describe('MealCard', () => {
  let component: MealCard;
  let fixture: ComponentFixture<MealCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MealCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('meal', meal);
    fixture.componentRef.setInput('isFavourite', false);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should name the favourite toggle by the current state', async () => {
    expect(component.favouriteLabel()).toBe('Add Teriyaki Chicken Casserole to favourites');

    fixture.componentRef.setInput('isFavourite', true);
    await fixture.whenStable();

    expect(component.favouriteLabel()).toBe('Remove Teriyaki Chicken Casserole from favourites');
  });
});
