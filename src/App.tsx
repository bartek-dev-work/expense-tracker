import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, type Location } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Dashboard } from '@/pages/Dashboard';
import { Expenses } from '@/pages/Expenses';
import { AddExpense } from '@/pages/AddExpense';
import { Stats } from '@/pages/Stats';
import { Settings } from '@/pages/Settings';
import { useSettingsStore } from '@/store/settings';

const MODAL_PATH_REGEX = /^\/expenses\/(new|[^/]+\/edit)$/;

function App(): JSX.Element {
  const dark = useSettingsStore((s) => s.dark);
  const location = useLocation();
  const state = location.state as { background?: Location } | null;

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [dark]);

  const isModalRoute = MODAL_PATH_REGEX.test(location.pathname);
  const background: Location | undefined =
    state?.background ?? (isModalRoute ? { ...location, pathname: '/expenses' } : undefined);

  return (
    <>
      <Routes location={background ?? location}>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="expenses/new" element={<AddExpense />} />
          <Route path="expenses/:id/edit" element={<AddExpense />} />
          <Route path="stats" element={<Stats />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>

      {background && (
        <Routes>
          <Route path="/expenses/new" element={<AddExpense />} />
          <Route path="/expenses/:id/edit" element={<AddExpense />} />
        </Routes>
      )}
    </>
  );
}

export default App;
