using BackendFungi.Models;
using BackendFungi.Models.Filters;

namespace BackendFungi.Abstractions.Services;

public interface IMushroomsService
{
    Task<Guid> CreateMushroomAsync(Mushroom mushroom, CancellationToken ct);

    Task<(Mushroom Mushroom, List<bool> DoppelgangersMap)> GetMushroomAsync(Guid mushroomId, CancellationToken ct);

    Task<List<(Mushroom Mushroom, List<bool> DoppelgangersMap)>> GetFilteredMushroomsAsync(
        MushroomFilter? mushroomFilter, CancellationToken ct);

    Task<Guid> UpdateMushroomAsync(Guid mushroomId, Mushroom newMushroom, CancellationToken ct);

    Task<Guid> DeleteMushroomAsync(Guid mushroomId, CancellationToken ct);
}