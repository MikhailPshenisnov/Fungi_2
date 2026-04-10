import { expect, type Page } from '@playwright/test';
import { E2E_USERS, type E2EUserRole } from './test-users';

export async function loginAs(page: Page, role: E2EUserRole = 'regular') {
  const user = E2E_USERS[role];

  await page.goto('/login');
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Пароль').fill(user.password);
  const rememberCheckbox = page.getByRole('checkbox', { name: 'Запомнить меня' });
  if (!(await rememberCheckbox.isChecked())) {
    await rememberCheckbox.check();
  }
  await page.getByRole('button', { name: 'Войти', exact: true }).click();
  await expect(page).toHaveURL(/\/profile(?:\?|$)/);
}

export async function openProfileMenu(page: Page) {
  await page.getByRole('button', { name: 'Открыть меню профиля' }).click();
  await expect(page.getByRole('menu', { name: 'Меню профиля' })).toBeVisible();
}

export async function logout(page: Page) {
  await openProfileMenu(page);
  await page.getByRole('menuitem', { name: 'Выйти' }).click();
  await expect(page).toHaveURL(/\/($|login(?:\?|$))/);
}
