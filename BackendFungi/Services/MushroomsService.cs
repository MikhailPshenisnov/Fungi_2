using BackendFungi.Abstractions;
using BackendFungi.Models;

namespace BackendFungi.Services;

public class MushroomsService : IMushroomsService
{
    private readonly IMushroomsRepository _mushroomsRepository;

    public MushroomsService(IMushroomsRepository mushroomsRepository)
    {
        _mushroomsRepository = mushroomsRepository;
    }

    // Returns a mushroom model based on the mushroom name, also returns a doppelgangers map,
    // which displays whether the corresponding doppelganger is in the database
    public async Task<(Mushroom Mushroom, List<bool> DoppelgangersMap)>
        GetMushroomAsync(string mushroomName, CancellationToken ct)
    {
        try
        {
            var allMushrooms = await _mushroomsRepository.GetAllMushrooms();

            var mushroom = allMushrooms.FirstOrDefault(m => m.Name == mushroomName);
            if (mushroom == null)
                throw new Exception("Unknown mushroom name");

            var doppelgangersMap = new List<bool>();
            foreach (var doppelganger in mushroom.Doppelgangers)
            {
                try
                {
                    var d = allMushrooms
                        .FirstOrDefault(m => m.Name == doppelganger.DoppelgangerName);
                    if (d == null)
                        throw new Exception("Unknown mushroom name");

                    doppelgangersMap.Add(true);
                }
                catch (Exception)
                {
                    doppelgangersMap.Add(false);
                }
            }

            return (mushroom, doppelgangersMap);
        }
        catch (Exception e)
        {
            throw new Exception($"Unable to get mushroom \"{mushroomName}\": \"{e.Message}\"");
        }
    }

    // Returns a list of all mushrooms models and doppelgangers map for them
    public async Task<List<(Mushroom Mushroom, List<bool> DoppelgangersMap)>>
        GetAllMushroomsAsync(CancellationToken ct)
    {
        try
        {
            var allMushrooms = await _mushroomsRepository.GetAllMushrooms();

            var result = new List<(Mushroom, List<bool> DoppelgangersMap)>();
            foreach (var mushroom in allMushrooms)
            {
                var doppelgangersMap = new List<bool>();
                foreach (var doppelganger in mushroom.Doppelgangers)
                {
                    try
                    {
                        var d = allMushrooms
                            .FirstOrDefault(m => m.Name == doppelganger.DoppelgangerName);
                        if (d == null)
                            throw new Exception("Unknown mushroom name");

                        doppelgangersMap.Add(true);
                    }
                    catch (Exception)
                    {
                        doppelgangersMap.Add(false);
                    }
                }

                result.Add((mushroom, doppelgangersMap));
            }

            return result;
        }
        catch (Exception e)
        {
            throw new Exception($"Unable to get mushrooms: \"{e.Message}\"");
        }
    }

