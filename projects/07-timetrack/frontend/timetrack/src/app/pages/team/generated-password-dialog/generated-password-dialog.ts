import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

export interface GeneratedPasswordDialogData {
  name: string;
  email: string;
  password: string;
  reason: 'created' | 'reset';
}

@Component({
  selector: 'app-generated-password-dialog',
  imports: [
    CdkCopyToClipboard,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './generated-password-dialog.html',
  styleUrl: './generated-password-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneratedPasswordDialog {
  protected readonly data = inject<GeneratedPasswordDialogData>(MAT_DIALOG_DATA);
  protected readonly copyResult = signal<'copied' | 'failed' | null>(null);

  onCopied(succeeded: boolean): void {
    this.copyResult.set(succeeded ? 'copied' : 'failed');
  }
}
