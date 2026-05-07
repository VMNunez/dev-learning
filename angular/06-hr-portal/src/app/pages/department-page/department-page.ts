import { Component, inject } from '@angular/core';
import { DepartmentService } from '../../core/services/department.service';
import { DepartmentList } from './components/department-list/department-list';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../shared/components/confirm-dialog/confirm-dialog';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-department-page',
  imports: [DepartmentList, MatButtonModule, RouterLink, MatCardModule],
  templateUrl: './department-page.html',
  styleUrl: './department-page.css',
})
export class DepartmentPage {
  private departmentService = inject(DepartmentService);
  private dialog = inject(MatDialog);
  departments = this.departmentService.departments;

  onDelete(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '500px',
      autoFocus: false,
      data: {
        title: 'Delete Department',
        message: 'Are you sure you want to delete this department?',
        cancelLabel: 'Cancel',
        confirmLabel: 'Delete',
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (confirmed) => {
        if (confirmed) {
          this.departmentService.deleteDepartment(id);
        }
      },
    });
  }
}
