using BackendFungi.Models;

namespace BackendFungi.Abstractions.Repositories;

public interface IMushroomsRepository
{
    Task<Guid> CreateMushroom(Mushroom mushroom, CancellationToken ct);

    Task<List<Mushroom>> GetAllMushrooms(CancellationToken ct);

    Task<Guid> UpdateMushroom(Guid mushroomId, Mushroom newMushroom, CancellationToken ct);

    Task<Guid> DeleteMushroom(Guid mushroomId, CancellationToken ct);
}