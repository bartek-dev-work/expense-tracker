/* global React, CATS, CAT_LIST, fmtPLN, Icon, Card, Caption, Chip, MobileShell, DesktopShell */
const { useState: useAddState, useEffect: useAddEffect, useRef: useAddRef } = React;

// Format an amount string ("1234,56") with thin-space thousands.
function formatAmountInput(raw) {
  // Keep digits and one comma.
  let s = raw.replace(/[^\d,]/g, '');
  const parts = s.split(',');
  let intPart = parts[0] || '';
  let dec = parts[1] !== undefined ? ',' + parts[1].slice(0, 2) : '';
  intPart = intPart.replace(/^0+(?=\d)/, '');
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F');
  return intPart + dec;
}

// ─── Form fields ──────────────────────────────────────────────────────────────
function AmountField({ value, onChange, error }) {
  return (
    <div>
      <label className="block text-[12px] font-semibold uppercase tracking-wider text-ink-500 dark:text-slate-400 mb-1.5">Kwota</label>
      <div
        className={[
          'relative flex items-center rounded-lg border bg-white dark:bg-slate-900/40 px-4 h-[60px] focus-within:border-brand-500',
          error ? 'border-danger' : 'border-line dark:border-line-dark',
        ].join(' ')}
      >
        <input
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(formatAmountInput(e.target.value))}
          placeholder="0,00"
          aria-label="Kwota wydatku"
          className="focus-ring flex-1 bg-transparent text-[36px] font-bold tracking-tight text-ink-900 dark:text-slate-100 num placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none"
          style={{ minWidth: 0 }}
        />
        <span className="text-[20px] font-semibold text-ink-500 dark:text-slate-400 ml-2">zł</span>
      </div>
      {error && (
        <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-danger">
          <Icon name="alert" size={14} stroke={2} />
          {error}
        </div>
      )}
    </div>
  );
}

function CategoryGrid({ value, onChange }) {
  return (
    <div>
      <label className="block text-[12px] font-semibold uppercase tracking-wider text-ink-500 dark:text-slate-400 mb-2">Kategoria</label>
      <div className="grid grid-cols-4 gap-2">
        {CAT_LIST.map(c => {
          const active = value === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onChange(c.id)}
              aria-pressed={active}
              className={[
                'focus-ring flex flex-col items-center gap-1 py-3 rounded-lg border transition-all',
                active
                  ? 'border-2 -m-px'
                  : 'border-line dark:border-line-dark bg-white dark:bg-slate-900/40 hover:border-brand-500',
              ].join(' ')}
              style={active ? { borderColor: c.color, background: c.color + '14' } : undefined}
            >
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: c.color + '1F', color: c.color }}
              >
                <Icon name={c.icon} size={18} stroke={2.2} />
              </span>
              <span className="text-[11px] font-semibold text-ink-900 dark:text-slate-100">{c.label}</span>
            </button>
          );
        })}
        {/* fill 8th cell for 4×2 visual */}
        <button
          type="button"
          className="focus-ring flex flex-col items-center gap-1 py-3 rounded-lg border-2 border-dashed border-line dark:border-line-dark text-ink-500 dark:text-slate-400"
          aria-label="Nowa kategoria"
        >
          <span className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
            <Icon name="plus" size={18} stroke={2.4} />
          </span>
          <span className="text-[11px] font-semibold">Nowa</span>
        </button>
      </div>
    </div>
  );
}

function DateField({ value, onChange }) {
  return (
    <div>
      <label className="block text-[12px] font-semibold uppercase tracking-wider text-ink-500 dark:text-slate-400 mb-1.5">Data</label>
      <div className="flex items-center gap-2">
        <Chip active={value === 'today'} onClick={() => onChange('today')}>Dziś</Chip>
        <Chip active={value === 'yesterday'} onClick={() => onChange('yesterday')}>Wczoraj</Chip>
        <button
          type="button"
          onClick={() => onChange('pick')}
          className={[
            'focus-ring inline-flex items-center gap-1.5 rounded-lg border bg-white dark:bg-slate-900/40 px-3 h-9 text-[13px] font-medium',
            value === 'pick' ? 'border-brand-500 text-brand-500' : 'border-line dark:border-line-dark text-ink-900 dark:text-slate-200',
          ].join(' ')}
        >
          <Icon name="cal" size={14} stroke={2} />
          {value === 'pick' ? '7 maja 2026' : 'Wybierz datę'}
        </button>
      </div>
    </div>
  );
}

