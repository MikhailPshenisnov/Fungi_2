using BackendFungi.Abstractions.Services;
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

    // TODO: ADD REQUESTS AND RESPONSES FOR ArticleLikesController

    /*
        Необходимо добавить классы запросов и ответов, а также
        сделать возвращаемым типом данных ActionResult<> вместо IActionResult
        (в качестве подсказки см. другие контроллеры)
    */

    [HttpPost]
    [Authorize]
    [SwaggerOperation(OperationId = "ToggleLike", Summary = "Toggle like",
        Description = "Toggles the like state for an article")]
    public async Task<IActionResult> ToggleLike(Guid articleId, CancellationToken ct)
    {
        var result = await _likesService.ToggleLikeAsync(articleId, User, ct);
        return Ok(new { IsLiked = result });
    }

    [HttpGet("count")]
    [SwaggerOperation(OperationId = "GetLikesCount", Summary = "Get likes count",
        Description = "Gets the number of likes for an article")]
    public async Task<IActionResult> GetLikesCount(Guid articleId, CancellationToken ct)
    {
        var count = await _likesService.GetLikesCountAsync(articleId, ct);
        return Ok(new { Count = count });
    }

    [HttpGet("user")]
    [Authorize]
    [SwaggerOperation(OperationId = "HasUserLiked", Summary = "Has user liked",
        Description = "Shows whether the user liked the article")]
    public async Task<IActionResult> HasUserLiked(Guid articleId, CancellationToken ct)
    {
        var hasLiked = await _likesService.HasUserLikedAsync(articleId, User, ct);
        return Ok(new { HasLiked = hasLiked });
    }
}