# Wydatki — śledzenie wydatków osobistych

Lekka aplikacja webowa do prostego śledzenia osobistego budżetu: pulpit z postępem miesięcznego budżetu, lista wydatków pogrupowana po dniach, dodawanie i edycja w modalu (bottom-sheet na mobile), statystyki w trzech zakresach czasowych (tydzień / miesiąc / rok), eksport CSV. W całości po polsku, z trybem ciemnym i pełną nawigacją klawiaturą.

## 🔗 Demo

**<https://expense-tracker-five-drab-69.vercel.app>**

Dane są mockowane (MSW) i trzymane w `localStorage` przeglądarki — można dodawać, edytować i usuwać wydatki, a po odświeżeniu strony wszystko zostaje. Żeby zacząć od czystego stanu: DevTools → Application → Storage → Clear site data.

## 📸 Wygląd

| Pulpit | Lista wydatków | Statystyki |
|---|---|---|
| ![Pulpit](hi-fi/screens/01-dashboard-light.png) | ![Lista](hi-fi/screens/02-lista-wydatkow-light.png) | ![Statystyki](hi-fi/screens/04-statystyki-light.png) |

| Dodaj wydatek (modal) | Ustawienia | Tryb ciemny |
|---|---|---|
| ![Dodaj](hi-fi/screens/03-dodaj-wydatek-light.png) | ![Ustawienia](hi-fi/screens/05-ustawienia-light.png) | ![Dark mode](hi-fi/screens/01-dashboard-dark.png) |

## ✨ Funkcje

- **Pulpit** z hero kartą budżetu, trzema wskaźnikami czasowymi (dziś / tydzień / miesiąc) z trendem vs. poprzedni okres, donutem kategorii i listą ostatnich wydatków
- **Lista wydatków** pogrupowana po dniach z sumami dziennymi, edycją i usuwaniem inline
- **Dodaj/edytuj wydatek** — modal centrowany na desktopie, bottom-sheet z grip handle na mobile, walidacja inline
- **Statystyki** w trzech zakresach (tydzień / miesiąc / rok) — bar chart, porównanie z poprzednim okresem, średnia dzienna, największy wydatek, top kategorie
- **Ustawienia** — profil, miesięczny budżet, waluta (PLN/EUR/USD), tryb ciemny, eksport do CSV (Excel-friendly, z BOM)
- **Pełna obsługa klawiatury** — focus trap w modalu, skip link, `Esc` zamyka, focus widoczny wszędzie
- **WCAG AA** — kontrasty zweryfikowane axe-core, semantyczny HTML, alternatywne opisy wykresów dla czytników ekranu
- **Tryb ciemny** z `prefers-color-scheme` i ręcznym przełącznikiem
- **`prefers-reduced-motion`** — wszystkie animacje są wyciszane

## 🛠 Technologie

