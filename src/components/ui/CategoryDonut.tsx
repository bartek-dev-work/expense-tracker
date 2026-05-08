import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { getCategory } from '@/lib/categories';
import { formatAmount } from '@/lib/format';
import { useSettingsStore } from '@/store/settings';
import type { CategoryTotal } from '@/lib/analytics';

interface CategoryDonutProps {
  data: CategoryTotal[];
  loading?: boolean;
}

export function CategoryDonut({ data, loading = false }: CategoryDonutProps): JSX.Element {
  const currency = useSettingsStore((s) => s.currency);
  const total = data.reduce((s, d) => s + d.total, 0);

  if (loading) {
    return <div className="h-64 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />;
  }

  if (data.length === 0 || total === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-ink-500">
        Brak danych do wykresu
      </div>
    );
  }

  const chartSummary = `Wykres kołowy kategorii. ${data
    .map((d) => `${getCategory(d.category).label}: ${formatAmount(d.total, currency)}`)
    .join('. ')}.`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <p className="sr-only">{chartSummary}</p>
      <div className="h-64 relative" {...({ inert: '' } as { inert: string })}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              innerRadius={60}
              outerRadius={96}
              paddingAngle={2}
              stroke="none"
              isAnimationActive
              animationDuration={600}
            >
              {data.map((entry) => (
                <Cell key={entry.category} fill={getCategory(entry.category).color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatAmount(value, currency)}
              contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="caption text-ink-500 dark:text-slate-500">Razem</span>
          <span className="text-xl font-bold num">{formatAmount(total, currency)}</span>
        </div>
      </div>

      <ul className="space-y-2.5">
        {data.map((d) => {
          const cat = getCategory(d.category);
          const pct = Math.round((d.total / total) * 100);
          return (
            <li key={d.category} className="flex items-center gap-3 text-sm">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: cat.color }}
                aria-hidden
              />
              <span className="font-medium flex-1 truncate">{cat.label}</span>
              <span className="num font-semibold">{formatAmount(d.total, currency)}</span>
              <span className="text-xs text-ink-500 dark:text-slate-400 num w-10 text-right">{pct}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
