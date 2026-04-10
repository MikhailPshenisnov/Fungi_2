import { expect, test } from '@playwright/test';
import { loginAs, logout } from '../support/auth';

test('@smoke auth: login and logout flow', async ({ page }) => {
  await loginAs(page, 'regular');
  await expect(page.locator('section[aria-label="Шапка профиля"]')).toBeVisible();

  await logout(page);
  await expect(page.getByRole('button', { name: 'Войти', exact: true })).toBeVisible();
});
