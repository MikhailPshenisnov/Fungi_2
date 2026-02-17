using BackendFungi.Abstractions.Services;
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
    
    // TODO: ADD REQUESTS AND RESPONSES FOR MushroomLikesController

    /*
        Необходимо добавить классы запросов и ответов, а также
        сделать возвращаемым типом данных ActionResult<> вместо IActionResult
        (в качестве подсказки см. другие контроллеры)
    */

    [HttpPost]
    [Authorize]
    [SwaggerOperation(OperationId = "ToggleLike", Summary = "Toggle like",
        Description = "Toggles the like state for a mushroom")]
    public async Task<IActionResult> ToggleLike(Guid mushroomId, CancellationToken ct)
    {
        var result = await _likesService.ToggleLikeAsync(mushroomId, User, ct);
        return Ok(new { IsLiked = result });
    }

    [HttpGet("count")]
    [SwaggerOperation(OperationId = "GetLikesCount", Summary = "Get likes count",
        Description = "Gets the number of likes for a mushroom")]
    public async Task<IActionResult> GetLikesCount(Guid mushroomId, CancellationToken ct)
    {
        var count = await _likesService.GetLikesCountAsync(mushroomId, ct);
        return Ok(new { Count = count });
    }

    [HttpGet("user")]
    [Authorize]
    [SwaggerOperation(OperationId = "HasUserLiked", Summary = "Has user liked",
        Description = "Shows whether the user liked the mushroom")]
    public async Task<IActionResult> HasUserLiked(Guid mushroomId, CancellationToken ct)
    {
        var hasLiked = await _likesService.HasUserLikedAsync(mushroomId, User, ct);
        return Ok(new { HasLiked = hasLiked });
    }
}