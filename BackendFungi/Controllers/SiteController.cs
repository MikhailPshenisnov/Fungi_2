using System.Text.Json;
using BackendFungi.Contracts.Requests;
using BackendFungi.DataBase;
using BackendFungi.DataBase.Context;
using BackendFungi.Models;
using BackendFungi.Services;
using BackendFungi.Supports;
using Microsoft.AspNetCore.Mvc;

namespace BackendFungi.Controllers;

[ApiController]
[Route("/[action]")]
public class SiteController : ControllerBase
{
    private readonly FungiDbContext _dbContext;
    private readonly IFilterArticleService _filterArticleService;

    public SiteController(FungiDbContext dbContext, IFilterArticleService filterArticleService)
    {
        _dbContext = dbContext;
        _filterArticleService = filterArticleService;
    }


    [HttpGet("{articleTitle=null}")]
    public IActionResult GetArticle(string? articleTitle)
    {
        if (string.IsNullOrEmpty(articleTitle))
            return Ok("\"article_title\" parameter is required");

        try
        {
            var article = DbApiFunctions.GetArticle(DbApiFunctions.FindArticleId(articleTitle));
            return Ok(article);
        }
        catch (Exception e)
        {
            return Ok(e.Message);
        }
    }

    [HttpGet]
    public IActionResult GetAllArticles()
    {
        try
        {
            var allArticles = DbApiFunctions.GetAllArticles();
            return Ok(allArticles);
        }
        catch (Exception e)
        {
            return Ok(e.Message);
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetFilterArticles([FromQuery] GetFilterArticleRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var filterArticleDtos=await _filterArticleService.GetFilterArticlesAsync(request, cancellationToken);
            return Ok(new GetFilterArticleResponse(filterArticleDtos));
        }
        catch (Exception e)
        {
            return StatusCode(500, "An error occurred while retrieving data.");
        }
    }


    [HttpPost]
    public IActionResult CreateArticle([FromBody] ArticleModel article)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        if (string.IsNullOrEmpty(article.Title))
            return Ok("\"Title\" parameter for article is required");

        try
        {
            article.PublishDate = article.PublishDate?.ToUniversalTime() ?? DateTime.Now.ToUniversalTime();

            DbApiFunctions.CreateArticle(article);
            return Ok($"Article \"{article.Title}\" was created");
        }
        catch (Exception e)
        {
            return Ok(e.Message);
        }
    }


    [HttpGet]
    public IResult Mushrooms([FromQuery] MushroomsModel filterValues)
    {
        return Results.Json(MushroomsFilter.Filter(filterValues, _dbContext));
    }
}