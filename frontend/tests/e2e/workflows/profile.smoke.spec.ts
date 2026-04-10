import { expect, test } from '@playwright/test';
import { loginAs, openProfileMenu } from '../support/auth';

test('@smoke profile: open profile page from header menu', async ({ page }) => {
  await loginAs(page, 'regular');
  await page.goto('/mushrooms');

  await openProfileMenu(page);
  await page.getByRole('menuitem', { name: 'Профиль' }).click();

  await expect(page).toHaveURL(/\/profile(?:\?|$)/);
  await expect(page.locator('section[aria-label="Шапка профиля"]')).toBeVisible();
  await expect(page.getByLabel('Сменить аватар')).toBeVisible();
});
