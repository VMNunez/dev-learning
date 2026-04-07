import { Injectable, signal } from '@angular/core';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  transactionList = signal<Transaction[]>([]);

  addTransaction(newTransaction: Transaction): void {
    const transaction = { ...newTransaction, id: Date.now() };
    this.transactionList.update((transactions) => [...transactions, transaction]);
  }

  deleteTransaction(deleteId: number): void {
    this.transactionList.update((transactions) =>
      transactions.filter((transaction) => transaction.id !== deleteId),
    );
  }
}
