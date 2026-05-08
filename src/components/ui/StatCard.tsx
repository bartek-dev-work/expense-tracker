import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Card } from './Card';
import { formatAmount } from '@/lib/format';
import { useSettingsStore } from '@/store/settings';

interface StatCardProps {
  label: string;
  amount: number;
  trendPct: number | null;
  loading?: boolean;
}

export function StatCard({ label, amount, trendPct, loading = false }: StatCardProps): JSX.Element {
  const currency = useSettingsStore((s) => s.currency);

  const isUp = trendPct !== null && trendPct > 0;
  const isDown = trendPct !== null && trendPct < 0;
  const trendColor = isUp ? 'text-danger' : isDown ? 'text-ok' : 'text-ink-500';

  return (
    <Card className="p-4 transition-transform hover:-translate-y-0.5">
      <div className="caption text-ink-500 dark:text-slate-500">{label}</div>
      {loading ? (
        <div className="mt-2 h-7 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      ) : (
        <div className="mt-1.5 text-xl md:text-2xl font-bold num">{formatAmount(amount, currency)}</div>
      )}
      <div className={`mt-1 inline-flex items-center gap-0.5 text-[12px] font-semibold ${trendColor}`}>
        {isUp && <ArrowUpRight size={12} strokeWidth={2.6} />}
        {isDown && <ArrowDownRight size={12} strokeWidth={2.6} />}
        {trendPct === null ? '—' : `${Math.abs(trendPct)}%`}
        <span className="text-ink-500 dark:text-slate-500 font-medium ml-1">vs poprz.</span>
      </div>
    </Card>
  );
}
