import { expect, test } from '@playwright/test';
import { loginAs } from '../support/auth';

test('@smoke likes: authenticated user can toggle mushroom like', async ({ page }) => {
  await loginAs(page, 'regular');
  await page.goto('/mushrooms');

  const firstCard = page.getByRole('link', { name: /^Открыть карточку гриба / }).first();
  const likeButton = firstCard.getByRole('button', { name: /Добавить в понравившиеся|Убрать из понравившихся/ });

  await expect(likeButton).toBeVisible();
  await likeButton.click();

  await expect(likeButton).toBeEnabled();
  await expect(page.getByRole('dialog', { name: 'Авторизация для лайка' })).toHaveCount(0);
});
