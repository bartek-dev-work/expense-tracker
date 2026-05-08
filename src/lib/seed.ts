import type { Expense } from '@/types/expense';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export const SEED_EXPENSES: Expense[] = [
  { id: '1',  amount: 28.5,  category: 'food',      date: daysAgo(0), description: 'Lunch z pracy' },
  { id: '2',  amount: 4.4,   category: 'transport', date: daysAgo(0), description: 'Bilet MPK' },
  { id: '3',  amount: 19.99, category: 'fun',       date: daysAgo(1), description: 'Spotify' },
  { id: '4',  amount: 87.32, category: 'food',      date: daysAgo(1), description: 'Biedronka' },
  { id: '5',  amount: 240.0, category: 'bills',     date: daysAgo(2), description: 'Prąd – kwiecień' },
  { id: '6',  amount: 12.0,  category: 'transport', date: daysAgo(2), description: 'Bolt' },
  { id: '7',  amount: 55.0,  category: 'fun',       date: daysAgo(3), description: 'Kino' },
  { id: '8',  amount: 42.5,  category: 'food',      date: daysAgo(4), description: 'Apteka + obiad' },
  { id: '9',  amount: 39.99, category: 'fun',       date: daysAgo(5), description: 'Netflix' },
  { id: '10', amount: 110.0, category: 'bills',     date: daysAgo(6), description: 'Internet' },
  { id: '11', amount: 21.0,  category: 'food',      date: daysAgo(7), description: 'Żabka' },
  { id: '12', amount: 6.8,   category: 'transport', date: daysAgo(8), description: 'Bilet MPK' },
];
