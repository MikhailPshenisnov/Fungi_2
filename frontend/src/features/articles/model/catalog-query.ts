export type ArticleSortMode = 'newest' | 'oldest' | 'likes';

export interface ArticleCatalogQueryState {
  q: string;
  author: string;
  sort: ArticleSortMode;
  page: number;
}

export const DEFAULT_ARTICLE_CATALOG_QUERY: ArticleCatalogQueryState = {
  q: '',
  author: '',
  sort: 'newest',
  page: 1
};

function parsePositiveInteger(value: string | null, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsedValue = Number.parseInt(value, 10);
  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    return fallback;
  }

  return parsedValue;
}

export function parseArticleCatalogQuery(searchParams: URLSearchParams): ArticleCatalogQueryState {
  const q = searchParams.get('q')?.trim() ?? '';
  const author = searchParams.get('author')?.trim() ?? '';
  const sortRaw = searchParams.get('sort') ?? DEFAULT_ARTICLE_CATALOG_QUERY.sort;
  const sort: ArticleSortMode = sortRaw === 'oldest' || sortRaw === 'likes' ? sortRaw : 'newest';
  const page = parsePositiveInteger(searchParams.get('page'), DEFAULT_ARTICLE_CATALOG_QUERY.page);

  return {
    q,
    author,
    sort,
    page
  };
}

export function serializeArticleCatalogQuery(state: ArticleCatalogQueryState): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (state.q.trim().length > 0) {
    searchParams.set('q', state.q.trim());
  }

  if (state.author.trim().length > 0) {
    searchParams.set('author', state.author.trim());
  }

  if (state.sort !== DEFAULT_ARTICLE_CATALOG_QUERY.sort) {
    searchParams.set('sort', state.sort);
  }

  if (state.page > 1) {
    searchParams.set('page', String(state.page));
  }

  return searchParams;
}
