import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { useExpensesStore } from '@/store/expenses';
import { useSettingsStore } from '@/store/settings';
import { formatAmount, formatDate } from '@/lib/format';

export function Expenses(): JSX.Element {
  const items = useExpensesStore((s) => s.items);
  const status = useExpensesStore((s) => s.status);
  const currency = useSettingsStore((s) => s.currency);

  return (
    <>
      <PageHeader
        eyebrow="02 · Lista"
        title="Lista wydatków"
        subtitle="Wszystkie wydatki, posortowane od najnowszych."
        action={
          <Link
            to="/expenses/new"
            className="focus-ring inline-flex items-center gap-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white px-4 h-10 text-sm font-semibold shadow-fab"
          >
            <Plus size={16} strokeWidth={2.4} />
            Dodaj
          </Link>
        }
      />

      <Card className="p-2 md:p-4">
        {status === 'loading' && (
          <div className="space-y-2 p-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        )}
        {status === 'success' && items.length === 0 && (
          <div className="py-12 text-center text-sm text-ink-500">Brak wydatków w tym okresie.</div>
        )}
        {status === 'success' && items.length > 0 && (
          <ul className="divide-y divide-line dark:divide-line-dark">
            {items.map((e) => (
              <li key={e.id} className="px-3 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{e.description}</div>
                  <div className="text-xs text-ink-500 dark:text-slate-400 mt-0.5">
                    {formatDate(e.date)} · {e.category}
                  </div>
                </div>
                <div className="text-sm font-bold num">−{formatAmount(e.amount, currency)}</div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
