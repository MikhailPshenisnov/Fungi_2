using System.Security.Claims;
using BackendFungi.Abstractions.Repositories;
using BackendFungi.Abstractions.Services;
using BackendFungi.Exceptions.SpecificExceptions;

namespace BackendFungi.Services;

public class MushroomLikesService : IMushroomLikesService
{
    private readonly IMushroomLikesRepository _likesRepository;
    private readonly IMushroomsRepository _mushroomsRepository;

    public MushroomLikesService(IMushroomLikesRepository likesRepository, IMushroomsRepository mushroomsRepository)
    {
        _likesRepository = likesRepository;
        _mushroomsRepository = mushroomsRepository;
    }

    public async Task<bool> ToggleLikeAsync(Guid mushroomId, ClaimsPrincipal user, CancellationToken ct)
    {
        await EnsureMushroomExistsAsync(mushroomId, ct);
        var userId = GetUserId(user);
        return await _likesRepository.ToggleLikeAsync(mushroomId, userId, ct);
    }

    public async Task<int> GetLikesCountAsync(Guid mushroomId, CancellationToken ct)
    {
        await EnsureMushroomExistsAsync(mushroomId, ct);
        return await _likesRepository.GetLikesCountAsync(mushroomId, ct);
    }

    public async Task<bool> HasUserLikedAsync(Guid mushroomId, ClaimsPrincipal user, CancellationToken ct)
    {
        await EnsureMushroomExistsAsync(mushroomId, ct);
        var userId = GetUserId(user);
        return await _likesRepository.HasUserLikedAsync(mushroomId, userId, ct);
    }
    
    private static Guid GetUserId(ClaimsPrincipal user)
    {
        return Guid.Parse(user.FindFirst("UserId")?.Value ?? throw new UnauthorizedAccessException());
    }

    private async Task EnsureMushroomExistsAsync(Guid mushroomId, CancellationToken ct)
    {
        var exists = await _mushroomsRepository.ExistsPublishedMushroom(mushroomId, ct);
        if (!exists)
            throw new UnknownIdentifierException("Unknown mushroom id");
    }
}
