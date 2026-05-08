import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { useExpensesStore } from '@/store/expenses';
import { useSettingsStore } from '@/store/settings';
import { useToastStore } from '@/store/toast';
import { formatAmount, formatDate } from '@/lib/format';
import { groupByDay } from '@/lib/analytics';
import { getCategory } from '@/lib/categories';

export function Expenses(): JSX.Element {
  const items = useExpensesStore((s) => s.items);
  const status = useExpensesStore((s) => s.status);
  const error = useExpensesStore((s) => s.error);
  const fetchAll = useExpensesStore((s) => s.fetchAll);
  const remove = useExpensesStore((s) => s.remove);
  const currency = useSettingsStore((s) => s.currency);
  const push = useToastStore((s) => s.push);
  const location = useLocation();

  const groups = useMemo(() => groupByDay(items), [items]);
  const loading = status === 'loading';

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm('Usunąć ten wydatek?')) return;
    try {
      await remove(id);
      push('Usunięto wydatek');
    } catch {
      push('Nie udało się usunąć', 'error');
    }
  };

  if (status === 'error') {
    return (
      <Card className="p-8 text-center">
        <div className="text-sm text-danger font-semibold mb-2">Nie udało się pobrać wydatków</div>
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
        eyebrow="02 · Lista"
        title="Lista wydatków"
        subtitle="Wszystkie wydatki, pogrupowane po dniach. Posortowane od najnowszych."
        action={
          <Link
            to="/expenses/new"
            state={{ background: location }}
            className="focus-ring inline-flex items-center gap-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white px-4 h-10 text-sm font-semibold shadow-fab"
          >
            <Plus size={16} strokeWidth={2.4} />
            Dodaj
          </Link>
        }
      />

      {loading && (
        <div aria-busy="true" aria-label="Ładowanie listy wydatków" className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && groups.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-sm font-semibold mb-1">Brak wydatków</div>
          <div className="text-xs text-ink-500 mb-4">Zacznij od dodania pierwszego wydatku.</div>
          <Link
            to="/expenses/new"
            state={{ background: location }}
            className="focus-ring inline-flex items-center gap-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white px-4 h-10 text-sm font-semibold shadow-fab"
          >
            <Plus size={16} strokeWidth={2.4} />
            Dodaj pierwszy
          </Link>
        </Card>
      )}

      {!loading && groups.length > 0 && (
        <div className="space-y-6">
          {groups.map((group) => (
            <section key={group.date} aria-labelledby={`day-${group.date}`}>
              <div className="flex items-baseline justify-between mb-2 px-1">
                <h2
                  id={`day-${group.date}`}
                  className="text-sm font-semibold text-ink-500 dark:text-slate-400"
                >
                  {formatDate(group.date)}
                </h2>
                <span className="text-xs font-semibold num text-ink-500 dark:text-slate-500">
                  {formatAmount(group.total, currency)}
                </span>
              </div>
              <Card className="overflow-hidden">
                <ul className="divide-y divide-line dark:divide-line-dark">
                  {group.items.map((e) => (
                    <li key={e.id} className="px-3 md:px-4 py-3 flex items-center gap-3">
                      <CategoryBadge category={e.category} size="md" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold truncate">{e.description}</div>
                        <div className="text-xs text-ink-500 dark:text-slate-400 mt-0.5">
                          {getCategory(e.category).label}
                          {e.note ? ` · ${e.note}` : ''}
                        </div>
                      </div>
                      <div className="text-sm font-bold num shrink-0">
                        −{formatAmount(e.amount, currency)}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Link
                          to={`/expenses/${e.id}/edit`}
                          state={{ background: location }}
                          aria-label={`Edytuj wydatek ${e.description}`}
                          className="focus-ring p-2 rounded-lg text-ink-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Pencil size={14} strokeWidth={2.2} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => void handleDelete(e.id)}
                          aria-label={`Usuń wydatek ${e.description}`}
                          className="focus-ring p-2 rounded-lg text-ink-500 hover:text-danger hover:bg-danger/10"
                        >
                          <Trash2 size={14} strokeWidth={2.2} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
