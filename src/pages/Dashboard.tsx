import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { CategoryDonut } from '@/components/ui/CategoryDonut';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { useExpensesStore } from '@/store/expenses';
import { useSettingsStore } from '@/store/settings';
import { formatAmount, formatDate } from '@/lib/format';
import { categoryBreakdown, computePeriodTotals, trendPercent } from '@/lib/analytics';

export function Dashboard(): JSX.Element {
  const items = useExpensesStore((s) => s.items);
  const status = useExpensesStore((s) => s.status);
  const error = useExpensesStore((s) => s.error);
  const fetchAll = useExpensesStore((s) => s.fetchAll);
  const budget = useSettingsStore((s) => s.monthlyBudget);
  const currency = useSettingsStore((s) => s.currency);
  const location = useLocation();

  const loading = status === 'loading';

  const totals = useMemo(() => computePeriodTotals(items), [items]);
  const breakdown = useMemo(() => categoryBreakdown(items), [items]);
  const recent = items.slice(0, 5);

  const progress = budget > 0 ? Math.min(100, (totals.thisMonth / budget) * 100) : 0;
  const overBudget = progress > 90;

  if (status === 'error') {
    return (
      <Card className="p-8 text-center">
        <div className="text-sm text-danger font-semibold mb-2">Nie udało się pobrać danych</div>
        <div className="text-xs text-ink-500 mb-4">{error}</div>
        <button
          type="button"
          onClick={() => void fetchAll()}
          className="focus-ring inline-flex items-center gap-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white px-4 h-10 text-sm font-semibold"
        >
          Spróbuj ponownie
        </button>
      </Card>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="01 · Pulpit"
        title="Pulpit"
        subtitle="Przegląd budżetu, ostatnie wydatki i podział na kategorie."
        action={
          <Link
            to="/expenses/new"
            state={{ background: location }}
            className="focus-ring inline-flex items-center gap-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white px-4 h-10 text-sm font-semibold shadow-fab"
          >
            <Plus size={16} strokeWidth={2.4} />
            Dodaj wydatek
          </Link>
        }
      />

      <Card className="p-6 mb-6">
        <div className="caption text-ink-500 dark:text-slate-500">Wydano w tym miesiącu</div>
        {loading ? (
          <div className="mt-2 h-9 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        ) : (
          <div className="mt-1 text-3xl md:text-4xl font-bold num">
            {formatAmount(totals.thisMonth, currency)}
          </div>
        )}
        <div className="mt-1 text-sm text-ink-500 dark:text-slate-400">
          z budżetu <span className="num font-medium">{formatAmount(budget, currency)}</span>
        </div>
        <div
          className="mt-4 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Wykorzystanie budżetu miesięcznego"
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${overBudget ? 'bg-danger' : 'bg-brand-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[11px] text-ink-500 dark:text-slate-500 num">
          <span>0</span>
          <span>{Math.round(progress)}%</span>
          <span>{formatAmount(budget, currency)}</span>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
        <StatCard
          label="Dziś"
          amount={totals.today}
          trendPct={trendPercent(totals.today, totals.yesterday)}
          loading={loading}
        />
        <StatCard
          label="Tydzień"
          amount={totals.thisWeek}
          trendPct={trendPercent(totals.thisWeek, totals.lastWeek)}
          loading={loading}
        />
        <StatCard
          label="Miesiąc"
          amount={totals.thisMonth}
          trendPct={trendPercent(totals.thisMonth, totals.lastMonth)}
          loading={loading}
        />
      </div>

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="caption text-ink-500 dark:text-slate-500">Kategorie · ten miesiąc</div>
          <Link
            to="/stats"
            className="focus-ring text-xs font-semibold text-brand-600 dark:text-brand-400 rounded px-1"
          >
            Zobacz statystyki →
          </Link>
        </div>
        <CategoryDonut data={breakdown} loading={loading} />
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="caption text-ink-500 dark:text-slate-500">Ostatnie wydatki</div>
          <Link
            to="/expenses"
            className="focus-ring text-xs font-semibold text-brand-600 dark:text-brand-400 rounded px-1"
          >
            Wszystkie →
          </Link>
        </div>
        {loading && (
          <ul aria-busy="true" aria-label="Ładowanie ostatnich wydatków" className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="h-14 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </ul>
        )}
        {!loading && recent.length === 0 && (
          <div className="py-8 text-center text-sm text-ink-500">
            Brak wydatków.{' '}
            <Link
              to="/expenses/new"
              state={{ background: location }}
              className="text-brand-600 font-semibold focus-ring rounded px-1"
            >
              Dodaj pierwszy
            </Link>
            .
          </div>
        )}
        {!loading && recent.length > 0 && (
          <ul className="divide-y divide-line dark:divide-line-dark">
            {recent.map((e) => (
              <li key={e.id} className="py-3 flex items-center gap-3">
                <CategoryBadge category={e.category} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold truncate">{e.description}</div>
                  <div className="text-xs text-ink-500 dark:text-slate-400 mt-0.5">
                    {formatDate(e.date)}
                  </div>
                </div>
                <div className="text-sm font-bold num shrink-0">−{formatAmount(e.amount, currency)}</div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
