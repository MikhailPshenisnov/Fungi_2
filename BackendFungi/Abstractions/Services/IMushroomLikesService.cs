namespace BackendFungi.Abstractions.Services;

public interface IMushroomLikesService
{
    Task<bool> ToggleLikeAsync(Guid mushroomId, Guid userId, CancellationToken ct);
    Task<int> GetLikesCountAsync(Guid mushroomId, CancellationToken ct);
    Task<bool> HasUserLikedAsync(Guid mushroomId, Guid userId, CancellationToken ct);
}