function DescField({ value, onChange }) {
  return (
    <div>
      <label className="block text-[12px] font-semibold uppercase tracking-wider text-ink-500 dark:text-slate-400 mb-1.5" htmlFor="desc">Opis</label>
      <input
        id="desc"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="np. Lunch z pracy"
        className="focus-ring w-full h-10 rounded-lg border border-line dark:border-line-dark bg-white dark:bg-slate-900/40 px-3 text-[14px] text-ink-900 dark:text-slate-100 placeholder:text-ink-500 dark:placeholder:text-slate-500"
      />
    </div>
  );
}

function NoteField({ open, setOpen, value, onChange }) {
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="focus-ring inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-500 dark:text-brand-400"
      >
        <Icon name={open ? 'minus' : 'plus'} size={14} stroke={2.4} />
        {open ? 'Schowaj notatkę' : 'Dodaj notatkę'}
      </button>
      {open && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder="Dowolna notatka, paragon, itp."
          className="focus-ring mt-2 w-full rounded-lg border border-line dark:border-line-dark bg-white dark:bg-slate-900/40 px-3 py-2 text-[14px] text-ink-900 dark:text-slate-100 placeholder:text-ink-500 dark:placeholder:text-slate-500 resize-none"
        />
      )}
    </div>
  );
}

// ─── The core form (used in modal AND sheet) ──────────────────────────────────
function AddForm({ onCancel, onSave, dense = false }) {
  const [amount, setAmount] = useAddState('28,50');
  const [cat, setCat] = useAddState('food');
  const [date, setDate] = useAddState('today');
  const [desc, setDesc] = useAddState('Lunch z pracy');
  const [noteOpen, setNoteOpen] = useAddState(false);
  const [note, setNote] = useAddState('');
  const [error, setError] = useAddState('');

  const submit = () => {
    if (!amount || amount === '0' || amount === '0,00') {
      setError('Podaj kwotę większą od zera');
      return;
    }
    setError('');
    onSave({ amount, cat, date, desc, note });
  };

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); submit(); }}
      className={['space-y-4', dense ? '' : ''].join(' ')}
    >
      <AmountField value={amount} onChange={setAmount} error={error} />
      <CategoryGrid value={cat} onChange={setCat} />
      <DateField value={date} onChange={setDate} />
      <DescField value={desc} onChange={setDesc} />
      <NoteField open={noteOpen} setOpen={setNoteOpen} value={note} onChange={setNote} />

      <div className="pt-2 flex items-center gap-2 flex-col-reverse sm:flex-row">
        <button
          type="button"
          onClick={onCancel}
          className="focus-ring h-11 px-4 rounded-lg text-[14px] font-semibold text-ink-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 w-full sm:w-auto"
        >
          Anuluj
        </button>
        <button
          type="submit"
          className="focus-ring h-11 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-[14px] font-semibold flex-1 sm:flex-none"
        >
          Zapisz wydatek
        </button>
      </div>
    </form>
  );
}

// ─── Modal (desktop) ──────────────────────────────────────────────────────────
function AddModal({ open, onClose, onSave }) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Dodaj wydatek">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm backdrop-in" onClick={onClose} />
      <div className="relative modal-in w-[440px] max-w-[92%] max-h-[90%] overflow-y-auto rounded-2xl bg-white dark:bg-surface-dark border border-line dark:border-line-dark shadow-pop">
        <div className="flex items-center px-5 py-4 border-b border-line dark:border-line-dark">
          <h2 className="text-[18px] font-semibold text-ink-900 dark:text-slate-100">Nowy wydatek</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij"
            className="focus-ring ml-auto w-9 h-9 rounded-lg text-ink-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
          >
            <Icon name="x" size={18} stroke={2.2} />
          </button>
        </div>
        <div className="p-5">
          <AddForm onCancel={onClose} onSave={(d) => { onSave(d); onClose(); }} />
        </div>
      </div>
    </div>
  );
}

