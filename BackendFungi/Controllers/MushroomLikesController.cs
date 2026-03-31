using BackendFungi.Abstractions.Services;
using BackendFungi.Contracts.Requests.MushroomsRequests;
using BackendFungi.Contracts.Responses;
using BackendFungi.Contracts.Responses.MushroomsResponses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace BackendFungi.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class MushroomLikesController : ControllerBase
{
    private readonly IMushroomLikesService _likesService;

    public MushroomLikesController(IMushroomLikesService likesService)
    {
        _likesService = likesService;
    }

    [HttpPost]
    [Authorize]
    [SwaggerOperation(OperationId = "ToggleMushroomLike", Summary = "Toggle like",
        Description = "Toggles the like state for a mushroom")]
    public async Task<ActionResult<BaseResponse<ToggleMushroomLikeResponse>>> ToggleLike(
        [FromQuery] ToggleMushroomLikeRequest request,
        CancellationToken ct)
    {
        var isLiked = await _likesService.ToggleLikeAsync(request.MushroomId, User, ct);

        var response = new BaseResponse<ToggleMushroomLikeResponse>(
            new ToggleMushroomLikeResponse(isLiked),
            null);

        return Ok(response);
    }

    [HttpGet("count")]
    [SwaggerOperation(OperationId = "GetMushroomLikesCount", Summary = "Get likes count",
        Description = "Gets the number of likes for a mushroom")]
    public async Task<ActionResult<BaseResponse<GetMushroomLikesCountResponse>>> GetLikesCount(
        [FromQuery] GetMushroomLikesCountRequest request,
        CancellationToken ct)
    {
        var count = await _likesService.GetLikesCountAsync(request.MushroomId, ct);

        var response = new BaseResponse<GetMushroomLikesCountResponse>(
            new GetMushroomLikesCountResponse(count),
            null);

        return Ok(response);
    }

    [HttpGet("user")]
    [Authorize]
    [SwaggerOperation(OperationId = "HasUserLikedMushroom", Summary = "Has user liked",
        Description = "Shows whether the user liked the mushroom")]
    public async Task<ActionResult<BaseResponse<HasUserLikedMushroomResponse>>> HasUserLiked(
        [FromQuery] HasUserLikedMushroomRequest request,
        CancellationToken ct)
    {
        var hasLiked = await _likesService.HasUserLikedAsync(request.MushroomId, User, ct);

        var response = new BaseResponse<HasUserLikedMushroomResponse>(
            new HasUserLikedMushroomResponse(hasLiked),
            null);

        return Ok(response);
    }
}
