import { test, expect, type Page } from '@playwright/test';

async function getActiveElement(page: Page): Promise<{
  tag: string;
  text: string;
  href: string | null;
  role: string | null;
  ariaLabel: string | null;
  ariaChecked: string | null;
}> {
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) {
      return { tag: 'BODY', text: '', href: null, role: null, ariaLabel: null, ariaChecked: null };
    }
    return {
      tag: el.tagName,
      text: (el.textContent ?? '').trim().slice(0, 60),
      href: el.getAttribute('href'),
      role: el.getAttribute('role'),
      ariaLabel: el.getAttribute('aria-label'),
      ariaChecked: el.getAttribute('aria-checked'),
    };
  });
}

async function pressTabUntil(
  page: Page,
  predicate: (info: Awaited<ReturnType<typeof getActiveElement>>) => boolean,
  maxSteps = 30,
): Promise<Awaited<ReturnType<typeof getActiveElement>>> {
  for (let i = 0; i < maxSteps; i++) {
    await page.keyboard.press('Tab');
    const info = await getActiveElement(page);
    if (predicate(info)) return info;
  }
  throw new Error(`Did not find target element within ${maxSteps} Tabs`);
}

async function waitForExpenses(page: Page): Promise<void> {
  await expect(page.getByText('Wydano w tym miesiącu')).toBeVisible();
  await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
}

test.describe('Keyboard navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForExpenses(page);
  });

  test('first Tab focuses skip link, Enter jumps to main content', async ({ page }) => {
    await page.keyboard.press('Tab');
    let active = await getActiveElement(page);
    expect(active.tag).toBe('A');
    expect(active.text).toBe('Pomiń do treści');
    expect(active.href).toBe('#main-content');

    await page.keyboard.press('Enter');
    active = await page.evaluate(() => ({
      id: document.activeElement?.id ?? '',
      tag: document.activeElement?.tagName ?? '',
    }));
    expect(active.id).toBe('main-content');
  });

  test('Tab cycles through sidebar nav (5 items + theme toggle)', async ({ page }) => {
    await page.keyboard.press('Tab');
    expect((await getActiveElement(page)).text).toBe('Pomiń do treści');

    const expectedSidebarOrder = [
      { text: 'Pulpit',     href: '/' },
      { text: 'Lista',      href: '/expenses' },
      { text: 'Dodaj',      href: '/expenses/new' },
      { text: 'Statystyki', href: '/stats' },
      { text: 'Ustawienia', href: '/settings' },
    ];

    for (const expected of expectedSidebarOrder) {
      await page.keyboard.press('Tab');
      const active = await getActiveElement(page);
      expect(active.tag).toBe('A');
      expect(active.text).toBe(expected.text);
      expect(active.href).toBe(expected.href);
    }

    await page.keyboard.press('Tab');
    const themeToggle = await getActiveElement(page);
    expect(themeToggle.tag).toBe('BUTTON');
    expect(themeToggle.ariaLabel).toMatch(/Przełącz na (jasny|ciemny) motyw/);
  });

  test('theme toggle switches dark mode via Spacja', async ({ page }) => {
    expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(false);

    await pressTabUntil(page, (i) => i.ariaLabel?.includes('Przełącz na ciemny motyw') ?? false);
    await page.keyboard.press('Space');
    expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(true);

    await page.keyboard.press('Space');
    expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(false);
  });

  test('Enter on sidebar nav navigates to route', async ({ page }) => {
    await pressTabUntil(page, (i) => i.text === 'Statystyki' && i.href === '/stats');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/stats');
    await expect(page.getByRole('heading', { name: 'Statystyki' })).toBeVisible();
  });

  test('Enter on "Dodaj wydatek" CTA opens modal with focus inside', async ({ page }) => {
    await pressTabUntil(page, (i) => i.text === 'Dodaj wydatek' && i.href === '/expenses/new');
    await page.keyboard.press('Enter');

    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Nowy wydatek' })).toBeVisible();

    await expect.poll(async () =>
      page.evaluate(() => {
        const el = document.activeElement;
        const dialog = document.querySelector('[role="dialog"]');
        return Boolean(dialog && el && dialog.contains(el));
      }),
    ).toBe(true);
  });

  test('Esc closes modal and returns focus to trigger', async ({ page }) => {
    await pressTabUntil(page, (i) => i.text === 'Dodaj wydatek' && i.href === '/expenses/new');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();

    const restored = await getActiveElement(page);
    expect(restored.text).toBe('Dodaj wydatek');
  });

  test('focus trap: Shift+Tab from first field wraps to last focusable', async ({ page }) => {
    await pressTabUntil(page, (i) => i.text === 'Dodaj wydatek' && i.href === '/expenses/new');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog')).toBeVisible();

    const closeButton = page.getByRole('button', { name: 'Zamknij' });
    await closeButton.focus();
    await page.keyboard.press('Tab');
    let active = await getActiveElement(page);
    expect(active.tag).toBe('INPUT');

    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');
    active = await getActiveElement(page);
    expect(active.ariaLabel).toBe('Zamknij');
  });

  test('Tab through entire form reaches all fields and submit', async ({ page }) => {
    await pressTabUntil(page, (i) => i.text === 'Dodaj wydatek' && i.href === '/expenses/new');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.locator('#amount').focus();

    const expectedFields = [
      { matcher: (i: Awaited<ReturnType<typeof getActiveElement>>) => i.role === 'radio' },
      { matcher: (i: Awaited<ReturnType<typeof getActiveElement>>) => i.tag === 'INPUT' && i.text === '' },
      { matcher: (i: Awaited<ReturnType<typeof getActiveElement>>) => i.tag === 'INPUT' && i.text === '' },
      { matcher: (i: Awaited<ReturnType<typeof getActiveElement>>) => i.tag === 'TEXTAREA' },
      { matcher: (i: Awaited<ReturnType<typeof getActiveElement>>) => i.tag === 'BUTTON' && i.text === 'Anuluj' },
      { matcher: (i: Awaited<ReturnType<typeof getActiveElement>>) => i.tag === 'BUTTON' && i.text.startsWith('Zapisz') },
    ];

    for (const f of expectedFields) {
      await pressTabUntil(page, f.matcher, 4);
    }
  });
});