// ─── Bottom sheet (mobile) ────────────────────────────────────────────────────
function AddSheet({ open, onClose, onSave }) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-40" role="dialog" aria-modal="true" aria-label="Dodaj wydatek">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm backdrop-in" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 sheet-in rounded-t-2xl bg-white dark:bg-surface-dark border-t border-line dark:border-line-dark shadow-pop max-h-[92%] overflow-y-auto">
        <div className="pt-2 pb-1 flex justify-center">
          <span className="block w-10 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>
        <div className="flex items-center px-5 py-2">
          <h2 className="text-[16px] font-semibold text-ink-900 dark:text-slate-100">Nowy wydatek</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij"
            className="focus-ring ml-auto w-9 h-9 rounded-lg text-ink-500 dark:text-slate-400 flex items-center justify-center"
          >
            <Icon name="x" size={18} stroke={2.2} />
          </button>
        </div>
        <div className="px-5 pb-6">
          <AddForm onCancel={onClose} onSave={(d) => { onSave(d); onClose(); }} dense />
        </div>
      </div>
    </div>
  );
}

// ─── Add screen (preview both layouts inline; tap "+" opens overlay) ──────────
function AddScreen({ device, onNav, active = 'add', onSavedToast }) {
  const isMobile = device === 'mobile';
  const [open, setOpen] = useAddState(true); // start open in this screen — it IS the screen.

  const onSave = () => { setOpen(false); onSavedToast && onSavedToast(); setTimeout(() => setOpen(true), 250); };

  if (isMobile) {
    return (
      <MobileShell active={active} title="Dodaj" onAdd={() => setOpen(true)} onNav={onNav}>
        <Card className="p-4">
          <Caption>Podgląd formularza</Caption>
          <p className="mt-1 text-sm text-ink-500 dark:text-slate-400">
            Na mobile formularz otwiera się jako bottom-sheet z grip handle.
            Stuknij <strong className="text-ink-900 dark:text-slate-100">„+”</strong>, żeby zobaczyć animację.
          </p>
        </Card>
        <Card className="p-5">
          <AddForm onCancel={() => {}} onSave={onSave} />
        </Card>
        <AddSheet open={open && device === 'mobile'} onClose={() => setOpen(false)} onSave={onSave} />
      </MobileShell>
    );
  }

  return (
    <DesktopShell active={active} title="Dodaj wydatek" breadcrumb="Pulpit / Nowy wpis" onNav={onNav}>
      <Card className="p-4">
        <Caption>Podgląd modala</Caption>
        <p className="mt-1 text-sm text-ink-500 dark:text-slate-400">
          Na desktop formularz otwiera się jako modal centrowany z efektem backdrop-blur. Kliknij{' '}
          <strong className="text-ink-900 dark:text-slate-100">„Dodaj wydatek”</strong> w prawym górnym rogu, żeby ponownie otworzyć modal.
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-4 items-start">
        <Card className="p-5">
          <h3 className="text-[15px] font-semibold mb-3 text-ink-900 dark:text-slate-100">Inline (na stronie)</h3>
          <AddForm onCancel={() => {}} onSave={onSave} />
        </Card>
        <Card className="p-5 bg-slate-100/70 dark:bg-slate-900/40">
          <h3 className="text-[15px] font-semibold mb-3 text-ink-900 dark:text-slate-100">Stany walidacji</h3>
          <div className="space-y-3">
            <AmountField value="" onChange={() => {}} error="Podaj kwotę większą od zera" />
            <div className="text-[12px] text-ink-500 dark:text-slate-400">Inputy: pusty + błąd, focus, wypełniony.</div>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Focus state" autoFocus={false} className="focus-ring h-10 rounded-lg border-2 border-brand-500 bg-white dark:bg-slate-900/60 px-3 text-[14px] text-ink-900 dark:text-slate-100" defaultValue="Biedronka" />
              <input placeholder="Domyślny" className="h-10 rounded-lg border border-line dark:border-line-dark bg-white dark:bg-slate-900/40 px-3 text-[14px] text-ink-500 dark:text-slate-500" />
            </div>
          </div>
        </Card>
      </div>

      <AddModal open={open && device === 'desktop'} onClose={() => setOpen(false)} onSave={onSave} />
    </DesktopShell>
  );
}

Object.assign(window, { AddForm, AddModal, AddSheet, AddScreen });
