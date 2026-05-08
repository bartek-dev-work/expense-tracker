import { http, HttpResponse, delay } from 'msw';
import type { Expense, ExpenseInput } from '@/types/expense';
import { SEED_EXPENSES } from '@/lib/seed';

const STORAGE_KEY = 'wydatki-msw-db';

function loadDb(): Expense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Expense[];
  } catch {
    // ignore parse errors
  }
  const seeded = [...SEED_EXPENSES];
  saveDb(seeded);
  return seeded;
}

function saveDb(items: Expense[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const handlers = [
  http.get('/api/expenses', async () => {
    await delay(300);
    return HttpResponse.json(loadDb());
  }),

  http.post('/api/expenses', async ({ request }) => {
    const input = (await request.json()) as ExpenseInput;
    await delay(250);
    const db = loadDb();
    const created: Expense = { ...input, id: crypto.randomUUID() };
    const next = [created, ...db];
    saveDb(next);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.put('/api/expenses/:id', async ({ params, request }) => {
    const id = params['id'] as string;
    const input = (await request.json()) as ExpenseInput;
    await delay(250);
    const db = loadDb();
    const idx = db.findIndex((e) => e.id === id);
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    const updated: Expense = { ...input, id };
    db[idx] = updated;
    saveDb(db);
    return HttpResponse.json(updated);
  }),

  http.delete('/api/expenses/:id', async ({ params }) => {
    const id = params['id'] as string;
    await delay(200);
    const db = loadDb();
    saveDb(db.filter((e) => e.id !== id));
    return new HttpResponse(null, { status: 204 });
  }),
];
