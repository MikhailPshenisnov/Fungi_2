namespace BackendFungi.Abstractions.Repositories;

public sealed record FavoriteArticleListItem(
    Guid ArticleId,
    string Title,
    string AuthorString,
    DateTime PublishDate,
    string HeaderPhotoLink,
    DateTime LikedAt,
    int LikesCount);

public interface  IArticleLikesRepository
{
    Task<bool> ToggleLikeAsync(Guid articleId, Guid userId, CancellationToken ct);
    Task<int> GetLikesCountAsync(Guid articleId, CancellationToken ct);
    Task<Dictionary<Guid, int>> GetLikesCountsByArticleIdsAsync(IReadOnlyCollection<Guid> articleIds, CancellationToken ct);
    Task<bool> HasUserLikedAsync(Guid articleId, Guid userId, CancellationToken ct);
    Task<(List<FavoriteArticleListItem> Items, int TotalCount)> GetMyFavoriteArticlesAsync(
        Guid userId,
        int page,
        int pageSize,
        CancellationToken ct);
}
