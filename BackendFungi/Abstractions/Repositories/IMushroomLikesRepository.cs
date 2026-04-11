namespace BackendFungi.Abstractions.Repositories;

public sealed record FavoriteMushroomListItem(
    Guid MushroomId,
    string Name,
    string? SynonymousName,
    string? LatinName,
    string Family,
    string HeaderPhotoLink,
    DateTime LikedAt,
    int LikesCount);

public interface IMushroomLikesRepository
{
    Task EnsureMushroomExistsAsync(Guid mushroomId, CancellationToken ct);

    Task<bool> ToggleLikeAsync(Guid mushroomId, Guid userId, CancellationToken ct);

    Task<int> GetLikesCountAsync(Guid mushroomId, CancellationToken ct);

    Task<bool> HasUserLikedAsync(Guid mushroomId, Guid userId, CancellationToken ct);

    Task<(List<FavoriteMushroomListItem> Items, int TotalCount)> GetMyFavoriteMushroomsAsync(
        Guid userId,
        int page,
        int pageSize,
        CancellationToken ct);
}
