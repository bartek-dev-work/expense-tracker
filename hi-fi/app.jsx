/* global React, ReactDOM,
   ThemeCtx, useToasts, ToastLayer, Caption, Icon,
   ScreenSection, NAV,
   DashboardScreen, ListScreen, AddScreen, StatsScreen, SettingsScreen */
const { useState: useAppState, useEffect: useAppEffect, useRef: useAppRef } = React;

// ─── Side prototype navigator (outer chrome) ──────────────────────────────────
const SCREENS = [
  { id: 'dashboard', label: 'Pulpit',     short: 'Dashboard',           icon: 'home',     subtitle: 'Hero, statystyki, donut, ostatnie wydatki' },
  { id: 'list',      label: 'Lista',      short: 'Lista wydatków',      icon: 'list',     subtitle: 'Filtry, sortowanie, grupowanie po dniach' },
  { id: 'add',       label: 'Dodaj',      short: 'Dodaj wydatek',       icon: 'plus',     subtitle: 'Modal (desktop) + bottom-sheet (mobile)' },
  { id: 'stats',     label: 'Statystyki', short: 'Statystyki',          icon: 'bar',      subtitle: 'Bar chart, top kategorii, vs poprzedni miesiąc' },
  { id: 'settings',  label: 'Ustawienia', short: 'Ustawienia',          icon: 'settings', subtitle: 'Profil, budżet, waluta, motyw' },
];

