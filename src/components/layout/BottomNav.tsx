import { NavLink } from 'react-router-dom';
import { Home, List, Plus, BarChart3, Settings as SettingsIcon, type LucideIcon } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  accent?: boolean;
}

const ITEMS: NavItem[] = [
  { to: '/',             label: 'Pulpit', icon: Home },
  { to: '/expenses',     label: 'Lista',  icon: List },
  { to: '/expenses/new', label: 'Dodaj',  icon: Plus, accent: true },
  { to: '/stats',        label: 'Stat.',  icon: BarChart3 },
  { to: '/settings',     label: 'Ustaw.', icon: SettingsIcon },
];

export function BottomNav(): JSX.Element {
  return (
    <nav
      aria-label="Nawigacja główna"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 h-16 border-t border-line dark:border-line-dark bg-surface/95 dark:bg-surface-dark/95 backdrop-blur"
    >
      <ul className="grid grid-cols-5 h-full">
        {ITEMS.map(({ to, label, icon: Icon, accent }) => (
          <li key={to} className="contents">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                [
                  'focus-ring flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium',
                  isActive ? 'text-brand-500 dark:text-brand-400' : 'text-ink-500 dark:text-slate-400',
                ].join(' ')
              }
            >
              {accent ? (
                <span className="w-11 h-11 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-fab -mt-4">
                  <Plus size={22} strokeWidth={2.4} />
                </span>
              ) : (
                <Icon size={20} strokeWidth={2.2} />
              )}
              {!accent && <span>{label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
