using System.Security.Claims;
using BackendFungi.Abstractions.Repositories;
using BackendFungi.Abstractions.Services;

namespace BackendFungi.Services;

public class ArticleLikesService : IArticleLikesService
{
    private readonly IArticleLikesRepository _likesRepository;

    public ArticleLikesService(IArticleLikesRepository likesRepository)
    {
        _likesRepository = likesRepository;
    }

    public async Task<bool> ToggleLikeAsync(Guid articleId, ClaimsPrincipal user, CancellationToken ct)
    {
        var userId = GetUserId(user);
        return await _likesRepository.ToggleLikeAsync(articleId, userId, ct);
    }

    public async Task<int> GetLikesCountAsync(Guid articleId, CancellationToken ct)
    {
        return await _likesRepository.GetLikesCountAsync(articleId, ct);
    }

    public async Task<Dictionary<Guid, int>> GetLikesCountsByArticleIdsAsync(IReadOnlyCollection<Guid> articleIds,
        CancellationToken ct)
    {
        return await _likesRepository.GetLikesCountsByArticleIdsAsync(articleIds, ct);
    }

    public async Task<bool> HasUserLikedAsync(Guid articleId, ClaimsPrincipal user, CancellationToken ct)
    {
        var userId = GetUserId(user);
        return await _likesRepository.HasUserLikedAsync(articleId, userId, ct);
    }

    private static Guid GetUserId(ClaimsPrincipal user)
    {
        return Guid.Parse(user.FindFirst("UserId")?.Value ?? throw new UnauthorizedAccessException());
    }
}
