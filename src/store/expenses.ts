import { create } from 'zustand';
import type { Expense, ExpenseInput } from '@/types/expense';
import * as api from '@/api/expenses';

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

interface ExpensesState {
  items: Expense[];
  status: AsyncStatus;
  error: string | null;
  fetchAll: () => Promise<void>;
  add: (input: ExpenseInput) => Promise<Expense>;
  update: (id: string, input: ExpenseInput) => Promise<Expense>;
  remove: (id: string) => Promise<void>;
}

export const useExpensesStore = create<ExpensesState>((set) => ({
  items: [],
  status: 'idle',
  error: null,

  fetchAll: async () => {
    set({ status: 'loading', error: null });
    try {
      const items = await api.listExpenses();
      set({ items, status: 'success' });
    } catch (err) {
      set({ status: 'error', error: err instanceof Error ? err.message : 'Nie udało się pobrać wydatków' });
    }
  },

  add: async (input) => {
    const created = await api.createExpense(input);
    set((s) => ({ items: [created, ...s.items] }));
    return created;
  },

  update: async (id, input) => {
    const updated = await api.updateExpense(id, input);
    set((s) => ({ items: s.items.map((e) => (e.id === id ? updated : e)) }));
    return updated;
  },

  remove: async (id) => {
    await api.deleteExpense(id);
    set((s) => ({ items: s.items.filter((e) => e.id !== id) }));
  },
}));
