import { effect, Injectable, signal } from '@angular/core';
import { NewTransaction, Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly STORAGE_KEY = 'transactions';

  transactionList = signal<Transaction[]>(this.loadTransactions());

  constructor() {
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.transactionList()));
    });
  }

  addTransaction(newTransaction: NewTransaction): void {
    const transaction = { ...newTransaction, id: crypto.randomUUID() };
    this.transactionList.update((transactions) => [...transactions, transaction]);
  }

  deleteTransaction(deleteId: string): void {
    this.transactionList.update((transactions) =>
      transactions.filter((transaction) => transaction.id !== deleteId),
    );
  }

  private loadTransactions(): Transaction[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];

    try {
      const parsed = JSON.parse(data);

      if (!Array.isArray(parsed)) {
        console.error('Stored transactions are not an array; starting empty.', parsed);
        return [];
      }

      return parsed;
    } catch (error) {
      console.error('Stored transactions could not be parsed; starting empty.', error);
      return [];
    }
  }
}
