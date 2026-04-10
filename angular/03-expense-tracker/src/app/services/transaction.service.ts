import { Injectable, signal } from '@angular/core';
import { NewTransaction, Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private loadTransactions(): Transaction[] {
    const data = localStorage.getItem('transactions');
    return data ? JSON.parse(data) : [];
  }

  transactionList = signal<Transaction[]>(this.loadTransactions());

  addTransaction(newTransaction: NewTransaction): void {
    const transaction = { ...newTransaction, id: Date.now() };
    this.transactionList.update((transactions) => [...transactions, transaction]);
    localStorage.setItem('transactions', JSON.stringify(this.transactionList()));
  }

  deleteTransaction(deleteId: number): void {
    this.transactionList.update((transactions) =>
      transactions.filter((transaction) => transaction.id !== deleteId),
    );
    localStorage.setItem('transactions', JSON.stringify(this.transactionList()));
  }
}
