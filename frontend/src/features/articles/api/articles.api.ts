import { requestJson, toApiUrl, uploadMultipartWithProgress } from '@shared/api';
import { mapArticle, mapArticles, mapEditorArticle, type Article, type EditorArticle } from '@entities/article';

interface GetFilteredArticlesApiResult {
  articles: unknown[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
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

interface FavoriteArticleItemApi {
  articleId: string;
  title: string;
  authorString: string;
  publishDate: string;
  headerPhotoLink: string;
  likedAt: string;
  likesCount?: number;
}

interface GetMyFavoriteArticlesApiResult {
  items: FavoriteArticleItemApi[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
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
  page?: number;
  pageSize?: number;
  sort?: 'newest' | 'oldest' | 'likes';
}

export interface PublicArticlesResult {
  articles: Article[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface FavoriteArticlesQuery {
  page?: number;
  pageSize?: number;
}

export interface FavoriteArticleItem {
  articleId: string;
  title: string;
  authorString: string;
  publishDate: string;
  headerPhotoLink: string;
  likedAt: string;
  likesCount: number;
}

export interface FavoriteArticlesResult {
  items: FavoriteArticleItem[];
  totalCount: number;
  page: number;
  pageSize: number;
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

  if (typeof query.page === 'number' && Number.isFinite(query.page)) {
    searchParams.set('Page', String(Math.max(1, Math.trunc(query.page))));
  }

  if (typeof query.pageSize === 'number' && Number.isFinite(query.pageSize)) {
    searchParams.set('PageSize', String(Math.max(1, Math.trunc(query.pageSize))));
  }

  if (query.sort === 'likes' || query.sort === 'oldest' || query.sort === 'newest') {
    searchParams.set('Sort', query.sort);
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

function buildFavoritesQueryString(query: FavoriteArticlesQuery): string {
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

function mapFavoriteArticleItem(apiValue: FavoriteArticleItemApi): FavoriteArticleItem {
  return {
    articleId: apiValue.articleId,
    title: apiValue.title,
    authorString: apiValue.authorString,
    publishDate: apiValue.publishDate,
    headerPhotoLink: normalizeMediaUrl(apiValue.headerPhotoLink),
    likedAt: apiValue.likedAt,
    likesCount: typeof apiValue.likesCount === 'number' ? apiValue.likesCount : 0
  };
}

export async function getPublicArticles(query: PublicArticlesQuery): Promise<PublicArticlesResult> {
  const path = `/Articles/GetFilteredArticles${buildPublicArticlesQueryString(query)}`;
  const result = await requestJson<GetFilteredArticlesApiResult>(path, { method: 'GET' });
  const articles = Array.isArray(result.articles) ? result.articles : [];

  const mappedArticles = mapArticles(articles as never[]);
  const normalizedPageSize = typeof result.pageSize === 'number' && result.pageSize > 0 ? Math.trunc(result.pageSize) : 12;
  const normalizedTotalCount = typeof result.totalCount === 'number' && result.totalCount >= 0 ? Math.trunc(result.totalCount) : mappedArticles.length;
  const normalizedPage =
    typeof result.page === 'number' && result.page > 0
      ? Math.trunc(result.page)
      : 1;

  return {
    articles: mappedArticles,
    totalCount: normalizedTotalCount,
    page: normalizedPage,
    pageSize: normalizedPageSize
  };
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

export async function getMyFavoriteArticles(
  token: string,
  query: FavoriteArticlesQuery = {}
): Promise<FavoriteArticlesResult> {
  const path = `/ArticleLikes/GetMyFavoriteArticles${buildFavoritesQueryString(query)}`;
  const result = await requestJson<GetMyFavoriteArticlesApiResult>(path, { method: 'GET', token });
  const items = Array.isArray(result.items) ? result.items.map(mapFavoriteArticleItem) : [];
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
  const normalizedPage =
    typeof result.page === 'number' && result.page > 0
      ? Math.trunc(result.page)
      : fallbackPage;

  return {
    items,
    totalCount: normalizedTotalCount,
    page: normalizedPage,
    pageSize: normalizedPageSize
  };
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
