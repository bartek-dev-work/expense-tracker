interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: ReadonlyArray<SegmentedOption<T>>;
  ariaLabel?: string;
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: SegmentedControlProps<T>): JSX.Element {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-line dark:border-line-dark"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={[
              'focus-ring rounded-md px-3 h-8 text-[13px] font-semibold transition-colors',
              active
                ? 'bg-surface dark:bg-surface-dark text-ink-900 dark:text-slate-100 shadow-card'
                : 'text-slate-600 dark:text-slate-300 hover:text-ink-900 dark:hover:text-slate-100',
            ].join(' ')}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
