import { Component, input, output } from '@angular/core';
import { Filter } from '../../../../models/transaction.model';

@Component({
  selector: 'app-filter-bar',
  imports: [],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.css',
})
export class FilterBar {
  current = input.required<Filter>();
  filterChange = output<Filter>();
}