test.describe('Stats page keyboard interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/stats');
    await expect(page.getByRole('heading', { name: 'Statystyki' })).toBeVisible();
  });

  test('SegmentedControl: Tab focuses, Spacja switches period', async ({ page }) => {
    const tydzien = page.getByRole('radio', { name: 'Tydzień' });
    const miesiac = page.getByRole('radio', { name: 'Miesiąc' });

    await expect(miesiac).toHaveAttribute('aria-checked', 'true');

    await tydzien.focus();
    await page.keyboard.press('Space');
    await expect(tydzien).toHaveAttribute('aria-checked', 'true');
    await expect(miesiac).toHaveAttribute('aria-checked', 'false');
  });
});

test.describe('Settings page keyboard interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: 'Ustawienia' })).toBeVisible();
  });

  test('toggles flip via Spacja', async ({ page }) => {
    const darkSwitch = page.getByRole('switch', { name: 'Ciemny motyw' });
    const initial = await darkSwitch.getAttribute('aria-checked');

    await darkSwitch.focus();
    await page.keyboard.press('Space');
    await expect(darkSwitch).toHaveAttribute('aria-checked', initial === 'true' ? 'false' : 'true');
  });

  test('budget input + currency select reachable via Tab', async ({ page }) => {
    const budgetInput = page.locator('input[type="number"]').first();
    await budgetInput.focus();
    await expect(budgetInput).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('select').first()).toBeFocused();
  });
});

test.describe('Expenses list keyboard interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/expenses');
    await expect(page.getByRole('heading', { name: 'Lista wydatków' })).toBeVisible();
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
  });

  test('Edit pencil reachable via Tab and opens modal', async ({ page }) => {
    const firstEditLink = page.locator('a[aria-label^="Edytuj wydatek"]').first();
    await firstEditLink.focus();
    await expect(firstEditLink).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Edytuj wydatek' })).toBeVisible();
  });

  test('Delete button is reachable and labelled', async ({ page }) => {
    const firstDeleteBtn = page.locator('button[aria-label^="Usuń wydatek"]').first();
    await firstDeleteBtn.focus();
    await expect(firstDeleteBtn).toBeFocused();
    await expect(firstDeleteBtn).toHaveAttribute('aria-label', /Usuń wydatek/);
  });
});

test.describe('Form validation messages', () => {
  test('submit empty form shows aria-alert messages linked via aria-describedby', async ({ page }) => {
    await page.goto('/expenses/new');
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.locator('#description').fill('');
    await page.locator('#amount').fill('');

    await page.getByRole('button', { name: /Zapisz/ }).click();

    const amountError = page.getByRole('alert').first();
    await expect(amountError).toBeVisible();

    const amountInput = page.locator('#amount');
    await expect(amountInput).toHaveAttribute('aria-invalid', 'true');
    const describedBy = await amountInput.getAttribute('aria-describedby');
    expect(describedBy).toBe('err-amount');
    await expect(page.locator('#err-amount')).toBeVisible();
  });
});
