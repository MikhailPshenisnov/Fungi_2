using System.Security.Claims;

namespace BackendFungi.Abstractions.Services;

public interface IMushroomLikesService
{
    Task<bool> ToggleLikeAsync(Guid mushroomId, ClaimsPrincipal user, CancellationToken ct);
    Task<int> GetLikesCountAsync(Guid mushroomId, CancellationToken ct);
    Task<bool> HasUserLikedAsync(Guid mushroomId, ClaimsPrincipal user, CancellationToken ct);
}