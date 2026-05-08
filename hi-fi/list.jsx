/* global React, EXPENSES, CATS, CAT_LIST, fmtPLN, fmtDayPl,
   Card, CatBubble, Caption, Chip, Skel, EmptyState, ErrorState, Icon, Tag,
   MobileShell, DesktopShell */
const { useState: useListState, useMemo: useListMemo } = React;

const RANGE_FILTERS = [
  { id: 'today', label: 'Dziś' },
  { id: 'week',  label: 'Tydzień' },
  { id: 'month', label: 'Miesiąc' },
  { id: 'range', label: 'Zakres' },
];

function groupByDay(items) {
  const map = new Map();
  for (const e of items) {
    const key = new Date(e.date.getFullYear(), e.date.getMonth(), e.date.getDate()).getTime();
    if (!map.has(key)) map.set(key, { date: e.date, items: [], total: 0 });
    const g = map.get(key);
    g.items.push(e);
    g.total += e.amount;
  }
  return [...map.values()].sort((a, b) => b.date - a.date);
}

function ListRow({ e, last }) {
  const c = CATS[e.cat];
  return (
    <li className={['flex items-center gap-3 px-4 py-3', last ? '' : 'border-b border-line dark:border-line-dark'].join(' ')}>
      <CatBubble cat={e.cat} size={40} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[14px] font-semibold text-ink-900 dark:text-slate-100 truncate">{e.desc}</span>
          <Tag color={c.color}>{c.label}</Tag>
        </div>
        <div className="text-[12px] text-ink-500 dark:text-slate-400">{e.tag}</div>
      </div>
      <div className="text-right">
        <div className="num text-[14px] font-semibold text-ink-900 dark:text-slate-100">−{fmtPLN(e.amount)}</div>
      </div>
      <button
        type="button"
        aria-label="Więcej akcji"
        className="focus-ring w-9 h-9 rounded-lg text-ink-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
      >
        <Icon name="more" size={16} stroke={2} />
      </button>
    </li>
  );
}

function DayGroup({ group }) {
  return (
    <div>
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border-y border-line dark:border-line-dark">
        <div className="text-[12px] font-semibold uppercase tracking-wider text-ink-500 dark:text-slate-400">{fmtDayPl(group.date)}</div>
        <div className="ml-auto num text-[12px] font-semibold text-ink-900 dark:text-slate-100">{fmtPLN(group.total)}</div>
      </div>
      <ul>
        {group.items.map((e, i) => <ListRow key={e.id} e={e} last={i === group.items.length - 1} />)}
      </ul>
    </div>
  );
}

function FiltersBar({ range, setRange, cats, toggleCat, sort, setSort, dense = false }) {
  return (
    <div className="space-y-3">
      {/* search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 dark:text-slate-500"><Icon name="search" size={16} stroke={2} /></span>
        <input
          type="search"
          placeholder="Szukaj wydatków…"
          aria-label="Szukaj wydatków"
          className="focus-ring w-full pl-9 pr-3 h-10 rounded-lg border border-line dark:border-line-dark bg-white dark:bg-surface-dark text-[14px] text-ink-900 dark:text-slate-100 placeholder:text-ink-500 dark:placeholder:text-slate-500"
        />
      </div>

      {/* date range chips */}
      <div className="flex items-center gap-2 overflow-x-auto frame-scroll pb-1 -mx-1 px-1">
        {RANGE_FILTERS.map(r => (
          <Chip key={r.id} active={range === r.id} onClick={() => setRange(r.id)}>{r.label}</Chip>
        ))}
      </div>

      {/* category chips + sort */}
      <div className="flex flex-wrap items-center gap-2">
        {CAT_LIST.map(c => (
          <Chip key={c.id} active={cats.includes(c.id)} dot color={c.color} onClick={() => toggleCat(c.id)}>
            {c.label}
          </Chip>
        ))}
        <div className="ml-auto">
          <button
            onClick={() => setSort(sort === 'date-desc' ? 'amount-desc' : sort === 'amount-desc' ? 'amount-asc' : 'date-desc')}
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-line dark:border-line-dark bg-white dark:bg-surface-dark px-3 h-9 text-[12px] font-medium text-ink-900 dark:text-slate-200"
          >
            <Icon name="filter" size={14} stroke={2} />
            {sort === 'date-desc' && 'Data ↓'}
            {sort === 'amount-desc' && 'Kwota ↓'}
            {sort === 'amount-asc' && 'Kwota ↑'}
            <Icon name="chevdown" size={14} stroke={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ListSkel({ rows = 5 }) {
  return (
    <Card className="overflow-hidden">
      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 flex items-center"><Skel w={120} h={10} /><div className="ml-auto"><Skel w={70} h={10} /></div></div>
      <ul className="divide-y divide-line dark:divide-line-dark">
        {Array.from({ length: rows }).map((_, i) => (
          <li key={i} className="flex items-center gap-3 px-4 py-3">
            <Skel w={40} h={40} r={999} />
            <div className="flex-1 space-y-2"><Skel w="70%" h={12} /><Skel w="40%" h={10} /></div>
            <Skel w={70} h={14} />
          </li>
        ))}
      </ul>
    </Card>
  );
}

function ListBody({ state, onAdd }) {
  const [range, setRange] = useListState('month');
  const [cats, setCats] = useListState([]);
  const [sort, setSort] = useListState('date-desc');

  const items = useListMemo(() => {
    let xs = [...EXPENSES];
    if (cats.length) xs = xs.filter(e => cats.includes(e.cat));
    if (sort === 'date-desc') xs.sort((a,b) => b.date - a.date);
    if (sort === 'amount-desc') xs.sort((a,b) => b.amount - a.amount);
    if (sort === 'amount-asc')  xs.sort((a,b) => a.amount - b.amount);
    return xs;
  }, [cats, sort]);

  const groups = useListMemo(() => groupByDay(items), [items]);

  const toggleCat = (id) =>
    setCats(cs => cs.includes(id) ? cs.filter(x => x !== id) : [...cs, id]);

  return (
    <>
      <FiltersBar range={range} setRange={setRange} cats={cats} toggleCat={toggleCat} sort={sort} setSort={setSort} />

      {state === 'loading' && <ListSkel rows={6} />}
      {state === 'empty' && (
        <Card className="p-2"><EmptyState onCta={onAdd} /></Card>
      )}
      {state === 'error' && (
        <Card className="p-2"><ErrorState onRetry={() => {}} /></Card>
      )}
      {state === 'default' && (
        <Card className="overflow-hidden">
          <div className="divide-y divide-line dark:divide-line-dark">
            {groups.map(g => <DayGroup key={g.date.toString()} group={g} />)}
          </div>
        </Card>
      )}
    </>
  );
}

function ListScreen({ state, device, onAdd, onNav, active = 'list' }) {
  const isMobile = device === 'mobile';
  if (isMobile) {
    return (
      <MobileShell active={active} title="Wydatki" onAdd={onAdd} onNav={onNav}>
        <ListBody state={state} onAdd={onAdd} />
      </MobileShell>
    );
  }
  return (
    <DesktopShell
      active={active} title="Wydatki" breadcrumb="Maj 2026" onNav={onNav}
      right={
        <button onClick={onAdd} className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-[13px] font-semibold px-3 py-2">
          <Icon name="plus" size={14} stroke={2.6} />
          Dodaj wydatek
        </button>
      }
    >
      <ListBody state={state} onAdd={onAdd} />
    </DesktopShell>
  );
}

window.ListScreen = ListScreen;
