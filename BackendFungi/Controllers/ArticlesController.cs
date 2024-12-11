using BackendFungi.Abstractions;
using BackendFungi.Contracts;
using BackendFungi.Models;
using Microsoft.AspNetCore.Mvc;

namespace BackendFungi.Controllers;

[ApiController]
[Route("/[action]")]
public class ArticlesController : ControllerBase
{
    // Services
    private readonly IArticlesService _articlesService;

    public ArticlesController(IArticlesService articlesService)
    {
        _articlesService = articlesService;
    }

    /* Query set for articles */

    // Getting an article by title
    [HttpGet("{articleTitle=}")]
    public async Task<IActionResult> GetArticle(string? articleTitle, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(articleTitle))
            return Ok("\"articleTitle\" parameter is required");

        try
        {
            var article = await _articlesService.GetArticleAsync(articleTitle, cancellationToken);

            var paragraphs = article.Paragraphs
                .Select(p => new ParagraphDto(p.ParagraphText))
                .ToList();

            var response = new ArticleDto(
                article.Title,
                article.PublishDate,
                article.AuthorString,
                article.HeaderPhotoLink,
                paragraphs);

            return Ok(response);
        }
        catch (Exception e)
        {
            return Ok(e.Message);
        }
    }

    // Getting all articles
    [HttpGet]
    public async Task<IActionResult> GetAllArticles(CancellationToken cancellationToken)
    {
        try
        {
            var allArticles = await _articlesService.GetAllArticlesAsync(cancellationToken);

            var response = new List<ArticleDto>();

            foreach (var article in allArticles)
            {
                var paragraphs = article.Paragraphs
                    .Select(p => new ParagraphDto(p.ParagraphText))
                    .ToList();

                response.Add(new ArticleDto(
                    article.Title,
                    article.PublishDate,
                    article.AuthorString,
                    article.HeaderPhotoLink,
                    paragraphs));
            }

            return Ok(response);
        }
        catch (Exception e)
        {
            return Ok(e.Message);
        }
    }

    // Getting filtered articles
    [HttpGet]
    public async Task<IActionResult> GetFilteredArticles([FromQuery] ArticleFilterDto articleFilterDto,
        CancellationToken cancellationToken)
    {
        try
        {
            var (articleFilter, error) = ArticleFilter.Create(
                articleFilterDto.PartOfTitle,
                articleFilterDto.PublishDateFrom,
                articleFilterDto.PublishDateTo,
                articleFilterDto.PartOfAuthorString);

            if (!string.IsNullOrEmpty(error))
            {
                return Ok(error);
            }

            var filteredArticles = await _articlesService
                .GetFilteredArticlesAsync(articleFilter, cancellationToken);

            var response = new List<ArticleDto>();

            foreach (var article in filteredArticles)
            {
                var paragraphs = article.Paragraphs
                    .Select(p => new ParagraphDto(p.ParagraphText))
                    .ToList();

                response.Add(new ArticleDto(
                    article.Title,
                    article.PublishDate,
                    article.AuthorString,
                    article.HeaderPhotoLink,
                    paragraphs));
            }

            return Ok(response);
        }
        catch (Exception e)
        {
            return Ok(e.Message);
        }
    }


    // Creating a new article based on the received data
    [HttpPost]
    public async Task<IActionResult> CreateArticle([FromBody] ArticleDto articleDto,
        CancellationToken cancellationToken)
    {
        try
        {
            var (article, error) = Article.Create(
                Guid.NewGuid(),
                articleDto.Title,
                articleDto.PublishDate,
                articleDto.AuthorString,
                articleDto.HeaderPhotoLink,
                articleDto.Paragraphs);

            if (!string.IsNullOrEmpty(error))
            {
                return Ok(error);
            }

            var createdArticleId = await _articlesService
                .CreateArticleAsync(article, cancellationToken);

            return Ok(createdArticleId);
        }
        catch (Exception e)
        {
            return Ok(e.Message);
        }
    }

    // Updating an article based on the article title with the received data
    [HttpPut("{articleTitle=}")]
    public async Task<IActionResult> UpdateArticle(string? articleTitle,
        [FromBody] ArticleDto newArticleDto, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(articleTitle))
            return Ok("\"articleTitle\" parameter is required");

        try
        {
            var existedArticle = await _articlesService.GetArticleAsync(articleTitle, cancellationToken);

            var (newArticle, error) = Article.Create(
                existedArticle.Id,
                newArticleDto.Title,
                newArticleDto.PublishDate,
                newArticleDto.AuthorString,
                newArticleDto.HeaderPhotoLink,
                newArticleDto.Paragraphs);

            if (!string.IsNullOrEmpty(error))
            {
                return Ok(error);
            }

            var updatedArticleId = await _articlesService
                .UpdateArticleAsync(articleTitle, newArticle, cancellationToken);

            return Ok(updatedArticleId);
        }
        catch (Exception e)
        {
            return Ok(e.Message);
        }
    }

    // Deleting an article by title
    [HttpDelete("{articleTitle=}")]
    public async Task<IActionResult> DeleteArticle(string? articleTitle,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(articleTitle))
            return Ok("\"articleTitle\" parameter is required");
        try
        {
            var deletedArticleId = await _articlesService
                .DeleteArticleAsync(articleTitle, cancellationToken);

            return Ok(deletedArticleId);
        }
        catch (Exception e)
        {
            return Ok(e.Message);
        }
    }
}