using BackendFungi.Abstractions.Repositories;
using BackendFungi.Abstractions.Services;

namespace BackendFungi.Services;

public class MushroomLikesService : IMushroomLikesService
{
    private readonly IMushroomLikesRepository _likesRepository;

    public MushroomLikesService(IMushroomLikesRepository likesRepository)
    {
        _likesRepository = likesRepository;
    }

    public async Task<bool> ToggleLikeAsync(Guid mushroomId, Guid userId, CancellationToken ct)
    {
        return await _likesRepository.ToggleLikeAsync(mushroomId, userId, ct);
    }

    public async Task<int> GetLikesCountAsync(Guid mushroomId, CancellationToken ct)
    {
        return await _likesRepository.GetLikesCountAsync(mushroomId, ct);
    }

    public async Task<bool> HasUserLikedAsync(Guid mushroomId, Guid userId, CancellationToken ct)
    {
        return await _likesRepository.HasUserLikedAsync(mushroomId, userId, ct);
    }
}