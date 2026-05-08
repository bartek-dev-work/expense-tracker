import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
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
      navigate('/expenses');
    } catch {
      push('Nie udało się zapisać', 'error');
    }
  });

  return (
    <>
      <PageHeader
        eyebrow="03 · Dodaj"
        title={editing ? 'Edytuj wydatek' : 'Nowy wydatek'}
        subtitle="Wypełnij formularz, walidacja jest włączona po stronie klienta."
      />

      <Card className="p-6 max-w-xl">
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <Field label="Kwota (zł)" error={errors.amount?.message}>
            <input
              type="number"
              step="0.01"
              inputMode="decimal"
              autoFocus
              aria-invalid={Boolean(errors.amount)}
              {...register('amount')}
              className="focus-ring w-full h-12 px-3 text-2xl font-semibold rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-slate-900 num"
              placeholder="0,00"
            />
          </Field>

          <Field label="Kategoria" error={errors.category?.message}>
            <div role="radiogroup" aria-label="Kategoria" className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {CATEGORIES.map((c) => {
                const active = selectedCategory === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setValue('category', c.id as CategoryId, { shouldValidate: true })}
                    className={[
                      'focus-ring rounded-lg border px-3 py-2.5 text-sm font-medium text-left transition-colors',
                      active
                        ? 'border-brand-500 bg-brand-500/10 text-brand-500 dark:text-brand-400'
                        : 'border-line dark:border-line-dark hover:bg-slate-50 dark:hover:bg-slate-800/60',
                    ].join(' ')}
                  >
                    <div className="w-6 h-6 rounded-full mb-1" style={{ background: c.color }} aria-hidden />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Data" error={errors.date?.message}>
            <input
              type="date"
              {...register('date')}
              max={todayIso()}
              className="focus-ring w-full h-11 px-3 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-slate-900"
            />
          </Field>

          <Field label="Opis" error={errors.description?.message}>
            <input
              type="text"
              placeholder="np. Lunch z pracy"
              {...register('description')}
              className="focus-ring w-full h-11 px-3 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-slate-900"
            />
          </Field>

          <Field label="Notatka (opcjonalna)" error={errors.note?.message}>
            <textarea
              rows={2}
              {...register('note')}
              className="focus-ring w-full px-3 py-2 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-slate-900 resize-none"
            />
          </Field>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="focus-ring h-11 px-4 rounded-lg border border-line dark:border-line-dark text-sm font-semibold"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="focus-ring flex-1 h-11 rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white text-sm font-semibold shadow-fab"
            >
              {isSubmitting ? 'Zapisywanie…' : editing ? 'Zapisz zmiany' : 'Zapisz wydatek'}
            </button>
          </div>
        </form>
      </Card>
    </>
  );
}

interface FieldProps {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}

function Field({ label, error, children }: FieldProps): JSX.Element {
  return (
    <label className="block">
      <span className="caption text-ink-500 dark:text-slate-500 mb-1.5 block">{label}</span>
      {children}
      {error && (
        <span role="alert" className="mt-1.5 block text-xs font-medium text-danger">
          {error}
        </span>
      )}
    </label>
  );
}
