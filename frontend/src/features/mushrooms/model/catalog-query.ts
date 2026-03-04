export type MushroomSortMode = 'name' | 'likes';
export type MushroomEatableFilterValue = 'all' | 'edible' | 'inedible';

export interface MushroomCatalogQueryState {
  q: string;
  family: string;
  eatable: MushroomEatableFilterValue;
  redBook: boolean;
  sort: MushroomSortMode;
  page: number;
}

export const DEFAULT_MUSHROOM_CATALOG_QUERY: MushroomCatalogQueryState = {
  q: '',
  family: '',
  eatable: 'all',
  redBook: false,
  sort: 'name',
  page: 1
};

function normalizeEatableFilter(value: string | null): MushroomEatableFilterValue {
  if (value === 'edible' || value === 'inedible') {
    return value;
  }

  return 'all';
}

function normalizeSortMode(value: string | null): MushroomSortMode {
  if (value === 'likes') {
    return 'likes';
  }

  return 'name';
}

function normalizePage(value: string | null): number {
  if (!value) {
    return 1;
  }

  const parsedValue = Number.parseInt(value, 10);
  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    return 1;
  }

  return parsedValue;
}

function normalizeString(value: string | null): string {
  if (!value) {
    return '';
  }

  return value.trim();
}

export function parseMushroomCatalogQuery(searchParams: URLSearchParams): MushroomCatalogQueryState {
  return {
    q: normalizeString(searchParams.get('q')),
    family: normalizeString(searchParams.get('family')),
    eatable: normalizeEatableFilter(searchParams.get('eatable')),
    redBook: searchParams.get('redBook') === '1',
    sort: normalizeSortMode(searchParams.get('sort')),
    page: normalizePage(searchParams.get('page'))
  };
}

export function serializeMushroomCatalogQuery(state: MushroomCatalogQueryState): URLSearchParams {
  const nextParams = new URLSearchParams();

  if (state.q) {
    nextParams.set('q', state.q);
  }

  if (state.family) {
    nextParams.set('family', state.family);
  }

  if (state.eatable !== 'all') {
    nextParams.set('eatable', state.eatable);
  }

  if (state.redBook) {
    nextParams.set('redBook', '1');
  }

  if (state.sort !== 'name') {
    nextParams.set('sort', state.sort);
  }

  if (state.page > 1) {
    nextParams.set('page', String(state.page));
  }

  return nextParams;
}

export function mapEatableFilterToApiValue(value: MushroomEatableFilterValue): string | undefined {
  if (value === 'edible') {
    return 'Съедобный';
  }

  if (value === 'inedible') {
    return 'Несъедобный';
  }

  return undefined;
}

