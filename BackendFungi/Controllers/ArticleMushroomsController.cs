using BackendFungi.Abstractions.Services;
using BackendFungi.Models.Other;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using Swashbuckle.AspNetCore.Annotations;

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
    
    // TODO: ADD REQUESTS AND RESPONSES FOR ArticleMushroomsController

    /*
        Необходимо добавить классы запросов и ответов, а также
        сделать возвращаемым типом данных ActionResult<> вместо IActionResult
        (в качестве подсказки см. другие контроллеры)
    */

    // TODO: TRY TO UNDERSTAND WHAT IS IT
    
    /*
        Я не понимаю зачем еще один метод получения грибов, разбирайтесь короче, не я писал
    */
    
    [HttpGet]
    [SwaggerOperation(OperationId = "GetAllMushrooms", Summary = "Get all mushrooms",
        Description = "Gets a list of all mushrooms")]
    public async Task<IActionResult> GetAllMushrooms(Guid articleId, CancellationToken ct)
    {
        var mushroomList = await _articleMushroomsService
            .GetAllMushroomsAsync(articleId, ct);

        return Ok(new { mushrooms = mushroomList });
    }

    [HttpPost]
    [Authorize]
    [SwaggerOperation(OperationId = "AddMushroomToArticle", Summary = "Add mushroom to article",
        Description = "Adds a link to the mushroom to the article")]
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
    [SwaggerOperation(OperationId = "DeleteMushroomFromArticle", Summary = "Deletes mushroom from article",
        Description = "Deletes a link to the mushroom from the article")]
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
