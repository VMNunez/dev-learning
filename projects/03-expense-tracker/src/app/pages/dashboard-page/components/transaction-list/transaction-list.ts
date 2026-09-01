import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Transaction } from '../../../../models/transaction.model';

@Component({
  selector: 'app-transaction-list',
  imports: [DecimalPipe],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.css',
})
export class TransactionList {
  transactions = input.required<Transaction[]>();
  deleteTransaction = output<number>();
}
