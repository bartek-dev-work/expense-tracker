interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ eyebrow, title, subtitle, action }: PageHeaderProps): JSX.Element {
  return (
    <div className="flex flex-wrap items-end gap-4 mb-6 md:mb-8">
      <div className="min-w-0 flex-1">
        {eyebrow && <div className="caption text-ink-500 dark:text-slate-500">{eyebrow}</div>}
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-ink-500 dark:text-slate-400 mt-1 max-w-2xl">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
