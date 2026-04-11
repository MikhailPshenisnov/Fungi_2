using System.Security.Claims;
using BackendFungi.Abstractions.Repositories;

namespace BackendFungi.Abstractions.Services;

public interface IMushroomLikesService
{
    Task<bool> ToggleLikeAsync(Guid mushroomId, ClaimsPrincipal user, CancellationToken ct);
    Task<int> GetLikesCountAsync(Guid mushroomId, CancellationToken ct);
    Task<bool> HasUserLikedAsync(Guid mushroomId, ClaimsPrincipal user, CancellationToken ct);
    Task<(List<FavoriteMushroomListItem> Items, int TotalCount)> GetMyFavoriteMushroomsAsync(
        ClaimsPrincipal user,
        int page,
        int pageSize,
        CancellationToken ct);
}
