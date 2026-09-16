import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordDialog } from './change-password-dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { EMPTY } from 'rxjs';

describe('ChangePasswordDialog', () => {
  let component: ChangePasswordDialog;
  let fixture: ComponentFixture<ChangePasswordDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePasswordDialog],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: vi.fn(), keydownEvents: () => EMPTY },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
