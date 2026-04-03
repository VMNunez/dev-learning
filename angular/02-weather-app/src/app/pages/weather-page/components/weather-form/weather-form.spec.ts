import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherForm } from './weather-form';

describe('WeatherForm', () => {
  let component: WeatherForm;
  let fixture: ComponentFixture<WeatherForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherForm],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
