import type { Mushroom } from '@entities/mushroom';
import type { MushroomSortMode } from './catalog-query';

export interface PaginatedMushroomsResult {
  items: Mushroom[];
  totalItems: number;
  totalPages: number;
  page: number;
}

export function sortMushrooms(
  mushrooms: Mushroom[],
  sortMode: MushroomSortMode,
  likesCountById: Record<string, number>
): Mushroom[] {
  const nextMushrooms = [...mushrooms];

  if (sortMode === 'likes') {
    nextMushrooms.sort((a, b) => {
      const likesDiff = (likesCountById[b.id] ?? 0) - (likesCountById[a.id] ?? 0);
      if (likesDiff !== 0) {
        return likesDiff;
      }

      return a.name.localeCompare(b.name, 'ru');
    });

    return nextMushrooms;
  }

  nextMushrooms.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  return nextMushrooms;
}

export function paginateMushrooms(mushrooms: Mushroom[], page: number, pageSize: number): PaginatedMushroomsResult {
  const totalItems = mushrooms.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const normalizedPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (normalizedPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    items: mushrooms.slice(startIndex, endIndex),
    totalItems,
    totalPages,
    page: normalizedPage
  };
}

