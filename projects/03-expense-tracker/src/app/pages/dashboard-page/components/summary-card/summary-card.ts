import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

type Tone = 'neutral' | 'income' | 'expense';

@Component({
  selector: 'app-summary-card',
  imports: [DecimalPipe],
  templateUrl: './summary-card.html',
  styleUrl: './summary-card.css',
})
export class SummaryCard {
  label = input.required<string>();
  amount = input.required<number>();
  tone = input<Tone>('neutral');
  prefix = input<string>('');
}
