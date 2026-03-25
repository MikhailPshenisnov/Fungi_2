using BackendFungi.Abstractions.Services;
using BackendFungi.Contracts.Requests.ArticlesRequests;
using BackendFungi.Contracts.Responses;
using BackendFungi.Contracts.Responses.ArticlesResponses;
using BackendFungi.Exceptions.SpecificExceptions;
using BackendFungi.Models;
using BackendFungi.Models.Other;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace BackendFungi.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class ArticleMushroomsController : ControllerBase
{
    private readonly IArticleMushroomsService _articleMushroomsService;
    private readonly IArticlesService _articlesService;
    private readonly IAccessCheckService _accessCheckService;

    public ArticleMushroomsController(
        IAccessCheckService accessCheckService,
        IArticleMushroomsService articleMushroomsService,
        IArticlesService articlesService)
    {
        _accessCheckService = accessCheckService;
        _articleMushroomsService = articleMushroomsService;
        _articlesService = articlesService;
    }

    [HttpGet]
    [SwaggerOperation(OperationId = "GetArticleMushrooms", Summary = "Get article mushrooms",
        Description = "Gets linked mushrooms for article")]
    public async Task<ActionResult<BaseResponse<GetArticleMushroomsResponse>>> GetAllMushrooms(
        [FromQuery] GetArticleMushroomsRequest request,
        CancellationToken ct)
    {
        var mushroomList = await _articleMushroomsService.GetAllMushroomsAsync(request.ArticleId, ct);

        var response = new BaseResponse<GetArticleMushroomsResponse>(
            new GetArticleMushroomsResponse(
                request.ArticleId,
                mushroomList.Select(x => x.MushroomId).Distinct().OrderBy(x => x).ToList()),
            null);

        return Ok(response);
    }

    [HttpPost]
    [Authorize]
    [SwaggerOperation(OperationId = "AddMushroomToArticle", Summary = "Add mushroom to article",
        Description = "Adds a link to the mushroom to the article")]
    public async Task<ActionResult<BaseResponse<AddMushroomToArticleResponse>>> AddMushroomToArticle(
        [FromQuery] AddMushroomToArticleRequest request,
        CancellationToken ct)
    {
        await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.ArticleMushroomsWrite,
            ct);

        await _articleMushroomsService.AddMushroomToArticleAsync(request.ArticleId, request.MushroomId, ct);

        var response = new BaseResponse<AddMushroomToArticleResponse>(
            new AddMushroomToArticleResponse(request.ArticleId, request.MushroomId),
            null);

        return Ok(response);
    }

    [HttpDelete]
    [Authorize]
    [SwaggerOperation(OperationId = "DeleteMushroomFromArticle", Summary = "Delete mushroom from article",
        Description = "Deletes a link to the mushroom from the article")]
    public async Task<ActionResult<BaseResponse<DeleteMushroomFromArticleResponse>>> DeleteMushroomFromArticle(
        [FromQuery] DeleteMushroomFromArticleRequest request,
        CancellationToken ct)
    {
        await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.ArticleMushroomsWrite,
            ct);

        await _articleMushroomsService.DeleteMushroomFromArticle(request.ArticleId, request.MushroomId, ct);

        var response = new BaseResponse<DeleteMushroomFromArticleResponse>(
            new DeleteMushroomFromArticleResponse(request.ArticleId, request.MushroomId),
            null);

        return Ok(response);
    }

    [HttpPut]
    [Authorize]
    [SwaggerOperation(OperationId = "ReplaceArticleMushrooms", Summary = "Replace article mushrooms",
        Description = "Replaces full set of linked mushrooms for the article")]
    public async Task<ActionResult<BaseResponse<ReplaceArticleMushroomsResponse>>> ReplaceArticleMushrooms(
        [FromBody] ReplaceArticleMushroomsRequest request,
        CancellationToken ct)
    {
        var user = await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.ArticleMushroomsWrite,
            ct);

        var article = await _articlesService.GetEditorArticleAsync(request.ArticleId, ct);
        var canManageAny = HasPermission(user, PermissionCodes.ArticlesManageAny);

        if (article.CreatedByUserId != user.Id && !canManageAny)
            throw new AccessException("The user does not have sufficient access rights");

        var mushroomIds = request.MushroomIds ?? new List<Guid>();
        await _articlesService.ReplaceArticleMushroomsAsync(request.ArticleId, mushroomIds, ct);

        var updatedIds = await _articlesService.GetArticleMushroomIdsAsync(request.ArticleId, ct);

        var response = new BaseResponse<ReplaceArticleMushroomsResponse>(
            new ReplaceArticleMushroomsResponse(request.ArticleId, updatedIds),
            null);

        return Ok(response);
    }

    private static bool HasPermission(User user, string permissionCode)
    {
        return user.Role.PermissionCodes.Contains(permissionCode, StringComparer.OrdinalIgnoreCase);
    }
}
