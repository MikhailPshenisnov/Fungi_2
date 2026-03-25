import { requestJson, toApiUrl, uploadMultipartWithProgress } from '@shared/api';
import { mapArticle, mapArticles, mapEditorArticle, type Article, type EditorArticle } from '@entities/article';

interface GetFilteredArticlesApiResult {
  articles: unknown[];
}

interface GetArticleApiResult {
  article: unknown;
}

interface GetEditorArticleApiResult {
  article: unknown;
}

interface GetMyArticlesApiResult {
  articles: unknown[];
}

interface CreateDraftApiResult {
  createdArticleId: string;
  status: string;
}

interface UpdateDraftApiResult {
  updatedArticleId: string;
  status: string;
}

interface SubmitForReviewApiResult {
  articleId: string;
  status: string;
  submittedAt: string;
}

interface ModerateArticleApiResult {
  articleId: string;
  status: string;
  reviewedAt: string;
}

interface ArchiveArticleApiResult {
  articleId: string;
  status: string;
  archivedAt: string;
}

interface UploadArticleImageApiResult {
  mediaUrl: string;
  mediaPath: string;
}

interface DeleteArticleImageApiResult {
  isDeleted: boolean;
}

interface ToggleLikeApiResult {
  isLiked: boolean;
}

interface GetLikesCountApiResult {
  count: number;
}

interface HasUserLikedApiResult {
  hasLiked: boolean;
}

interface GetArticleMushroomsApiResult {
  articleId: string;
  mushroomIds: string[];
}

const PROTOCOL_URL_PATTERN = /^[a-z][a-z\d+.-]*:/i;
const SCHEME_RELATIVE_URL_PATTERN = /^\/\//;

export interface EditorParagraphInput {
  text: string;
  isSubtitle: boolean;
}

export interface EditorArticlePayload {
  title: string;
  publishDate: string;
  authorString: string;
  headerPhotoLink: string;
  extraPhotoLinks: string[];
  paragraphs: EditorParagraphInput[];
  linkedMushroomIds: string[];
}

export interface PublicArticlesQuery {
  q?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
}

