import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelItem } from './panel-item';

describe('PanelItem', () => {
  let component: PanelItem;
  let fixture: ComponentFixture<PanelItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelItem],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelItem);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('name', 'Ada Lovelace');
    fixture.componentRef.setInput('meta', 'Engineering · Developer');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