function PrototypeSidebar({ active, onSelect, dark, setDark }) {
  return (
    <aside className="w-[260px] shrink-0 h-screen sticky top-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col">
      <div className="px-5 pt-5 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-500 dark:text-brand-400 flex items-center justify-center">
            <Icon name="wallet" size={18} stroke={2.2} />
          </span>
          <div>
            <div className="text-[15px] font-bold tracking-tight text-ink-900 dark:text-slate-100">Wydatki</div>
            <div className="text-[11px] uppercase tracking-wider text-ink-500 dark:text-slate-500 font-semibold">Hi-fi prototyp</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="px-2 pb-1.5 caption text-ink-500 dark:text-slate-500">Ekrany</div>
        {SCREENS.map((s, i) => {
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              aria-current={isActive ? 'page' : undefined}
              className={[
                'focus-ring w-full flex items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                isActive ? 'bg-brand-500/10' : 'hover:bg-slate-100 dark:hover:bg-slate-800/60',
              ].join(' ')}
            >
              <span
                className={[
                  'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                  isActive ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-ink-500 dark:text-slate-400',
                ].join(' ')}
              >
                <Icon name={s.icon} size={15} stroke={2.4} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-ink-500 dark:text-slate-500 num">0{i + 1}</span>
                  <span className={['text-[13px] font-semibold', isActive ? 'text-brand-500 dark:text-brand-400' : 'text-ink-900 dark:text-slate-100'].join(' ')}>{s.short}</span>
                </div>
                <div className="text-[11px] text-ink-500 dark:text-slate-400 mt-0.5 leading-snug">{s.subtitle}</div>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <button
          type="button"
          onClick={() => setDark(!dark)}
          className="focus-ring w-full inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-[13px] font-medium text-ink-900 dark:text-slate-100"
        >
          <Icon name={dark ? 'sun' : 'moon'} size={15} stroke={2.2} />
          {dark ? 'Jasny motyw' : 'Ciemny motyw'}
        </button>
        <div className="text-[11px] text-ink-500 dark:text-slate-500 leading-snug px-1">
          Mocup React + Tailwind + Recharts · Polski UI · WCAG AA
        </div>
      </div>
    </aside>
  );
}

// ─── Main app ─────────────────────────────────────────────────────────────────
function App() {
  const [dark, setDark] = useAppState(false);
  const [active, setActive] = useAppState('dashboard');
  const { toasts, push } = useToasts();
  const mainRef = useAppRef(null);

  useAppEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add('dark'); else root.classList.remove('dark');
  }, [dark]);

  // Scroll-to-top of main pane when active screen changes
  useAppEffect(() => {
    if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  }, [active]);

  const onAdd = () => push('Dodano wydatek');

  const onNav = (id) => setActive(id);

  // Stash the activeScreen object for header
  const screen = SCREENS.find(s => s.id === active);

  // Each screen's content (default + states)
  const screenContent = () => {
    switch (active) {
      case 'dashboard':
        return (
          <ScreenSection
            title="Pulpit"
            subtitle="Hero z postępem budżetu, statystyki, donut kategorii i ostatnie wydatki."
            render={({ state, device }) => (
              <DashboardScreen state={state} device={device} active="dashboard" onAdd={onAdd} onNav={onNav} />
            )}
          />
        );
      case 'list':
        return (
          <ScreenSection
            title="Lista wydatków"
            subtitle="Wyszukiwanie, filtry zakresu i kategorii, sortowanie, grupowanie po dniach."
            render={({ state, device }) => (
              <ListScreen state={state} device={device} active="list" onAdd={onAdd} onNav={onNav} />
            )}
          />
        );
      case 'add':
        return (
          <ScreenSection
            title="Dodaj wydatek"
            subtitle="Modal centrowany na desktop + bottom sheet z grip handle na mobile. Walidacja inline."
            states={['default']}
            render={({ device }) => (
              <AddScreen device={device} active="add" onSavedToast={onAdd} onNav={onNav} />
            )}
          />
        );
      case 'stats':
        return (
          <ScreenSection
            title="Statystyki"
            subtitle="Segmentowane Tydzień / Miesiąc / Rok, bar chart, vs poprzedni miesiąc, top 3 kategorii."
            render={({ state, device }) => (
              <StatsScreen state={state} device={device} active="stats" onAdd={onAdd} onNav={onNav} />
            )}
          />
        );
      case 'settings':
        return (
          <ScreenSection
            title="Ustawienia"
            subtitle="Profil, budżet inline, waluta, motyw, powiadomienia, eksport, wylogowanie."
            states={['default']}
            render={({ device }) => (
              <SettingsScreen device={device} active="settings" onAdd={onAdd} onNav={onNav} />
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ThemeCtx.Provider value={{ dark, setDark }}>
      <div className="theme-transition flex min-h-screen bg-slate-100 dark:bg-bg-dark text-ink-900 dark:text-slate-100">
        <PrototypeSidebar active={active} onSelect={setActive} dark={dark} setDark={setDark} />

        <main ref={mainRef} className="flex-1 min-w-0 h-screen overflow-y-auto">
          {/* Top bar — describes the screen + global theme toggle for redundancy */}
          <header className="sticky top-0 z-30 px-8 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-bg-dark/80 backdrop-blur flex items-center gap-4">
            <div>
              <div className="caption text-ink-500 dark:text-slate-500">{`0${SCREENS.findIndex(s => s.id === active) + 1} · Ekran`}</div>
              <h1 className="text-[22px] font-bold tracking-tight text-ink-900 dark:text-slate-100">{screen?.short}</h1>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 h-9 text-[12px] font-medium text-ink-500 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-ok" />
                Mockowe dane
              </span>
              <button
                type="button"
                onClick={() => setDark(!dark)}
                aria-label={dark ? 'Przełącz na jasny motyw' : 'Przełącz na ciemny motyw'}
                className="focus-ring h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-ink-900 dark:text-slate-100 text-[13px] font-semibold inline-flex items-center gap-1.5"
              >
                <Icon name={dark ? 'sun' : 'moon'} size={14} stroke={2.2} />
                {dark ? 'Light' : 'Dark'}
              </button>
            </div>
          </header>

          <div className="p-8 space-y-10 max-w-[1480px]">
            {screenContent()}

            {/* Footer signature */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-ink-500 dark:text-slate-500 num flex items-center justify-between">
              <span>Wydatki · Hi-fi prototyp · React + Tailwind + Recharts</span>
              <span>WCAG AA · Polski UI</span>
            </div>
          </div>
        </main>

        <ToastLayer toasts={toasts} />
      </div>
    </ThemeCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
