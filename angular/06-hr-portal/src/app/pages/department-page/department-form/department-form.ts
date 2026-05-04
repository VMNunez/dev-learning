import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-department-form',
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatInputModule, MatButtonModule],
  templateUrl: './department-form.html',
  styleUrl: './department-form.css',
})
export class DepartmentForm {
  departmentForm = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    description: new FormControl<string>(''),
  });

  onSubmit() {}
}
