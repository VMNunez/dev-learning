import { Component, computed, inject } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage {
  private transactionService = inject(TransactionService);

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
}
