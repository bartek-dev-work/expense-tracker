import type { Expense } from '@/types/expense';
import { getCategory } from '@/lib/categories';

const HEADER = ['data', 'kwota', 'kategoria', 'opis', 'notatka'] as const;

function escapeCell(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function expensesToCsv(items: Expense[]): string {
  const rows = items.map((e) => [
    e.date,
    e.amount.toFixed(2).replace('.', ','),
    getCategory(e.category).label,
    e.description,
    e.note ?? '',
  ]);
  return [HEADER, ...rows].map((row) => row.map(escapeCell).join(';')).join('\r\n');
}

export function downloadFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([`﻿${content}`], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
