import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Entries } from './entries';

describe('Entries', () => {
  let component: Entries;
  let fixture: ComponentFixture<Entries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Entries],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Entries);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
