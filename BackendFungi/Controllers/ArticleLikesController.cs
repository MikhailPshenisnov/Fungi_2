using BackendFungi.Abstractions.Services;
using BackendFungi.Contracts.Requests.ArticlesRequests;
using BackendFungi.Contracts.Responses;
using BackendFungi.Contracts.Responses.ArticlesResponses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace BackendFungi.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class ArticleLikesController : ControllerBase
{
    private readonly IArticleLikesService _likesService;

    public ArticleLikesController(IArticleLikesService likesService)
    {
        _likesService = likesService;
    }

    [HttpPost]
    [Authorize]
    [SwaggerOperation(OperationId = "ToggleArticleLike", Summary = "Toggle like",
        Description = "Toggles the like state for an article")]
    public async Task<ActionResult<BaseResponse<ToggleArticleLikeResponse>>> ToggleLike(
        [FromQuery] ToggleArticleLikeRequest request,
        CancellationToken ct)
    {
        var result = await _likesService.ToggleLikeAsync(request.ArticleId, User, ct);

        var response = new BaseResponse<ToggleArticleLikeResponse>(
            new ToggleArticleLikeResponse(result),
            null);

        return Ok(response);
    }

    [HttpGet("count")]
    [SwaggerOperation(OperationId = "GetArticleLikesCount", Summary = "Get likes count",
        Description = "Gets the number of likes for an article")]
    public async Task<ActionResult<BaseResponse<GetArticleLikesCountResponse>>> GetLikesCount(
        [FromQuery] GetArticleLikesCountRequest request,
        CancellationToken ct)
    {
        var count = await _likesService.GetLikesCountAsync(request.ArticleId, ct);

        var response = new BaseResponse<GetArticleLikesCountResponse>(
            new GetArticleLikesCountResponse(count),
            null);

        return Ok(response);
    }

    [HttpGet("user")]
    [Authorize]
    [SwaggerOperation(OperationId = "HasUserLikedArticle", Summary = "Has user liked",
        Description = "Shows whether the user liked the article")]
    public async Task<ActionResult<BaseResponse<HasUserLikedArticleResponse>>> HasUserLiked(
        [FromQuery] HasUserLikedArticleRequest request,
        CancellationToken ct)
    {
        var hasLiked = await _likesService.HasUserLikedAsync(request.ArticleId, User, ct);

        var response = new BaseResponse<HasUserLikedArticleResponse>(
            new HasUserLikedArticleResponse(hasLiked),
            null);

        return Ok(response);
    }

    [HttpGet]
    [Authorize]
    [SwaggerOperation(OperationId = "GetMyFavoriteArticles", Summary = "Get my favorite articles",
        Description = "Returns paginated list of current user's favorite published articles")]
    [ProducesResponseType(typeof(BaseResponse<GetMyFavoriteArticlesResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(BaseResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(BaseResponse<object>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<BaseResponse<GetMyFavoriteArticlesResponse>>> GetMyFavoriteArticles(
        [FromQuery] GetMyFavoriteArticlesRequest request,
        CancellationToken ct)
    {
        var (items, totalCount) = await _likesService.GetMyFavoriteArticlesAsync(User, request.Page, request.PageSize, ct);

        var response = new BaseResponse<GetMyFavoriteArticlesResponse>(
            new GetMyFavoriteArticlesResponse(
                items
                    .Select(item => new FavoriteArticleItemDto(
                        item.ArticleId,
                        item.Title,
                        item.AuthorString,
                        item.PublishDate,
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
