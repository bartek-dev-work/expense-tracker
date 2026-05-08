/* global React, Card, Caption, Toggle, Icon, MobileShell, DesktopShell, useTheme */
const { useState: useSetState } = React;

function Row({ icon, color = '#6366F1', label, meta, control, danger = false, divider = true }) {
  return (
    <div className={['flex items-center gap-3 px-4 py-3.5', divider ? 'border-b border-line dark:border-line-dark last:border-b-0' : ''].join(' ')}>
      {icon && (
        <span className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: color + '14', color }}>
          <Icon name={icon} size={16} stroke={2.2} />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className={['text-[14px] font-semibold', danger ? 'text-danger' : 'text-ink-900 dark:text-slate-100'].join(' ')}>{label}</div>
        {meta && <div className="text-[12px] text-ink-500 dark:text-slate-400 mt-0.5">{meta}</div>}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

function CurrencySelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="focus-ring h-9 rounded-lg border border-line dark:border-line-dark bg-white dark:bg-slate-900/40 px-2 text-[13px] font-medium text-ink-900 dark:text-slate-100 num"
      aria-label="Waluta"
    >
      <option value="PLN">PLN</option>
      <option value="EUR">EUR</option>
      <option value="USD">USD</option>
    </select>
  );
}

function BudgetInput({ value, onChange }) {
  return (
    <div className="inline-flex items-center rounded-lg border border-line dark:border-line-dark bg-white dark:bg-slate-900/40 h-9 pl-2 pr-3">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ''))}
        inputMode="numeric"
        className="focus-ring w-[80px] bg-transparent text-[13px] font-semibold text-ink-900 dark:text-slate-100 text-right num focus:outline-none"
        aria-label="Budżet miesięczny"
      />
      <span className="ml-1 text-[12px] text-ink-500 dark:text-slate-400">zł</span>
    </div>
  );
}

function ProfileCard() {
  return (
    <Card className="p-4 flex items-center gap-3">
      <span
        className="w-12 h-12 rounded-full text-white flex items-center justify-center text-[16px] font-semibold"
        style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
        aria-hidden="true"
      >
        AK
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-semibold text-ink-900 dark:text-slate-100">Anna Kowalska</div>
        <div className="text-[12px] text-ink-500 dark:text-slate-400">anna.kowalska@example.pl</div>
      </div>
      <button className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-line dark:border-line-dark bg-white dark:bg-surface-dark text-[12px] font-semibold px-3 h-8 text-ink-900 dark:text-slate-100">
        <Icon name="edit" size={13} stroke={2} />
        Edytuj
      </button>
    </Card>
  );
}

function SettingsBody() {
  const { dark, setDark } = useTheme();
  const [budget, setBudget] = useSetState('4000');
  const [currency, setCurrency] = useSetState('PLN');
  const [notify, setNotify] = useSetState(true);

  return (
    <>
      <ProfileCard />

      <Card className="overflow-hidden">
        <div className="px-4 pt-3 pb-1"><Caption>Aplikacja</Caption></div>
        <Row
          icon="package" color={CATS_COLOR_FALLBACK_BUDGET}
          label="Kategorie"
          meta="5 aktywnych"
          control={<button className="focus-ring text-ink-500 dark:text-slate-400" aria-label="Otwórz kategorie"><Icon name="chevright" size={16} stroke={2.2} /></button>}
        />
        <Row
          icon="wallet" color="#6366F1"
          label="Budżet miesięczny"
          meta="Limit, po którym dostaniesz ostrzeżenie"
          control={<BudgetInput value={budget} onChange={setBudget} />}
        />
        <Row
          icon="receipt" color="#8B5CF6"
          label="Waluta"
          meta="Domyślna waluta zapisu"
          control={<CurrencySelect value={currency} onChange={setCurrency} />}
        />
      </Card>

      <Card className="overflow-hidden">
        <div className="px-4 pt-3 pb-1"><Caption>Wygląd i powiadomienia</Caption></div>
        <Row
          icon="moon" color="#0F172A"
          label="Ciemny motyw"
          meta="Automatycznie po zmroku — wkrótce"
          control={<Toggle checked={dark} onChange={setDark} ariaLabel="Ciemny motyw" />}
        />
        <Row
          icon="bell" color="#F59E0B"
          label="Powiadomienia"
          meta="Codzienne podsumowanie + ostrzeżenia o budżecie"
          control={<Toggle checked={notify} onChange={setNotify} ariaLabel="Powiadomienia" />}
        />
      </Card>

      <Card className="overflow-hidden">
        <div className="px-4 pt-3 pb-1"><Caption>Dane</Caption></div>
        <Row
          icon="download" color="#10B981"
          label="Eksport CSV"
          meta="Wszystkie wydatki z 2026 roku"
          control={
            <button className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-[12px] font-semibold px-3 h-8">
              Pobierz
            </button>
          }
        />
        <Row
          icon="logout" color="#EF4444"
          label="Wyloguj"
          danger
          control={<button className="focus-ring text-danger" aria-label="Wyloguj"><Icon name="chevright" size={16} stroke={2.2} /></button>}
        />
      </Card>

      <p className="text-center text-[11px] text-ink-500 dark:text-slate-500 num">Wydatki · v1.4.2</p>
    </>
  );
}

// We accidentally referenced a non-existent var. Define it inline:
const CATS_COLOR_FALLBACK_BUDGET = '#06B6D4';

function SettingsScreen({ device, onAdd, onNav, active = 'settings' }) {
  const isMobile = device === 'mobile';
  if (isMobile) {
    return (
      <MobileShell active={active} title="Ustawienia" onAdd={onAdd} onNav={onNav}>
        <SettingsBody />
      </MobileShell>
    );
  }
  return (
    <DesktopShell active={active} title="Ustawienia" breadcrumb="Konto" onNav={onNav}>
      <div className="grid grid-cols-2 gap-4 items-start">
        <SettingsBody />
      </div>
    </DesktopShell>
  );
}

window.SettingsScreen = SettingsScreen;
