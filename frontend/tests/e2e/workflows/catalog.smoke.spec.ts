import { expect, test } from '@playwright/test';

test('@smoke catalog: mushrooms list opens details', async ({ page }) => {
  await page.goto('/mushrooms');
  await expect(page.getByRole('heading', { name: 'Грибы' })).toBeVisible();

  const firstCard = page.getByRole('link', { name: /^Открыть карточку гриба / }).first();
  await expect(firstCard).toBeVisible();
  await firstCard.click();

  await expect(page).toHaveURL(/\/mushrooms\/[0-9a-f-]+$/i);
  await expect(page.getByRole('heading', { name: 'Морфология' })).toBeVisible();

  await page.getByRole('link', { name: 'Назад к каталогу' }).click();
  await expect(page).toHaveURL(/\/mushrooms(?:\?|$)/);
});
