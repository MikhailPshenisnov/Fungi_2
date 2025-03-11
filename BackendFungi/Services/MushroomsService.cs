using BackendFungi.Abstractions.Repositories;
using BackendFungi.Abstractions.Services;
using BackendFungi.Exceptions.SpecificExceptions;
using BackendFungi.Models;
using BackendFungi.Models.Filters;

namespace BackendFungi.Services;

public class MushroomsService : IMushroomsService
{
    private readonly IMushroomsRepository _mushroomsRepository;

    public MushroomsService(IMushroomsRepository mushroomsRepository)
    {
        _mushroomsRepository = mushroomsRepository;
    }

    // Creates a new mushroom and its doppelgangers in the system via the repository
    // Parameters: mushroom model with mushroom data and cancellation token
    // Returns: guid of the created mushroom
    public async Task<Guid>
        CreateMushroomAsync(Mushroom mushroom, CancellationToken cancellationToken)
    {
        var createdMushroomId = await _mushroomsRepository.CreateMushroom(mushroom, cancellationToken);

        return createdMushroomId;
    }

    // Retrieves a mushroom by its guid along with a doppelgangers map
    // Parameters: guid of the mushroom and cancellation token
    // Returns: tuple containing the Mushroom model and the doppelgangers map or throws UnknownIdentifierException
    public async Task<(Mushroom Mushroom, List<bool> DoppelgangersMap)>
        GetMushroomAsync(Guid mushroomId, CancellationToken cancellationToken)
    {
        var allMushrooms = await _mushroomsRepository.GetAllMushrooms(cancellationToken);

        var mushroom = allMushrooms.FirstOrDefault(m => m.Id == mushroomId);

        if (mushroom == null)
            throw new UnknownIdentifierException("Unknown mushroom id");

        var doppelgangersMap = mushroom.Doppelgangers
            .Select(doppelganger => allMushrooms
                .FirstOrDefault(m => m.Name == doppelganger.DoppelgangerName))
            .Select(doppelgangerModel => doppelgangerModel is not null)
            .ToList();

        return (mushroom, doppelgangersMap);
    }

    // Retrieves a filtered list of mushrooms with their doppelgangers maps based on the provided filter
    // Parameters: optional MushroomFilter model to filter mushrooms and cancellation token
    // Returns: list of tuples of the Mushroom model and the doppelgangers map, sorted by mushroom name
    public async Task<List<(Mushroom Mushroom, List<bool> DoppelgangersMap)>>
        GetFilteredMushroomsAsync(MushroomFilter? mushroomFilter, CancellationToken cancellationToken)
    {
        var allMushrooms = await _mushroomsRepository.GetAllMushrooms(cancellationToken);

        var mushrooms = allMushrooms;

        if (mushroomFilter is not null)
        {
            if (mushroomFilter.PartOfName is not null)
            {
                mushrooms = mushrooms
                    .Where(m => m.Name.ToLower().Contains(mushroomFilter.PartOfName.ToLower()) ||
                                m.SynonymousName is not null &&
                                m.SynonymousName.ToLower().Contains(mushroomFilter.PartOfName.ToLower()) ||
                                m.LatinName is not null &&
                                m.LatinName.ToLower().Contains(mushroomFilter.PartOfName.ToLower()))
                    .ToList();
            }

            if (mushroomFilter.Family is not null)
            {
                mushrooms = mushrooms
                    .Where(m => m.Family.ToLower().Contains(mushroomFilter.Family.ToLower()))
                    .ToList();
            }

            if (mushroomFilter.RedBook is not null)
            {
                mushrooms = mushrooms
                    .Where(m => m.RedBook == mushroomFilter.RedBook)
                    .ToList();
            }

            if (mushroomFilter.Eatable is not null)
            {
                mushrooms = mushrooms
                    .Where(m => m.Eatable == mushroomFilter.Eatable)
                    .ToList();
            }

            if (mushroomFilter.HasStem is not null)
            {
                mushrooms = mushrooms
                    .Where(m => m.HasStem == mushroomFilter.HasStem)
                    .ToList();

                if (mushroomFilter.HasStem is true)
                {
                    if (mushroomFilter.StemSizeFrom is not null)
                    {
                        mushrooms = mushrooms
                            .Where(m => m.StemSizeFrom >= mushroomFilter.StemSizeFrom)
                            .ToList();
                    }

                    if (mushroomFilter.StemSizeTo is not null)
                    {
                        mushrooms = mushrooms
                            .Where(m => m.StemSizeTo <= mushroomFilter.StemSizeTo)
                            .ToList();
                    }

                    if (mushroomFilter.StemType is not null)
                    {
                        mushrooms = mushrooms
                            .Where(m => m.StemType == mushroomFilter.StemType)
                            .ToList();
                    }

                    if (mushroomFilter.StemColor is not null)
                    {
                        mushrooms = mushrooms
                            .Where(m => m.StemColor != null &&
                                        m.StemColor.ToLower().Contains(mushroomFilter.StemColor.ToLower()))
                            .ToList();
                    }
                }
            }

            if (mushroomFilter.CapType is not null)
            {
                mushrooms = mushrooms
                    .Where(m => m.CapType == mushroomFilter.CapType)
                    .ToList();
            }

            if (mushroomFilter.CapColor is not null)
            {
                mushrooms = mushrooms
                    .Where(m => m.CapColor.ToLower().Contains(mushroomFilter.CapColor.ToLower()))
                    .ToList();
            }

            if (mushroomFilter.CapUndersideType is not null)
            {
                mushrooms = mushrooms
                    .Where(m => m.CapUndersideType == mushroomFilter.CapUndersideType)
                    .ToList();
            }
        }

        mushrooms = mushrooms.OrderBy(m => m.Name).ToList();

        List<(Mushroom Mushroom, List<bool> DoppelgangersMap)> result = mushrooms
            .Select(mushroom =>
            {
                var doppelgangersMap = mushroom.Doppelgangers
                    .Select(doppelganger => allMushrooms
                        .FirstOrDefault(m => m.Name == doppelganger.DoppelgangerName))
                    .Select(doppelgangerModel => doppelgangerModel is not null)
                    .ToList();

                return (mushroom, doppelgangersMap);
            })
            .ToList();

        return result;
    }


    // Updates an existing mushroom in the system via the repository
    // Parameters: guid of the mushroom, Mushroom model with updated data and cancellation token
    // Returns: guid of the updated mushroom
    public async Task<Guid>
        UpdateMushroomAsync(Guid mushroomId, Mushroom newMushroom, CancellationToken cancellationToken)
    {
        var updatedMushroomId = await _mushroomsRepository.UpdateMushroom(mushroomId, newMushroom,
            cancellationToken);

        return updatedMushroomId;
    }

    // Deletes a mushroom from the system via the repository
    // Parameters: guid of the mushroom and cancellation token
    // Returns: guid of the deleted mushroom
    public async Task<Guid>
        DeleteMushroomAsync(Guid mushroomId, CancellationToken cancellationToken)
    {
        var deletedMushroomId = await _mushroomsRepository.DeleteMushroom(mushroomId, cancellationToken);

        return deletedMushroomId;
    }
}