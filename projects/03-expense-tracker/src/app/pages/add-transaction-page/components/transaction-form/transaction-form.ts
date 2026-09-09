import { Component, output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import type { NewTransaction } from '../../../../models/transaction.model';

@Component({
  selector: 'app-transaction-form',
  imports: [ReactiveFormsModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.css',
})
export class TransactionForm {
  transactionForm = new FormGroup({
    description: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    type: new FormControl<'income' | 'expense' | ''>('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    date: new FormControl(this.today(), {
      nonNullable: true,
      validators: Validators.required,
    }),
  });

  transactionSubmit = output<NewTransaction>();

  onSubmit() {
    this.transactionForm.markAllAsTouched();

    if (!this.transactionForm.valid) return;

    const { description, amount, type, date } = this.transactionForm.getRawValue();

    if (amount === null || type === '') return;

    this.transactionSubmit.emit({ description, amount, type, date });
    this.transactionForm.reset({ date: this.today() });
  }

  get description() {
    return this.transactionForm.get('description');
  }
  get amount() {
    return this.transactionForm.get('amount');
  }
  get type() {
    return this.transactionForm.get('type');
  }
  get date() {
    return this.transactionForm.get('date');
  }

  private today(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
