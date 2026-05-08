import type { Currency } from '@/types/expense';

const CURRENCY_LOCALE: Record<Currency, string> = {
  PLN: 'pl-PL',
  EUR: 'de-DE',
  USD: 'en-US',
};

export function formatAmount(value: number, currency: Currency = 'PLN'): string {
  return new Intl.NumberFormat(CURRENCY_LOCALE[currency], {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('pl-PL', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  }).format(new Date(iso));
}

export function formatShortDate(iso: string): string {
  return new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(iso));
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
