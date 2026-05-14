import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DepartmentService } from '../../../core/services/department.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Department } from '../../../models/department.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-department-form',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInputModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './department-form.html',
  styleUrl: './department-form.css',
})
export class DepartmentForm implements OnInit {
  private departmentService = inject(DepartmentService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  editId = signal<number | null>(null);

  departmentForm = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    description: new FormControl<string>('', Validators.required),
  });

  get name() {
    return this.departmentForm.get('name');
  }

  ngOnInit(): void {
    const rawId = this.route.snapshot.paramMap.get('id');
    if (rawId) {
      this.editId.set(Number(rawId));
      const department = this.departmentService.getById(Number(rawId));
      if (department) {
        this.departmentForm.patchValue({
          name: department.name,
          description: department.description,
        });
      }
    }
  }

  onSubmit() {
    this.departmentForm.markAllAsTouched();

    if (this.departmentForm.valid) {
      const formValue = this.departmentForm.value;

      const isDuplicate = this.departmentService.nameExists(
        formValue.name as string,
        this.editId() ?? undefined,
      );

      if (isDuplicate) {
        this.departmentForm.controls.name.setErrors({ duplicateName: true });
        return;
      }

      const departmentData: Omit<Department, 'id'> = {
        name: formValue.name as string,
        description: formValue.description as string,
      };

      if (this.editId()) {
        const updateDepartment = {
          id: this.editId() as number,
          ...departmentData,
        };

        this.departmentService.editDepartment(updateDepartment);
        this.snackBar.open('Department updated', 'Close', { duration: 3000 });
      } else {
        const newDepartment: Department = {
          id: Date.now(),
          ...departmentData,
        };

        this.departmentService.addDepartment(newDepartment);
        this.snackBar.open('Department added', 'Close', { duration: 3000 });
      }
      this.departmentForm.markAsPristine();
      this.router.navigate(['departments']);
    }
  }
}
