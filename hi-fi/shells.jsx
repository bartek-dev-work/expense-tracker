/* global React, Icon, useTheme, FAB, Card, CatBubble */
const { useState: useStateShells } = React;

// In-app navigation items (used both inside mobile bottom nav AND desktop sidebar)
const NAV = [
  { id: 'dashboard', label: 'Pulpit',     icon: 'home' },
  { id: 'list',      label: 'Wydatki',    icon: 'list' },
  { id: 'add',       label: 'Dodaj',      icon: 'plus' },
  { id: 'stats',     label: 'Statystyki', icon: 'bar' },
  { id: 'settings',  label: 'Ustawienia', icon: 'settings' },
];

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ size = 32, initials = 'AK' }) {
  return (
    <div
      className="rounded-full text-white text-[12px] font-semibold flex items-center justify-center shrink-0"
      style={{
        width: size, height: size,
        background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
      }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

// ─── Mobile top bar ───────────────────────────────────────────────────────────
function MobileTopbar({ title, onAdd, showThemeToggle = true }) {
  const { dark, setDark } = useTheme();
  return (
    <div className="sticky top-0 z-20 px-5 pt-2 pb-3 bg-bg/90 dark:bg-bg-dark/90 backdrop-blur border-b border-line dark:border-line-dark">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-500 dark:text-brand-400 flex items-center justify-center">
            <Icon name="wallet" size={18} stroke={2.2} />
          </span>
          <span className="font-bold text-[16px] tracking-tight text-ink-900 dark:text-slate-100">Wydatki</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {showThemeToggle && (
            <button
              type="button"
              aria-label={dark ? 'Przełącz na jasny motyw' : 'Przełącz na ciemny motyw'}
              onClick={() => setDark(!dark)}
              className="focus-ring w-9 h-9 rounded-lg border border-line dark:border-line-dark bg-white dark:bg-surface-dark text-ink-900 dark:text-slate-100 flex items-center justify-center"
            >
              <Icon name={dark ? 'sun' : 'moon'} size={16} stroke={2.2} />
            </button>
          )}
          <Avatar />
        </div>
      </div>
      {title && <h1 className="mt-3 text-[22px] font-bold tracking-tight text-ink-900 dark:text-slate-100">{title}</h1>}
    </div>
  );
}

// ─── Mobile bottom nav ────────────────────────────────────────────────────────
function MobileBottomNav({ active, onSelect, onAdd }) {
  return (
    <div
      className="sticky bottom-0 left-0 right-0 z-20 mt-6 border-t border-line dark:border-line-dark bg-white/95 dark:bg-surface-dark/95 backdrop-blur"
    >
      <div className="grid grid-cols-5 items-center">
        {NAV.map((item, i) => {
          const isAdd = item.id === 'add';
          const isActive = active === item.id;
          if (isAdd) {
            return (
              <div key={item.id} className="flex justify-center -mt-6">
                <FAB onClick={onAdd} size={52} className="relative" ariaLabel="Dodaj wydatek" />
              </div>
            );
          }
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={[
                'focus-ring flex flex-col items-center gap-0.5 py-2.5',
                isActive ? 'text-brand-500 dark:text-brand-400' : 'text-ink-500 dark:text-slate-400',
              ].join(' ')}
            >
              <Icon name={item.icon} size={20} stroke={2.2} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
      <div className="h-[10px] flex justify-center">
        <span className="block w-32 h-1 rounded-full bg-slate-300/70 dark:bg-slate-600/70" />
      </div>
    </div>
  );
}

// ─── Desktop sidebar ──────────────────────────────────────────────────────────
function DesktopSidebar({ active, onSelect, collapsed = false }) {
  return (
    <aside
      className={[
        'shrink-0 h-full border-r border-line dark:border-line-dark bg-white dark:bg-surface-dark',
        'flex flex-col py-4',
        collapsed ? 'w-[68px]' : 'w-[220px]',
      ].join(' ')}
    >
      <div className={['flex items-center gap-2 px-4 mb-6', collapsed ? 'justify-center px-0' : ''].join(' ')}>
        <span className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-500 dark:text-brand-400 flex items-center justify-center">
          <Icon name="wallet" size={18} stroke={2.2} />
        </span>
        {!collapsed && <span className="font-bold text-[16px] tracking-tight text-ink-900 dark:text-slate-100">Wydatki</span>}
      </div>

      <nav className={['flex flex-col gap-1', collapsed ? 'px-2' : 'px-2'].join(' ')}>
        {NAV.map(item => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={[
                'focus-ring flex items-center gap-3 rounded-lg text-[13px] font-medium',
                collapsed ? 'justify-center h-10 w-10 mx-auto' : 'px-3 py-2',
                isActive
                  ? 'bg-brand-500/10 text-brand-500 dark:text-brand-400'
                  : 'text-ink-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
              ].join(' ')}
            >
              <Icon name={item.icon} size={18} stroke={2.2} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-2">
        <div className={['rounded-lg border border-dashed border-line dark:border-line-dark p-3', collapsed ? 'hidden' : ''].join(' ')}>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500 dark:text-slate-400">Budżet maj</div>
          <div className="mt-1 text-[13px] num text-ink-900 dark:text-slate-100">2 480 / 4 000&nbsp;zł</div>
          <div className="mt-2 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: '62%', background: 'linear-gradient(90deg,#6366F1,#8B5CF6)' }} />
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── Desktop topbar ───────────────────────────────────────────────────────────
function DesktopTopbar({ title, breadcrumb, right }) {
  const { dark, setDark } = useTheme();
  return (
    <div className="sticky top-0 z-10 flex items-center gap-4 px-8 py-4 border-b border-line dark:border-line-dark bg-bg/80 dark:bg-bg-dark/80 backdrop-blur">
      <div>
        {breadcrumb && (
          <div className="text-[12px] font-medium text-ink-500 dark:text-slate-400">{breadcrumb}</div>
        )}
        <h1 className="text-[22px] font-bold tracking-tight text-ink-900 dark:text-slate-100">{title}</h1>
      </div>
      <div className="ml-auto flex items-center gap-2">
        {right}
        <button
          type="button"
          aria-label={dark ? 'Przełącz na jasny motyw' : 'Przełącz na ciemny motyw'}
          onClick={() => setDark(!dark)}
          className="focus-ring w-9 h-9 rounded-lg border border-line dark:border-line-dark bg-white dark:bg-surface-dark text-ink-900 dark:text-slate-100 flex items-center justify-center"
        >
          <Icon name={dark ? 'sun' : 'moon'} size={16} stroke={2.2} />
        </button>
        <button className="focus-ring w-9 h-9 rounded-lg border border-line dark:border-line-dark bg-white dark:bg-surface-dark text-ink-900 dark:text-slate-100 flex items-center justify-center" aria-label="Powiadomienia">
          <Icon name="bell" size={16} stroke={2.2} />
        </button>
        <Avatar size={32} />
      </div>
    </div>
  );
}

// ─── Page shells ──────────────────────────────────────────────────────────────
function MobileShell({ active = 'dashboard', title, children, onAdd, onNav, showFab = true, scrollable = true }) {
  return (
    <div className="relative h-full flex flex-col bg-bg dark:bg-bg-dark">
      <MobileTopbar title={title} />
      <div className={['relative flex-1', scrollable ? '' : ''].join(' ')}>
        <div className="px-5 pb-6 pt-3 space-y-4">{children}</div>
      </div>
      <MobileBottomNav active={active} onSelect={onNav || (() => {})} onAdd={onAdd || (() => {})} />
    </div>
  );
}

function DesktopShell({ active = 'dashboard', title, breadcrumb, right, children, onNav, sidebar = 'full' }) {
  return (
    <div className="h-full flex bg-bg dark:bg-bg-dark">
      <DesktopSidebar active={active} onSelect={onNav || (() => {})} collapsed={sidebar === 'collapsed'} />
      <div className="flex-1 min-w-0 flex flex-col">
        <DesktopTopbar title={title} breadcrumb={breadcrumb} right={right} />
        <div className="flex-1 overflow-y-auto">
          <div className="px-8 py-6 max-w-[1080px] space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  NAV, Avatar,
  MobileTopbar, MobileBottomNav, DesktopSidebar, DesktopTopbar,
  MobileShell, DesktopShell,
});
