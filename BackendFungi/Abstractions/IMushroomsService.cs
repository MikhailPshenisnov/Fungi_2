using BackendFungi.Models;

namespace BackendFungi.Abstractions;

public interface IMushroomsService
{
    Task<(Mushroom Mushroom, List<bool> DoppelgangersMap)> GetMushroomAsync(string mushroomName, CancellationToken ct);

    Task<List<(Mushroom Mushroom, List<bool> DoppelgangersMap)>> GetAllMushroomsAsync(CancellationToken ct);

    Task<List<(Mushroom Mushroom, List<bool> DoppelgangersMap)>>
        GetFilteredMushroomsAsync(MushroomFilter mushroomFilter, CancellationToken ct);

    Task<Guid> CreateMushroomAsync(Mushroom mushroom, CancellationToken ct);

    Task<Guid> UpdateMushroomAsync(string mushroomName, Mushroom newMushroom, CancellationToken ct);

    Task<Guid> DeleteMushroomAsync(string mushroomName, CancellationToken ct);
}