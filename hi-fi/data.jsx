/* global React */
// Polish formatting helpers + mock data + Icon set (inline lucide-style SVGs).

const MONTHS_PL = ['stycznia','lutego','marca','kwietnia','maja','czerwca','lipca','sierpnia','września','października','listopada','grudnia'];
const WEEKDAYS_PL = ['niedz.','pon.','wt.','śr.','czw.','pt.','sob.'];

function fmtPLN(n, opts = {}) {
  const { sign = false, decimals = 2 } = opts;
  const abs = Math.abs(n);
  const parts = abs.toFixed(decimals).split('.');
  // Thin space U+202F looks great as Polish thousands separator and avoids odd line wraps.
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F');
  const body = decimals > 0 ? parts.join(',') : parts[0];
  const s = (n < 0 ? '\u2212' : sign && n > 0 ? '+' : '') + body + '\u00A0zł';
  return s;
}

function fmtDayPl(d) {
  const date = new Date(d);
  return `${WEEKDAYS_PL[date.getDay()]}, ${date.getDate()} ${MONTHS_PL[date.getMonth()]}`;
}
function fmtDayShortPl(d) {
  const date = new Date(d);
  return `${date.getDate()} ${MONTHS_PL[date.getMonth()]}`;
}

// ─── Categories ──────────────────────────────────────────────────────────────
const CATS = {
  food:      { id: 'food',      label: 'Jedzenie', color: '#F97316', icon: 'utensils' },
  transport: { id: 'transport', label: 'Transport', color: '#06B6D4', icon: 'bus' },
  bills:     { id: 'bills',     label: 'Rachunki',  color: '#8B5CF6', icon: 'receipt' },
  fun:       { id: 'fun',       label: 'Rozrywka',  color: '#EC4899', icon: 'music' },
  other:     { id: 'other',     label: 'Inne',      color: '#64748B', icon: 'package' },
};
const CAT_LIST = Object.values(CATS);

// ─── Expenses (May 2026) ─────────────────────────────────────────────────────
// We'll fix "today" to 7 maja 2026 so the layout always reads sensibly.
const TODAY = new Date(2026, 4, 7); // 7 May 2026 — matches header copy.

function d(off) {
  const x = new Date(TODAY); x.setDate(x.getDate() - off); x.setHours(12,0,0,0);
  return x;
}

const EXPENSES = [
  // Today (7 maja)
  { id: 'e1',  amount:  28.50, cat: 'food',      desc: 'Lunch z pracy',         tag: 'BliskoBistro',  date: d(0) },
  { id: 'e2',  amount:   4.80, cat: 'transport', desc: 'Bilet MPK',             tag: 'Komunikacja',   date: d(0) },
  { id: 'e3',  amount:  19.99, cat: 'fun',       desc: 'Spotify Premium',       tag: 'Subskrypcja',   date: d(0) },
  // Wczoraj (6 maja)
  { id: 'e4',  amount: 134.20, cat: 'food',      desc: 'Biedronka',             tag: 'Zakupy tygodniowe', date: d(1) },
  { id: 'e5',  amount:  22.00, cat: 'transport', desc: 'Bolt',                  tag: 'Powrót do domu', date: d(1) },
  // 5 maja
  { id: 'e6',  amount:  43.50, cat: 'fun',       desc: 'Netflix',               tag: 'Subskrypcja',   date: d(2) },
  { id: 'e7',  amount:  17.40, cat: 'other',     desc: 'Apteka',                tag: 'Zdrowie',       date: d(2) },
  // 4 maja
  { id: 'e8',  amount: 289.00, cat: 'bills',     desc: 'Prąd – kwiecień',       tag: 'Rachunki',      date: d(3) },
  { id: 'e9',  amount:  56.30, cat: 'food',      desc: 'Lidl',                  tag: 'Zakupy',        date: d(3) },
  // 3 maja
  { id: 'e10', amount:  12.00, cat: 'transport', desc: 'Bilet MPK',             tag: 'Komunikacja',   date: d(4) },
  { id: 'e11', amount:  68.00, cat: 'fun',       desc: 'Kino Helios',           tag: 'Wieczór',       date: d(4) },
  // 2 maja
  { id: 'e12', amount: 159.00, cat: 'bills',     desc: 'Internet – maj',        tag: 'Abonament',     date: d(5) },
  { id: 'e13', amount:  92.40, cat: 'food',      desc: 'Carrefour',             tag: 'Zakupy',        date: d(5) },
  // 1 maja
  { id: 'e14', amount:  18.00, cat: 'food',      desc: 'Kawa + ciastko',        tag: 'Costa',         date: d(6) },
  { id: 'e15', amount: 410.00, cat: 'bills',     desc: 'Czynsz – maj',          tag: 'Mieszkanie',    date: d(6) },
];

// Aggregate totals
function sumByCat(items) {
  const o = {};
  for (const e of items) o[e.cat] = (o[e.cat] || 0) + e.amount;
  return o;
}
function sumAll(items) { return items.reduce((a,b) => a + b.amount, 0); }

