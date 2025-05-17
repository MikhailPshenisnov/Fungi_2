using BackendFungi.Abstractions.Services;
using BackendFungi.Models.Other;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading;

namespace BackendFungi.Controllers;

[ApiController]
[Route("[controller]/[action]")]

public class ArticleMushroomsController : ControllerBase
{
    private readonly IArticleMushroomsService _articleMushroomsService;
    private readonly IAccessCheckService _accessCheckService;

    public ArticleMushroomsController(IAccessCheckService accessCheckService, IArticleMushroomsService articleMushroomsService)
    {
        _accessCheckService = accessCheckService;
        _articleMushroomsService = articleMushroomsService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllMushrooms(Guid articleId, CancellationToken ct)
    {
        var mushroomList = await _articleMushroomsService
            .GetAllMushroomsAsync(articleId, ct);

        return Ok(new { mushrooms = mushroomList });
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> AddMushroomToArticle(Guid articleId, 
        Guid mushroomId, CancellationToken ct)
    {
        await _accessCheckService.CheckAccessLevel(
            HttpContext,
            (int)AccessLevelEnumerator.Editor,
            ct
        );

        var result = await _articleMushroomsService.AddMushroomToArticleAsync(articleId, mushroomId, ct);
        return Ok(new { article = result });
    }

    [HttpDelete]
    [Authorize]
    public async Task<IActionResult> DeleteMushroomFromArticle(Guid articleId, 
        Guid mushroomId, CancellationToken ct)
    {
        await _accessCheckService.CheckAccessLevel(
            HttpContext,
            (int)AccessLevelEnumerator.Editor,
            ct
        );

        var result = await _articleMushroomsService.DeleteMushroomFromArticle(articleId, mushroomId, ct);
        return Ok(new { article = result });
    }
}
