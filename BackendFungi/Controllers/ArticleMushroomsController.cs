using BackendFungi.Abstractions.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendFungi.Controllers;

[ApiController]
[Route("[controller]/[action]")]

public class ArticleMushroomsController : ControllerBase
{
    private readonly IArticleMushroomsService _articleMushroomsService;

    public ArticleMushroomsController(IArticleMushroomsService articleMushroomsService)
    {
        _articleMushroomsService = articleMushroomsService;
    }

    [HttpGet("mushrooms")]
    public async Task<IActionResult> GetAllMushrooms(Guid articleId, CancellationToken ct)
    {
        var mushroomList = await _articleMushroomsService
            .GetAllMushroomsAsync(articleId, ct);

        return Ok(new { mushrooms = mushroomList });
    }
}
