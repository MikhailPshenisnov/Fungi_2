namespace BackendFungi.Abstractions.Repositories;

public interface IMushroomLikesRepository
{
    Task EnsureMushroomExistsAsync(Guid mushroomId, CancellationToken ct);

    Task<bool> ToggleLikeAsync(Guid mushroomId, Guid userId, CancellationToken ct);

    Task<int> GetLikesCountAsync(Guid mushroomId, CancellationToken ct);

    Task<bool> HasUserLikedAsync(Guid mushroomId, Guid userId, CancellationToken ct);
}
