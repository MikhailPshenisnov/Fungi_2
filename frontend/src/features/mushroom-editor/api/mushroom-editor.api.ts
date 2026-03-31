import { requestJson, toApiUrl, uploadMultipartWithProgress } from '@shared/api';

const PROTOCOL_URL_PATTERN = /^[a-z][a-z\d+.-]*:/i;
const SCHEME_RELATIVE_URL_PATTERN = /^\/\//;

export type MushroomRevisionStatus = 'Draft' | 'InReview' | 'Published' | 'Rejected' | 'Archived';
export type MushroomModerationDecision = 'Approve' | 'Reject';

export interface EditorMushroomRevision {
  revisionId: string;
  sourceMushroomId: string | null;
  name: string;
  synonymousName: string | null;
  latinName: string | null;
  family: string;
  redBook: boolean;
  eatable: string;
  hasStem: boolean;
  stemSizeFrom: number | null;
  stemSizeTo: number | null;
  stemType: string | null;
  stemColor: string | null;
  capType: string;
  capColor: string;
  capUndersideType: string;
  description: string;
  headerPhotoLink: string | null;
  extraPhotoLinks: string[];
  doppelgangerNames: string[];
  status: MushroomRevisionStatus;
  createdByUserId: string;
  updatedByUserId: string | null;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
  publishedAt: string | null;
  reviewedAt: string | null;
  reviewedByUserId: string | null;
  reviewNote: string | null;
  archivedAt: string | null;
  likesCount: number;
}

export interface EditorMushroomPayload {
  sourceMushroomId?: string | null;
  name: string;
  synonymousName: string | null;
  latinName: string | null;
  family: string;
  redBook: boolean;
  eatable: string;
  hasStem: boolean;
  stemSizeFrom: number | null;
  stemSizeTo: number | null;
  stemType: string | null;
  stemColor: string | null;
  capType: string;
  capColor: string;
  capUndersideType: string;
  description: string;
  headerPhotoLink: string | null;
  extraPhotoLinks: string[];
  doppelgangers: string[];
}

interface EditorMushroomListApiResult {
  mushrooms: unknown[];
}

interface GetEditorMushroomApiResult {
  mushroom: unknown;
}

interface CreateMushroomDraftApiResult {
  createdRevisionId: string;
  status: string;
}

interface UpdateMushroomDraftApiResult {
  updatedRevisionId: string;
  status: string;
}

interface SubmitMushroomForReviewApiResult {
  revisionId: string;
  status: string;
  submittedAt: string;
}

interface ModerateMushroomApiResult {
  revisionId: string;
  status: string;
  reviewedAt: string;
  publishedMushroomId: string | null;
}

interface ArchiveMushroomApiResult {
  revisionId: string;
  status: string;
  archivedAt: string;
}

interface UploadMushroomImageApiResult {
  mediaUrl: string;
  mediaPath: string;
}

