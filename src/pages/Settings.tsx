import { useId, useState } from 'react';
import { Download, User } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { useSettingsStore } from '@/store/settings';
import type { Currency } from '@/types/expense';
import { useToastStore } from '@/store/toast';
import { useExpensesStore } from '@/store/expenses';
import { downloadFile, expensesToCsv } from '@/lib/csv';

export function Settings(): JSX.Element {
  const dark = useSettingsStore((s) => s.dark);
  const toggleDark = useSettingsStore((s) => s.toggleDark);
  const monthlyBudget = useSettingsStore((s) => s.monthlyBudget);
  const setMonthlyBudget = useSettingsStore((s) => s.setMonthlyBudget);
  const currency = useSettingsStore((s) => s.currency);
  const setCurrency = useSettingsStore((s) => s.setCurrency);
  const notifications = useSettingsStore((s) => s.notifications);
  const setNotifications = useSettingsStore((s) => s.setNotifications);
  const profileName = useSettingsStore((s) => s.profileName);
  const profileEmail = useSettingsStore((s) => s.profileEmail);
  const setProfile = useSettingsStore((s) => s.setProfile);
  const items = useExpensesStore((s) => s.items);
  const push = useToastStore((s) => s.push);

  const budgetId = useId();
  const currencyId = useId();
  const nameId = useId();
  const emailId = useId();

  const [editingProfile, setEditingProfile] = useState(false);
  const [draftName, setDraftName] = useState(profileName);
  const [draftEmail, setDraftEmail] = useState(profileEmail);

  const initials = profileName
    .split(' ')
    .map((p) => p[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleSaveProfile = (): void => {
    setProfile(draftName.trim() || profileName, draftEmail.trim() || profileEmail);
    setEditingProfile(false);
    push('Zapisano profil');
  };

  const handleExport = (): void => {
    if (items.length === 0) {
      push('Brak wydatków do eksportu', 'error');
      return;
    }
    const filename = `wydatki-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadFile(filename, expensesToCsv(items), 'text/csv');
    push('Eksport gotowy');
  };

  return (
    <>
      <PageHeader
        eyebrow="05 · Ustawienia"
        title="Ustawienia"
        subtitle="Profil, budżet, motyw i powiadomienia. Zmiany zapisują się od razu w localStorage."
      />

      <Card className="p-5 mb-6 max-w-xl">
        <div className="flex items-center gap-4">
          <span
            role="img"
            aria-label={`Avatar użytkownika ${profileName}`}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white text-lg font-bold flex items-center justify-center shrink-0"
          >
            {initials || <User size={22} strokeWidth={2.4} aria-hidden="true" />}
          </span>
          <div className="min-w-0 flex-1">
            {editingProfile ? (
              <div className="space-y-2">
                <label htmlFor={nameId} className="sr-only">
                  Imię i nazwisko
                </label>
                <input
                  id={nameId}
                  type="text"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="Imię i nazwisko"
                  className="focus-ring w-full h-9 px-2 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-slate-900 text-sm font-semibold"
                />
                <label htmlFor={emailId} className="sr-only">
                  Email
                </label>
                <input
                  id={emailId}
                  type="email"
                  value={draftEmail}
                  onChange={(e) => setDraftEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="focus-ring w-full h-9 px-2 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-slate-900 text-sm"
                />
              </div>
            ) : (
              <>
                <div className="text-base font-bold truncate">{profileName}</div>
                <div className="text-sm text-ink-500 dark:text-slate-400 truncate">{profileEmail}</div>
              </>
            )}
          </div>
          <div className="shrink-0 flex gap-2">
            {editingProfile ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setDraftName(profileName);
                    setDraftEmail(profileEmail);
                    setEditingProfile(false);
                  }}
                  className="focus-ring h-9 px-3 rounded-lg border border-line dark:border-line-dark text-sm font-semibold"
                >
                  Anuluj
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="focus-ring h-9 px-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold"
                >
                  Zapisz
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setEditingProfile(true)}
                className="focus-ring h-9 px-3 rounded-lg border border-line dark:border-line-dark text-sm font-semibold"
              >
                Edytuj profil
              </button>
            )}
          </div>
        </div>
      </Card>

      <Card className="divide-y divide-line dark:divide-line-dark max-w-xl mb-6">
        <Row>
          <label htmlFor={budgetId} className="text-sm font-medium">
            Budżet miesięczny
          </label>
          <input
            id={budgetId}
            type="number"
            min={0}
            step={50}
            value={monthlyBudget}
            onChange={(e) => setMonthlyBudget(Number(e.target.value))}
            onBlur={() => push('Zapisano budżet')}
            className="focus-ring w-32 h-9 px-3 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-slate-900 text-right num"
          />
        </Row>

        <Row>
          <label htmlFor={currencyId} className="text-sm font-medium">
            Waluta
          </label>
          <select
            id={currencyId}
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="focus-ring h-9 px-3 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-slate-900"
          >
            <option value="PLN">PLN — Złoty</option>
            <option value="EUR">EUR — Euro</option>
            <option value="USD">USD — Dolar</option>
          </select>
        </Row>

        <Row>
          <span id="setting-dark" className="text-sm font-medium">
            Ciemny motyw
          </span>
          <Toggle checked={dark} onChange={toggleDark} ariaLabelledBy="setting-dark" />
        </Row>

        <Row>
          <span id="setting-notifications" className="text-sm font-medium">
            Powiadomienia
          </span>
          <Toggle
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
            ariaLabelledBy="setting-notifications"
          />
        </Row>
      </Card>

      <Card className="p-5 max-w-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold">Eksport CSV</div>
            <div className="text-xs text-ink-500 dark:text-slate-400 mt-0.5">
              Pobierz listę {items.length} {items.length === 1 ? 'wydatku' : 'wydatków'} jako plik CSV.
            </div>
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="focus-ring inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-line dark:border-line-dark text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/60"
          >
            <Download size={14} strokeWidth={2.4} aria-hidden="true" />
            Pobierz
          </button>
        </div>
      </Card>
    </>
  );
}

function Row({ children }: { children: React.ReactNode }): JSX.Element {
  return <div className="flex items-center justify-between gap-4 px-4 py-3.5">{children}</div>;
}

function Toggle({
  checked,
  onChange,
  ariaLabelledBy,
}: {
  checked: boolean;
  onChange: () => void;
  ariaLabelledBy: string;
}): JSX.Element {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={ariaLabelledBy}
      onClick={onChange}
      className={[
        'focus-ring relative h-6 w-11 rounded-full transition-colors',
        checked ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-700',
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