const TOTAL_MONTH = sumAll(EXPENSES);          // ≈ 1374.99 zł — but spec says 2480 zł.
const BUDGET = 4000;
// To match the spec's hero number we surface a "spent so far in May" derived from EXPENSES + earlier-month entries.
// We'll inject a synthetic earlier-month chunk so the visible card reads ~2 480 zł — keeps the demo coherent without faking the list.
const EARLIER_MAY = 2480 - TOTAL_MONTH; // ≈ 1105 zł of expenses earlier in May not shown in the recent list

const STATS = {
  today:    sumAll(EXPENSES.filter(e => e.date.toDateString() === TODAY.toDateString())),
  week:     sumAll(EXPENSES.filter(e => (TODAY - e.date) / 86400000 <= 7)),
  month:    2480,
  budget:   BUDGET,
  byCat:    sumByCat(EXPENSES),
  prevMonth: 2780, // for VS poprzedni miesiąc card
};

// ─── Bar chart series (dni tygodnia) ─────────────────────────────────────────
const WEEK_BARS = [
  { day: 'Pn', amount: 142 },
  { day: 'Wt', amount:  88 },
  { day: 'Śr', amount: 230 },
  { day: 'Cz', amount:  64 },
  { day: 'Pt', amount: 312 },
  { day: 'Sb', amount: 195 },
  { day: 'Nd', amount: 110 },
];
const MONTH_BARS = Array.from({ length: 14 }, (_, i) => ({
  day: `${i + 1}.05`, amount: Math.round(40 + Math.random() * 280),
}));
const YEAR_BARS = ['Sty','Lut','Mar','Kwi','Maj','Cze','Lip','Sie','Wrz','Paź','Lis','Gru']
  .map((m, i) => ({ day: m, amount: i <= 4 ? Math.round(2200 + Math.random() * 900) : 0 }));

// ─── Icons (lucide-flavored, MIT-inspired stroke set) ────────────────────────
// Each icon is a function returning the inner SVG markup.
const ICONS = {
  wallet:   '<path d="M19 7H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1"/><path d="M21 11h-6a2 2 0 0 0 0 4h6"/><path d="M3 9V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"/>',
  search:   '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  plus:     '<path d="M12 5v14M5 12h14"/>',
  minus:    '<path d="M5 12h14"/>',
  x:        '<path d="M18 6 6 18M6 6l12 12"/>',
  check:    '<path d="M20 6 9 17l-5-5"/>',
  sun:      '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  moon:     '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>',
  home:     '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
  list:     '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6"  r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
  bar:      '<path d="M3 3v18h18"/><rect x="7"  y="11" width="3" height="7" rx="1"/><rect x="12" y="6"  width="3" height="12" rx="1"/><rect x="17" y="14" width="3" height="4" rx="1"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09c0 .66.39 1.26 1 1.51a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82c.25.61.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09c-.66 0-1.26.39-1.51 1Z"/>',
  bell:     '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  logout:   '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
  user:     '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  chevdown: '<path d="m6 9 6 6 6-6"/>',
  chevright:'<path d="m9 6 6 6-6 6"/>',
  arrowup:  '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
  arrowdown:'<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
  trend_up: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  trend_dn: '<polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/>',
  more:     '<circle cx="12" cy="5"  r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>',
  edit:     '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  trash:    '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  alert:    '<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><circle cx="12" cy="16" r=".75" fill="currentColor"/>',
  refresh:  '<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>',
  cal:      '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8"  y1="2" x2="8"  y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  filter:   '<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>',
  utensils: '<path d="M3 2v7c0 1.1.9 2 2 2s2-.9 2-2V2"/><path d="M5 11v11"/><path d="M19 2v20"/><path d="M19 12c-2 0-3-1-3-3V2"/>',
  bus:      '<path d="M8 6v6"/><path d="M16 6v6"/><path d="M2 12h19.6"/><path d="M18 18h2a1 1 0 0 0 1-1v-6.5a4 4 0 0 0-1.2-2.8L18 6H6L4.2 7.7A4 4 0 0 0 3 10.5V17a1 1 0 0 0 1 1h2"/><circle cx="7"  cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  receipt:  '<path d="M4 2v20l3-2 3 2 3-2 3 2 3-2V2H4Z"/><path d="M16 8H8"/><path d="M16 12H8"/><path d="M13 16H8"/>',
  music:    '<path d="M9 18V5l12-2v13"/><circle cx="6"  cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  package:  '<path d="m7.5 4.27 9 5.15"/><path d="M21 8 12 3 3 8l9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
  shopping: '<circle cx="9"  cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>',
  empty:    '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M8 14h2"/>', // generic
};

function Icon(props) {
  const name = props.name;
  const size = props.size != null ? props.size : 18;
  const strokeW = props.stroke != null ? props.stroke : 2;
  const className = props.className || '';
  const style = props.style || {};
  const inner = ICONS[name];
  if (!inner) return null;
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round" strokeLinejoin="round"
      className={className} style={style}
      aria-hidden="true" focusable="false"
      stroke="currentColor"
      strokeWidth={strokeW}
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  );
}

Object.assign(window, {
  fmtPLN, fmtDayPl, fmtDayShortPl,
  CATS, CAT_LIST,
  EXPENSES, STATS, BUDGET, TODAY,
  WEEK_BARS, MONTH_BARS, YEAR_BARS,
  Icon, ICONS,
});
