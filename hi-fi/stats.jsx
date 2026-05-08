/* global React, Recharts, fmtPLN, CATS, CAT_LIST, STATS, WEEK_BARS, MONTH_BARS, YEAR_BARS,
   Card, Caption, Segmented, Skel, EmptyState, ErrorState, TrendPill, Icon, Tag,
   MobileShell, DesktopShell */
const { useState: useStatsState, useMemo: useStatsMemo, useEffect: useStatsEffect } = React;

function BarChartCard({ data, height = 220 }) {
  const { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } = Recharts;
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <Caption>Wydatki w czasie</Caption>
        <span className="text-[12px] text-ink-500 dark:text-slate-400 num">
          razem {fmtPLN(data.reduce((a, b) => a + b.amount, 0), { decimals: 0 })}
        </span>
      </div>
      <div className="mt-3" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 4, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#818CF8" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(100,116,139,0.15)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false}
              tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 500 }} className="text-ink-500 dark:text-slate-400" />
            <YAxis tickLine={false} axisLine={false}
              tick={{ fill: 'currentColor', fontSize: 11 }} className="text-ink-500 dark:text-slate-400"
              width={36} tickFormatter={(v) => v >= 1000 ? (v/1000).toFixed(1) + 'k' : v} />
            <Tooltip
              cursor={{ fill: 'rgba(99,102,241,0.08)' }}
              contentStyle={{
                background: 'rgba(15,23,42,0.95)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12,
              }}
              labelStyle={{ color: '#cbd5e1' }}
              formatter={(v) => [fmtPLN(v), 'Wydatki']}
            />
            <Bar dataKey="amount" radius={[6, 6, 2, 2]} fill="url(#barGrad)" animationDuration={900} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function VsPrevCard({ current, prev }) {
  const diff = current - prev;
  const pct = prev ? (diff / prev) * 100 : 0;
  return (
    <Card className="p-4">
      <Caption>Vs poprzedni miesiąc</Caption>
      <div className="mt-2 flex items-baseline gap-2 flex-wrap">
        <span className={['text-[26px] font-bold tracking-tight num', diff >= 0 ? 'text-danger' : 'text-ok'].join(' ')}>
          {diff >= 0 ? '+' : '−'}{fmtPLN(Math.abs(diff))}
        </span>
        <TrendPill value={pct} />
      </div>
      <div className="mt-1 text-[12px] text-ink-500 dark:text-slate-400 num">
        Maj {fmtPLN(current, { decimals: 0 })} · Kwiecień {fmtPLN(prev, { decimals: 0 })}
      </div>
    </Card>
  );
}

