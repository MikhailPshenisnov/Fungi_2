using BackendFungi.Abstractions;
using BackendFungi.Database.Context;
using BackendFungi.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendFungi.Database.Repositories;

public class MushroomsRepository : IMushroomsRepository
{
    private readonly FungiDbContext _context;
    private readonly IDoppelgangersRepository _doppelgangersRepository;

    public MushroomsRepository(FungiDbContext context, IDoppelgangersRepository doppelgangersRepository)
    {
        _context = context;
        _doppelgangersRepository = doppelgangersRepository;
    }

    // Creates a mushroom and doppelgangers to it in the database according to the mushroom model,
    // returns the name of the created mushroom
    public async Task<string> CreateMushroom(Mushroom mushroom)
    {
        var mushroomEntity = new Entities.Mushroom
        {
            Id = mushroom.Id,
            Name = mushroom.Name,
            SynonymousName = mushroom.SynonymousName,
            LatinName = mushroom.LatinName,
            Family = mushroom.Family,
            RedBook = mushroom.RedBook,
            Eatable = mushroom.Eatable,
            HasStem = mushroom.HasStem,
            StemSizeFrom = mushroom.StemSizeFrom,
            StemSizeTo = mushroom.StemSizeTo,
            StemType = mushroom.StemType,
            StemColor = mushroom.StemColor,
            CapType = mushroom.CapType,
            CapColor = mushroom.CapColor,
            CapUndersideType = mushroom.CapUndersideType,
            Description = mushroom.Description,
            HeaderPhotoLink = mushroom.HeaderPhotoLink
        };

        await _context.Mushrooms.AddAsync(mushroomEntity);
        await _context.SaveChangesAsync();

        var addedDoppelgangers = new List<Guid>();
        foreach (var doppelganger in mushroom.Doppelgangers)
        {
            addedDoppelgangers.Add(await _doppelgangersRepository.CreateDoppelganger(doppelganger));
        }

        return mushroom.Name;
    }

    // Gets list of all mushrooms and doppelgangers to them from the database
    public async Task<List<Mushroom>> GetAllMushrooms()
    {
        var mushroomEntities = await _context.Mushrooms
            .AsNoTracking()
            .ToListAsync();

        var mushrooms = new List<Mushroom>();

        foreach (var mushroomEntity in mushroomEntities)
        {
            var doppelgangers = await _doppelgangersRepository
                .GetMushroomDoppelgangers(mushroomEntity.Id);

            mushrooms.Add(Mushroom.Create(
                mushroomEntity.Id,
                mushroomEntity.Name,
                mushroomEntity.SynonymousName,
                mushroomEntity.LatinName,
                mushroomEntity.Family,
                mushroomEntity.RedBook,
                mushroomEntity.Eatable,
                mushroomEntity.HasStem,
                mushroomEntity.StemSizeFrom,
                mushroomEntity.StemSizeTo,
                mushroomEntity.StemType,
                mushroomEntity.StemColor,
                mushroomEntity.CapType,
                mushroomEntity.CapColor,
                mushroomEntity.CapUndersideType,
                mushroomEntity.Description,
                mushroomEntity.HeaderPhotoLink,
                doppelgangers).Mushroom);
        }

        return mushrooms;
    }

    // Gets new parameters for a mushroom, deletes all doppelgangers for the searched mushroom,
    // updates the mushroom parameters and creates new doppelgangers for it
    public async Task<string> UpdateMushroom(string mushroomName, Mushroom newMushroom)
    {
        var oldMushroom = (await GetAllMushrooms()).FirstOrDefault(m => m.Name == mushroomName);

        if (oldMushroom == null)
            throw new Exception("Unknown mushroom name");

        foreach (var doppelganger in oldMushroom.Doppelgangers)
        {
            await _doppelgangersRepository.DeleteDoppelganger(doppelganger.Id);
        }

        await _context.Mushrooms
            .Where(m => m.Name == mushroomName)
            .ExecuteUpdateAsync(x => x
                .SetProperty(m => m.Name, m => newMushroom.Name)
                .SetProperty(m => m.SynonymousName, m => newMushroom.SynonymousName)
                .SetProperty(m => m.LatinName, m => newMushroom.LatinName)
                .SetProperty(m => m.Family, m => newMushroom.Family)
                .SetProperty(m => m.RedBook, m => newMushroom.RedBook)
                .SetProperty(m => m.Eatable, m => newMushroom.Eatable)
                .SetProperty(m => m.HasStem, m => newMushroom.HasStem)
                .SetProperty(m => m.StemSizeFrom, m => newMushroom.StemSizeFrom)
                .SetProperty(m => m.StemSizeTo, m => newMushroom.StemSizeTo)
                .SetProperty(m => m.StemType, m => newMushroom.StemType)
                .SetProperty(m => m.StemColor, m => newMushroom.StemColor)
                .SetProperty(m => m.CapType, m => newMushroom.CapType)
                .SetProperty(m => m.CapColor, m => newMushroom.CapColor)
                .SetProperty(m => m.CapUndersideType, m => newMushroom.CapUndersideType)
                .SetProperty(m => m.Description, m => newMushroom.Description)
                .SetProperty(m => m.HeaderPhotoLink, m => newMushroom.HeaderPhotoLink));

        foreach (var doppelganger in newMushroom.Doppelgangers)
        {
            await _doppelgangersRepository.CreateDoppelganger(doppelganger);
        }

        return mushroomName;
    }

    // Deletes a mushroom, and along with it, thanks to the database settings,
    // all its doppelgangers are deleted, returns the id of the deleted mushroom
    public async Task<string> DeleteMushroom(string mushroomName)
    {
        var numUpdated = await _context.Mushrooms
            .Where(m => m.Name == mushroomName)
            .ExecuteDeleteAsync();

        if (numUpdated == 0)
        {
            throw new Exception("Unknown mushroom Name");
        }

        return mushroomName;
    }
}