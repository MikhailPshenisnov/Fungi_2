using BackendFungi.Models;

namespace BackendFungi.Abstractions;

public interface IMushroomsRepository
{
    Task<string> CreateMushroom(Mushroom mushroom);
    Task<List<Mushroom>> GetAllMushrooms();
    Task<string> UpdateMushroom(string mushroomName, Mushroom newMushroomModel);
    Task<string> DeleteMushroom(string mushroomName);
}