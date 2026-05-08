export type CategoryId = 'food' | 'transport' | 'bills' | 'fun' | 'other';

export type Currency = 'PLN' | 'EUR' | 'USD';

export interface Expense {
  id: string;
  amount: number;
  category: CategoryId;
  date: string;
  description: string;
  note?: string;
}

export type ExpenseInput = Omit<Expense, 'id'>;
