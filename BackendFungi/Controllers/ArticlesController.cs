using BackendFungi.Abstractions.Services;
using BackendFungi.Contracts.Other;
using BackendFungi.Contracts.Requests.ArticlesRequests;
using BackendFungi.Contracts.Responses;
using BackendFungi.Contracts.Responses.ArticlesResponses;
using BackendFungi.Exceptions.SpecificExceptions;
using BackendFungi.Models;
using BackendFungi.Models.Filters;
using BackendFungi.Models.Other;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendFungi.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class ArticlesController : ControllerBase
{
    private readonly IAccessCheckService _accessCheckService;
    private readonly IArticlesService _articlesService;

    public ArticlesController(IAccessCheckService accessCheckService, IArticlesService articlesService)
    {
        _accessCheckService = accessCheckService;
        _articlesService = articlesService;
    }

    [HttpGet]
    public async Task<IActionResult> GetArticle([FromQuery] GetArticleRequest request,
        CancellationToken cancellationToken)
    {
        var article = await _articlesService
            .GetArticleAsync(request.ArticleId, cancellationToken);

        var response = new BaseResponse<GetArticleResponse>(
            new GetArticleResponse(
                new ArticleDto(
                    article.Id,
                    article.Title,
                    article.PublishDate,
                    article.AuthorString,
                    article.HeaderPhotoLink,
                    article.ExtraPhotoLinks,
                    article.Paragraphs
                        .Select(paragraph =>
                            new ParagraphDto(
                                paragraph.Id,
                                paragraph.ArticleId,
                                paragraph.ParagraphText,
                                paragraph.SerialNumber,
                                paragraph.IsSubtitle))
                        .ToList())),
            null);

        return Ok(response);
    }

    [HttpGet]
    public async Task<IActionResult> GetFilteredArticles([FromQuery] GetFilteredArticlesRequest request,
        CancellationToken cancellationToken)
    {
        var (articleFilter, articleFilterError) = ArticleFilter
            .Create(request.PartOfTitle,
                request.PublishDateFrom,
                request.PublishDateTo,
                request.PartOfAuthorString);

        if (!string.IsNullOrEmpty(articleFilterError))
            throw new ConversionException($"Incorrect data format: {articleFilterError}");

        var filteredArticles = await _articlesService
            .GetFilteredArticlesAsync(articleFilter, cancellationToken);

        var response = new BaseResponse<GetFilteredArticlesResponse>(
            new GetFilteredArticlesResponse(
                filteredArticles
                    .Select(article =>
                        new ArticleDto(
                            article.Id,
                            article.Title,
                            article.PublishDate,
                            article.AuthorString,
                            article.HeaderPhotoLink,
                            article.ExtraPhotoLinks,
                            article.Paragraphs
                                .Select(paragraph =>
                                    new ParagraphDto(
                                        paragraph.Id,
                                        paragraph.ArticleId,
                                        paragraph.ParagraphText,
                                        paragraph.SerialNumber,
                                        paragraph.IsSubtitle))
                                .ToList()))
                    .ToList()),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateArticle([FromBody] CreateArticleRequest request,
        CancellationToken cancellationToken)
    {
        await _accessCheckService.CheckAccessLevel(
            HttpContext,
            (int)AccessLevelEnumerator.Editor,
            cancellationToken);

        var (article, articleError) = Article
            .Create(Guid.NewGuid(),
                request.Title,
                request.PublishDate,
                request.AuthorString,
                request.HeaderPhotoLink,
                request.ExtraPhotoLinks,
                request.ArticleText.Split('\n').ToList());

        if (!string.IsNullOrEmpty(articleError))
            throw new ConversionException($"Incorrect data format: {articleError}");

        var createdArticleId = await _articlesService
            .CreateArticleAsync(article, cancellationToken);

        var response = new BaseResponse<CreateArticleResponse>(
            new CreateArticleResponse(
                createdArticleId),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpPut]
    public async Task<IActionResult> UpdateArticle([FromBody] UpdateArticleRequest request,
        CancellationToken cancellationToken)
    {
        await _accessCheckService.CheckAccessLevel(
            HttpContext,
            (int)AccessLevelEnumerator.Editor,
            cancellationToken);

        var (newArticle, newArticleError) = Article
            .Create(request.ArticleId,
                request.NewTitle,
                request.NewPublishDate,
                request.NewAuthorString,
                request.NewHeaderPhotoLink,
                request.NewExtraPhotoLinks,
                request.NewArticleText.Split('\n').ToList());

        if (!string.IsNullOrEmpty(newArticleError))
            throw new ConversionException($"Incorrect data format: {newArticleError}");

        var updatedArticleId = await _articlesService
            .UpdateArticleAsync(request.ArticleId, newArticle, cancellationToken);

        var response = new BaseResponse<UpdateArticleResponse>(
            new UpdateArticleResponse(
                updatedArticleId),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpDelete]
    public async Task<IActionResult> DeleteArticle([FromQuery] DeleteArticleRequest request,
        CancellationToken cancellationToken)
    {
        await _accessCheckService.CheckAccessLevel(
            HttpContext,
            (int)AccessLevelEnumerator.JuniorAdministratorMin,
            cancellationToken);

        var deletedArticleId = await _articlesService
            .DeleteArticleAsync(request.ArticleId, cancellationToken);

        var response = new BaseResponse<DeleteArticleResponse>(
            new DeleteArticleResponse(
                deletedArticleId),
            null);

        return Ok(response);
    }
}