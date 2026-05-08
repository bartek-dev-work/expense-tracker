import type { CategoryId } from '@/types/expense';

export interface Category {
  id: CategoryId;
  label: string;
  color: string;
  icon: string;
}

export const CATEGORIES: readonly Category[] = [
  { id: 'food',      label: 'Jedzenie',  color: '#F97316', icon: 'utensils' },
  { id: 'transport', label: 'Transport', color: '#06B6D4', icon: 'bus' },
  { id: 'bills',     label: 'Rachunki',  color: '#8B5CF6', icon: 'receipt' },
  { id: 'fun',       label: 'Rozrywka',  color: '#EC4899', icon: 'music' },
  { id: 'other',     label: 'Inne',      color: '#64748B', icon: 'tag' },
] as const;

export function getCategory(id: CategoryId): Category {
  const cat = CATEGORIES.find((c) => c.id === id);
  if (!cat) throw new Error(`Unknown category: ${id}`);
  return cat;
}
