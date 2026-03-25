export const PERMISSION_CODES = {
  articlesWrite: 'content.articles.write',
  articlesReview: 'content.articles.review',
  articlesPublish: 'content.articles.publish',
  articlesArchive: 'content.articles.archive',
  articlesManageAny: 'content.articles.manage-any',
  articleMediaWrite: 'content.article-media.write',
  articleMushroomsWrite: 'content.article-mushrooms.write'
} as const;

export function hasPermission(permissionCodes: readonly string[], permissionCode: string): boolean {
  if (!permissionCode) {
    return false;
  }

  const normalizedCode = permissionCode.trim().toLowerCase();
  if (!normalizedCode) {
    return false;
  }

  return permissionCodes.some((code) => code.trim().toLowerCase() === normalizedCode);
}

export function hasAnyPermission(permissionCodes: readonly string[], requiredCodes: readonly string[]): boolean {
  return requiredCodes.some((code) => hasPermission(permissionCodes, code));
}
