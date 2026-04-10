import { expect, test } from '@playwright/test';
import { loginAs } from '../support/auth';

test('@smoke editor articles: create draft and submit for review', async ({ page }) => {
  await loginAs(page, 'admin');
  await page.goto('/editor/articles/new');

  const uniqueSuffix = Date.now();

  await page.getByRole('textbox', { name: 'Заголовок', exact: true }).fill(`Smoke статья ${uniqueSuffix}`);
  await page.getByRole('textbox', { name: 'Автор', exact: true }).fill('editor_user');
  await page.getByPlaceholder('Текст абзаца').first().fill('Smoke paragraph text for editor workflow.');

  await page.getByRole('button', { name: 'Сохранить черновик' }).click();
  await expect(page).toHaveURL(/\/editor\/articles\/[^/]+\/edit$/);

  await page.getByRole('textbox', { name: 'URL обложки', exact: true }).fill('https://example.com/article-cover.jpg');
  await page.getByRole('button', { name: 'Отправить на модерацию' }).click();

  await expect(page.getByText(/Статус:\s*На модерации/i)).toBeVisible();
});
