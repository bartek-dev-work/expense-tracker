/* global React, Recharts, fmtPLN, fmtDayPl, CATS, CAT_LIST, Icon */
const { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } = React;

// ─── Theme context ────────────────────────────────────────────────────────────
const ThemeCtx = createContext({ dark: false, setDark: () => {} });
const useTheme = () => useContext(ThemeCtx);

// ─── Card primitive ───────────────────────────────────────────────────────────
function Card({ className = '', children, hover = false, ...rest }) {
  return (
    <div
      className={[
        'bg-white dark:bg-surface-dark',
        'border border-line dark:border-line-dark',
        'rounded-xl shadow-card',
        hover ? 'transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-pop' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
}

// ─── Category bubble ──────────────────────────────────────────────────────────
function CatBubble({ cat, size = 40 }) {
  const c = CATS[cat];
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0"
      style={{
        width: size, height: size,
        background: c.color + '1F',
        color: c.color,
      }}
      aria-hidden="true"
    >
      <Icon name={c.icon} size={Math.round(size * 0.5)} stroke={2} />
    </div>
  );
}

// ─── Caption ──────────────────────────────────────────────────────────────────
function Caption({ children, className = '' }) {
  return <div className={`caption text-ink-500 dark:text-slate-400 ${className}`}>{children}</div>;
}

// ─── Trend pill ───────────────────────────────────────────────────────────────
function TrendPill({ value }) {
  const up = value >= 0;
  return (
    <span
      className={[
        'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold num',
        up ? 'text-danger bg-red-50 dark:bg-red-500/10' : 'text-ok bg-emerald-50 dark:bg-emerald-500/10',
      ].join(' ')}
    >
      <Icon name={up ? 'arrowup' : 'arrowdown'} size={11} stroke={2.5} />
      {Math.abs(value).toFixed(0)}%
    </span>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skel({ w = '100%', h = 12, r = 6, className = '' }) {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-700/60 ${className}`}
      style={{ width: w, height: h, borderRadius: r }}
    />
  );
}

// ─── Empty state illustration (simple line art, original) ─────────────────────
function EmptyArt({ size = 96 }) {
  return (
    <svg viewBox="0 0 120 96" width={size} height={size * (96 / 120)} className="text-slate-300 dark:text-slate-600">
      <rect x="14" y="22" width="92" height="58" rx="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="14" y1="40" x2="106" y2="40" stroke="currentColor" strokeWidth="2" />
      <circle cx="22" cy="31" r="2" fill="currentColor" />
      <circle cx="30" cy="31" r="2" fill="currentColor" />
      <circle cx="38" cy="31" r="2" fill="currentColor" />
      <line x1="26" y1="55" x2="78" y2="55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="26" y1="64" x2="60" y2="64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="92" cy="60" r="10" fill="none" stroke="#6366F1" strokeWidth="2" />
      <line x1="99" y1="67" x2="106" y2="74" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function EmptyState({ title = 'Brak wydatków', subtitle = 'Dodaj swój pierwszy wydatek, żeby zacząć śledzenie.', cta = 'Dodaj pierwszy', onCta }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
      <EmptyArt />
      <div className="mt-4 text-base font-semibold text-ink-900 dark:text-slate-100">{title}</div>
      <div className="mt-1 text-sm text-ink-500 dark:text-slate-400 max-w-[28ch]">{subtitle}</div>
      {cta && (
        <button
          type="button"
          onClick={onCta}
          className="focus-ring mt-5 inline-flex items-center gap-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2.5"
        >
          <Icon name="plus" size={16} stroke={2.5} />
          {cta}
        </button>
      )}
    </div>
  );
}

function ErrorState({ title = 'Coś poszło nie tak', subtitle = 'Nie udało się pobrać danych. Sprawdź połączenie i spróbuj ponownie.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/10 text-danger flex items-center justify-center">
        <Icon name="alert" size={28} stroke={2} />
      </div>
      <div className="mt-4 text-base font-semibold text-ink-900 dark:text-slate-100">{title}</div>
      <div className="mt-1 text-sm text-ink-500 dark:text-slate-400 max-w-[32ch]">{subtitle}</div>
      <button
        type="button"
        onClick={onRetry}
        className="focus-ring mt-5 inline-flex items-center gap-1.5 rounded-lg border border-line dark:border-line-dark bg-white dark:bg-surface-dark text-ink-900 dark:text-slate-100 text-sm font-semibold px-4 py-2.5 hover:border-brand-500"
      >
        <Icon name="refresh" size={16} stroke={2} />
        Spróbuj ponownie
      </button>
    </div>
  );
}

// ─── Toggle + Chip + Segmented ───────────────────────────────────────────────
function Toggle({ checked, onChange, ariaLabel }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={[
        'focus-ring relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
        checked ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600',
      ].join(' ')}
    >
      <span
        className={[
          'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0.5',
        ].join(' ')}
      />
    </button>
  );
}

function Chip({ active, onClick, children, color, dot, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'focus-ring inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors',
        active
          ? 'bg-brand-500 text-white border border-brand-500'
          : 'bg-white dark:bg-surface-dark text-ink-900 dark:text-slate-200 border border-line dark:border-line-dark hover:border-brand-500',
        className,
      ].join(' ')}
    >
      {dot && (
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ background: active ? '#fff' : (color || '#6366F1') }}
        />
      )}
      {children}
    </button>
  );
}

function Segmented({ items, value, onChange, className = '' }) {
  const ref = useRef(null);
  const idx = items.findIndex(i => i.value === value);
  const [pos, setPos] = useState({ left: 0, width: 0 });
  useEffect(() => {
    if (!ref.current) return;
    const btn = ref.current.querySelectorAll('button')[idx];
    if (btn) setPos({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [idx, items.length]);
  return (
    <div
      ref={ref}
      className={`relative inline-flex items-center rounded-lg bg-slate-100 dark:bg-slate-800/80 p-1 ${className}`}
      role="tablist"
    >
      <span
        className="absolute top-1 bottom-1 rounded-md bg-white dark:bg-slate-700 shadow-sm transition-all duration-300"
        style={{ left: pos.left, width: pos.width }}
        aria-hidden="true"
      />
      {items.map(it => (
        <button
          key={it.value}
          role="tab"
          aria-selected={it.value === value}
          onClick={() => onChange(it.value)}
          className={[
            'relative z-10 px-3 py-1.5 text-[13px] font-medium rounded-md focus-ring',
            it.value === value ? 'text-ink-900 dark:text-slate-100' : 'text-ink-500 dark:text-slate-400',
          ].join(' ')}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

// ─── Progress bar ────────────────────────────────────────────────────────────
function Progress({ value, max, animate = true }) {
  const pct = Math.min(100, (value / max) * 100);
  const danger = pct >= 90;
  return (
    <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{
          width: pct + '%',
          background: danger
            ? 'linear-gradient(90deg, #F59E0B, #EF4444)'
            : 'linear-gradient(90deg, #6366F1, #8B5CF6)',
          animation: animate ? 'progressFill 800ms cubic-bezier(0.2, 0.8, 0.2, 1) both' : 'none',
        }}
      />
    </div>
  );
}

// ─── Toast (singleton hook) ──────────────────────────────────────────────────
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, msg, leaving: false }]);
    setTimeout(() => setToasts(t => t.map(x => x.id === id ? { ...x, leaving: true } : x)), 1800);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2050);
  }, []);
  return { toasts, push };
}

function ToastLayer({ toasts }) {
  return (
    <div
      className="pointer-events-none fixed left-1/2 bottom-6 z-[60] flex flex-col items-center gap-2"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map(t => (
        <div
          key={t.id}
          className={[
            'pointer-events-auto rounded-full bg-ink-900 dark:bg-white text-white dark:text-ink-900 px-4 py-2 text-sm font-medium shadow-pop flex items-center gap-2',
            t.leaving ? 'toast-out' : 'toast-in',
          ].join(' ')}
        >
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-ok text-white">
            <Icon name="check" size={14} stroke={3} />
          </span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── Frame (mobile / desktop preview canvases) ───────────────────────────────
function PhoneFrame({ children, label = 'Mobile · 375px' }) {
  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex items-center gap-2">
        <Caption>{label}</Caption>
      </div>
      <div className="rounded-[36px] p-2 bg-slate-900 dark:bg-slate-950 shadow-pop">
        <div
          className="relative rounded-[28px] overflow-hidden bg-bg dark:bg-bg-dark"
          style={{ width: 375, height: 720 }}
        >
          {/* notch */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full bg-slate-900 dark:bg-slate-950 z-30" />
          {/* status bar */}
          <div className="relative z-20 flex items-center justify-between px-6 pt-2.5 pb-1 text-[12px] font-semibold text-ink-900 dark:text-slate-100">
            <span className="num">9:41</span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3.5 h-2 rounded-[1px] border border-current" />
              <span className="inline-block w-1 h-2 rounded-[1px] bg-current" />
            </span>
          </div>
          <div className="relative h-[calc(100%-32px)] overflow-y-auto frame-scroll">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopFrame({ children, label = 'Desktop' }) {
  return (
    <div className="flex flex-col items-start gap-3 flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <Caption>{label}</Caption>
      </div>
      <div className="w-full rounded-2xl border border-line dark:border-line-dark bg-white dark:bg-surface-dark shadow-pop overflow-hidden">
        {/* window chrome */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-line dark:border-line-dark bg-slate-50 dark:bg-slate-900/60">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="w-3 h-3 rounded-full bg-emerald-400" />
          <div className="ml-3 mr-auto text-[12px] text-ink-500 dark:text-slate-400 num">wydatki.app</div>
        </div>
        <div className="bg-bg dark:bg-bg-dark" style={{ height: 720 }}>
          <div className="h-full overflow-y-auto frame-scroll">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Frame Strip: states grid + mobile/desktop side-by-side ──────────────────
const STATES = [
  { id: 'default', label: 'Default' },
  { id: 'loading', label: 'Loading' },
  { id: 'empty',   label: 'Empty' },
  { id: 'error',   label: 'Error' },
];

function ScreenSection({ title, subtitle, render, defaultState = 'default', states = ['default','loading','empty','error'] }) {
  const [state, setState] = useState(defaultState);
  const opts = STATES.filter(s => states.includes(s.id));
  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-[20px] font-semibold text-ink-900 dark:text-slate-100">{title}</h2>
          {subtitle && <p className="text-sm text-ink-500 dark:text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {opts.length > 1 && (
          <Segmented
            value={state}
            onChange={setState}
            items={opts.map(s => ({ value: s.id, label: s.label }))}
          />
        )}
      </header>

      <div className="flex flex-wrap items-start gap-8">
        <PhoneFrame>{render({ state, device: 'mobile' })}</PhoneFrame>
        <DesktopFrame>{render({ state, device: 'desktop' })}</DesktopFrame>
      </div>
    </section>
  );
}

// ─── FAB ──────────────────────────────────────────────────────────────────────
function FAB({ onClick, ariaLabel = 'Dodaj wydatek', size = 56, className = '' }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      style={{ width: size, height: size }}
      className={[
        'focus-ring rounded-full text-white flex items-center justify-center shadow-fab',
        'transition-transform duration-200 hover:scale-105 active:scale-95',
        className,
      ].join(' ')}
    >
      <span
        className="absolute inset-0 rounded-full"
        style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
        aria-hidden="true"
      />
      <Icon name="plus" size={Math.round(size * 0.42)} stroke={2.6} className="relative" />
    </button>
  );
}

// ─── Tag pill (small text label inside list rows) ─────────────────────────────
function Tag({ children, color }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium border"
      style={{
        color: color || '#64748B',
        borderColor: (color || '#64748B') + '33',
        background: (color || '#64748B') + '0F',
      }}
    >
      {children}
    </span>
  );
}

// Expose
Object.assign(window, {
  ThemeCtx, useTheme,
  Card, CatBubble, Caption, TrendPill,
  Skel, EmptyState, ErrorState,
  Toggle, Chip, Segmented, Progress,
  useToasts, ToastLayer,
  PhoneFrame, DesktopFrame, ScreenSection,
  FAB, Tag,
});
