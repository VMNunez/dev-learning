import { Component, output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import type { Transaction } from '../../../../models/transaction.model';

@Component({
  selector: 'app-transaction-form',
  imports: [ReactiveFormsModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.css',
})
export class TransactionForm {
  transactionForm = new FormGroup({
    description: new FormControl('', Validators.required),
    amount: new FormControl(0, Validators.required),
    type: new FormControl('income', Validators.required),
    date: new FormControl(new Date().toISOString().split('T')[0], Validators.required),
  });

  transactionSubmit = output<Transaction>();

  onSubmit() {
    this.transactionSubmit.emit(this.transactionForm.value as Transaction);
  }
}
