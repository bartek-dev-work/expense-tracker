import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { CATEGORIES } from '@/lib/categories';
import { todayIso } from '@/lib/format';
import { useExpensesStore } from '@/store/expenses';
import { useToastStore } from '@/store/toast';
import type { CategoryId } from '@/types/expense';

const schema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: 'Podaj kwotę' })
    .positive('Kwota musi być większa od zera')
    .max(1_000_000, 'Maksymalnie 1 000 000'),
  category: z.enum(['food', 'transport', 'bills', 'fun', 'other'] as const, {
    errorMap: () => ({ message: 'Wybierz kategorię' }),
  }),
  date: z
    .string()
    .min(1, 'Wybierz datę')
    .refine((v) => new Date(v) <= new Date(), 'Data nie może być z przyszłości'),
  description: z.string().trim().min(2, 'Min. 2 znaki').max(80, 'Max. 80 znaków'),
  note: z.string().max(240, 'Max. 240 znaków').optional(),
});

type FormValues = z.input<typeof schema>;

export function AddExpense(): JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const items = useExpensesStore((s) => s.items);
  const add = useExpensesStore((s) => s.add);
  const update = useExpensesStore((s) => s.update);
  const push = useToastStore((s) => s.push);

  const editing = id ? items.find((e) => e.id === id) : undefined;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: undefined,
      category: 'food',
      date: todayIso(),
      description: '',
      note: '',
    },
  });

  useEffect(() => {
    if (editing) {
      reset({
        amount: editing.amount,
        category: editing.category,
        date: editing.date,
        description: editing.description,
        note: editing.note ?? '',
      });
    }
  }, [editing, reset]);

  const selectedCategory = watch('category');

  const close = (): void => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/expenses', { replace: true });
  };

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      amount: Number(values.amount),
      category: values.category,
      date: values.date,
      description: values.description,
      note: values.note?.trim() ? values.note : undefined,
    };
    try {
      if (editing) {
        await update(editing.id, payload);
        push('Zaktualizowano wydatek');
      } else {
        await add(payload);
        push('Dodano wydatek');
      }
      close();
    } catch {
      push('Nie udało się zapisać', 'error');
    }
  });

  return (
    <Modal open onClose={close} title={editing ? 'Edytuj wydatek' : 'Nowy wydatek'}>
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <Field name="amount" label="Kwota (zł)" error={errors.amount?.message}>
          {(p) => (
            <input
              {...p}
              {...register('amount')}
              type="number"
              step="0.01"
              inputMode="decimal"
              placeholder="0,00"
              className="focus-ring w-full h-14 px-3 text-3xl font-bold rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-slate-900 num"
            />
          )}
        </Field>

        <CategoryGroup
          value={selectedCategory}
          error={errors.category?.message}
          onChange={(v) => setValue('category', v, { shouldValidate: true })}
        />

        <Field name="date" label="Data" error={errors.date?.message}>
          {(p) => (
            <input
              {...p}
              {...register('date')}
              type="date"
              max={todayIso()}
              className="focus-ring w-full h-11 px-3 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-slate-900"
            />
          )}
        </Field>

        <Field name="description" label="Opis" error={errors.description?.message}>
          {(p) => (
            <input
              {...p}
              {...register('description')}
              type="text"
              placeholder="np. Lunch z pracy"
              className="focus-ring w-full h-11 px-3 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-slate-900"
            />
          )}
        </Field>

        <Field name="note" label="Notatka (opcjonalna)" error={errors.note?.message}>
          {(p) => (
            <textarea
              {...p}
              {...register('note')}
              rows={2}
              className="focus-ring w-full px-3 py-2 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-slate-900 resize-none"
            />
          )}
        </Field>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={close}
            className="focus-ring h-11 px-4 rounded-lg border border-line dark:border-line-dark text-sm font-semibold"
          >
            Anuluj
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="focus-ring flex-1 h-11 rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-semibold shadow-fab"
          >
            {isSubmitting ? 'Zapisywanie…' : editing ? 'Zapisz zmiany' : 'Zapisz wydatek'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

interface FieldRenderProps {
  id: string;
  'aria-invalid': boolean;
  'aria-describedby'?: string;
}

interface FieldProps {
  name: string;
  label: string;
  error?: string | undefined;
  children: (props: FieldRenderProps) => React.ReactNode;
}

function Field({ name, label, error, children }: FieldProps): JSX.Element {
  const errorId = error ? `err-${name}` : undefined;
  const renderProps: FieldRenderProps = {
    id: name,
    'aria-invalid': Boolean(error),
    ...(errorId ? { 'aria-describedby': errorId } : {}),
  };
  return (
    <div>
      <label htmlFor={name} className="caption text-ink-500 dark:text-slate-500 mb-1.5 block">
        {label}
      </label>
      {children(renderProps)}
      {error && (
        <span id={errorId} role="alert" className="mt-1.5 block text-xs font-medium text-danger">
          {error}
        </span>
      )}
    </div>
  );
}

interface CategoryGroupProps {
  value: CategoryId;
  error?: string | undefined;
  onChange: (id: CategoryId) => void;
}

function CategoryGroup({ value, error, onChange }: CategoryGroupProps): JSX.Element {
  const errorId = error ? 'err-category' : undefined;
  return (
    <div>
      <span className="caption text-ink-500 dark:text-slate-500 mb-1.5 block">Kategoria</span>
      <div
        role="radiogroup"
        aria-label="Kategoria"
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        className="grid grid-cols-3 gap-2"
      >
        {CATEGORIES.map((c) => {
          const active = value === c.id;
          return (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(c.id)}
              className={[
                'focus-ring rounded-lg border px-3 py-2.5 text-sm font-medium text-left transition-colors',
                active
                  ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                  : 'border-line dark:border-line-dark hover:bg-slate-50 dark:hover:bg-slate-800/60',
              ].join(' ')}
            >
              <div
                className="w-6 h-6 rounded-full mb-1.5"
                style={{ background: c.color }}
                aria-hidden
              />
              {c.label}
            </button>
          );
        })}
      </div>
      {error && (
        <span id={errorId} role="alert" className="mt-1.5 block text-xs font-medium text-danger">
          {error}
        </span>
      )}
    </div>
  );
}
