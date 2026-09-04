import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Params } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stat-card',
  imports: [MatCardModule, MatIconModule, RouterLink],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
})
export class StatCard {
  icon = input.required<string>();
  label = input.required<string>();
  value = input.required<number>();
  link = input.required<string>();
  queryParams = input<Params | undefined>(undefined);
}
