import type { Article } from '@entities/article';
import type { ArticleSortMode } from './catalog-query';

export interface PaginatedArticles {
  page: number;
  totalPages: number;
  items: Article[];
}

export function sortArticles(articles: Article[], mode: ArticleSortMode): Article[] {
  const clonedArticles = [...articles];

  if (mode === 'likes') {
    return clonedArticles.sort((left, right) => {
      if (right.likesCount !== left.likesCount) {
        return right.likesCount - left.likesCount;
      }

      return right.publishDate.localeCompare(left.publishDate);
    });
  }

  if (mode === 'oldest') {
    return clonedArticles.sort((left, right) => left.publishDate.localeCompare(right.publishDate));
  }

  return clonedArticles.sort((left, right) => right.publishDate.localeCompare(left.publishDate));
}

export function paginateArticles(articles: Article[], page: number, pageSize: number): PaginatedArticles {
  const normalizedPageSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(articles.length / normalizedPageSize));
  const normalizedPage = Math.min(Math.max(1, page), totalPages);

  const startIndex = (normalizedPage - 1) * normalizedPageSize;
  const endIndex = startIndex + normalizedPageSize;

  return {
    page: normalizedPage,
    totalPages,
    items: articles.slice(startIndex, endIndex)
  };
}
