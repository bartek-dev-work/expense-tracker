# Wydatki — śledzenie wydatków osobistych

Aplikacja webowa do prostego śledzenia wydatków: dashboard z postępem budżetu, lista wydatków, dodawanie/edycja, statystyki i ustawienia. Projekt zaliczeniowy z przedmiotu UI/UX.

## 🔗 Demo

> _Link do działającej aplikacji uzupełnić po deployu._

## 🛠 Technologie

- **Vite + React 18 + TypeScript** — szkielet aplikacji
- **React Router** — routing między widokami
- **Tailwind CSS** — stylowanie + system tokenów
- **React Hook Form + Zod** — formularz i walidacja
- **Zustand** — globalny stan (ustawienia + lista wydatków + toasty)
- **MSW (Mock Service Worker)** — mock REST API w przeglądarce (`GET / POST / PUT / DELETE`)
- **Recharts** — wykresy
- **Framer Motion** — animacje
- **lucide-react** — ikony

## 🚀 Uruchomienie lokalne

```bash
npm install
npm run dev
```

Aplikacja startuje na <http://localhost:5173>. Mock API i seed danych w localStorage uruchamiają się automatycznie.

```bash
npm run build      # produkcja
npm run preview    # podgląd builda
npm run lint       # type-check
```

## 📁 Struktura

```
src/
├── api/         # klient HTTP do mockowanego backendu
├── components/  # komponenty wielokrotnego użytku
│   ├── layout/  # Sidebar, BottomNav, AppShell
│   └── ui/      # Card, Toaster, PageHeader
├── lib/         # categories, format, seed
├── mocks/       # MSW handlers + browser worker
├── pages/       # 5 ekranów (Dashboard, Expenses, AddExpense, Stats, Settings)
├── store/       # Zustand: settings, expenses, toast
├── types/       # typy domeny
├── App.tsx      # routing
└── main.tsx     # bootstrap + MSW init
```

Pliki projektowe pomocnicze:

- `wireframes/` — prototyp lo-fi (HTML + screeny w `wireframes/screens/`)
- `hi-fi/` — prototyp hi-fi (statyczna React+Tailwind via CDN, screeny w `hi-fi/screens/`)
- `docs/user-flow.md` — diagram user flow (Mermaid)

## ✅ Pokrycie wymagań

| # | Wymaganie | Status |
|---|---|---|
| 1.1 | Lo-fi prototyp | ✅ `wireframes/` |
| 1.2 | Hi-fi + user flow | ✅ `hi-fi/` + `docs/user-flow.md` |
| 1.3 | Spójność designu z implementacją | ✅ te same tokeny w `tailwind.config.ts` co w hi-fi |
| 2 | Komponenty + routing + UI lib | ✅ React Router + Tailwind |
| 3 | Responsive | ✅ mobile (bottom nav) + desktop (sidebar) |
| 4 | Formularz + walidacja | ✅ RHF + Zod w `AddExpense` |
| 5 | WCAG | ✅ aria-*, focus-ring, kontrast AA |
| 6 | State management | ✅ Zustand + 4 stany (idle/loading/success/error) |
| 7 | API + obsługa błędów | ✅ MSW + GET/POST/PUT/DELETE |
| 8 | Mikrointerakcje | ✅ Framer Motion (toasty, hover) |
| 9 | Deploy + README | ⏳ TODO po implementacji |

## 📝 Notatka UX

> _Krótka notatka UX (1–2 strony) z opisem grupy docelowej, uzasadnieniem decyzji i odniesieniem do heurystyk Nielsena — do dopisania._
