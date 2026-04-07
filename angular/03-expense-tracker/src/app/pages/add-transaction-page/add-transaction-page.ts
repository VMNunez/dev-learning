import { Component, inject } from '@angular/core';
import { TransactionForm } from './components/transaction-form/transaction-form';
import { TransactionService } from '../../services/transaction.service';
import type { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-add-transaction-page',
  imports: [TransactionForm],
  templateUrl: './add-transaction-page.html',
  styleUrl: './add-transaction-page.css',
})
export class AddTransactionPage {
  private transactionService = inject(TransactionService);

  onTransactionSubmit(transaction: Transaction) {
    this.transactionService.addTransaction(transaction);
  }
}
