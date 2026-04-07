import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransactionPage } from './add-transaction-page';

describe('AddTransactionPage', () => {
  let component: AddTransactionPage;
  let fixture: ComponentFixture<AddTransactionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTransactionPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AddTransactionPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
