/* global React, Recharts, fmtPLN, fmtDayPl, EXPENSES, STATS, BUDGET, CATS, CAT_LIST,
   Card, CatBubble, Caption, TrendPill, Skel, EmptyState, ErrorState, Progress, Tag, Icon,
   MobileShell, DesktopShell, FAB */
const { useEffect: useDashEffect, useState: useDashState } = React;

// ─── Hero card ────────────────────────────────────────────────────────────────
function HeroCard({ spent, budget, dense = false }) {
  return (
    <Card className={dense ? 'p-4' : 'p-5'}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Caption>Wydano w maju</Caption>
          <div className="mt-1 flex items-baseline gap-2 flex-wrap">
            <span className="text-[28px] font-bold tracking-tight text-ink-900 dark:text-slate-100 num">
              {fmtPLN(spent)}
            </span>
            <span className="text-sm text-ink-500 dark:text-slate-400 num">/ {fmtPLN(budget)}</span>
          </div>
        </div>
        <span className="caption text-ink-500 dark:text-slate-400 shrink-0">{Math.round((spent/budget)*100)}%</span>
      </div>
      <div className="mt-3"><Progress value={spent} max={budget} /></div>
      <div className="mt-2 text-[12px] text-ink-500 dark:text-slate-400">
        Pozostało <span className="num font-semibold text-ink-900 dark:text-slate-100">{fmtPLN(budget - spent)}</span> · 24 dni do końca miesiąca
      </div>
    </Card>
  );
}

function HeroSkel({ dense = false }) {
  return (
    <Card className={dense ? 'p-4' : 'p-5'}>
      <Skel w={120} h={10} />
      <div className="mt-3 flex items-baseline gap-2"><Skel w={170} h={28} /><Skel w={70} h={14} /></div>
      <div className="mt-4"><Skel w="100%" h={10} r={999} /></div>
      <div className="mt-3"><Skel w={180} h={10} /></div>
    </Card>
  );
}

// ─── Stat tile ────────────────────────────────────────────────────────────────
function StatTile({ label, amount, trend, icon, compact = false }) {
  if (compact) {
    return (
      <Card className="p-2.5 min-w-0 overflow-hidden" hover>
        <Caption className="truncate">{label}</Caption>
        <div className="mt-1 num text-[14px] font-bold tracking-tight text-ink-900 dark:text-slate-100 leading-tight truncate">
          {fmtPLN(amount, { decimals: 0 })}
        </div>
        <div className="mt-1"><TrendPill value={trend} /></div>
      </Card>
    );
  }
  return (
    <Card className="p-4 min-w-0 overflow-hidden" hover>
      <div className="flex items-center gap-2 min-w-0">
        <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-ink-500 dark:text-slate-400 flex items-center justify-center shrink-0">
          <Icon name={icon} size={15} stroke={2.2} />
        </span>
        <Caption className="truncate">{label}</Caption>
        <div className="ml-auto shrink-0"><TrendPill value={trend} /></div>
      </div>
      <div className="mt-2 text-[20px] font-bold tracking-tight num text-ink-900 dark:text-slate-100 truncate">{fmtPLN(amount)}</div>
    </Card>
  );
}
function StatSkel() {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2"><Skel w={28} h={28} r={8} /><Skel w={50} h={10} /><div className="ml-auto"><Skel w={42} h={16} r={999} /></div></div>
      <div className="mt-3"><Skel w={120} h={20} /></div>
    </Card>
  );
}

