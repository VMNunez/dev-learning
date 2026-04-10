import { Component, computed, inject, signal } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';

type Filter = 'all' | 'income' | 'expense';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage {
  private transactionService = inject(TransactionService);
  currentFilter = signal<Filter>('all');

  transactions = this.transactionService.transactionList;

  totalIncome = computed(() =>
    this.transactions()
      .filter((transaction) => transaction.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0),
  );

  totalExpense = computed(() =>
    this.transactions()
      .filter((transaction) => transaction.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0),
  );

  balance = computed(() => this.totalIncome() - this.totalExpense());

  onDeleteTransaction(id: number) {
    this.transactionService.deleteTransaction(id);
  }

  filteredTransactions = computed(() => {
    switch (this.currentFilter()) {
      case 'all':
        return this.transactions();

      case 'income':
        return this.transactions().filter((transaction) => transaction.type === 'income');

      case 'expense':
        return this.transactions().filter((transaction) => transaction.type === 'expense');
    }
  });
}