function TopCategoriesCard() {
  const sorted = CAT_LIST
    .map(c => ({ ...c, value: STATS.byCat[c.id] || 0 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);
  const max = sorted[0]?.value || 1;
  const [tick, setTick] = useStatsState(0);
  useStatsEffect(() => { const t = setTimeout(() => setTick(1), 80); return () => clearTimeout(t); }, []);
  return (
    <Card className="p-4">
      <Caption>Top 3 kategorie</Caption>
      <ul className="mt-3 space-y-3">
        {sorted.map((c, i) => {
          const pct = (c.value / max) * 100;
          return (
            <li key={c.id} className="flex items-center gap-3">
              <span className="w-6 text-[12px] font-bold text-ink-500 dark:text-slate-400 num">#{i + 1}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-ink-900 dark:text-slate-100">{c.label}</span>
                  <span className="ml-auto num text-[13px] font-semibold text-ink-900 dark:text-slate-100">{fmtPLN(c.value, { decimals: 0 })}</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-[width] duration-700 ease-out"
                    style={{ width: tick ? pct + '%' : '0%', background: c.color }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function MicroTilesGrid({ avg, biggest }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="p-4">
        <Caption>Średnia dzienna</Caption>
        <div className="mt-2 text-[20px] font-bold tracking-tight num text-ink-900 dark:text-slate-100">{fmtPLN(avg)}</div>
        <div className="text-[12px] text-ink-500 dark:text-slate-400">w maju</div>
      </Card>
      <Card className="p-4">
        <Caption>Największy wydatek</Caption>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[20px] font-bold tracking-tight num text-ink-900 dark:text-slate-100">{fmtPLN(biggest.amount)}</span>
          <Tag color={CATS[biggest.cat].color}>{CATS[biggest.cat].label}</Tag>
        </div>
        <div className="text-[12px] text-ink-500 dark:text-slate-400 truncate">{biggest.desc}</div>
      </Card>
    </div>
  );
}

function ChartSkel({ height = 220 }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between"><Skel w={140} h={10} /><Skel w={80} h={10} /></div>
      <div className="mt-3 flex items-end gap-2" style={{ height }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex-1 rounded-md bg-slate-200 dark:bg-slate-700/60 animate-pulse" style={{ height: `${30 + (i * 9) % 70}%` }} />
        ))}
      </div>
    </Card>
  );
}

function StatsBody({ state }) {
  const [range, setRange] = useStatsState('week');
  const data = range === 'week' ? WEEK_BARS : range === 'month' ? MONTH_BARS : YEAR_BARS;

  // Use a key on the chart wrapper so re-mount triggers Recharts' bar grow animation when range changes.
  const key = range;

  if (state === 'loading') {
    return (
      <>
        <div className="flex items-center justify-between">
          <Segmented value={range} onChange={setRange} items={[
            { value: 'week', label: 'Tydzień' }, { value: 'month', label: 'Miesiąc' }, { value: 'year', label: 'Rok' },
          ]} />
        </div>
        <ChartSkel />
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4"><Skel w={100} h={10} /><div className="mt-2"><Skel w={140} h={22} /></div></Card>
          <Card className="p-4"><Skel w={100} h={10} /><div className="mt-2"><Skel w={120} h={22} /></div></Card>
        </div>
        <Card className="p-4"><Skel w={140} h={10} /><div className="mt-3 space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skel key={i} h={10} />)}</div></Card>
      </>
    );
  }
  if (state === 'empty') {
    return (
      <>
        <Segmented value={range} onChange={setRange} items={[
          { value: 'week', label: 'Tydzień' }, { value: 'month', label: 'Miesiąc' }, { value: 'year', label: 'Rok' },
        ]} />
        <Card className="p-2"><EmptyState title="Brak danych do statystyk" subtitle="Dodaj kilka wydatków, żeby zobaczyć wykresy." cta="Dodaj wydatek" /></Card>
      </>
    );
  }
  if (state === 'error') {
    return (
      <>
        <Segmented value={range} onChange={setRange} items={[
          { value: 'week', label: 'Tydzień' }, { value: 'month', label: 'Miesiąc' }, { value: 'year', label: 'Rok' },
        ]} />
        <Card className="p-2"><ErrorState onRetry={() => {}} /></Card>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Segmented value={range} onChange={setRange} items={[
          { value: 'week', label: 'Tydzień' }, { value: 'month', label: 'Miesiąc' }, { value: 'year', label: 'Rok' },
        ]} />
        <span className="text-[12px] text-ink-500 dark:text-slate-400">
          {range === 'week' ? '1 maja – 7 maja' : range === 'month' ? '1 maja – 14 maja' : '2026'}
        </span>
      </div>
      <div key={key}><BarChartCard data={data} /></div>
      <div className="grid grid-cols-2 gap-3">
        <VsPrevCard current={STATS.month} prev={STATS.prevMonth} />
        <Card className="p-4">
          <Caption>Średnia tygodniowa</Caption>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-[20px] font-bold num text-ink-900 dark:text-slate-100">{fmtPLN(STATS.month / 4.3, { decimals: 0 })}</span>
            <TrendPill value={-3} />
          </div>
          <div className="text-[12px] text-ink-500 dark:text-slate-400">Mniej niż w kwietniu</div>
        </Card>
      </div>
      <TopCategoriesCard />
      <MicroTilesGrid
        avg={STATS.month / 7}
        biggest={{ amount: 410, cat: 'bills', desc: 'Czynsz – maj' }}
      />
    </>
  );
}

function StatsScreen({ state, device, onAdd, onNav, active = 'stats' }) {
  const isMobile = device === 'mobile';
  if (isMobile) {
    return (
      <MobileShell active={active} title="Statystyki" onAdd={onAdd} onNav={onNav}>
        <StatsBody state={state} />
      </MobileShell>
    );
  }
  return (
    <DesktopShell active={active} title="Statystyki" breadcrumb="Maj 2026" onNav={onNav}>
      {state === 'default' ? (
        <>
          <div className="flex items-center justify-between">
            <Segmented
              value="week"
              onChange={() => {}}
              items={[
                { value: 'week', label: 'Tydzień' }, { value: 'month', label: 'Miesiąc' }, { value: 'year', label: 'Rok' },
              ]}
            />
            <span className="text-[12px] text-ink-500 dark:text-slate-400">1 maja – 7 maja</span>
          </div>
          <BarChartCard data={WEEK_BARS} height={260} />
          <div className="grid grid-cols-3 gap-4">
            <VsPrevCard current={STATS.month} prev={STATS.prevMonth} />
            <Card className="p-4">
              <Caption>Średnia tygodniowa</Caption>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-[24px] font-bold num text-ink-900 dark:text-slate-100">{fmtPLN(STATS.month / 4.3, { decimals: 0 })}</span>
                <TrendPill value={-3} />
              </div>
              <div className="text-[12px] text-ink-500 dark:text-slate-400">Mniej niż w kwietniu</div>
            </Card>
            <Card className="p-4">
              <Caption>Średnia dzienna</Caption>
              <div className="mt-2 text-[24px] font-bold num text-ink-900 dark:text-slate-100">{fmtPLN(STATS.month / 7)}</div>
              <div className="text-[12px] text-ink-500 dark:text-slate-400">w maju</div>
            </Card>
          </div>
          <div className="grid grid-cols-[1fr_1fr] gap-4">
            <TopCategoriesCard />
            <Card className="p-4">
              <Caption>Największy wydatek</Caption>
              <div className="mt-3 flex items-center gap-3">
                <span className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#8B5CF61F', color: '#8B5CF6' }}>
                  <Icon name="receipt" size={20} stroke={2.2} />
                </span>
                <div className="min-w-0">
                  <div className="text-[15px] font-semibold text-ink-900 dark:text-slate-100">Czynsz – maj</div>
                  <div className="text-[12px] text-ink-500 dark:text-slate-400">1 maja · Mieszkanie</div>
                </div>
                <div className="ml-auto text-[20px] font-bold num text-ink-900 dark:text-slate-100">−{fmtPLN(410)}</div>
              </div>
              <div className="mt-4 h-px bg-line dark:bg-line-dark" />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <Caption>Liczba transakcji</Caption>
                  <div className="mt-1 text-[18px] font-bold num text-ink-900 dark:text-slate-100">15</div>
                </div>
                <div>
                  <Caption>Najczęstsza</Caption>
                  <div className="mt-1 text-[14px] font-semibold text-ink-900 dark:text-slate-100">Jedzenie</div>
                </div>
              </div>
            </Card>
          </div>
        </>
      ) : (
        <StatsBody state={state} />
      )}
    </DesktopShell>
  );
}

window.StatsScreen = StatsScreen;
