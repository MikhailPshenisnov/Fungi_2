export type ArticleStatus = 'Draft' | 'InReview' | 'Scheduled' | 'Published' | 'Rejected' | 'Archived';

export interface ArticleParagraph {
  id: string;
  articleId: string;
  paragraphText: string;
  serialNumber: number;
  isSubtitle: boolean;
}

export interface Article {
  id: string;
  title: string;
  publishDate: string;
  authorString: string;
  headerPhotoLink: string;
  extraPhotoLinks: string[];
  status: ArticleStatus;
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
  paragraphs: ArticleParagraph[];
}

export interface EditorArticle extends Article {
  linkedMushroomIds: string[];
}

export interface ArticleLikeState {
  articleId: string;
  likesCount: number;
  isLiked: boolean;
}