interface DeleteMushroomImageApiResult {
  isDeleted: boolean;
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

function normalizeStatus(value: string | null | undefined): MushroomRevisionStatus {
  if (value === 'Draft' || value === 'InReview' || value === 'Published' || value === 'Rejected' || value === 'Archived') {
    return value;
  }

  return 'Draft';
}

function mapEditorMushroom(apiValue: Record<string, unknown>): EditorMushroomRevision {
  const extraPhotoLinks = Array.isArray(apiValue.extraPhotoLinks) ? apiValue.extraPhotoLinks : [];
  const doppelgangerNames = Array.isArray(apiValue.doppelgangerNames) ? apiValue.doppelgangerNames : [];

  return {
    revisionId: String(apiValue.revisionId ?? ''),
    sourceMushroomId: typeof apiValue.sourceMushroomId === 'string' ? apiValue.sourceMushroomId : null,
    name: typeof apiValue.name === 'string' ? apiValue.name : '',
    synonymousName: typeof apiValue.synonymousName === 'string' ? apiValue.synonymousName : null,
    latinName: typeof apiValue.latinName === 'string' ? apiValue.latinName : null,
    family: typeof apiValue.family === 'string' ? apiValue.family : '',
    redBook: Boolean(apiValue.redBook),
    eatable: typeof apiValue.eatable === 'string' ? apiValue.eatable : '',
    hasStem: Boolean(apiValue.hasStem),
    stemSizeFrom: typeof apiValue.stemSizeFrom === 'number' ? apiValue.stemSizeFrom : null,
    stemSizeTo: typeof apiValue.stemSizeTo === 'number' ? apiValue.stemSizeTo : null,
    stemType: typeof apiValue.stemType === 'string' ? apiValue.stemType : null,
    stemColor: typeof apiValue.stemColor === 'string' ? apiValue.stemColor : null,
    capType: typeof apiValue.capType === 'string' ? apiValue.capType : '',
    capColor: typeof apiValue.capColor === 'string' ? apiValue.capColor : '',
    capUndersideType: typeof apiValue.capUndersideType === 'string' ? apiValue.capUndersideType : '',
    description: typeof apiValue.description === 'string' ? apiValue.description : '',
    headerPhotoLink:
      typeof apiValue.headerPhotoLink === 'string' && apiValue.headerPhotoLink.trim().length > 0
        ? normalizeMediaUrl(apiValue.headerPhotoLink)
        : null,
    extraPhotoLinks: extraPhotoLinks
      .map((value) => (typeof value === 'string' ? normalizeMediaUrl(value) : ''))
      .filter(Boolean),
    doppelgangerNames: doppelgangerNames.map((value) => (typeof value === 'string' ? value : '')).filter(Boolean),
    status: normalizeStatus(typeof apiValue.status === 'string' ? apiValue.status : null),
    createdByUserId: typeof apiValue.createdByUserId === 'string' ? apiValue.createdByUserId : '',
    updatedByUserId: typeof apiValue.updatedByUserId === 'string' ? apiValue.updatedByUserId : null,
    createdAt: typeof apiValue.createdAt === 'string' ? apiValue.createdAt : new Date().toISOString(),
    updatedAt: typeof apiValue.updatedAt === 'string' ? apiValue.updatedAt : new Date().toISOString(),
    submittedAt: typeof apiValue.submittedAt === 'string' ? apiValue.submittedAt : null,
    publishedAt: typeof apiValue.publishedAt === 'string' ? apiValue.publishedAt : null,
    reviewedAt: typeof apiValue.reviewedAt === 'string' ? apiValue.reviewedAt : null,
    reviewedByUserId: typeof apiValue.reviewedByUserId === 'string' ? apiValue.reviewedByUserId : null,
    reviewNote: typeof apiValue.reviewNote === 'string' ? apiValue.reviewNote : null,
    archivedAt: typeof apiValue.archivedAt === 'string' ? apiValue.archivedAt : null,
    likesCount: typeof apiValue.likesCount === 'number' ? apiValue.likesCount : 0
  };
}

function sanitizePayload(payload: EditorMushroomPayload) {
  const trimmedExtraPhotoLinks = payload.extraPhotoLinks.map((value) => value.trim()).filter(Boolean);

  return {
    sourceMushroomId: payload.sourceMushroomId ?? null,
    name: payload.name.trim(),
    synonymousName: payload.synonymousName?.trim() || null,
    latinName: payload.latinName?.trim() || null,
    family: payload.family.trim(),
    redBook: payload.redBook,
    eatable: payload.eatable.trim(),
    hasStem: payload.hasStem,
    stemSizeFrom: payload.stemSizeFrom,
    stemSizeTo: payload.stemSizeTo,
    stemType: payload.stemType?.trim() || null,
    stemColor: payload.stemColor?.trim() || null,
    capType: payload.capType.trim(),
    capColor: payload.capColor.trim(),
    capUndersideType: payload.capUndersideType.trim(),
    description: payload.description.trim(),
    headerPhotoLink: payload.headerPhotoLink?.trim() || null,
    extraPhotoLinks: trimmedExtraPhotoLinks.length > 0 ? trimmedExtraPhotoLinks : null,
    doppelgangers: payload.doppelgangers.map((value) => value.trim()).filter(Boolean)
  };
}

async function getList(path: string, token: string): Promise<EditorMushroomRevision[]> {
  const result = await requestJson<EditorMushroomListApiResult>(path, { method: 'GET', token });
  const mushrooms = Array.isArray(result.mushrooms) ? result.mushrooms : [];
  return mushrooms.map((value) => mapEditorMushroom(value as Record<string, unknown>));
}

export async function getMyDrafts(token: string): Promise<EditorMushroomRevision[]> {
  return await getList('/Mushrooms/GetMyDrafts', token);
}

export async function getMyMaterials(token: string): Promise<EditorMushroomRevision[]> {
  return await getList('/Mushrooms/GetMyMaterials', token);
}

export async function getModerationQueue(token: string): Promise<EditorMushroomRevision[]> {
  return await getList('/Mushrooms/GetModerationQueue', token);
}

export async function getEditorMushroom(revisionId: string, token: string): Promise<EditorMushroomRevision> {
  const result = await requestJson<GetEditorMushroomApiResult>(
    `/Mushrooms/GetEditorMushroom?RevisionId=${encodeURIComponent(revisionId)}`,
    {
      method: 'GET',
      token
    }
  );

  return mapEditorMushroom(result.mushroom as Record<string, unknown>);
}

export async function createDraft(payload: EditorMushroomPayload, token: string): Promise<CreateMushroomDraftApiResult> {
  return await requestJson<CreateMushroomDraftApiResult>('/Mushrooms/CreateDraft', {
    method: 'POST',
    token,
    body: sanitizePayload(payload)
  });
}

export async function updateDraft(revisionId: string, payload: EditorMushroomPayload, token: string): Promise<UpdateMushroomDraftApiResult> {
  return await requestJson<UpdateMushroomDraftApiResult>('/Mushrooms/UpdateDraft', {
    method: 'PUT',
    token,
    body: {
      revisionId,
      ...sanitizePayload(payload)
    }
  });
}

export async function submitForReview(revisionId: string, token: string): Promise<SubmitMushroomForReviewApiResult> {
  return await requestJson<SubmitMushroomForReviewApiResult>('/Mushrooms/SubmitForReview', {
    method: 'POST',
    token,
    body: { revisionId }
  });
}

export async function moderateMushroom(
  revisionId: string,
  decision: MushroomModerationDecision,
  reviewNote: string,
  token: string
): Promise<ModerateMushroomApiResult> {
  return await requestJson<ModerateMushroomApiResult>('/Mushrooms/ModerateMushroom', {
    method: 'POST',
    token,
    body: {
      revisionId,
      decision,
      reviewNote: reviewNote.trim() || null
    }
  });
}

export async function archiveMushroom(revisionId: string, token: string): Promise<ArchiveMushroomApiResult> {
  return await requestJson<ArchiveMushroomApiResult>('/Mushrooms/ArchiveMushroom', {
    method: 'POST',
    token,
    body: { revisionId }
  });
}

export async function uploadMushroomImage(
  file: File,
  token: string,
  onProgress?: (value: number) => void
): Promise<UploadMushroomImageApiResult> {
  const result = await uploadMultipartWithProgress<UploadMushroomImageApiResult>({
    path: '/Mushrooms/UploadMushroomImage',
    token,
    fileFieldName: 'image',
    file,
    onProgress
  });

  return {
    ...result,
    mediaUrl: normalizeMediaUrl(result.mediaUrl)
  };
}

export async function deleteMushroomImage(mediaPath: string, token: string): Promise<DeleteMushroomImageApiResult> {
  return await requestJson<DeleteMushroomImageApiResult>(
    `/Mushrooms/DeleteMushroomImage?MediaPath=${encodeURIComponent(mediaPath)}`,
    {
      method: 'DELETE',
      token
    }
  );
}
