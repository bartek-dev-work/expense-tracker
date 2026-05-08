import type { CategoryId, Expense } from '@/types/expense';

export type Period = 'week' | 'month' | 'year';

export interface PeriodTotals {
  today: number;
  yesterday: number;
  thisWeek: number;
  lastWeek: number;
  thisMonth: number;
  lastMonth: number;
}

export interface CategoryTotal {
  category: CategoryId;
  total: number;
}

export interface DayGroup {
  date: string;
  total: number;
  items: Expense[];
}

export interface Bucket {
  key: string;
  label: string;
  total: number;
}

export interface PeriodAnalysis {
  period: Period;
  rangeLabel: string;
  total: number;
  prevTotal: number;
  items: Expense[];
  buckets: Bucket[];
  byCategory: CategoryTotal[];
  avgPerDay: number;
  biggest: Expense | null;
  daysInPeriod: number;
}

const MS_DAY = 24 * 60 * 60 * 1000;

const PL_DAYS_SHORT = ['niedz.', 'pon.', 'wt.', 'śr.', 'czw.', 'pt.', 'sob.'];
const PL_MONTHS_SHORT = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];
const PL_MONTHS_LONG = [
  'styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec',
  'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień',
];

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfWeek(d: Date): Date {
  const x = startOfDay(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  return x;
}

function startOfMonth(d: Date): Date {
  const x = startOfDay(d);
  x.setDate(1);
  return x;
}

function isBetween(date: Date, fromInclusive: Date, toExclusive: Date): boolean {
  return date >= fromInclusive && date < toExclusive;
}

function sumIn(items: Expense[], from: Date, to: Date): number {
  return items.reduce((sum, e) => {
    const d = new Date(e.date);
    return isBetween(d, from, to) ? sum + e.amount : sum;
  }, 0);
}

function itemsIn(items: Expense[], from: Date, to: Date): Expense[] {
  return items.filter((e) => {
    const d = new Date(e.date);
    return isBetween(d, from, to);
  });
}

export function computePeriodTotals(items: Expense[], now: Date = new Date()): PeriodTotals {
  const today = startOfDay(now);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const weekStart = startOfWeek(now);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const lastWeekStart = new Date(weekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  const monthStart = startOfMonth(now);
  const nextMonthStart = new Date(monthStart);
  nextMonthStart.setMonth(nextMonthStart.getMonth() + 1);

  const lastMonthStart = new Date(monthStart);
  lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

  return {
    today: sumIn(items, today, tomorrow),
    yesterday: sumIn(items, yesterday, today),
    thisWeek: sumIn(items, weekStart, weekEnd),
    lastWeek: sumIn(items, lastWeekStart, weekStart),
    thisMonth: sumIn(items, monthStart, nextMonthStart),
    lastMonth: sumIn(items, lastMonthStart, monthStart),
  };
}

export function trendPercent(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

export function categoryBreakdown(items: Expense[]): CategoryTotal[] {
  const map = new Map<CategoryId, number>();
  for (const e of items) {
    map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
  }
  return [...map.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

export function groupByDay(items: Expense[]): DayGroup[] {
  const map = new Map<string, Expense[]>();
  for (const e of items) {
    const list = map.get(e.date);
    if (list) list.push(e);
    else map.set(e.date, [e]);
  }
  return [...map.entries()]
    .map(([date, group]) => ({
      date,
      items: group,
      total: group.reduce((s, e) => s + e.amount, 0),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

interface PeriodRange {
  start: Date;
  end: Date;
  prevStart: Date;
  prevEnd: Date;
  buckets: Bucket[];
  rangeLabel: string;
}

function buildPeriodRange(period: Period, anchor: Date): PeriodRange {
  if (period === 'week') {
    const start = startOfWeek(anchor);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    const prevStart = new Date(start);
    prevStart.setDate(prevStart.getDate() - 7);
    const buckets: Bucket[] = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return { key: d.toISOString().slice(0, 10), label: PL_DAYS_SHORT[d.getDay()] ?? '', total: 0 };
    });
    const lastDay = new Date(start);
    lastDay.setDate(lastDay.getDate() + 6);
    const rangeLabel = `${start.getDate()}–${lastDay.getDate()} ${PL_MONTHS_LONG[start.getMonth()]}`;
    return { start, end, prevStart, prevEnd: start, buckets, rangeLabel };
  }

  if (period === 'month') {
    const start = startOfMonth(anchor);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    const prevStart = new Date(start);
    prevStart.setMonth(prevStart.getMonth() - 1);
    const days = Math.round((end.getTime() - start.getTime()) / MS_DAY);
    const buckets: Bucket[] = Array.from({ length: days }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return { key: d.toISOString().slice(0, 10), label: String(i + 1), total: 0 };
    });
    const rangeLabel = `${PL_MONTHS_LONG[start.getMonth()]} ${start.getFullYear()}`;
    return { start, end, prevStart, prevEnd: start, buckets, rangeLabel };
  }

  const start = new Date(anchor.getFullYear(), 0, 1);
  const end = new Date(anchor.getFullYear() + 1, 0, 1);
  const prevStart = new Date(anchor.getFullYear() - 1, 0, 1);
  const buckets: Bucket[] = Array.from({ length: 12 }, (_, i) => ({
    key: `${anchor.getFullYear()}-${String(i + 1).padStart(2, '0')}`,
    label: PL_MONTHS_SHORT[i] ?? '',
    total: 0,
  }));
  const rangeLabel = String(anchor.getFullYear());
  return { start, end, prevStart, prevEnd: start, buckets, rangeLabel };
}

export function analyzePeriod(
  items: Expense[],
  period: Period,
  anchor: Date = new Date(),
): PeriodAnalysis {
  const range = buildPeriodRange(period, anchor);
  const inRange = itemsIn(items, range.start, range.end);
  const prevTotal = sumIn(items, range.prevStart, range.prevEnd);

  const bucketMap = new Map(range.buckets.map((b) => [b.key, { ...b }]));
  for (const e of inRange) {
    const key = period === 'year' ? e.date.slice(0, 7) : e.date;
    const bucket = bucketMap.get(key);
    if (bucket) bucket.total += e.amount;
  }
  const buckets = [...bucketMap.values()];
  const total = inRange.reduce((s, e) => s + e.amount, 0);
  const daysInPeriod =
    period === 'year' ? 12 : Math.round((range.end.getTime() - range.start.getTime()) / MS_DAY);
  const avgPerDay = total / Math.max(1, daysInPeriod);
  const biggest = inRange.reduce<Expense | null>(
    (max, e) => (max === null || e.amount > max.amount ? e : max),
    null,
  );

  return {
    period,
    rangeLabel: range.rangeLabel,
    total,
    prevTotal,
    items: inRange,
    buckets,
    byCategory: categoryBreakdown(inRange),
    avgPerDay,
    biggest,
    daysInPeriod,
  };
}
