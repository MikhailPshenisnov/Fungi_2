using BackendFungi.Abstractions.Repositories;
using BackendFungi.Database.Context;
using BackendFungi.Exceptions.SpecificExceptions;
using BackendFungi.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendFungi.Repositories;

public class MushroomsRepository : IMushroomsRepository
{
    private readonly FungiDbContext _context;

    public MushroomsRepository(FungiDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> CreateMushroom(Mushroom mushroom, CancellationToken cancellationToken)
    {
        var extraPhotoLinksString =
            mushroom.ExtraPhotoLinks is null ? null : string.Join(";", mushroom.ExtraPhotoLinks);

        var mushroomEntity = new Database.Entities.Mushroom
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
            HeaderPhotoLink = mushroom.HeaderPhotoLink,
            ExtraPhotoLinks = extraPhotoLinksString,
        };

        await _context.Mushrooms.AddAsync(mushroomEntity, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        foreach (var doppelgangerEntity in mushroom.Doppelgangers
                     .Select(doppelganger => new Database.Entities.Doppelganger
                     {
                         Id = doppelganger.Id,
                         MushroomId = doppelganger.MushroomId,
                         DoppelgangerName = doppelganger.DoppelgangerName
                     })
                     .ToList())
        {
            await _context.Doppelgangers.AddAsync(doppelgangerEntity, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        return mushroomEntity.Id;
    }

    public async Task<List<Mushroom>> GetAllMushrooms(CancellationToken cancellationToken)
    {
        var mushroomEntities = await _context.Mushrooms
            .Include(m => m.Doppelgangers)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var mushrooms = mushroomEntities
            .Select(mushroomEntity =>
            {
                var doppelgangers = mushroomEntity.Doppelgangers
                    .Select(doppelgangerEntity =>
                    {
                        var (doppelganger, doppelgangerError) = Doppelganger
                            .Create(doppelgangerEntity.Id,
                                doppelgangerEntity.MushroomId,
                                doppelgangerEntity.DoppelgangerName);

                        if (!string.IsNullOrEmpty(doppelgangerError))
                            throw new IntegrityException($"Incorrect data format in the database, unable to create " +
                                                         $"a doppelganger model: {doppelgangerError}");

                        return doppelganger;
                    })
                    .ToList();

                var (mushroom, mushroomError) = Mushroom
                    .Create(mushroomEntity.Id,
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
                        mushroomEntity.ExtraPhotoLinks?.Split(';').ToList(),
                        doppelgangers);

                if (!string.IsNullOrEmpty(mushroomError))
                    throw new IntegrityException($"Incorrect data format in the database, unable to create a " +
                                                 $"mushroom model: {mushroomError}");

                return mushroom;
            })
            .ToList();

        return mushrooms;
    }

    public async Task<Guid> UpdateMushroom(Guid mushroomId, Mushroom newMushroom, CancellationToken cancellationToken)
    {
        var oldMushroomEntity = await _context.Mushrooms
            .Include(m => m.Doppelgangers)
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.Id == mushroomId, cancellationToken);

        if (oldMushroomEntity is null)
            throw new UnknownIdentifierException("Unknown mushroom id");

        await _context.Doppelgangers
            .Where(d => oldMushroomEntity.Doppelgangers
                .Select(x => x.Id)
                .Contains(d.Id))
            .ExecuteDeleteAsync(cancellationToken);

        var newExtraPhotoLinksString =
            newMushroom.ExtraPhotoLinks is null ? null : string.Join(";", newMushroom.ExtraPhotoLinks);

        await _context.Mushrooms
            .Where(m => m.Id == mushroomId)
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
                    .SetProperty(m => m.HeaderPhotoLink, m => newMushroom.HeaderPhotoLink)
                    .SetProperty(m => m.ExtraPhotoLinks, m => newExtraPhotoLinksString),
                cancellationToken);

        foreach (var doppelgangerEntity in newMushroom.Doppelgangers
                     .Select(doppelganger => new Database.Entities.Doppelganger
                     {
                         Id = doppelganger.Id,
                         MushroomId = doppelganger.MushroomId,
                         DoppelgangerName = doppelganger.DoppelgangerName
                     })
                     .ToList())
        {
            await _context.Doppelgangers.AddAsync(doppelgangerEntity, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        return oldMushroomEntity.Id;
    }

    public async Task<Guid> DeleteMushroom(Guid mushroomId, CancellationToken cancellationToken)
    {
        var numDeleted = await _context.Mushrooms
            .Where(m => m.Id == mushroomId)
            .ExecuteDeleteAsync(cancellationToken);

        if (numDeleted == 0)
            throw new UnknownIdentifierException("Unknown mushroom id");

        return mushroomId;
    }
}