| Warstwa | Biblioteka |
|---|---|
| Bundler & dev server | **Vite 6** |
| UI | **React 18** + **TypeScript** (strict, `noImplicitAny`, `noUncheckedSideEffectImports`) |
| Routing | **React Router 6** (z patternem background-route dla modali) |
| Styling | **Tailwind CSS 3** (z customowymi tokenami brand/ok/danger) |
| Formularze | **React Hook Form** + **Zod** (resolver) |
| State management | **Zustand** (3 store'y: `settings`, `expenses`, `toast`) z `persist` middleware |
| Mock API | **MSW 2** (Service Worker, `GET / POST / PUT / DELETE`) |
| Wykresy | **Recharts** (PieChart donut + BarChart) |
| Animacje | **Framer Motion** (modale, toasty) z `MotionConfig reducedMotion="user"` |
| Ikony | **lucide-react** |

## 🚀 Uruchomienie lokalne

```bash
git clone https://github.com/bartek-dev-work/expense-tracker.git
cd expense-tracker
npm install
npm run dev
```

Otwórz <http://localhost:5173>. Mock API oraz zestaw startowych wydatków (12 sztuk) ładują się automatycznie.

```bash
npm run build       # produkcyjny build do dist/
npm run preview     # podgląd produkcyjnego builda lokalnie
npm run lint        # type-check (tsc --noEmit)
npm run test:e2e    # testy e2e (Playwright)
npm run test:e2e:ui # testy e2e w trybie UI
```

Wymagana wersja Node: **20.0+**.

> **Uwaga dla macOS Safari:** domyślnie Tab przeskakuje tylko między polami formularzy.
> Aby uruchomić pełną nawigację po linkach i przyciskach, włącz: `System Settings → Keyboard → Keyboard navigation`.
> W Chrome/Firefox działa od razu.

## 📁 Struktura projektu

```
.
├── src/
│   ├── api/                 # klient HTTP (fetch wrapper z obsługą 204)
│   ├── components/
│   │   ├── layout/          # AppShell, Sidebar (desktop), BottomNav (mobile)
│   │   └── ui/              # Card, Modal, Toaster, PageHeader,
│   │                        # CategoryBadge, CategoryDonut, StatCard,
│   │                        # SegmentedControl
│   ├── lib/                 # categories, format (Intl PL), analytics, csv, seed
│   ├── mocks/               # MSW handlers (REST CRUD) + worker setup
│   ├── pages/               # 5 ekranów: Dashboard, Expenses, AddExpense,
│   │                        # Stats, Settings
│   ├── store/               # Zustand: settings (persist), expenses, toast
│   ├── types/               # typy domeny (Expense, CategoryId, Currency)
│   ├── App.tsx              # routing + background-route pattern dla modali
│   ├── main.tsx             # bootstrap + MSW worker.start
│   └── index.css            # Tailwind + custom (skip-link, prefers-reduced-motion)
│
├── wireframes/              # prototyp lo-fi (HTML w skali szarości + screeny)
├── hi-fi/                   # prototyp hi-fi (statyczna React+Tailwind via CDN)
├── docs/
│   └── user-flow.md         # diagram Mermaid + ścieżki użytkownika
│
├── public/
│   └── mockServiceWorker.js
├── vercel.json              # SPA rewrite + Service-Worker-Allowed header
├── tailwind.config.ts       # tokeny zsynchronizowane z prototypem hi-fi
└── tsconfig.app.json        # strict TS, alias `@/*` → `src/*`
```

## ⌨️ Klawiatura

| Skrót | Akcja |
|---|---|
| `Tab` / `Shift+Tab` | Nawigacja między elementami |
| `Esc` | Zamknięcie modala |
| `Enter` na linku w nawigacji | Przejście na ekran |
| `Spacja` na toggle/radio | Przełącznik / wybór |
| Pierwszy `Tab` na stronie | Pojawia się **„Pomiń do treści"** (skip link) |

## 🔬 Audyty i testy

- **Playwright e2e** — 14 testów weryfikujących nawigację klawiaturą (skip link, sidebar, modal focus trap, formularze, SegmentedControl, toggles, edit/delete). `npm run test:e2e`.
- **axe-core 4.10** — 0 naruszeń na każdej z 5 stron (Dashboard, Lista, Dodaj, Statystyki, Ustawienia)
- **Lighthouse** na produkcji (headless Chrome):
  - Accessibility: **96**
  - Best Practices: **96**
  - SEO: **90**
  - Performance: **79** (limituje wagę bundla — Recharts + Framer Motion + MSW)
- **TypeScript strict** — zero `any`, zero `unknown`

---

## 🎨 Decyzje projektowe

### Grupa docelowa

Aplikacja jest celowana w **studentów i młodych dorosłych (20–30 lat)**, którzy chcą mieć kontrolę nad miesięcznym budżetem, ale nie chcą się męczyć z arkuszami kalkulacyjnymi ani aplikacjami bankowymi z dziesiątkami funkcji. Główne use-case'y:

- „Ile wydałem dziś?" — odpowiedź widoczna na pulpicie w 1 sekundę
- „Ile zostało mi z budżetu na ten miesiąc?" — pasek postępu na pulpicie
- „Na co najwięcej idzie?" — donut kategorii + statystyki

### Persona

> **Marta, 24 lata, junior developer w Krakowie**
> Wynajmuje mieszkanie, jada na mieście kilka razy w tygodniu, korzysta z MPK i Bolta. Próbowała Excela — porzuciła po dwóch tygodniach, bo dodawanie wydatku zajmowało za dużo klikania. Chce zobaczyć w 5 sekund, czy mieści się w budżecie, i zrozumieć, gdzie wycieka jej kasa.

Konkretne potrzeby Marty kształtowały kluczowe decyzje:
- **dodanie wydatku w ≤ 3 tapnięcia** — FAB zawsze widoczny, modal z autofocus na polu kwoty, kategoria w siatce ikon
- **kategorie kolorystyczne** zamiast tekstowych — Marta po tygodniu rozpoznaje pomarańczowe kółko = jedzenie szybciej niż etykietę
- **3 wskaźniki czasowe** (dziś / tydzień / miesiąc) — najczęstsze pytanie to „ile dzisiaj wydałam"

### Kluczowe wybory UI/UX

| Wybór | Uzasadnienie |
|---|---|
| **Modal/bottom-sheet zamiast osobnej strony** dla dodawania | Użytkownik nie traci kontekstu listy; na desktopie modal centrowany, na mobile bottom-sheet z grip handle (znajomy wzorzec z iOS/Android) |
| **Background-route pattern** w React Router | URL `/expenses/new` jest deep-linkowalny (można wysłać znajomej), ale wizualnie modal pływa nad poprzednim ekranem |
| **localStorage + MSW** zamiast realnego backendu | Aplikacja jest 100% offline, demo działa bez konta — zero friction |
| **Donut z legendą obok** (zamiast pod) | Lepsze wykorzystanie szerokiego ekranu; na mobile grid składa się do 1 kolumny |
| **Polski format kwot i dat** (Intl) | „−28,50 zł", „wt., 7 maja" — nie „-28.50 PLN", „Tue May 7" |
| **Soft shadows + 12px radius** | Język wizualny zgodny z trendem 2024+ (Linear, Notion) |

### Heurystyki Nielsena

1. **Widoczność statusu systemu** — skeleton screens podczas ładowania, toast po każdej akcji (`Dodano wydatek`), pasek postępu budżetu jako żywy wskaźnik
2. **Dopasowanie do rzeczywistości** — polskie etykiety, format kwot, polskie nazwy dni („pt., 8 maja"), kategorie życiowe (Jedzenie / Transport / Rachunki / Rozrywka / Inne)
3. **Kontrola i swoboda** — `Esc` zamyka modal, „Anuluj" w formularzu, możliwość edycji każdego wydatku, kosz przy każdym wpisie z `confirm()` przed usunięciem
4. **Spójność i standardy** — jeden komponent `CategoryBadge` używany w 4 miejscach (lista, dashboard, statystyki, modal), te same kolory dla tych samych kategorii w całej apce
5. **Zapobieganie błędom** — `max={today}` na polu daty, walidacja kwoty (>0), wymagana kategoria z domyślnie zaznaczoną „Jedzenie", `confirm()` przed destrukcyjnym usunięciem
6. **Rozpoznawanie zamiast przypominania** — kolorowe ikony kategorii (nie trzeba pamiętać nazw), siatka kategorii zamiast dropdownu w formularzu, dni tygodnia po polsku
7. **Elastyczność i efektywność** — skróty klawiaturowe, Tab nawigacja, focus trap w modalu (zaawansowani użytkownicy nie potrzebują myszki)
8. **Estetyka i minimalistyczny design** — białe karty, soft shadow, dużo pustej przestrzeni, jeden font (Inter), stonowana paleta indygo+slate
9. **Pomoc w rozpoznawaniu i naprawie błędów** — komunikaty błędów inline pod każdym polem (`role="alert"`), retry button w stanie błędu sieci, opisowe toasty błędów
10. **Pomoc i dokumentacja** — placeholdery w polach (`np. Lunch z pracy`), opisy pod każdą sekcją na pulpicie, tooltipy w stat-cards (vs. poprzedni okres)

### User-Centered Design

Decyzje projektowe weryfikowane były trzema „filtrami":

1. **Czy persona (Marta) zrozumie to bez tutoriala?** — żadnego onboardingu, ekran pulpitu jest „samowyjaśniający"
2. **Czy mogę to zrobić jedną ręką trzymając telefon?** — FAB w prawym dolnym rogu (kciuk), bottom-nav, modal jako bottom-sheet
3. **Czy to działa offline / w słabym 3G?** — MSW zamiast prawdziwego API, optymistyczne update'y stanu, persystencja w `localStorage`

### Dostępność (WCAG)

- pełen **focus trap** w modalu z roving `tabindex` w `radiogroup` kategorii
- **skip-link** „Pomiń do treści" jako pierwszy element po Tab
- **`prefers-reduced-motion`** — globalny override przez CSS + `MotionConfig` Framer Motion
- **kontrasty AA** zweryfikowane axe-core (token `ok` przesunięty z `#10B981` na `#047857` po wykryciu naruszenia)
- **alternatywne opisy wykresów** — `<p class="sr-only">` z pełną listą kategorii i kwot przed każdym wykresem (screen reader dostaje pełny tekst, sighted user widzi wizualizację)
- **`role="dialog"` + `aria-modal`** + autofocus na pierwszym polu modala, focus wraca do trigger button po zamknięciu

### Roadmap

- **Kategoryzacja zwrotna** (np. „już 3 razy wpisywałeś «Lunch z pracy» — zaproponować autouzupełnienie?")
- **Powiadomienia push** o zbliżaniu się do limitu budżetu
- **Eksport per-okres** (obecnie eksportuje wszystko — można by wybrać zakres)
- **Synchronizacja między urządzeniami** (wymagałoby realnego backendu i auth)
- **PWA** (offline cache, install prompt, ikona na home screen)

---

## 📜 Licencja

MIT
