using System.Security.Claims;

namespace BackendFungi.Abstractions.Services;

public interface IArticleLikesService
{
    Task<bool> ToggleLikeAsync(Guid articleId, ClaimsPrincipal user, CancellationToken ct);
    Task<int> GetLikesCountAsync(Guid articleId, CancellationToken ct);
    Task<bool> HasUserLikedAsync(Guid articleId, ClaimsPrincipal user, CancellationToken ct);
}