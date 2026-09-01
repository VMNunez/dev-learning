import { Component, computed, inject, signal } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { RouterLink } from '@angular/router';
import { SummaryCard } from './components/summary-card/summary-card';
import { FilterBar } from './components/filter-bar/filter-bar';
import { TransactionList } from './components/transaction-list/transaction-list';
import { Filter } from '../../models/transaction.model';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, SummaryCard, FilterBar, TransactionList],
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

  onDeleteTransaction(id: string) {
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