function buildPublicArticlesQueryString(query: PublicArticlesQuery): string {
  const searchParams = new URLSearchParams();

  if (query.q) {
    searchParams.set('PartOfTitle', query.q);
  }

  if (query.author) {
    searchParams.set('PartOfAuthorString', query.author);
  }

  if (query.dateFrom) {
    searchParams.set('PublishDateFrom', query.dateFrom);
  }

  if (query.dateTo) {
    searchParams.set('PublishDateTo', query.dateTo);
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

function sanitizePayload(payload: EditorArticlePayload) {
  const sanitizedExtraPhotoLinks = payload.extraPhotoLinks
    .map((value) => value.trim())
    .filter(Boolean);

  return {
    title: payload.title,
    publishDate: payload.publishDate,
    authorString: payload.authorString,
    headerPhotoLink: payload.headerPhotoLink.trim(),
    extraPhotoLinks: sanitizedExtraPhotoLinks.length > 0 ? sanitizedExtraPhotoLinks : null,
    paragraphs: payload.paragraphs.map((paragraph) => ({
      text: paragraph.text,
      isSubtitle: paragraph.isSubtitle
    })),
    linkedMushroomIds: payload.linkedMushroomIds
  };
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

export async function getPublicArticles(query: PublicArticlesQuery): Promise<Article[]> {
  const path = `/Articles/GetFilteredArticles${buildPublicArticlesQueryString(query)}`;
  const result = await requestJson<GetFilteredArticlesApiResult>(path, { method: 'GET' });
  const articles = Array.isArray(result.articles) ? result.articles : [];
  return mapArticles(articles as never[]);
}

export async function getPublicArticleById(articleId: string): Promise<Article> {
  const path = `/Articles/GetArticle?ArticleId=${encodeURIComponent(articleId)}`;
  const result = await requestJson<GetArticleApiResult>(path, { method: 'GET' });
  return mapArticle(result.article as never);
}

export async function getEditorArticle(articleId: string, token: string): Promise<EditorArticle> {
  const path = `/Articles/GetEditorArticle?ArticleId=${encodeURIComponent(articleId)}`;
  const result = await requestJson<GetEditorArticleApiResult>(path, { method: 'GET', token });
  return mapEditorArticle(result.article as never);
}

export async function getMyDrafts(token: string): Promise<Article[]> {
  const result = await requestJson<GetMyArticlesApiResult>('/Articles/GetMyDrafts', { method: 'GET', token });
  const articles = Array.isArray(result.articles) ? result.articles : [];
  return mapArticles(articles as never[]);
}

export async function getMyMaterials(token: string): Promise<Article[]> {
  const result = await requestJson<GetMyArticlesApiResult>('/Articles/GetMyMaterials', { method: 'GET', token });
  const articles = Array.isArray(result.articles) ? result.articles : [];
  return mapArticles(articles as never[]);
}

export async function getModerationQueue(token: string): Promise<Article[]> {
  const result = await requestJson<GetMyArticlesApiResult>('/Articles/GetModerationQueue', { method: 'GET', token });
  const articles = Array.isArray(result.articles) ? result.articles : [];
  return mapArticles(articles as never[]);
}

export async function createDraft(payload: EditorArticlePayload, token: string): Promise<CreateDraftApiResult> {
  return await requestJson<CreateDraftApiResult>('/Articles/CreateDraft', {
    method: 'POST',
    token,
    body: sanitizePayload(payload)
  });
}

export async function updateDraft(articleId: string, payload: EditorArticlePayload, token: string): Promise<UpdateDraftApiResult> {
  return await requestJson<UpdateDraftApiResult>('/Articles/UpdateDraft', {
    method: 'PUT',
    token,
    body: {
      articleId,
      ...sanitizePayload(payload)
    }
  });
}

export async function submitForReview(articleId: string, token: string): Promise<SubmitForReviewApiResult> {
  return await requestJson<SubmitForReviewApiResult>('/Articles/SubmitForReview', {
    method: 'POST',
    token,
    body: {
      articleId
    }
  });
}

export async function moderateArticle(
  articleId: string,
  decision: 'Approve' | 'Reject',
  reviewNote: string,
  token: string
): Promise<ModerateArticleApiResult> {
  return await requestJson<ModerateArticleApiResult>('/Articles/ModerateArticle', {
    method: 'POST',
    token,
    body: {
      articleId,
      decision,
      reviewNote: reviewNote.trim() || null
    }
  });
}

export async function archiveArticle(articleId: string, token: string): Promise<ArchiveArticleApiResult> {
  return await requestJson<ArchiveArticleApiResult>('/Articles/ArchiveArticle', {
    method: 'POST',
    token,
    body: {
      articleId
    }
  });
}

export async function uploadArticleImage(
  file: File,
  token: string,
  onProgress?: (value: number) => void
): Promise<UploadArticleImageApiResult> {
  const result = await uploadMultipartWithProgress<UploadArticleImageApiResult>({
    path: '/Articles/UploadArticleImage',
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

export async function deleteArticleImage(mediaPath: string, token: string): Promise<DeleteArticleImageApiResult> {
  return await requestJson<DeleteArticleImageApiResult>(`/Articles/DeleteArticleImage?MediaPath=${encodeURIComponent(mediaPath)}`, {
    method: 'DELETE',
    token
  });
}

export async function toggleArticleLike(articleId: string, token: string): Promise<boolean> {
  const path = `/ArticleLikes/ToggleLike?ArticleId=${encodeURIComponent(articleId)}`;
  const result = await requestJson<ToggleLikeApiResult>(path, { method: 'POST', token });
  return Boolean(result.isLiked);
}

export async function getArticleLikesCount(articleId: string): Promise<number> {
  const path = `/ArticleLikes/GetLikesCount/count?ArticleId=${encodeURIComponent(articleId)}`;
  const result = await requestJson<GetLikesCountApiResult>(path, { method: 'GET' });
  return typeof result.count === 'number' ? result.count : 0;
}

export async function hasUserLikedArticle(articleId: string, token: string): Promise<boolean> {
  const path = `/ArticleLikes/HasUserLiked/user?ArticleId=${encodeURIComponent(articleId)}`;
  const result = await requestJson<HasUserLikedApiResult>(path, { method: 'GET', token });
  return Boolean(result.hasLiked);
}

export async function getArticleMushroomIds(articleId: string): Promise<string[]> {
  const path = `/ArticleMushrooms/GetAllMushrooms?ArticleId=${encodeURIComponent(articleId)}`;
  const result = await requestJson<GetArticleMushroomsApiResult>(path, { method: 'GET' });
  return Array.isArray(result.mushroomIds) ? result.mushroomIds.filter(Boolean) : [];
}
