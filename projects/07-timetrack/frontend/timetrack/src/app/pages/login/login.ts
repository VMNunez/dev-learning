import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AuthService, UnreadableSessionError } from '../../core/services/auth-service';
import { apiErrorMessage } from '../../shared/models/api-error';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Logo } from '../../shared/components/logo/logo';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    Logo,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly emailInput = viewChild.required<ElementRef<HTMLInputElement>>('emailInput');
  private readonly destroyRef = inject(DestroyRef);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly showPassword = signal(false);
  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.error.set(null));

    afterNextRender(() => {
      if (this.authService.consumeSessionExpired()) {
        this.error.set('Your session has expired. Please log in again.');
      }
      this.emailInput().nativeElement.focus();
    });
  }

  onSubmit() {
    if (this.form.invalid || this.loading()) return;

    this.loading.set(true);

    this.authService
      .login(this.form.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () =>
          this.router
            .navigate(['/dashboard'])
            .then((navigated) => {
              if (!navigated) this.loading.set(false);
            })
            .catch(() => {
              this.error.set('Could not load the app — refresh the page and try again');
              this.loading.set(false);
            }),
        error: (err: unknown) => {
          // The one failure that is not an HTTP error: the call succeeded and its body did not.
          // `apiErrorMessage`'s connection fallback would blame the network for it.
          this.error.set(
            err instanceof UnreadableSessionError
              ? 'The server sent a response this app cannot read. Refresh the page and try again.'
              : apiErrorMessage(
                  err,
                  'Could not reach the server — check your connection and try again',
                ),
          );
          this.loading.set(false);
        },
      });
  }
}
