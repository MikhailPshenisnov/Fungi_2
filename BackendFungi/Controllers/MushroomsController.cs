using BackendFungi.Abstractions.Services;
using BackendFungi.Contracts.Other;
using BackendFungi.Contracts.Requests.MushroomsRequests;
using BackendFungi.Contracts.Responses;
using BackendFungi.Contracts.Responses.MushroomsResponses;
using BackendFungi.Exceptions.SpecificExceptions;
using BackendFungi.Models;
using BackendFungi.Models.Filters;
using BackendFungi.Models.Other;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendFungi.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class MushroomsController : ControllerBase
{
    private readonly IAccessCheckService _accessCheckService;
    private readonly IMushroomsService _mushroomsService;

    public MushroomsController(IAccessCheckService accessCheckService, IMushroomsService mushroomsService)
    {
        _accessCheckService = accessCheckService;
        _mushroomsService = mushroomsService;
    }

    /*
        DEFINITION OF "DOPPELGANGERS MAP":
        A doppelgangers map is a list of boolean values that matches the length of the list of mushroom doppelgangers,
        where each value corresponds in position to one mushroom doppelganger from the list and shows whether it is in
        the mushroom table, so that on the frontend you can give a link to it
    */

    [HttpGet]
    public async Task<IActionResult> GetMushroom([FromQuery] GetMushroomRequest request,
        CancellationToken cancellationToken)
    {
        var (mushroom, doppelgangersMap) = await _mushroomsService
            .GetMushroomAsync(request.MushroomId, cancellationToken);

        if (mushroom.Doppelgangers.Count != doppelgangersMap.Count)
            throw new Exception("Service error");

        var response = new BaseResponse<GetMushroomResponse>(
            new GetMushroomResponse(
                new MushroomDto(
                    mushroom.Id,
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
                    mushroom.ExtraPhotoLinks,
                    mushroom.Doppelgangers
                        .Select((doppelganger, i) =>
                            new DoppelgangerDto(
                                doppelganger.Id,
                                doppelganger.MushroomId,
                                doppelganger.DoppelgangerName,
                                doppelgangersMap[i]))
                        .ToList())),
            null);

        return Ok(response);
    }

    [HttpGet]
    public async Task<IActionResult> GetFilteredMushrooms([FromQuery] GetFilteredMushroomsRequest request,
        CancellationToken cancellationToken)
    {
        var (mushroomFilter, mushroomFilterError) = MushroomFilter
            .Create(request.PartOfName,
                request.Family,
                request.RedBook,
                request.Eatable,
                request.HasStem,
                request.StemSizeFrom,
                request.StemSizeTo,
                request.StemType,
                request.StemColor,
                request.CapType,
                request.CapColor,
                request.CapUndersideType);

        if (!string.IsNullOrEmpty(mushroomFilterError))
            throw new ConversionException($"Incorrect data format: {mushroomFilterError}");

        var filteredMushrooms = await _mushroomsService
            .GetFilteredMushroomsAsync(mushroomFilter, cancellationToken);

        var response = new BaseResponse<GetFilteredMushroomsResponse>(
            new GetFilteredMushroomsResponse(
                filteredMushrooms
                    .Select(x =>
                        new MushroomDto(
                            x.Mushroom.Id,
                            x.Mushroom.Name,
                            x.Mushroom.SynonymousName,
                            x.Mushroom.LatinName,
                            x.Mushroom.Family,
                            x.Mushroom.RedBook,
                            x.Mushroom.Eatable,
                            x.Mushroom.HasStem,
                            x.Mushroom.StemSizeFrom,
                            x.Mushroom.StemSizeTo,
                            x.Mushroom.StemType,
                            x.Mushroom.StemColor,
                            x.Mushroom.CapType,
                            x.Mushroom.CapColor,
                            x.Mushroom.CapUndersideType,
                            x.Mushroom.Description,
                            x.Mushroom.HeaderPhotoLink,
                            x.Mushroom.ExtraPhotoLinks,
                            x.Mushroom.Doppelgangers
                                .Select((doppelganger, i) =>
                                    new DoppelgangerDto(
                                        doppelganger.Id,
                                        doppelganger.MushroomId,
                                        doppelganger.DoppelgangerName,
                                        x.DoppelgangersMap[i]))
                                .ToList()))
                    .ToList()),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateMushroom([FromBody] CreateMushroomRequest request,
        CancellationToken cancellationToken)
    {
        await _accessCheckService.CheckAccessLevel(
            HttpContext,
            (int)AccessLevelEnumerator.Editor,
            cancellationToken);

        var (mushroom, mushroomError) = Mushroom
            .Create(Guid.NewGuid(),
                request.Name,
                request.SynonymousName,
                request.LatinName,
                request.Family,
                request.RedBook,
                request.Eatable,
                request.HasStem,
                request.StemSizeFrom,
                request.StemSizeTo,
                request.StemType,
                request.StemColor,
                request.CapType,
                request.CapColor,
                request.CapUndersideType,
                request.Description,
                request.HeaderPhotoLink,
                request.ExtraPhotoLinks,
                request.Doppelgangers);

        if (!string.IsNullOrEmpty(mushroomError))
            throw new ConversionException($"Incorrect data format: {mushroomError}");

        var createdMushroomId = await _mushroomsService
            .CreateMushroomAsync(mushroom, cancellationToken);

        var response = new BaseResponse<CreateMushroomResponse>(
            new CreateMushroomResponse(
                createdMushroomId),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpPut]
    public async Task<IActionResult> UpdateMushroom([FromBody] UpdateMushroomRequest request,
        CancellationToken cancellationToken)
    {
        await _accessCheckService.CheckAccessLevel(
            HttpContext,
            (int)AccessLevelEnumerator.Editor,
            cancellationToken);

        var (newMushroom, newMushroomError) = Mushroom
            .Create(request.MushroomId,
                request.NewName,
                request.NewSynonymousName,
                request.NewLatinName,
                request.NewFamily,
                request.NewRedBook,
                request.NewEatable,
                request.NewHasStem,
                request.NewStemSizeFrom,
                request.NewStemSizeTo,
                request.NewStemType,
                request.NewStemColor,
                request.NewCapType,
                request.NewCapColor,
                request.NewCapUndersideType,
                request.NewDescription,
                request.NewHeaderPhotoLink,
                request.NewExtraPhotoLinks,
                request.NewDoppelgangers);

        if (!string.IsNullOrEmpty(newMushroomError))
            throw new ConversionException($"Incorrect data format: {newMushroomError}");

        var updatedMushroomId = await _mushroomsService
            .UpdateMushroomAsync(request.MushroomId, newMushroom, cancellationToken);

        var response = new BaseResponse<UpdateMushroomResponse>(
            new UpdateMushroomResponse(
                updatedMushroomId),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpDelete]
    public async Task<IActionResult> DeleteMushroom([FromQuery] DeleteMushroomRequest request,
        CancellationToken cancellationToken)
    {
        await _accessCheckService.CheckAccessLevel(
            HttpContext,
            (int)AccessLevelEnumerator.JuniorAdministratorMin,
            cancellationToken);

        var deletedMushroomId = await _mushroomsService
            .DeleteMushroomAsync(request.MushroomId, cancellationToken);

        var response = new BaseResponse<DeleteMushroomResponse>(
            new DeleteMushroomResponse(
                deletedMushroomId),
            null);

        return Ok(response);
    }
}