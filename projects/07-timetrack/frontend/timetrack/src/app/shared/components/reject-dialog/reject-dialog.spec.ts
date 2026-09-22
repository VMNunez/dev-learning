import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EMPTY } from 'rxjs';

import { TimeEntry } from '../../models/time-entry';
import { RejectDialog, RejectDialogData } from './reject-dialog';

describe('RejectDialog', () => {
  let component: RejectDialog;
  let fixture: ComponentFixture<RejectDialog>;

  beforeEach(async () => {
    const entry: TimeEntry = {
      id: 1,
      userId: 2,
      userName: 'Ana García',
      projectId: 3,
      projectName: 'Project A',
      date: '2026-09-19',
      hours: 8,
      description: 'API work',
      status: 'SUBMITTED',
      rejectionNote: null,
    };
    const data: RejectDialogData = { entry };

    await TestBed.configureTestingModule({
      imports: [RejectDialog],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: { close: () => {}, keydownEvents: () => EMPTY } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RejectDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
