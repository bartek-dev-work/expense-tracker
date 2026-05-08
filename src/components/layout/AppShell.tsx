import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Toaster } from '@/components/ui/Toaster';
import { useExpensesStore } from '@/store/expenses';

export function AppShell(): JSX.Element {
  const fetchAll = useExpensesStore((s) => s.fetchAll);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  return (
    <div className="theme-transition flex min-h-screen bg-bg dark:bg-bg-dark text-ink-900 dark:text-slate-100">
      <a href="#main-content" className="skip-link">
        Pomiń do treści
      </a>
      <Sidebar />
      <main id="main-content" tabIndex={-1} className="flex-1 min-w-0 pb-20 md:pb-0">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-8">
          <Outlet />
        </div>
      </main>
      <BottomNav />
      <Toaster />
    </div>
  );
}
