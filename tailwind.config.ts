import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: { 900: '#0F172A', 500: '#64748B' },
        line: { DEFAULT: '#E2E8F0', dark: '#1F2937' },
        surface: { DEFAULT: '#FFFFFF', dark: '#111827' },
        bg: { DEFAULT: '#FAFAFA', dark: '#0B1120' },
        brand: { 500: '#6366F1', 600: '#4F46E5', 400: '#818CF8' },
        ok: '#10B981',
        danger: '#EF4444',
        warn: '#F59E0B',
        cat: {
          food: '#F97316',
          transport: '#06B6D4',
          bills: '#8B5CF6',
          fun: '#EC4899',
          other: '#64748B',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
        pop: '0 20px 40px -12px rgba(15,23,42,0.18), 0 8px 16px -8px rgba(15,23,42,0.10)',
        fab: '0 12px 28px -8px rgba(99,102,241,0.55), 0 4px 12px -4px rgba(99,102,241,0.45)',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
};

export default config;
