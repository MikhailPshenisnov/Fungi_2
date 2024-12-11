using BackendFungi.Models;

namespace BackendFungi.Abstractions;

public interface IDoppelgangersRepository
{
    Task<Guid> CreateDoppelganger(Doppelganger doppelganger);

    Task<List<Doppelganger>> GetMushroomDoppelgangers(Guid mushroomId);

    Task<Guid> DeleteDoppelganger(Guid doppelgangerId);
}