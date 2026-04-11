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

    [HttpGet]
    [Authorize]
    [SwaggerOperation(OperationId = "GetMyFavoriteMushrooms", Summary = "Get my favorite mushrooms",
        Description = "Returns paginated list of current user's favorite visible mushrooms")]
    [ProducesResponseType(typeof(BaseResponse<GetMyFavoriteMushroomsResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(BaseResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(BaseResponse<object>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<BaseResponse<GetMyFavoriteMushroomsResponse>>> GetMyFavoriteMushrooms(
        [FromQuery] GetMyFavoriteMushroomsRequest request,
        CancellationToken ct)
    {
        var (items, totalCount) = await _likesService.GetMyFavoriteMushroomsAsync(User, request.Page, request.PageSize, ct);

        var response = new BaseResponse<GetMyFavoriteMushroomsResponse>(
            new GetMyFavoriteMushroomsResponse(
                items
                    .Select(item => new FavoriteMushroomItemDto(
                        item.MushroomId,
                        item.Name,
                        item.SynonymousName,
                        item.LatinName,
                        item.Family,
                        item.HeaderPhotoLink,
                        item.LikedAt,
                        item.LikesCount))
                    .ToList(),
                totalCount,
                request.Page,
                request.PageSize),
            null);

        return Ok(response);
    }
}
