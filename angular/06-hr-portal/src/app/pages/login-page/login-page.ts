import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  isLoading = signal<boolean>(false);
  hasError = signal<boolean>(false);

  loginForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
  });

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    this.hasError.set(false);
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      this.isLoading.set(true);
      const formValue = this.loginForm.value;

      setTimeout(() => {
        this.authService.login(formValue.email!, formValue.password!);
        if (this.authService.isLoggedIn()) {
          this.router.navigate(['/dashboard']);
        } else {
          this.hasError.set(true);
          this.isLoading.set(false);
        }
      }, 1000);
    }
  }
}
