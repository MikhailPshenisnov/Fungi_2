import { toApiUrl } from '@shared/api';
import type { Mushroom, MushroomDoppelganger, MushroomRevision, MushroomRevisionStatus } from './mushroom.types';

interface MushroomDoppelgangerApi {
  id: string;
  mushroomId: string;
  doppelgangerName: string;
  isContainedInDatabase: boolean;
}

interface MushroomApi {
  id: string;
  name: string;
  synonymousName?: string | null;
  latinName?: string | null;
  family: string;
  redBook: boolean;
  eatable: string;
  hasStem: boolean;
  stemSizeFrom?: number | null;
  stemSizeTo?: number | null;
  stemType?: string | null;
  stemColor?: string | null;
  capType: string;
  capColor: string;
  capUndersideType: string;
  description: string;
  headerPhotoLink: string;
  extraPhotoLinks?: string[] | null;
  doppelgangers?: MushroomDoppelgangerApi[] | null;
  likesCount?: number;
}

interface EditorMushroomDto {
  revisionId: string;
  sourceMushroomId?: string | null;
  name: string;
  synonymousName?: string | null;
  latinName?: string | null;
  family: string;
  redBook: boolean;
  eatable: string;
  hasStem: boolean;
  stemSizeFrom?: number | null;
  stemSizeTo?: number | null;
  stemType?: string | null;
  stemColor?: string | null;
  capType: string;
  capColor: string;
  capUndersideType: string;
  description: string;
  headerPhotoLink?: string | null;
  extraPhotoLinks?: string[] | null;
  doppelgangerNames?: string[] | null;
  status?: string;
  createdByUserId?: string;
  updatedByUserId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  submittedAt?: string | null;
  publishedAt?: string | null;
  reviewedAt?: string | null;
  reviewedByUserId?: string | null;
  reviewNote?: string | null;
  archivedAt?: string | null;
  likesCount?: number;
}

const knownRevisionStatuses = new Set<MushroomRevisionStatus>(['Draft', 'InReview', 'Published', 'Rejected', 'Archived']);

const PROTOCOL_URL_PATTERN = /^[a-z][a-z\d+.-]*:/i;
const SCHEME_RELATIVE_URL_PATTERN = /^\/\//;

function mapDoppelganger(apiValue: MushroomDoppelgangerApi): MushroomDoppelganger {
  return {
    id: apiValue.id,
    mushroomId: apiValue.mushroomId,
    doppelgangerName: apiValue.doppelgangerName,
    isContainedInDatabase: Boolean(apiValue.isContainedInDatabase)
  };
}

function normalizeRevisionStatus(value: string | undefined): MushroomRevisionStatus {
  if (value && knownRevisionStatuses.has(value as MushroomRevisionStatus)) {
    return value as MushroomRevisionStatus;
  }

  return 'Draft';
}

function normalizeMediaUrl(value: string | null | undefined): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return null;
  }

  if (PROTOCOL_URL_PATTERN.test(trimmedValue) || SCHEME_RELATIVE_URL_PATTERN.test(trimmedValue)) {
    return trimmedValue;
  }

  if (trimmedValue.startsWith('/')) {
    return toApiUrl(trimmedValue);
  }

  return toApiUrl(`/${trimmedValue}`);
}

function cleanStringArray(values: string[] | null | undefined): string[] {
  if (!Array.isArray(values)) {
    return [];
  }

  return values.map((value) => value.trim()).filter(Boolean);
}

export function mapMushroom(apiValue: MushroomApi): Mushroom {
  return {
    id: apiValue.id,
    name: apiValue.name,
    synonymousName: apiValue.synonymousName ?? null,
    latinName: apiValue.latinName ?? null,
    family: apiValue.family,
    redBook: Boolean(apiValue.redBook),
    eatable: apiValue.eatable,
    hasStem: Boolean(apiValue.hasStem),
    stemSizeFrom: apiValue.stemSizeFrom ?? null,
    stemSizeTo: apiValue.stemSizeTo ?? null,
    stemType: apiValue.stemType ?? null,
    stemColor: apiValue.stemColor ?? null,
    capType: apiValue.capType,
    capColor: apiValue.capColor,
    capUndersideType: apiValue.capUndersideType,
    description: apiValue.description,
    headerPhotoLink: apiValue.headerPhotoLink,
    extraPhotoLinks: Array.isArray(apiValue.extraPhotoLinks) ? apiValue.extraPhotoLinks.filter(Boolean) : [],
    doppelgangers: Array.isArray(apiValue.doppelgangers) ? apiValue.doppelgangers.map(mapDoppelganger) : [],
    likesCount: typeof apiValue.likesCount === 'number' ? apiValue.likesCount : 0
  };
}

export function mapMushrooms(apiValues: MushroomApi[]): Mushroom[] {
  return apiValues.map(mapMushroom);
}

export function mapEditorMushroom(apiValue: EditorMushroomDto): MushroomRevision {
  return {
    revisionId: apiValue.revisionId,
    sourceMushroomId: apiValue.sourceMushroomId ?? null,
    name: apiValue.name,
    synonymousName: apiValue.synonymousName ?? null,
    latinName: apiValue.latinName ?? null,
    family: apiValue.family,
    redBook: Boolean(apiValue.redBook),
    eatable: apiValue.eatable,
    hasStem: Boolean(apiValue.hasStem),
    stemSizeFrom: apiValue.stemSizeFrom ?? null,
    stemSizeTo: apiValue.stemSizeTo ?? null,
    stemType: apiValue.stemType ?? null,
    stemColor: apiValue.stemColor ?? null,
    capType: apiValue.capType,
    capColor: apiValue.capColor,
    capUndersideType: apiValue.capUndersideType,
    description: apiValue.description,
    headerPhotoLink: normalizeMediaUrl(apiValue.headerPhotoLink),
    extraPhotoLinks: cleanStringArray(apiValue.extraPhotoLinks).map((value) => normalizeMediaUrl(value)).filter(
      (value): value is string => Boolean(value)
    ),
    doppelgangerNames: cleanStringArray(apiValue.doppelgangerNames),
    status: normalizeRevisionStatus(apiValue.status),
    createdByUserId: apiValue.createdByUserId ?? '',
    updatedByUserId: apiValue.updatedByUserId ?? null,
    createdAt: apiValue.createdAt ?? '',
    updatedAt: apiValue.updatedAt ?? '',
    submittedAt: apiValue.submittedAt ?? null,
    publishedAt: apiValue.publishedAt ?? null,
    reviewedAt: apiValue.reviewedAt ?? null,
    reviewedByUserId: apiValue.reviewedByUserId ?? null,
    reviewNote: apiValue.reviewNote ?? null,
    archivedAt: apiValue.archivedAt ?? null,
    likesCount: typeof apiValue.likesCount === 'number' ? apiValue.likesCount : 0
  };
}

export function mapEditorMushrooms(apiValues: EditorMushroomDto[]): MushroomRevision[] {
  return apiValues.map(mapEditorMushroom);
}
