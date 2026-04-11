using System.Security.Claims;
using BackendFungi.Abstractions.Repositories;

namespace BackendFungi.Abstractions.Services;

public interface IArticleLikesService
{
    Task<bool> ToggleLikeAsync(Guid articleId, ClaimsPrincipal user, CancellationToken ct);
    Task<int> GetLikesCountAsync(Guid articleId, CancellationToken ct);
    Task<Dictionary<Guid, int>> GetLikesCountsByArticleIdsAsync(IReadOnlyCollection<Guid> articleIds, CancellationToken ct);
    Task<bool> HasUserLikedAsync(Guid articleId, ClaimsPrincipal user, CancellationToken ct);
    Task<(List<FavoriteArticleListItem> Items, int TotalCount)> GetMyFavoriteArticlesAsync(
        ClaimsPrincipal user,
        int page,
        int pageSize,
        CancellationToken ct);
}
