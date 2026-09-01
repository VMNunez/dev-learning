import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryFilter } from './category-filter';

describe('CategoryFilter', () => {
  let component: CategoryFilter;
  let fixture: ComponentFixture<CategoryFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryFilter);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('categories', ['Chicken', 'Dessert']);
    fixture.componentRef.setInput('selected', '');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark only the selected category as pressed', async () => {
    const pressed = () =>
      Array.from(
        (fixture.nativeElement as HTMLElement).querySelectorAll('[aria-pressed="true"]'),
      ).map((button) => button.textContent?.trim());

    expect(pressed()).toEqual(['All']);

    fixture.componentRef.setInput('selected', 'Dessert');
    await fixture.whenStable();

    expect(pressed()).toEqual(['Dessert']);
  });
});
