import { requestJson } from '@shared/api';
import { mapMushroom, mapMushrooms, type Mushroom } from '@entities/mushroom';

interface GetFilteredMushroomsApiResult {
  mushrooms: unknown[];
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

export interface GetFilteredMushroomsParams {
  partOfName?: string;
  family?: string;
  eatable?: string;
  redBook?: boolean;
}

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

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

export async function getFilteredMushrooms(params: GetFilteredMushroomsParams): Promise<Mushroom[]> {
  const path = `/Mushrooms/GetFilteredMushrooms${buildQueryString(params)}`;
  const result = await requestJson<GetFilteredMushroomsApiResult>(path, { method: 'GET' });
  const mushrooms = Array.isArray(result.mushrooms) ? result.mushrooms : [];
  return mapMushrooms(mushrooms as never[]);
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

