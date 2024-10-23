using BackendFungi.Abstractions;
using BackendFungi.Contracts;
using BackendFungi.Database.Context;
using BackendFungi.Models;
using BackendFungi.YuraFolder.Models;
using BackendFungi.YuraFolder.Supports;
using Microsoft.AspNetCore.Mvc;

namespace BackendFungi.Controllers;

[ApiController]
[Route("/[action]")]
public class SiteController : ControllerBase
{
    // Database contexts
    private readonly FungiDbContext _dbContext;

    // Services
    private readonly IArticleService _articleService;
    private readonly IFilterArticleService _filterArticleService;

    public SiteController(
        FungiDbContext dbContext,
        IFilterArticleService filterArticleService,
        IArticleService articleService)
    {
        _dbContext = dbContext;
        _filterArticleService = filterArticleService;
        _articleService = articleService;
    }

    // Getting an article by title
    [HttpGet("{articleTitle=}")]
    public async Task<IActionResult> GetArticle(string? articleTitle, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(articleTitle))
            return BadRequest("\"articleTitle\" parameter is required");

        try
        {
            var article = await _articleService.GetArticleAsync(articleTitle, cancellationToken);

            var paragraphs = article.Paragraphs
                .Select(p => new ParagraphDto(p.ParagraphText))
                .ToList();

            var response = new ArticleDto(
                article.Title,
                article.PublishDate,
                paragraphs);

            return Ok(response);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    // Getting all articles
    [HttpGet]
    public async Task<IActionResult> GetAllArticles(CancellationToken cancellationToken)
    {
        try
        {
            var articles = await _articleService.GetAllArticlesAsync(cancellationToken);

            var response = new List<ArticleDto>();

            foreach (var article in articles)
            {
                var paragraphs = article.Paragraphs
                    .Select(p => new ParagraphDto(p.ParagraphText))
                    .ToList();

                response.Add(new ArticleDto(
                    article.Title,
                    article.PublishDate,
                    paragraphs));
            }

            return Ok(response);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    // Getting filtered articles
    [HttpGet]
    public async Task<IActionResult> GetFilterArticles([FromQuery] GetFilterArticleRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var filterArticleDtos = await _filterArticleService
                .GetFilterArticlesAsync(request, cancellationToken);
            return Ok(new GetFilterArticleResponse(filterArticleDtos));
        }
        catch (Exception e)
        {
            return StatusCode(500, $"An error occurred while retrieving data. \"{e.Message}\"");
        }
    }

    // Creating a new article based on the received data
    [HttpPost]
    public async Task<IActionResult> CreateArticle([FromBody] ArticleDto request, 
        CancellationToken cancellationToken)
    {
        try
        {
            var (article, error) = Article.Create(
                Guid.NewGuid(),
                request.Title,
                request.PublishDate,
                request.Paragraphs);

            if (!string.IsNullOrEmpty(error))
            {
                return BadRequest(error);
            }

            var createdArticleId = await _articleService
                .CreateArticleAsync(article, cancellationToken);

            return Ok(createdArticleId);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    // Updating an article based on the article title with the received data
    [HttpPut("{articleTitle=}")]
    public async Task<IActionResult> UpdateArticle(string? articleTitle,
        [FromBody] ArticleDto newArticle, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(articleTitle))
            return BadRequest("\"article_title\" parameter is required");

        try
        {
            var existedArticleId = (await _articleService.GetArticleAsync(articleTitle, cancellationToken)).Id;
            
            var (newArticleModel, error) = Article.Create(
                existedArticleId,
                newArticle.Title,
                newArticle.PublishDate,
                newArticle.Paragraphs);

            if (!string.IsNullOrEmpty(error))
            {
                return BadRequest(error);
            }

            var updatedArticleId = await _articleService
                .UpdateArticleAsync(
                    articleTitle,
                    newArticleModel.Title,
                    newArticleModel.PublishDate,
                    newArticleModel.Paragraphs,
                    cancellationToken);

            return Ok(updatedArticleId);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    // Deleting an article by title
    [HttpDelete("{articleTitle=}")]
    public async Task<IActionResult> DeleteArticle(string? articleTitle, 
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(articleTitle))
            return BadRequest("\"article_title\" parameter is required");
        try
        {
            var deletedArticleId = await _articleService
                .DeleteArticleAsync(articleTitle, cancellationToken);

            return Ok(deletedArticleId);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    // Getting filtered mushrooms (probably)
    [HttpGet]
    public IResult Mushrooms([FromQuery] MushroomsModel filterValues)
    {
        return Results.Json(MushroomsFilter.Filter(filterValues, _dbContext));
    }
}