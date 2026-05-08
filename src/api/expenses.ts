import type { Expense, ExpenseInput } from '@/types/expense';

const BASE = '/api/expenses';

async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export function listExpenses(): Promise<Expense[]> {
  return http<Expense[]>(BASE);
}

export function createExpense(input: ExpenseInput): Promise<Expense> {
  return http<Expense>(BASE, { method: 'POST', body: JSON.stringify(input) });
}

export function updateExpense(id: string, input: ExpenseInput): Promise<Expense> {
  return http<Expense>(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(input) });
}

export function deleteExpense(id: string): Promise<void> {
  return http<void>(`${BASE}/${id}`, { method: 'DELETE' });
}
