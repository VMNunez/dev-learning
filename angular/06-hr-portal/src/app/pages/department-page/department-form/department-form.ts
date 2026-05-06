import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DepartmentService } from '../../../core/services/department.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Department } from '../../../models/department.model';

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
  editId = signal<number | null>(null);

  departmentForm = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    description: new FormControl<string>('', Validators.required),
  });

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
      } else {
        const newDepartment: Department = {
          id: Date.now(),
          ...departmentData,
        };
        this.departmentService.addDepartment(newDepartment);
      }
      this.departmentForm.markAsPristine();
      this.router.navigate(['departments']);
    }
  }
}
