import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { useSettingsStore } from '@/store/settings';
import type { Currency } from '@/types/expense';
import { useToastStore } from '@/store/toast';

export function Settings(): JSX.Element {
  const dark = useSettingsStore((s) => s.dark);
  const toggleDark = useSettingsStore((s) => s.toggleDark);
  const monthlyBudget = useSettingsStore((s) => s.monthlyBudget);
  const setMonthlyBudget = useSettingsStore((s) => s.setMonthlyBudget);
  const currency = useSettingsStore((s) => s.currency);
  const setCurrency = useSettingsStore((s) => s.setCurrency);
  const notifications = useSettingsStore((s) => s.notifications);
  const setNotifications = useSettingsStore((s) => s.setNotifications);
  const push = useToastStore((s) => s.push);

  return (
    <>
      <PageHeader
        eyebrow="05 · Ustawienia"
        title="Ustawienia"
        subtitle="Profil, budżet, motyw i powiadomienia. Zmiany zapisują się od razu w localStorage."
      />

      <Card className="divide-y divide-line dark:divide-line-dark max-w-xl">
        <Row label="Budżet miesięczny">
          <input
            type="number"
            min={0}
            step={50}
            value={monthlyBudget}
            onChange={(e) => setMonthlyBudget(Number(e.target.value))}
            onBlur={() => push('Zapisano budżet')}
            className="focus-ring w-32 h-9 px-3 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-slate-900 text-right num"
          />
        </Row>

        <Row label="Waluta">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="focus-ring h-9 px-3 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-slate-900"
          >
            <option value="PLN">PLN — Złoty</option>
            <option value="EUR">EUR — Euro</option>
            <option value="USD">USD — Dolar</option>
          </select>
        </Row>

        <Row label="Ciemny motyw">
          <Toggle checked={dark} onChange={toggleDark} ariaLabel="Przełącz motyw" />
        </Row>

        <Row label="Powiadomienia">
          <Toggle
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
            ariaLabel="Przełącz powiadomienia"
          />
        </Row>
      </Card>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  onChange: () => void;
  ariaLabel: string;
}): JSX.Element {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onChange}
      className={[
        'focus-ring relative h-6 w-11 rounded-full transition-colors',
        checked ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700',
      ].join(' ')}
    >
      <span
        className={[
          'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0',
        ].join(' ')}
      />
    </button>
  );
}
