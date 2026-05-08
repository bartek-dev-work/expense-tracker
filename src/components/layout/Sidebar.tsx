import { NavLink, useLocation } from 'react-router-dom';
import { Home, List, Plus, BarChart3, Settings as SettingsIcon, Wallet, Sun, Moon, type LucideIcon } from 'lucide-react';
import { useSettingsStore } from '@/store/settings';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  accent?: boolean;
  modal?: boolean;
}

const ITEMS: NavItem[] = [
  { to: '/',             label: 'Pulpit',     icon: Home },
  { to: '/expenses',     label: 'Lista',      icon: List },
  { to: '/expenses/new', label: 'Dodaj',      icon: Plus, accent: true, modal: true },
  { to: '/stats',        label: 'Statystyki', icon: BarChart3 },
  { to: '/settings',     label: 'Ustawienia', icon: SettingsIcon },
];

export function Sidebar(): JSX.Element {
  const dark = useSettingsStore((s) => s.dark);
  const toggleDark = useSettingsStore((s) => s.toggleDark);
  const location = useLocation();

  return (
    <aside className="hidden md:flex w-[240px] shrink-0 h-screen sticky top-0 border-r border-line dark:border-line-dark bg-surface dark:bg-surface-dark flex-col">
      <div className="px-5 pt-5 pb-4 border-b border-line dark:border-line-dark">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center">
            <Wallet size={18} strokeWidth={2.2} />
          </span>
          <div>
            <div className="text-[15px] font-bold tracking-tight">Wydatki</div>
            <div className="caption text-ink-500 dark:text-slate-500">Tracker</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {ITEMS.map(({ to, label, icon: Icon, accent, modal }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            state={modal ? { background: location } : undefined}
            className={({ isActive }) =>
              [
                'focus-ring w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-semibold transition-colors',
                isActive
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
                  : 'text-ink-900 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60',
              ].join(' ')
            }
          >
            <span
              className={[
                'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                accent
                  ? 'bg-brand-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-ink-500 dark:text-slate-400',
              ].join(' ')}
            >
              <Icon size={15} strokeWidth={2.4} />
            </span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-line dark:border-line-dark">
        <button
          type="button"
          onClick={toggleDark}
          aria-label={dark ? 'Przełącz na jasny motyw' : 'Przełącz na ciemny motyw'}
          className="focus-ring w-full inline-flex items-center gap-2 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-slate-900 px-3 py-2 text-[13px] font-medium"
        >
          {dark ? <Sun size={15} strokeWidth={2.2} /> : <Moon size={15} strokeWidth={2.2} />}
          {dark ? 'Jasny motyw' : 'Ciemny motyw'}
        </button>
      </div>
    </aside>
  );
}
