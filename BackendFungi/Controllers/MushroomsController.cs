using BackendFungi.Abstractions;
using BackendFungi.Contracts;
using BackendFungi.Database.Context;
using BackendFungi.Models;
using Microsoft.AspNetCore.Mvc;

namespace BackendFungi.Controllers;

[ApiController]
[Route("/[action]")]
public class MushroomsController : ControllerBase
{
    // Database contexts
    // TODO Убрать использование DbContext из контроллера

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
                mushroom.RedBook,
                mushroom.Eatable,
                mushroom.HasStem,
                mushroom.StemSizeFrom,
                mushroom.StemSizeTo,
                mushroom.StemType,
                mushroom.StemColor,
                mushroom.Description,
                doppelgangers,
                doppelgangersMap);

            return Ok(response);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    // Getting all mushrooms and theirs doppelgangers maps
    [HttpGet]
    public async Task<IActionResult> GetAllMushrooms(CancellationToken cancellationToken)
    {
        try
        {
            var mushrooms = await _mushroomsService
                .GetAllMushroomsAsync(cancellationToken);

            var response = new List<MushroomDtoWithDoppelgangersMap>();

            foreach (var (mushroom, doppelgangersMap) in mushrooms)
            {
                var doppelgangers = mushroom.Doppelgangers
                    .Select(d => new DoppelgangerDto(d.DoppelgangerName))
                    .ToList();

                var mushroomDto = new MushroomDtoWithDoppelgangersMap(
                    mushroom.Name,
                    mushroom.SynonymousName,
                    mushroom.RedBook,
                    mushroom.Eatable,
                    mushroom.HasStem,
                    mushroom.StemSizeFrom,
                    mushroom.StemSizeTo,
                    mushroom.StemType,
                    mushroom.StemColor,
                    mushroom.Description,
                    doppelgangers,
                    doppelgangersMap);

                response.Add(mushroomDto);
            }

            return Ok(response);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    // Getting filtered mushrooms
    [HttpGet]
    public async Task<IActionResult> GetFilteredMushrooms([FromQuery] MushroomFilterDto filter, 
        CancellationToken cancellationToken)
    {
        try
        {
            var filtered = await _mushroomsService.GetFilteredMushroomsAsync(filter, cancellationToken);

            var response = new List<MushroomDtoWithDoppelgangersMap>();

            foreach(var (mushroom, doppelgangersMap) in filtered)
            {
                var doppelgangers = mushroom.Doppelgangers
                    .Select(d => new DoppelgangerDto(d.DoppelgangerName))
                    .ToList();

                var mushroomDto = new MushroomDtoWithDoppelgangersMap(
                    mushroom.Name,
                    mushroom.SynonymousName,
                    mushroom.RedBook,
                    mushroom.Eatable,
                    mushroom.HasStem,
                    mushroom.StemSizeFrom,
                    mushroom.StemSizeTo,
                    mushroom.StemType,
                    mushroom.StemColor,
                    mushroom.Description,
                    doppelgangers,
                    doppelgangersMap);

                response.Add(mushroomDto);
            }

            return Ok(response);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    // Creating a new mushroom based on the received data
    [HttpPost]
    public async Task<IActionResult> CreateMushroom([FromBody] MushroomDto request,
        CancellationToken cancellationToken)
    {
        try
        {
            var (mushroom, error) = Mushroom.Create(
                Guid.NewGuid(),
                request.Name,
                request.SynonymousName,
                request.RedBook,
                request.Eatable,
                request.HasStem,
                request.StemSizeFrom,
                request.StemSizeTo,
                request.StemType,
                request.StemColor,
                request.Description,
                request.Doppelgangers);

            if (!string.IsNullOrEmpty(error))
            {
                return BadRequest(error);
            }

            var createdMushroomId = await _mushroomsService
                .CreateMushroomAsync(mushroom, cancellationToken);

            return Ok(createdMushroomId);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    // Updating a mushroom based on the mushroom name with the received data
    [HttpPut("{mushroomName=}")]
    public async Task<IActionResult> UpdateMushroom(string? mushroomName,
        [FromBody] MushroomDto newMushroom, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(mushroomName))
            return BadRequest("\"mushroomName\" parameter is required");

        try
        {
            var existedMushroomId = (await _mushroomsService
                .GetMushroomAsync(mushroomName, cancellationToken)).Mushroom.Id;

            var (newMushroomModel, error) = Mushroom.Create(
                existedMushroomId,
                newMushroom.Name,
                newMushroom.SynonymousName,
                newMushroom.RedBook,
                newMushroom.Eatable,
                newMushroom.HasStem,
                newMushroom.StemSizeFrom,
                newMushroom.StemSizeTo,
                newMushroom.StemType,
                newMushroom.StemColor,
                newMushroom.Description,
                newMushroom.Doppelgangers);

            if (!string.IsNullOrEmpty(error))
            {
                return BadRequest(error);
            }

            var updatedMushroomId = await _mushroomsService
                .UpdateMushroomAsync(mushroomName, newMushroomModel, cancellationToken);

            return Ok(updatedMushroomId);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
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
            return BadRequest(e.Message);
        }
    }
}