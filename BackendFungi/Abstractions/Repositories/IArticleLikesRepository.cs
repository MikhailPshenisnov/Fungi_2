namespace BackendFungi.Abstractions.Repositories;

public interface  IArticleLikesRepository
{
    Task<bool> ToggleLikeAsync(Guid articleId, Guid userId, CancellationToken ct);
    Task<int> GetLikesCountAsync(Guid articleId, CancellationToken ct);
    Task<bool> HasUserLikedAsync(Guid articleId, Guid userId, CancellationToken ct);
}