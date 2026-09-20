import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EMPTY } from 'rxjs';

import { ProjectDialog, ProjectDialogData } from './project-dialog';

describe('ProjectDialog', () => {
  let component: ProjectDialog;
  let fixture: ComponentFixture<ProjectDialog>;

  beforeEach(async () => {
    const data: ProjectDialogData = { project: null };

    await TestBed.configureTestingModule({
      imports: [ProjectDialog],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: { close: () => {}, keydownEvents: () => EMPTY } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
