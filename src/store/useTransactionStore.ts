import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction } from '../types';
import { mockTransactions } from '../data/mockData';

interface TransactionFilters {
  search: string;
  categories: string[];
  type: 'all' | 'income' | 'expense';
  dateRange: { from: string | null; to: string | null };
  amountRange: { min: number | null; max: number | null };
}

interface TransactionStore {
  transactions: Transaction[];
  filters: TransactionFilters;
  sortConfig: { key: keyof Transaction; direction: 'asc' | 'desc' };
  pagination: { page: number; pageSize: number };

  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setFilter: <K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) => void;
  resetFilters: () => void;
  setSort: (key: keyof Transaction) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

const defaultFilters: TransactionFilters = {
  search: '',
  categories: [],
  type: 'all',
  dateRange: { from: null, to: null },
  amountRange: { min: null, max: null },
};

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set) => ({
      transactions: mockTransactions,
      filters: defaultFilters,
      sortConfig: { key: 'date', direction: 'desc' },
      pagination: { page: 1, pageSize: 10 },

      addTransaction: (t) =>
        set((state) => ({
          transactions: [
            { ...t, id: `TXN-CUSTOM-${Date.now()}` },
            ...state.transactions,
          ],
        })),

      updateTransaction: (id, t) =>
        set((state) => ({
          transactions: state.transactions.map((txn) =>
            txn.id === id ? { ...txn, ...t } : txn
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((txn) => txn.id !== id),
        })),

      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
          pagination: { ...state.pagination, page: 1 },
        })),

      resetFilters: () =>
        set((state) => ({
          filters: defaultFilters,
          pagination: { ...state.pagination, page: 1 },
        })),

      setSort: (key) =>
        set((state) => ({
          sortConfig: {
            key,
            direction:
              state.sortConfig.key === key && state.sortConfig.direction === 'desc'
                ? 'asc'
                : 'desc',
          },
        })),

      setPage: (page) =>
        set((state) => ({
          pagination: { ...state.pagination, page },
        })),

      setPageSize: (pageSize) =>
        set((state) => ({
          pagination: { ...state.pagination, pageSize, page: 1 },
        })),
    }),
    {
      name: 'zorvyn-transactions',
      partialize: (state) => ({
        transactions: state.transactions,
      }),
    }
  )
);
