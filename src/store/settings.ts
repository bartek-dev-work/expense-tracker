import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Currency } from '@/types/expense';

interface SettingsState {
  dark: boolean;
  monthlyBudget: number;
  currency: Currency;
  notifications: boolean;
  profileName: string;
  profileEmail: string;
  setDark: (dark: boolean) => void;
  toggleDark: () => void;
  setMonthlyBudget: (value: number) => void;
  setCurrency: (currency: Currency) => void;
  setNotifications: (enabled: boolean) => void;
  setProfile: (name: string, email: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      dark: false,
      monthlyBudget: 4000,
      currency: 'PLN',
      notifications: true,
      profileName: 'Anna Kowalska',
      profileEmail: 'anna@example.com',
      setDark: (dark) => set({ dark }),
      toggleDark: () => set((s) => ({ dark: !s.dark })),
      setMonthlyBudget: (value) => set({ monthlyBudget: value }),
      setCurrency: (currency) => set({ currency }),
      setNotifications: (enabled) => set({ notifications: enabled }),
      setProfile: (profileName, profileEmail) => set({ profileName, profileEmail }),
    }),
    { name: 'wydatki-settings' },
  ),
);
