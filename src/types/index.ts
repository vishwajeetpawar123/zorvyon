export type Category =
  | 'salary' | 'freelance' | 'investment'
  | 'housing' | 'groceries' | 'utilities'
  | 'transportation' | 'entertainment' | 'dining'
  | 'shopping' | 'healthcare' | 'subscriptions'
  | 'education' | 'other';

export interface Transaction {
  id: string;
  date: string;           // ISO date string
  description: string;
  category: Category;
  type: 'income' | 'expense';
  amount: number;         // Always positive, type determines sign
  status: 'completed' | 'pending';
}

export type Role = 'viewer' | 'admin';
export type Theme = 'dark' | 'light';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY';

export interface LinkedBank {
  id: number;
  name: string;
  type: string;
  masked: string;
}

export interface CategoryStat {
  category: Category;
  total: number;
  percentage: number;
  count: number;
  color: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral' | 'warning';
  value: string | number;
  icon: string;
}
