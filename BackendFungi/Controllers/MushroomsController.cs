using BackendFungi.Abstractions;
using BackendFungi.Contracts;
using BackendFungi.Models;
using Microsoft.AspNetCore.Mvc;

namespace BackendFungi.Controllers;

[ApiController]
[Route("/[action]")]
public class MushroomsController : ControllerBase
{
    // Services
    private readonly IMushroomsService _mushroomsService;

    public MushroomsController(
        IMushroomsService mushroomsService)
    {
        _mushroomsService = mushroomsService;
    }

    /* Query set for mushrooms */

    /* DEFINITION OF "DOPPELGANGERS MAP":
     A doppelgangers map is a list of boolean values that matches the length of the list of mushroom doppelgangers,
     where each value corresponds in position to one mushroom doppelganger from the list and shows whether it is in
     the mushroom table, so that on the frontend you can give a link to it */

    // Getting a mushroom and its doppelgangers map by mushroom name
    [HttpGet("{mushroomName=}")]
    public async Task<IActionResult> GetMushroom(string? mushroomName, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(mushroomName))
            return BadRequest("\"mushroomName\" parameter is required");

        try
        {
            var (mushroom, doppelgangersMap) = (await _mushroomsService
                .GetMushroomAsync(mushroomName, cancellationToken));

            var doppelgangers = mushroom.Doppelgangers
                .Select(d => new DoppelgangerDto(d.DoppelgangerName))
                .ToList();

            var response = new MushroomDtoWithDoppelgangersMap(
                mushroom.Name,
                mushroom.SynonymousName,
                mushroom.LatinName,
                mushroom.Family,
                mushroom.RedBook,
                mushroom.Eatable,
                mushroom.HasStem,
                mushroom.StemSizeFrom,
                mushroom.StemSizeTo,
                mushroom.StemType,
                mushroom.StemColor,
                mushroom.CapType,
                mushroom.CapColor,
                mushroom.CapUndersideType,
                mushroom.Description,
                mushroom.HeaderPhotoLink,
                doppelgangers,
                doppelgangersMap);

            return Ok(response);
        }
        catch (Exception e)
        {
            return Ok(e.Message);
        }
    }

    // Getting all mushrooms and theirs doppelgangers maps
    [HttpGet]
    public async Task<IActionResult> GetAllMushrooms(CancellationToken cancellationToken)
    {
        try
        {
            var allMushrooms = await _mushroomsService
                .GetAllMushroomsAsync(cancellationToken);

            var response = new List<MushroomDtoWithDoppelgangersMap>();

            foreach (var (mushroom, doppelgangersMap) in allMushrooms)
            {
                var doppelgangers = mushroom.Doppelgangers
                    .Select(d => new DoppelgangerDto(d.DoppelgangerName))
                    .ToList();

                var mushroomDto = new MushroomDtoWithDoppelgangersMap(
                    mushroom.Name,
                    mushroom.SynonymousName,
                    mushroom.LatinName,
                    mushroom.Family,
                    mushroom.RedBook,
                    mushroom.Eatable,
                    mushroom.HasStem,
                    mushroom.StemSizeFrom,
                    mushroom.StemSizeTo,
                    mushroom.StemType,
                    mushroom.StemColor,
                    mushroom.CapType,
                    mushroom.CapColor,
                    mushroom.CapUndersideType,
                    mushroom.Description,
                    mushroom.HeaderPhotoLink,
                    doppelgangers,
                    doppelgangersMap);

                response.Add(mushroomDto);
            }

            return Ok(response);
        }
        catch (Exception e)
        {
            return Ok(e.Message);
        }
    }

    // Getting filtered mushrooms
    [HttpGet]
    public async Task<IActionResult> GetFilteredMushrooms([FromBody] MushroomFilterDto mushroomFilterDto,
        CancellationToken cancellationToken)
    {
        try
        {
            var (mushroomFilter, error) = MushroomFilter.Create(
                mushroomFilterDto.PartOfName,
                mushroomFilterDto.Family,
                mushroomFilterDto.RedBook,
                mushroomFilterDto.Eatable,
                mushroomFilterDto.HasStem,
                mushroomFilterDto.StemSizeFrom,
                mushroomFilterDto.StemSizeTo,
                mushroomFilterDto.StemType,
                mushroomFilterDto.StemColor,
                mushroomFilterDto.CapType,
                mushroomFilterDto.CapColor,
                mushroomFilterDto.CapUndersideType);

            if (!string.IsNullOrEmpty(error))
            {
                return Ok(error);
            }

            var filteredMushrooms =
                await _mushroomsService.GetFilteredMushroomsAsync(mushroomFilter, cancellationToken);

            var response = new List<MushroomDtoWithDoppelgangersMap>();

            foreach (var (mushroom, doppelgangersMap) in filteredMushrooms)
            {
                var doppelgangers = mushroom.Doppelgangers
                    .Select(d => new DoppelgangerDto(d.DoppelgangerName))
                    .ToList();

                var mushroomDto = new MushroomDtoWithDoppelgangersMap(
                    mushroom.Name,
                    mushroom.SynonymousName,
                    mushroom.LatinName,
                    mushroom.Family,
                    mushroom.RedBook,
                    mushroom.Eatable,
                    mushroom.HasStem,
                    mushroom.StemSizeFrom,
                    mushroom.StemSizeTo,
                    mushroom.StemType,
                    mushroom.StemColor,
                    mushroom.CapType,
                    mushroom.CapColor,
                    mushroom.CapUndersideType,
                    mushroom.Description,
                    mushroom.HeaderPhotoLink,
                    doppelgangers,
                    doppelgangersMap);

                response.Add(mushroomDto);
            }

            return Ok(response);
        }
        catch (Exception e)
        {
            return Ok(e.Message);
        }
    }

    // Creating a new mushroom based on the received data
    [HttpPost]
    public async Task<IActionResult> CreateMushroom([FromBody] MushroomDto mushroomDto,
        CancellationToken cancellationToken)
    {
        try
        {
            var (mushroom, error) = Mushroom.Create(
                Guid.NewGuid(),
                mushroomDto.Name,
                mushroomDto.SynonymousName,
                mushroomDto.LatinName,
                mushroomDto.Family,
                mushroomDto.RedBook,
                mushroomDto.Eatable,
                mushroomDto.HasStem,
                mushroomDto.StemSizeFrom,
                mushroomDto.StemSizeTo,
                mushroomDto.StemType,
                mushroomDto.StemColor,
                mushroomDto.CapType,
                mushroomDto.CapColor,
                mushroomDto.CapUndersideType,
                mushroomDto.Description,
                mushroomDto.HeaderPhotoLink,
                mushroomDto.Doppelgangers);

            if (!string.IsNullOrEmpty(error))
            {
                return Ok(error);
            }

            var createdMushroomId = await _mushroomsService
                .CreateMushroomAsync(mushroom, cancellationToken);

            return Ok(createdMushroomId);
        }
        catch (Exception e)
        {
            return Ok(e.Message);
        }
    }

    // Updating a mushroom based on the mushroom name with the received data
    [HttpPut("{mushroomName=}")]
    public async Task<IActionResult> UpdateMushroom(string? mushroomName,
        [FromBody] MushroomDto mushroomDto, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(mushroomName))
            return Ok("\"mushroomName\" parameter is required");

        try
        {
            var existedMushroom =
                await _mushroomsService.GetMushroomAsync(mushroomName, cancellationToken);

            var (newMushroom, error) = Mushroom.Create(
                existedMushroom.Mushroom.Id,
                mushroomDto.Name,
                mushroomDto.SynonymousName,
                mushroomDto.LatinName,
                mushroomDto.Family,
                mushroomDto.RedBook,
                mushroomDto.Eatable,
                mushroomDto.HasStem,
                mushroomDto.StemSizeFrom,
                mushroomDto.StemSizeTo,
                mushroomDto.StemType,
                mushroomDto.StemColor,
                mushroomDto.CapType,
                mushroomDto.CapColor,
                mushroomDto.CapUndersideType,
                mushroomDto.Description,
                mushroomDto.HeaderPhotoLink,
                mushroomDto.Doppelgangers);

            if (!string.IsNullOrEmpty(error))
            {
                return Ok(error);
            }

            var updatedMushroomId = await _mushroomsService
                .UpdateMushroomAsync(mushroomName, newMushroom, cancellationToken);

            return Ok(updatedMushroomId);
        }
        catch (Exception e)
        {
            return Ok(e.Message);
        }
    }

    // Deleting a mushroom by name
    [HttpDelete("{mushroomName=}")]
    public async Task<IActionResult> DeleteMushroom(string? mushroomName,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(mushroomName))
            return BadRequest("\"mushroomName\" parameter is required");
        try
        {
            var deletedMushroomId = await _mushroomsService
                .DeleteMushroomAsync(mushroomName, cancellationToken);

            return Ok(deletedMushroomId);
        }
        catch (Exception e)
        {
            return Ok(e.Message);
        }
    }
}