import { useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { useExpensesStore } from '@/store/expenses';
import { useSettingsStore } from '@/store/settings';
import { formatAmount } from '@/lib/format';
import { CATEGORIES, getCategory } from '@/lib/categories';
import type { CategoryId } from '@/types/expense';

export function Stats(): JSX.Element {
  const items = useExpensesStore((s) => s.items);
  const status = useExpensesStore((s) => s.status);
  const currency = useSettingsStore((s) => s.currency);

  const dailyTotals = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of items) {
      map.set(e.date, (map.get(e.date) ?? 0) + e.amount);
    }
    return [...map.entries()]
      .map(([date, total]) => ({ date: date.slice(5), total: Math.round(total * 100) / 100 }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [items]);

  const byCategory = useMemo(() => {
    const map = new Map<CategoryId, number>();
    for (const e of items) {
      map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
    }
    return CATEGORIES.map((c) => ({
      id: c.id,
      label: c.label,
      color: c.color,
      total: map.get(c.id) ?? 0,
    })).sort((a, b) => b.total - a.total);
  }, [items]);

  const total = byCategory.reduce((s, c) => s + c.total, 0);

  return (
    <>
      <PageHeader
        eyebrow="04 · Statystyki"
        title="Statystyki"
        subtitle="Trend wydatków dziennych i podział kategorii."
      />

      <Card className="p-6 mb-6">
        <div className="caption text-ink-500 dark:text-slate-500 mb-3">Dzienne wydatki</div>
        {status === 'loading' ? (
          <div className="h-64 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyTotals} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: number) => formatAmount(value, currency)}
                  cursor={{ fill: 'rgba(99,102,241,0.08)' }}
                />
                <Bar dataKey="total" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <div className="caption text-ink-500 dark:text-slate-500 mb-3">Top kategorie</div>
        <ul className="space-y-3">
          {byCategory.map((c) => {
            const pct = total === 0 ? 0 : Math.round((c.total / total) * 100);
            return (
              <li key={c.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <span className="w-3 h-3 rounded-full" style={{ background: getCategory(c.id).color }} aria-hidden />
                    {c.label}
                  </span>
                  <span className="num font-semibold">{formatAmount(c.total, currency)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.color }} />
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </>
  );
}
