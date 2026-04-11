import { requestJson, toApiUrl } from '@shared/api';
import { mapMushroom, mapMushrooms, type Mushroom } from '@entities/mushroom';

interface GetFilteredMushroomsApiResult {
  mushrooms: unknown[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
}

interface GetMyFavoriteMushroomsApiResult {
  items: FavoriteMushroomItemApi[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
}

interface GetMushroomApiResult {
  mushroom: unknown;
}

interface GetLikesCountApiResult {
  count: number;
}

interface HasUserLikedApiResult {
  hasLiked: boolean;
}

interface ToggleLikeApiResult {
  isLiked: boolean;
}

interface FavoriteMushroomItemApi {
  mushroomId: string;
  name: string;
  synonymousName?: string | null;
  latinName?: string | null;
  family: string;
  headerPhotoLink: string;
  likedAt: string;
  likesCount?: number;
}

export interface GetFilteredMushroomsParams {
  partOfName?: string;
  family?: string;
  eatable?: string;
  redBook?: boolean;
  page?: number;
  pageSize?: number;
  sort?: 'name' | 'likes';
}

export interface GetFilteredMushroomsResult {
  mushrooms: Mushroom[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface FavoriteMushroomsQuery {
  page?: number;
  pageSize?: number;
}

export interface FavoriteMushroomItem {
  mushroomId: string;
  name: string;
  synonymousName: string | null;
  latinName: string | null;
  family: string;
  headerPhotoLink: string;
  likedAt: string;
  likesCount: number;
}

export interface FavoriteMushroomsResult {
  items: FavoriteMushroomItem[];
  totalCount: number;
  page: number;
  pageSize: number;
}

const PROTOCOL_URL_PATTERN = /^[a-z][a-z\d+.-]*:/i;
const SCHEME_RELATIVE_URL_PATTERN = /^\/\//;

function buildQueryString(params: GetFilteredMushroomsParams): string {
  const searchParams = new URLSearchParams();

  if (params.partOfName) {
    searchParams.set('PartOfName', params.partOfName);
  }

  if (params.family) {
    searchParams.set('Family', params.family);
  }

  if (params.eatable) {
    searchParams.set('Eatable', params.eatable);
  }

  if (typeof params.redBook === 'boolean') {
    searchParams.set('RedBook', String(params.redBook));
  }

  if (typeof params.page === 'number' && Number.isFinite(params.page)) {
    searchParams.set('Page', String(Math.max(1, Math.trunc(params.page))));
  }

  if (typeof params.pageSize === 'number' && Number.isFinite(params.pageSize)) {
    searchParams.set('PageSize', String(Math.max(1, Math.trunc(params.pageSize))));
  }

  if (params.sort === 'likes' || params.sort === 'name') {
    searchParams.set('Sort', params.sort);
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

function buildFavoritesQueryString(query: FavoriteMushroomsQuery): string {
  const searchParams = new URLSearchParams();

  if (typeof query.page === 'number' && Number.isFinite(query.page)) {
    searchParams.set('Page', String(Math.max(1, Math.trunc(query.page))));
  }

  if (typeof query.pageSize === 'number' && Number.isFinite(query.pageSize)) {
    searchParams.set('PageSize', String(Math.max(1, Math.trunc(query.pageSize))));
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

function normalizeMediaUrl(value: string): string {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return '';
  }

  if (PROTOCOL_URL_PATTERN.test(trimmedValue) || SCHEME_RELATIVE_URL_PATTERN.test(trimmedValue)) {
    return trimmedValue;
  }

  if (trimmedValue.startsWith('/')) {
    return toApiUrl(trimmedValue);
  }

  return toApiUrl(`/${trimmedValue}`);
}

function mapFavoriteMushroomItem(apiValue: FavoriteMushroomItemApi): FavoriteMushroomItem {
  return {
    mushroomId: apiValue.mushroomId,
    name: apiValue.name,
    synonymousName: apiValue.synonymousName ?? null,
    latinName: apiValue.latinName ?? null,
    family: apiValue.family,
    headerPhotoLink: normalizeMediaUrl(apiValue.headerPhotoLink),
    likedAt: apiValue.likedAt,
    likesCount: typeof apiValue.likesCount === 'number' ? apiValue.likesCount : 0
  };
}

export async function getFilteredMushrooms(params: GetFilteredMushroomsParams): Promise<GetFilteredMushroomsResult> {
  const path = `/Mushrooms/GetFilteredMushrooms${buildQueryString(params)}`;
  const result = await requestJson<GetFilteredMushroomsApiResult>(path, { method: 'GET' });
  const mushrooms = Array.isArray(result.mushrooms) ? result.mushrooms : [];
  const mappedMushrooms = mapMushrooms(mushrooms as never[]);
  const normalizedPageSize = typeof result.pageSize === 'number' && result.pageSize > 0 ? Math.trunc(result.pageSize) : 12;
  const normalizedTotalCount = typeof result.totalCount === 'number' && result.totalCount >= 0 ? Math.trunc(result.totalCount) : mappedMushrooms.length;
  const normalizedPage = typeof result.page === 'number' && result.page > 0 ? Math.trunc(result.page) : 1;

  return {
    mushrooms: mappedMushrooms,
    totalCount: normalizedTotalCount,
    page: normalizedPage,
    pageSize: normalizedPageSize
  };
}

export async function getMyFavoriteMushrooms(
  token: string,
  query: FavoriteMushroomsQuery = {}
): Promise<FavoriteMushroomsResult> {
  const path = `/MushroomLikes/GetMyFavoriteMushrooms${buildFavoritesQueryString(query)}`;
  const result = await requestJson<GetMyFavoriteMushroomsApiResult>(path, { method: 'GET', token });
  const items = Array.isArray(result.items) ? result.items.map(mapFavoriteMushroomItem) : [];
  const fallbackPageSize =
    typeof query.pageSize === 'number' && Number.isFinite(query.pageSize)
      ? Math.max(1, Math.trunc(query.pageSize))
      : 12;
  const fallbackPage =
    typeof query.page === 'number' && Number.isFinite(query.page)
      ? Math.max(1, Math.trunc(query.page))
      : 1;
  const normalizedPageSize =
    typeof result.pageSize === 'number' && result.pageSize > 0
      ? Math.trunc(result.pageSize)
      : fallbackPageSize;
  const normalizedTotalCount =
    typeof result.totalCount === 'number' && result.totalCount >= 0
      ? Math.trunc(result.totalCount)
      : items.length;
  const normalizedPage = typeof result.page === 'number' && result.page > 0 ? Math.trunc(result.page) : fallbackPage;

  return {
    items,
    totalCount: normalizedTotalCount,
    page: normalizedPage,
    pageSize: normalizedPageSize
  };
}

export async function getMushroomById(mushroomId: string): Promise<Mushroom> {
  const path = `/Mushrooms/GetMushroom?MushroomId=${encodeURIComponent(mushroomId)}`;
  const result = await requestJson<GetMushroomApiResult>(path, { method: 'GET' });
  return mapMushroom(result.mushroom as never);
}

export async function getMushroomLikesCount(mushroomId: string): Promise<number> {
  const path = `/MushroomLikes/GetLikesCount/count?mushroomId=${encodeURIComponent(mushroomId)}`;
  const result = await requestJson<GetLikesCountApiResult>(path, { method: 'GET' });
  return typeof result.count === 'number' ? result.count : 0;
}

export async function hasUserLikedMushroom(mushroomId: string, token: string): Promise<boolean> {
  const path = `/MushroomLikes/HasUserLiked/user?mushroomId=${encodeURIComponent(mushroomId)}`;
  const result = await requestJson<HasUserLikedApiResult>(path, {
    method: 'GET',
    token
  });

  return Boolean(result.hasLiked);
}

export async function toggleMushroomLike(mushroomId: string, token: string): Promise<boolean> {
  const path = `/MushroomLikes/ToggleLike?mushroomId=${encodeURIComponent(mushroomId)}`;
  const result = await requestJson<ToggleLikeApiResult>(path, {
    method: 'POST',
    token
  });

  return Boolean(result.isLiked);
}
