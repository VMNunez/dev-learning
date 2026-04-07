import { Component, inject } from '@angular/core';
import { TransactionForm } from './components/transaction-form/transaction-form';
import { TransactionService } from '../../services/transaction.service';
import type { NewTransaction } from '../../models/transaction.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-transaction-page',
  imports: [TransactionForm],
  templateUrl: './add-transaction-page.html',
  styleUrl: './add-transaction-page.css',
})
export class AddTransactionPage {
  private transactionService = inject(TransactionService);
  private router = inject(Router);

  onTransactionSubmit(transaction: NewTransaction) {
    this.transactionService.addTransaction(transaction);
    this.router.navigate(['/']);
  }
}