// ─── Donut + Legend (Recharts) ────────────────────────────────────────────────
function DonutCard({ data, compact = false }) {
  const { PieChart, Pie, Cell, ResponsiveContainer } = Recharts;
  const total = data.reduce((a,b) => a + b.value, 0);
  const donutSize = compact ? 140 : 160;
  return (
    <Card className="p-4 min-w-0 overflow-hidden">
      <div className="flex items-center justify-between gap-2">
        <Caption>Kategorie · maj</Caption>
        <button className="focus-ring text-[12px] font-medium text-brand-500 dark:text-brand-400 shrink-0">Zobacz wszystkie</button>
      </div>
      <div className={compact ? 'mt-3 flex flex-col items-center gap-3' : 'mt-2 grid grid-cols-[160px,1fr] gap-3 items-center'}>
        <div className="relative shrink-0" style={{ width: donutSize, height: donutSize }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius={50}
                outerRadius={72}
                paddingAngle={2}
                stroke="none"
                animationBegin={120}
                animationDuration={900}
              >
                {data.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-[11px] font-medium uppercase tracking-wider text-ink-500 dark:text-slate-400">Razem</div>
            <div className="text-[18px] font-bold num text-ink-900 dark:text-slate-100">{fmtPLN(total, { decimals: 0 })}</div>
          </div>
        </div>

        <ul className={compact ? 'w-full space-y-1.5' : 'space-y-1.5 min-w-0'}>
          {data.map(d => {
            const pct = (d.value / total) * 100;
            return (
              <li key={d.label} className="flex items-center gap-2 text-[13px] min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                <span className="text-ink-900 dark:text-slate-200 font-medium truncate">{d.label}</span>
                <span className="ml-auto num text-ink-500 dark:text-slate-400 shrink-0">{pct.toFixed(0)}%</span>
                <span className="num text-ink-900 dark:text-slate-100 text-right shrink-0 tabular-nums" style={{ minWidth: 56 }}>{fmtPLN(d.value, { decimals: 0 })}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}

function DonutSkel() {
  return (
    <Card className="p-4">
      <Skel w={140} h={10} />
      <div className="mt-3 grid grid-cols-[160px,1fr] gap-3 items-center">
        <div className="rounded-full bg-slate-100 dark:bg-slate-800/60 animate-pulse" style={{ width: 160, height: 160 }} />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skel w={10} h={10} r={999} /><Skel w={70} h={10} /><div className="ml-auto"><Skel w={56} h={10} /></div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─── Recent expenses list ─────────────────────────────────────────────────────
function RecentList({ items }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between p-4 pb-2">
        <Caption>Ostatnie wydatki</Caption>
        <button className="focus-ring text-[12px] font-medium text-brand-500 dark:text-brand-400">Zobacz wszystkie</button>
      </div>
      <ul className="divide-y divide-line dark:divide-line-dark">
        {items.slice(0, 5).map(e => {
          const c = CATS[e.cat];
          return (
            <li key={e.id} className="flex items-center gap-3 px-4 py-3">
              <CatBubble cat={e.cat} size={36} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-ink-900 dark:text-slate-100 truncate">{e.desc}</span>
                  <Tag color={c.color}>{c.label}</Tag>
                </div>
                <div className="text-[12px] text-ink-500 dark:text-slate-400">{fmtDayPl(e.date)} · {e.tag}</div>
              </div>
              <span className="num text-[14px] font-semibold text-ink-900 dark:text-slate-100">−{fmtPLN(e.amount)}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function RecentSkel() {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 pb-2"><Skel w={150} h={10} /></div>
      <ul className="divide-y divide-line dark:divide-line-dark">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="flex items-center gap-3 px-4 py-3">
            <Skel w={36} h={36} r={999} />
            <div className="flex-1 space-y-2"><Skel w="70%" h={12} /><Skel w="40%" h={10} /></div>
            <Skel w={64} h={14} />
          </li>
        ))}
      </ul>
    </Card>
  );
}

// ─── Dashboard renderer ───────────────────────────────────────────────────────
function DashboardScreen({ state, device, onAdd, onNav, active = 'dashboard' }) {
  const donutData = CAT_LIST.map(c => ({
    label: c.label,
    value: STATS.byCat[c.id] || 0,
    color: c.color,
  })).filter(d => d.value > 0);

  const isMobile = device === 'mobile';

  // Empty/error replace the data sections only — header + nav remain.
  const body = () => {
    if (state === 'loading') {
      return (
        <>
          <HeroSkel />
          <div className={isMobile ? 'grid grid-cols-3 gap-2' : 'grid grid-cols-3 gap-3'}>
            <StatSkel /><StatSkel /><StatSkel />
          </div>
          <DonutSkel />
          <RecentSkel />
        </>
      );
    }
    if (state === 'empty') {
      return (
        <>
          <HeroCard spent={0} budget={BUDGET} />
          <Card className="p-2">
            <EmptyState
              title="Brak wydatków w tym miesiącu"
              subtitle="Dodaj pierwszy wydatek, żeby zobaczyć podsumowanie i wykresy."
              cta="Dodaj pierwszy"
              onCta={onAdd}
            />
          </Card>
        </>
      );
    }
    if (state === 'error') {
      return (
        <Card className="p-2">
          <ErrorState onRetry={() => {}} />
        </Card>
      );
    }
    return (
      <>
        <HeroCard spent={STATS.month} budget={BUDGET} />
        <div className={isMobile ? 'grid grid-cols-3 gap-2' : 'grid grid-cols-3 gap-3'}>
          <StatTile compact={isMobile} label="Dziś"    amount={STATS.today} trend={+12} icon="cal" />
          <StatTile compact={isMobile} label="Tydzień" amount={STATS.week}  trend={-8}  icon="cal" />
          <StatTile compact={isMobile} label="Miesiąc" amount={STATS.month} trend={+4}  icon="cal" />
        </div>
        <DonutCard data={donutData} compact={isMobile} />
        <RecentList items={EXPENSES} />
      </>
    );
  };

  if (isMobile) {
    return (
      <MobileShell active={active} title="Pulpit" onAdd={onAdd} onNav={onNav}>
        {body()}
      </MobileShell>
    );
  }
  return (
    <DesktopShell active={active} title="Pulpit" breadcrumb="Maj 2026" onNav={onNav}
      right={
        <button onClick={onAdd} className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-[13px] font-semibold px-3 py-2">
          <Icon name="plus" size={14} stroke={2.6} />
          Dodaj wydatek
        </button>
      }
    >
      {state === 'loading' && (
        <>
          <HeroSkel />
          <div className="grid grid-cols-3 gap-4"><StatSkel /><StatSkel /><StatSkel /></div>
          <div className="grid grid-cols-2 gap-4"><DonutSkel /><RecentSkel /></div>
        </>
      )}
      {state === 'empty' && (
        <>
          <HeroCard spent={0} budget={BUDGET} />
          <Card className="p-2"><EmptyState onCta={onAdd} /></Card>
        </>
      )}
      {state === 'error' && (
        <Card className="p-2"><ErrorState onRetry={() => {}} /></Card>
      )}
      {state === 'default' && (
        <>
          <HeroCard spent={STATS.month} budget={BUDGET} />
          <div className="grid grid-cols-3 gap-4">
            <StatTile label="Dziś"    amount={STATS.today} trend={+12} icon="cal" />
            <StatTile label="Tydzień" amount={STATS.week}  trend={-8}  icon="cal" />
            <StatTile label="Miesiąc" amount={STATS.month} trend={+4}  icon="cal" />
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-4">
            <DonutCard data={donutData} />
            <RecentList items={EXPENSES} />
          </div>
        </>
      )}
    </DesktopShell>
  );
}

window.DashboardScreen = DashboardScreen;
