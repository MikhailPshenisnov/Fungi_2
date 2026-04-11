import { expect, test, type Locator, type Page } from '@playwright/test';
import { loginAs } from '../support/auth';

async function ensureFirstArticleIsFavorite(page: Page): Promise<string> {
  await page.goto('/articles');

  const likeButton = page.getByRole('button', { name: /Убрать лайк статье|Поставить лайк статье/ }).first();
  await expect(likeButton).toBeVisible();

  const articleCard = likeButton.locator('xpath=ancestor::*[@role="link"][1]');
  const articleTitle = (await articleCard.getByRole('heading').first().textContent())?.trim() ?? '';

  const ariaLabel = (await likeButton.getAttribute('aria-label')) ?? '';
  if (ariaLabel.includes('Поставить лайк статье')) {
    await likeButton.click();
  }

  await expect(likeButton).toBeEnabled();
  return articleTitle;
}

async function ensureFirstMushroomIsFavorite(page: Page): Promise<string> {
  await page.goto('/mushrooms');

  const likeButton = page.getByRole('button', { name: /Добавить в понравившиеся|Убрать из понравившихся/ }).first();
  await expect(likeButton).toBeVisible();

  const mushroomCard = likeButton.locator('xpath=ancestor::*[@role="link"][1]');
  const mushroomTitle = (await mushroomCard.getByRole('heading').first().textContent())?.trim() ?? '';

  const ariaLabel = (await likeButton.getAttribute('aria-label')) ?? '';
  if (ariaLabel.includes('Добавить в понравившиеся')) {
    await likeButton.click();
  }

  await expect(likeButton).toBeEnabled();
  return mushroomTitle;
}

async function openFavorites(page: Page) {
  await page.goto('/profile?tab=favorites');
  await expect(page).toHaveURL(/\/profile\?tab=favorites(?:&|$)/);
  await expect(page.getByTestId('favorites-articles-section')).toBeVisible();
  await expect(page.getByTestId('favorites-mushrooms-section')).toBeVisible();
}

async function removeFirstFavoriteCard(
  section: Locator,
  cardTestId: string,
  removeButtonTestId: string
): Promise<number> {
  const cards = section.getByTestId(cardTestId);
  await expect(cards.first()).toBeVisible();
  const countBefore = await cards.count();
  await expect(countBefore).toBeGreaterThan(0);

  const firstCard = cards.first();
  const removeButton = firstCard.getByTestId(removeButtonTestId);
  await expect(removeButton).toBeVisible();
  await removeButton.click();

  const expectedCount = Math.max(0, countBefore - 1);
  await expect(cards).toHaveCount(expectedCount);
  return countBefore;
}

test('@smoke favorites: likes from catalogs are visible in profile favorites', async ({ page }) => {
  await loginAs(page, 'regular');

  const articleTitle = await ensureFirstArticleIsFavorite(page);
  const mushroomTitle = await ensureFirstMushroomIsFavorite(page);

  await openFavorites(page);

  await expect(page.getByTestId('favorites-articles-section').getByText(articleTitle, { exact: true })).toBeVisible();
  await expect(page.getByTestId('favorites-mushrooms-section').getByText(mushroomTitle, { exact: true })).toBeVisible();
});

test('@smoke favorites: unlike in favorites removes cards', async ({ page }) => {
  await loginAs(page, 'regular');

  await ensureFirstArticleIsFavorite(page);
  await ensureFirstMushroomIsFavorite(page);
  await openFavorites(page);

  const articlesSection = page.getByTestId('favorites-articles-section');
  const mushroomsSection = page.getByTestId('favorites-mushrooms-section');

  await removeFirstFavoriteCard(articlesSection, 'favorite-article-card', 'favorite-article-remove');
  await removeFirstFavoriteCard(mushroomsSection, 'favorite-mushroom-card', 'favorite-mushroom-remove');
});

test('@smoke favorites: legacy /profile/favorites route redirects to query tab', async ({ page }) => {
  await loginAs(page, 'regular');

  await page.goto('/profile/favorites');
  await expect(page).toHaveURL(/\/profile\?tab=favorites(?:&|$)/);
  await expect(page.getByTestId('favorites-page')).toBeVisible();
});

test('@smoke favorites: 401 in favorites request signs out and redirects to login', async ({ page }) => {
  await loginAs(page, 'regular');

  await page.route('**/ArticleLikes/GetMyFavoriteArticles*', async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({
        errorMessage: 'Unauthorized'
      })
    });
  });

  await page.goto('/profile?tab=favorites');
  await expect(page).toHaveURL(/\/login\?reason=session-expired(?:&|$)/);
});
