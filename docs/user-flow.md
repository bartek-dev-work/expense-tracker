# User Flow — Expense Tracker

Przepływ użytkownika między ekranami aplikacji. Diagram pokazuje typowe ścieżki: od pierwszego wejścia, przez dodanie wydatku, po zarządzanie budżetem.

## Diagram główny

```mermaid
flowchart TD
    Start([Start aplikacji]) --> Dashboard

    Dashboard["① Pulpit<br/>balans miesiąca · ostatnie wydatki<br/>donut kategorii · skróty czasowe"]
    List["② Lista wydatków<br/>filtry · sortowanie<br/>grupowanie po dniach"]
    Add["③ Dodaj wydatek<br/>modal / bottom sheet<br/>walidacja inline"]
    Stats["④ Statystyki<br/>bar chart · top kategorii<br/>vs poprzedni miesiąc"]
    Settings["⑤ Ustawienia<br/>profil · budżet · waluta<br/>motyw · eksport"]

    Dashboard -- "tap kafelka czasowego" --> List
    Dashboard -- "tap segmentu donuta" --> Stats
    Dashboard -- "FAB +" --> Add
    Dashboard -- "tap avatara" --> Settings

    List -- "FAB +" --> Add
    List -- "tap wiersza" --> Detail{{Szczegóły wydatku}}
    Detail -- "Edytuj" --> Add
    Detail -- "Usuń" --> Confirm{{Potwierdź usunięcie}}
    Confirm -- "Tak" --> List
    Confirm -- "Anuluj" --> Detail

    Add -- "Zapisz (sukces)" --> Toast{{Toast: Dodano ✓}}
    Toast --> List
    Add -- "Anuluj / X" --> Back1[/wróć do poprzedniego ekranu/]

    Stats -- "tap słupka" --> List
    Stats -- "tap kategorii" --> List

    Settings -- "Kategorie" --> Categories["Zarządzanie kategoriami"]
    Settings -- "Eksport CSV" --> Export{{Pobranie pliku}}
    Settings -- "Wyloguj" --> Logout{{Potwierdź wylogowanie}}

    classDef screen fill:#EEF2FF,stroke:#6366F1,stroke-width:2px,color:#0F172A;
    classDef action fill:#FFFFFF,stroke:#94A3B8,stroke-dasharray: 4 3,color:#0F172A;
    class Dashboard,List,Add,Stats,Settings,Categories screen;
    class Detail,Confirm,Toast,Export,Logout,Back1 action;
```

## Kluczowe ścieżki

### Ścieżka 1 — szybkie dodanie wydatku (golden path)
`Dashboard → FAB + → Modal "Dodaj wydatek" → wypełnij kwotę i kategorię → Zapisz → Toast ✓ → powrót do Dashboard`

**Cel:** dodanie wydatku w ≤ 3 tapnięcia. Modal ma autofocus na polu kwoty.

### Ścieżka 2 — analiza wydatków
`Dashboard → tap segmentu donuta (np. „Jedzenie") → Statystyki z filtrem kategorii → tap słupka → Lista wydatków filtrowana po dniu i kategorii`

**Cel:** od ogółu do szczegółu w 3 krokach.

### Ścieżka 3 — edycja wydatku
`Lista → tap wiersza → szczegóły → Edytuj → modal z prefillem → Zapisz → Toast ✓ → Lista`

### Ścieżka 4 — zmiana budżetu
`Dashboard → tap avatara → Ustawienia → inline edit „Budżet miesięczny" → autosave + toast → wracam, pasek w hero karcie się aktualizuje`

## Routing

| Ścieżka URL | Ekran | Komponent |
|---|---|---|
| `/` | Pulpit (Dashboard) | `pages/Dashboard.tsx` |
| `/expenses` | Lista wydatków | `pages/Expenses.tsx` |
| `/expenses/new` | Dodaj wydatek (modal nad listą lub osobny ekran na mobile) | `pages/AddExpense.tsx` |
| `/expenses/:id/edit` | Edycja wydatku | `pages/AddExpense.tsx` (ten sam, prefill) |
| `/stats` | Statystyki | `pages/Stats.tsx` |
| `/settings` | Ustawienia | `pages/Settings.tsx` |

## Stany ekranów (do implementacji)

Każdy ekran z danymi musi obsługiwać 4 stany:

- **Loading** → skeleton screens (animowane szare bloki, nie spinner)
- **Empty** → ilustracja + tekst + CTA „Dodaj pierwszy wydatek"
- **Error** → komunikat + przycisk „Spróbuj ponownie"
- **Success** → docelowa zawartość

## Zasady nawigacji

- **Mobile (< 640px):** bottom navigation, środkowy slot = FAB „+" (skrót do Add).
- **Tablet (640–1024px):** sidebar zwinięty do ikon (44×44px), labelki w tooltipie.
- **Desktop (> 1024px):** pełny sidebar z labelami + skrótami klawiszowymi (`g d` — dashboard, `g l` — lista, `n` — nowy wydatek).
- **Powrót:** `Esc` zamyka modale i sheety, na mobile gest swipe-down.
- **Persystencja stanu:** filtry listy i wybrany okres statystyk zapamiętywane w URL query params.
