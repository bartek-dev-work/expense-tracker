import { AnimatePresence, motion } from 'framer-motion';
import { Check, AlertTriangle, Info } from 'lucide-react';
import { useToastStore, type Toast } from '@/store/toast';

const ICONS = {
  success: Check,
  error: AlertTriangle,
  info: Info,
} as const;

const STYLES = {
  success: 'bg-ok/10 text-ok border-ok/30',
  error: 'bg-danger/10 text-danger border-danger/30',
  info: 'bg-brand-500/10 text-brand-600 border-brand-500/30',
} as const;

export function Toaster(): JSX.Element {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      aria-live="polite"
      role="status"
      className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 space-y-2"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast }: { toast: Toast }): JSX.Element {
  const Icon = ICONS[toast.variant];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
      className={`pointer-events-auto inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-pop bg-surface dark:bg-surface-dark ${STYLES[toast.variant]}`}
    >
      <Icon size={16} strokeWidth={2.4} />
      <span>{toast.message}</span>
    </motion.div>
  );
}
