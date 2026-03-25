import type { Article, ArticleParagraph, ArticleStatus, EditorArticle } from './article.types';
import { toApiUrl } from '@shared/api';

interface ArticleParagraphApi {
  id: string;
  articleId: string;
  paragraphText: string;
  serialNumber: number;
  isSubtitle: boolean;
}

interface ArticleApi {
  id: string;
  title: string;
  publishDate: string;
  authorString: string;
  headerPhotoLink: string;
  extraPhotoLinks?: string[] | null;
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
  paragraphs?: ArticleParagraphApi[] | null;
}

interface EditorArticleApi extends ArticleApi {
  linkedMushroomIds?: string[] | null;
}

const knownStatuses = new Set<ArticleStatus>(['Draft', 'InReview', 'Scheduled', 'Published', 'Rejected', 'Archived']);

const PROTOCOL_URL_PATTERN = /^[a-z][a-z\d+.-]*:/i;
const SCHEME_RELATIVE_URL_PATTERN = /^\/\//;

function normalizeStatus(value: string | undefined): ArticleStatus {
  if (!value) {
    return 'Published';
  }

  if (knownStatuses.has(value as ArticleStatus)) {
    return value as ArticleStatus;
  }

  return 'Published';
}

function mapParagraph(apiValue: ArticleParagraphApi): ArticleParagraph {
  return {
    id: apiValue.id,
    articleId: apiValue.articleId,
    paragraphText: apiValue.paragraphText,
    serialNumber: apiValue.serialNumber,
    isSubtitle: Boolean(apiValue.isSubtitle)
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

export function mapArticle(apiValue: ArticleApi): Article {
  return {
    id: apiValue.id,
    title: apiValue.title,
    publishDate: apiValue.publishDate,
    authorString: apiValue.authorString,
    headerPhotoLink: normalizeMediaUrl(apiValue.headerPhotoLink),
    extraPhotoLinks: Array.isArray(apiValue.extraPhotoLinks)
      ? apiValue.extraPhotoLinks.map((value) => normalizeMediaUrl(value)).filter(Boolean)
      : [],
    status: normalizeStatus(apiValue.status),
    createdByUserId: apiValue.createdByUserId ?? '',
    updatedByUserId: apiValue.updatedByUserId ?? null,
    createdAt: apiValue.createdAt ?? apiValue.publishDate,
    updatedAt: apiValue.updatedAt ?? apiValue.publishDate,
    submittedAt: apiValue.submittedAt ?? null,
    publishedAt: apiValue.publishedAt ?? null,
    reviewedAt: apiValue.reviewedAt ?? null,
    reviewedByUserId: apiValue.reviewedByUserId ?? null,
    reviewNote: apiValue.reviewNote ?? null,
    archivedAt: apiValue.archivedAt ?? null,
    likesCount: typeof apiValue.likesCount === 'number' ? apiValue.likesCount : 0,
    paragraphs: Array.isArray(apiValue.paragraphs) ? apiValue.paragraphs.map(mapParagraph).sort((a, b) => a.serialNumber - b.serialNumber) : []
  };
}

export function mapArticles(apiValues: ArticleApi[]): Article[] {
  return apiValues.map(mapArticle);
}

export function mapEditorArticle(apiValue: EditorArticleApi): EditorArticle {
  const article = mapArticle(apiValue);

  return {
    ...article,
    linkedMushroomIds: Array.isArray(apiValue.linkedMushroomIds) ? apiValue.linkedMushroomIds.filter(Boolean) : []
  };
}
