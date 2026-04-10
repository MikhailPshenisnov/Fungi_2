import { expect, test } from '@playwright/test';
import { loginAs } from '../support/auth';

test('@smoke editor mushrooms: create draft and submit for review', async ({ page }) => {
  await loginAs(page, 'admin');
  await page.goto('/editor/mushrooms/new');

  const uniqueSuffix = Date.now();

  await page.getByRole('textbox', { name: 'Название', exact: true }).fill(`Smoke гриб ${uniqueSuffix}`);
  await page.getByRole('textbox', { name: 'Семейство', exact: true }).fill('Тестовое семейство');
  await page.getByRole('spinbutton', { name: 'Ножка от', exact: true }).fill('5');
  await page.getByRole('spinbutton', { name: 'Ножка до', exact: true }).fill('10');
  await page.getByRole('textbox', { name: 'Тип ножки', exact: true }).fill('Цилиндрическая');
  await page.getByRole('textbox', { name: 'Цвет ножки', exact: true }).fill('Бежевый');
  await page.getByRole('textbox', { name: 'Тип шляпки', exact: true }).fill('Выпуклая');
  await page.getByRole('textbox', { name: 'Цвет шляпки', exact: true }).fill('Коричневый');
  await page.getByRole('textbox', { name: 'Нижняя поверхность шляпки', exact: true }).fill('Пластинчатая');
  await page.getByPlaceholder('Кратко опишите гриб').fill('Smoke description for mushroom revision workflow.');

  await page.getByRole('button', { name: 'Сохранить черновик' }).click();
  await expect(page).toHaveURL(/\/editor\/mushrooms\/[^/]+\/edit$/);

  await page.getByRole('textbox', { name: 'URL главного фото', exact: true }).fill('https://example.com/mushroom-cover.jpg');
  await page.getByRole('button', { name: 'Отправить на модерацию' }).click();

  await expect(page.getByText(/Статус:\s*На модерации/i)).toBeVisible();
});
