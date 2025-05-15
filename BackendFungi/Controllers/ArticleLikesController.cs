using BackendFungi.Abstractions.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
    public async Task<IActionResult> ToggleLike(Guid articleId, CancellationToken ct)
    {
        var result = await _likesService.ToggleLikeAsync(articleId, User, ct);
        return Ok(new { IsLiked = result });
    }

    [HttpGet("count")]
    public async Task<IActionResult> GetLikesCount(Guid articleId, CancellationToken ct)
    {
        var count = await _likesService.GetLikesCountAsync(articleId, ct);
        return Ok(new { Count = count });
    }

    [HttpGet("user")]
    [Authorize]
    public async Task<IActionResult> HasUserLiked(Guid articleId, CancellationToken ct)
    {
        var hasLiked = await _likesService.HasUserLikedAsync(articleId, User, ct);
        return Ok(new { HasLiked = hasLiked });
    }
}