    // Returns a list of mushrooms and doppelgangers map for them after filtering
    public async Task<List<(Mushroom Mushroom, List<bool> DoppelgangersMap)>>
        GetFilteredMushroomsAsync(MushroomFilter mushroomFilter, CancellationToken ct)
    {
        try
        {
            var allMushrooms = await _mushroomsRepository.GetAllMushrooms();

            if (mushroomFilter.PartOfName is not null)
            {
                allMushrooms = allMushrooms
                    .Where(m => m.Name.Contains(mushroomFilter.PartOfName) ||
                                m.SynonymousName is not null &&
                                m.SynonymousName.Contains(mushroomFilter.PartOfName) ||
                                m.LatinName is not null &&
                                m.LatinName.Contains(mushroomFilter.PartOfName))
                    .ToList();
            }

            if (mushroomFilter.Family is not null)
            {
                allMushrooms = allMushrooms
                    .Where(m => m.Family.Contains(mushroomFilter.Family))
                    .ToList();
            }

            if (mushroomFilter.RedBook is not null)
            {
                allMushrooms = allMushrooms
                    .Where(m => m.RedBook == mushroomFilter.RedBook)
                    .ToList();
            }

            if (mushroomFilter.Eatable is not null)
            {
                allMushrooms = allMushrooms
                    .Where(m => m.Eatable == mushroomFilter.Eatable)
                    .ToList();
            }

            if (mushroomFilter.HasStem is not null)
            {
                allMushrooms = allMushrooms
                    .Where(m => m.HasStem == mushroomFilter.HasStem)
                    .ToList();

                if (mushroomFilter.HasStem is true)
                {
                    if (mushroomFilter.StemSizeFrom is not null)
                    {
                        allMushrooms = allMushrooms
                            .Where(m => m.StemSizeFrom >= mushroomFilter.StemSizeFrom)
                            .ToList();
                    }

                    if (mushroomFilter.StemSizeTo is not null)
                    {
                        allMushrooms = allMushrooms
                            .Where(m => m.StemSizeTo <= mushroomFilter.StemSizeTo)
                            .ToList();
                    }

                    if (mushroomFilter.StemType is not null)
                    {
                        allMushrooms = allMushrooms
                            .Where(m => m.StemType == mushroomFilter.StemType)
                            .ToList();
                    }

                    if (mushroomFilter.StemColor is not null)
                    {
                        allMushrooms = allMushrooms
                            .Where(m => m.StemColor!.Contains(mushroomFilter.StemColor))
                            .ToList();
                    }
                }
            }

            if (mushroomFilter.CapType is not null)
            {
                allMushrooms = allMushrooms
                    .Where(m => m.CapType == mushroomFilter.CapType)
                    .ToList();
            }

            if (mushroomFilter.CapColor is not null)
            {
                allMushrooms = allMushrooms
                    .Where(m => m.CapColor.Contains(mushroomFilter.CapColor))
                    .ToList();
            }

            if (mushroomFilter.CapUndersideType is not null)
            {
                allMushrooms = allMushrooms
                    .Where(m => m.CapUndersideType == mushroomFilter.CapUndersideType)
                    .ToList();
            }


            var result = new List<(Mushroom, List<bool> DoppelgangersMap)>();
            foreach (var mushroom in allMushrooms)
            {
                var doppelgangersMap = new List<bool>();
                foreach (var doppelganger in mushroom.Doppelgangers)
                {
                    try
                    {
                        var d = allMushrooms
                            .FirstOrDefault(m => m.Name == doppelganger.DoppelgangerName);
                        if (d == null)
                            throw new Exception("Unknown mushroom name");

                        doppelgangersMap.Add(true);
                    }
                    catch (Exception)
                    {
                        doppelgangersMap.Add(false);
                    }
                }

                result.Add((mushroom, doppelgangersMap));
            }

            return result;
        }
        catch (Exception e)
        {
            throw new Exception($"Unable to get filtered mushrooms: \"{e.Message}\"");
        }
    }

    // Creates a mushroom and doppelgangers for it in the database,
    // returns the id of the created mushroom
    public async Task<Guid> CreateMushroomAsync(Mushroom mushroom, CancellationToken ct)
    {
        try
        {
            var allMushrooms = await _mushroomsRepository.GetAllMushrooms();
            var existedMushroom = allMushrooms.FirstOrDefault(m => m.Name == mushroom.Name);

            if (existedMushroom == null)
                throw new Exception("Unknown mushroom name");

            throw new Exception($"Mushroom \"{mushroom.Name}\" has already existed");
        }
        catch (Exception e)
        {
            if (e.Message == $"Mushroom \"{mushroom.Name}\" has already existed")
            {
                throw new Exception($"Unable to create mushroom \"{mushroom.Name}\": \"{e.Message}\"");
            }

            if (e.Message == "Unknown mushroom name")
            {
                try
                {
                    await _mushroomsRepository.CreateMushroom(mushroom);
                    return mushroom.Id;
                }
                catch (Exception ex)
                {
                    throw new Exception($"Unable to create mushroom \"{mushroom.Name}\": \"{ex.Message}\"");
                }
            }

            throw new Exception($"Unable to create mushroom \"{mushroom.Name}\": \"{e.Message}\"");
        }
    }

    // Changes the mushroom parameters to new ones, returns the id of the changed mushroom
    public async Task<Guid> UpdateMushroomAsync(string mushroomName, Mushroom newMushroom, CancellationToken ct)
    {
        try
        {
            var allMushrooms = await _mushroomsRepository.GetAllMushrooms();
            var existedMushroom = allMushrooms.FirstOrDefault(m => m.Name == mushroomName);

            await _mushroomsRepository.UpdateMushroom(mushroomName, newMushroom);

            return existedMushroom!.Id;
        }
        catch (Exception e)
        {
            throw new Exception($"Unable to update mushroom \"{mushroomName}\": \"{e.Message}\"");
        }
    }

    // Deletes a mushroom and returns its id
    public async Task<Guid> DeleteMushroomAsync(string mushroomName, CancellationToken ct)
    {
        try
        {
            var allMushrooms = await _mushroomsRepository.GetAllMushrooms();
            var existedMushroom = allMushrooms.FirstOrDefault(m => m.Name == mushroomName);

            await _mushroomsRepository.DeleteMushroom(mushroomName);

            return existedMushroom!.Id;
        }
        catch (Exception e)
        {
            throw new Exception($"Unable to delete mushroom \"{mushroomName}\": \"{e.Message}\"");
        }
    }
}