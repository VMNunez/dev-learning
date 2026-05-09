import {
  AfterViewInit,
  Component,
  computed,
  effect,
  input,
  output,
  ViewChild,
} from '@angular/core';
import type { LeaveRequest, LeaveRequestStatus } from '../../../../models/leave-request.model';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DatePipe, NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-leave-request-table',
  imports: [
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatPaginatorModule,
    DatePipe,
    NgClass,
    MatButtonModule,
  ],
  templateUrl: './leave-request-table.html',
  styleUrl: './leave-request-table.css',
})
export class LeaveRequestTable implements AfterViewInit {
  requests = input<LeaveRequest[]>([]);
  role = input<string>('');
  datasource = new MatTableDataSource<LeaveRequest>([]);
  statusChange = output<{ id: number; status: LeaveRequestStatus }>();

  displayColumns = computed(() => {
    const cols = ['reason', 'startDate', 'endDate', 'status', 'actions'];

    return this.role() === 'admin' ? ['employeeEmail', ...cols] : cols;
  });

  constructor() {
    effect(() => {
      this.datasource.data = this.requests();
    });
  }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  onStatusChange(id: number, status: LeaveRequestStatus) {
    this.statusChange.emit({ id, status });
  }
}
