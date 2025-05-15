using BackendFungi.Abstractions.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
    public async Task<IActionResult> ToggleLike(Guid mushroomId, CancellationToken ct)
    {
        var result = await _likesService.ToggleLikeAsync(mushroomId, User, ct);
        return Ok(new { IsLiked = result });
    }

    [HttpGet("count")]
    public async Task<IActionResult> GetLikesCount(Guid mushroomId, CancellationToken ct)
    {
        var count = await _likesService.GetLikesCountAsync(mushroomId, ct);
        return Ok(new { Count = count });
    }

    [HttpGet("user")]
    public async Task<IActionResult> HasUserLiked(Guid mushroomId, CancellationToken ct)
    {
        var hasLiked = await _likesService.HasUserLikedAsync(mushroomId, User, ct);
        return Ok(new { HasLiked = hasLiked });
    }
}