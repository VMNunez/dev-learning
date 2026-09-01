export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

export type NewTransaction = Omit<Transaction, 'id'>;

export type Filter = 'all' | 'income' | 'expense';
