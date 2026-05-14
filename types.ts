export type Category = 'food' | 'transport' | 'data' | 'fun' | 'other';

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  date: string; // ISO string
  description?: string;
}

export type FilterType = 'this_week' | 'last_week' | 'all_time';
