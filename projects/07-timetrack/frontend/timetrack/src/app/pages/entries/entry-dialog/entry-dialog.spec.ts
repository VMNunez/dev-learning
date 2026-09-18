import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EMPTY } from 'rxjs';

import { EntryDialog, EntryDialogData } from './entry-dialog';

describe('EntryDialog', () => {
  let component: EntryDialog;
  let fixture: ComponentFixture<EntryDialog>;

  beforeEach(async () => {
    const data: EntryDialogData = { entry: null, projects: [] };

    await TestBed.configureTestingModule({
      imports: [EntryDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: { close: () => {}, keydownEvents: () => EMPTY } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EntryDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
