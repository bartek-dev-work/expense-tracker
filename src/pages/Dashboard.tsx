import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { useExpensesStore } from '@/store/expenses';
import { useSettingsStore } from '@/store/settings';
import { formatAmount } from '@/lib/format';

export function Dashboard(): JSX.Element {
  const items = useExpensesStore((s) => s.items);
  const status = useExpensesStore((s) => s.status);
  const budget = useSettingsStore((s) => s.monthlyBudget);
  const currency = useSettingsStore((s) => s.currency);

  const totalThisMonth = useMemo(() => {
    const now = new Date();
    return items
      .filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, e) => sum + e.amount, 0);
  }, [items]);

  const progress = Math.min(100, (totalThisMonth / budget) * 100);

  return (
    <>
      <PageHeader
        eyebrow="01 · Pulpit"
        title="Pulpit"
        subtitle="Przegląd budżetu, ostatnie wydatki i podział na kategorie."
        action={
          <Link
            to="/expenses/new"
            className="focus-ring inline-flex items-center gap-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white px-4 h-10 text-sm font-semibold shadow-fab"
          >
            <Plus size={16} strokeWidth={2.4} />
            Dodaj wydatek
          </Link>
        }
      />

      <Card className="p-6 mb-6">
        <div className="caption text-ink-500 dark:text-slate-500">Wydano w tym miesiącu</div>
        {status === 'loading' ? (
          <div className="mt-2 h-9 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        ) : (
          <div className="mt-2 text-3xl md:text-4xl font-bold num">{formatAmount(totalThisMonth, currency)}</div>
        )}
        <div className="mt-1 text-sm text-ink-500 dark:text-slate-400">
          z budżetu <span className="num">{formatAmount(budget, currency)}</span>
        </div>
        <div
          className="mt-4 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${progress > 90 ? 'bg-danger' : 'bg-brand-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </Card>

      <Card className="p-6">
        <div className="caption text-ink-500 dark:text-slate-500 mb-3">Ostatnie wydatki</div>
        {status === 'loading' && (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        )}
        {status === 'success' && items.length === 0 && (
          <div className="py-8 text-center text-sm text-ink-500">
            Brak wydatków. <Link to="/expenses/new" className="text-brand-500 font-semibold">Dodaj pierwszy</Link>.
          </div>
        )}
        {status === 'success' && items.length > 0 && (
          <ul className="divide-y divide-line dark:divide-line-dark">
            {items.slice(0, 5).map((e) => (
              <li key={e.id} className="py-3 flex items-center justify-between gap-3">
                <span className="text-sm font-medium truncate">{e.description}</span>
                <span className="text-sm font-semibold num">−{formatAmount(e.amount, currency)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
