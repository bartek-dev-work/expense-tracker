import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Currency } from '@/types/expense';

interface SettingsState {
  dark: boolean;
  monthlyBudget: number;
  currency: Currency;
  notifications: boolean;
  setDark: (dark: boolean) => void;
  toggleDark: () => void;
  setMonthlyBudget: (value: number) => void;
  setCurrency: (currency: Currency) => void;
  setNotifications: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      dark: false,
      monthlyBudget: 4000,
      currency: 'PLN',
      notifications: true,
      setDark: (dark) => set({ dark }),
      toggleDark: () => set((s) => ({ dark: !s.dark })),
      setMonthlyBudget: (value) => set({ monthlyBudget: value }),
      setCurrency: (currency) => set({ currency }),
      setNotifications: (enabled) => set({ notifications: enabled }),
    }),
    { name: 'wydatki-settings' },
  ),
);
