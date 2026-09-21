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
}

// Shows a new member's generated password, the one time it exists outside the database's hash: it
// arrives in the `POST /api/users` response and nowhere else (§10). A dialog rather than a snackbar,
// because a snackbar goes on one stray click or under the next snackbar, and this value cannot be read
// again; it submits nothing, so it calls no service, and its only exit is Done — the page opens it with
// `disableClose`, so neither Escape nor a backdrop click throws the password away.
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

  // The CDK reports whether the browser accepted the copy; a refusal is said out loud, with the way
  // round it, rather than leaving the manager to paste an empty clipboard.
  onCopied(succeeded: boolean): void {
    this.copyResult.set(succeeded ? 'copied' : 'failed');
  }
}
