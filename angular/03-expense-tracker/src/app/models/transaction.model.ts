export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

export type NewTransaction = Omit<Transaction, 'id'>;
