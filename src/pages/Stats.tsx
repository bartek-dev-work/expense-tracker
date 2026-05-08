import { useMemo, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { useExpensesStore } from '@/store/expenses';
import { useSettingsStore } from '@/store/settings';
import { formatAmount, formatDate } from '@/lib/format';
import { analyzePeriod, trendPercent, type Period } from '@/lib/analytics';
import { getCategory } from '@/lib/categories';

const PERIOD_OPTIONS = [
  { value: 'week',  label: 'Tydzień' },
  { value: 'month', label: 'Miesiąc' },
  { value: 'year',  label: 'Rok' },
] as const satisfies ReadonlyArray<{ value: Period; label: string }>;

const COMPARISON_LABEL: Record<Period, string> = {
  week: 'Vs poprzedni tydzień',
  month: 'Vs poprzedni miesiąc',
  year: 'Vs poprzedni rok',
};

export function Stats(): JSX.Element {
  const [period, setPeriod] = useState<Period>('month');
  const items = useExpensesStore((s) => s.items);
  const status = useExpensesStore((s) => s.status);
  const error = useExpensesStore((s) => s.error);
  const fetchAll = useExpensesStore((s) => s.fetchAll);
  const currency = useSettingsStore((s) => s.currency);

  const analysis = useMemo(() => analyzePeriod(items, period), [items, period]);
  const trend = trendPercent(analysis.total, analysis.prevTotal);
  const diff = analysis.total - analysis.prevTotal;
  const loading = status === 'loading';

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
        eyebrow="04 · Statystyki"
        title="Statystyki"
        subtitle="Trend wydatków i podział kategorii w wybranym okresie."
        action={
          <SegmentedControl<Period>
            value={period}
            onChange={setPeriod}
            options={PERIOD_OPTIONS}
            ariaLabel="Wybór okresu"
          />
        }
      />

      <Card className="p-6 mb-6">
        <div className="flex items-baseline justify-between mb-1">
          <div className="caption text-ink-500 dark:text-slate-500">{analysis.rangeLabel}</div>
          <div className="text-xs text-ink-500 dark:text-slate-500">{analysis.items.length} wydatków</div>
        </div>
        <div className="text-3xl font-bold num">{formatAmount(analysis.total, currency)}</div>

        {loading ? (
          <div className="mt-4 h-64 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
        ) : analysis.items.length === 0 ? (
          <div className="mt-4 h-64 flex items-center justify-center text-sm text-ink-500">
            Brak wydatków w tym okresie
          </div>
        ) : (
          <>
            <p className="sr-only">
              Wykres słupkowy wydatków, {analysis.rangeLabel}, suma {formatAmount(analysis.total, currency)}.
              {analysis.buckets
                .filter((b) => b.total > 0)
                .map((b) => ` ${b.label}: ${formatAmount(b.total, currency)}.`)
                .join('')}
            </p>
            <div className="mt-4 h-64" {...({ inert: '' } as { inert: string })}>
              <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysis.buckets} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  interval={period === 'month' ? 3 : 0}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip
                  formatter={(value: number) => formatAmount(value, currency)}
                  cursor={{ fill: 'rgba(99,102,241,0.08)' }}
                  contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}
                />
                <Bar dataKey="total" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            </div>
          </>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6">
        <Card className="p-5">
          <div className="caption text-ink-500 dark:text-slate-500">{COMPARISON_LABEL[period]}</div>
          <div className="mt-1.5 text-xl md:text-2xl font-bold num flex items-center gap-1">
            <ComparisonIcon trend={trend} />
            {diff >= 0 ? '+' : ''}{formatAmount(diff, currency)}
          </div>
          <div className="mt-1 text-xs text-ink-500 dark:text-slate-400 num">
            {trend === null ? 'Brak danych z poprzedniego okresu' : `${Math.abs(trend)}% różnicy`}
          </div>
        </Card>
        <Card className="p-5">
          <div className="caption text-ink-500 dark:text-slate-500">Średnia dzienna</div>
          <div className="mt-1.5 text-xl md:text-2xl font-bold num">
            {formatAmount(analysis.avgPerDay, currency)}
          </div>
          <div className="mt-1 text-xs text-ink-500 dark:text-slate-400">
            w okresie {analysis.daysInPeriod} {period === 'year' ? 'mies.' : 'dni'}
          </div>
        </Card>
        <Card className="p-5">
          <div className="caption text-ink-500 dark:text-slate-500">Największy wydatek</div>
          {analysis.biggest ? (
            <>
              <div className="mt-1.5 text-xl md:text-2xl font-bold num">
                {formatAmount(analysis.biggest.amount, currency)}
              </div>
              <div className="mt-1 text-xs text-ink-500 dark:text-slate-400 truncate">
                {analysis.biggest.description} · {formatDate(analysis.biggest.date)}
              </div>
            </>
          ) : (
            <div className="mt-1.5 text-sm text-ink-500">Brak danych</div>
          )}
        </Card>
      </div>

      <Card className="p-6">
        <div className="caption text-ink-500 dark:text-slate-500 mb-3">Top kategorie</div>
        {analysis.byCategory.length === 0 ? (
          <div className="py-8 text-center text-sm text-ink-500">
            Brak wydatków w tym okresie.
          </div>
        ) : (
          <ul className="space-y-3">
            {analysis.byCategory.map((c) => {
              const pct = analysis.total === 0 ? 0 : Math.round((c.total / analysis.total) * 100);
              const cat = getCategory(c.category);
              return (
                <li key={c.category} className="flex items-center gap-3">
                  <CategoryBadge category={c.category} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium">{cat.label}</span>
                      <span className="num font-semibold">
                        {formatAmount(c.total, currency)}{' '}
                        <span className="text-ink-500 dark:text-slate-500 font-medium">· {pct}%</span>
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: cat.color }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </>
  );
}

function ComparisonIcon({ trend }: { trend: number | null }): JSX.Element {
  if (trend === null || trend === 0) return <Minus size={20} strokeWidth={2.4} className="text-ink-500" />;
  if (trend > 0) return <ArrowUpRight size={20} strokeWidth={2.4} className="text-danger" />;
  return <ArrowDownRight size={20} strokeWidth={2.4} className="text-ok" />;
}
