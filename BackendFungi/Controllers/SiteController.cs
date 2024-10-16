using System.Text.Json;
using BackendFungi.DataBase;
using BackendFungi.DataBase.Context;
using BackendFungi.Models;
using BackendFungi.Supports;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;

namespace BackendFungi.Controllers;

[ApiController]
[Route("/[action]")]
public class SiteController : ControllerBase
{
    private readonly FungiDbContext _dbContext;

    public SiteController(FungiDbContext dbContext)
    {
        _dbContext = dbContext;
    }


    private int _c = 1;

    [HttpGet]
    public IActionResult GetArticle()
    {
        var headers = HttpContext.Request.Headers;
        if (headers.TryGetValue("article_title", out var articleTitle))
        {
            if (!(articleTitle != ""))
                return Ok("\"article_title\" header required");

            try
            {
                var article = DbApiFunctions.GetArticle(DbApiFunctions.FindArticleId(articleTitle.ToString()));
                return Ok(article);
            }
            catch (Exception e)
            {
                return Ok(e.Message);
            }
        }

        return BadRequest("incorrect_headers");
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
    public IActionResult CreateArticle()
    {
        var headers = HttpContext.Request.Headers;
        if (headers.TryGetValue("article_data", out var articleData))
        {
            if (!(articleData != ""))
                return Ok("\"article_data\" header required");

            try
            {
                var data = JsonSerializer.Deserialize<ArticleModel>(articleData.ToString());
                if (data is null) return Ok("Incorrect data format of \"article_data\"");

                data.PublishDate = data.PublishDate?.ToUniversalTime() ?? DateTime.Now.ToUniversalTime();

                DbApiFunctions.CreateArticle(data);
                return Ok("Article created");
            }
            catch (Exception e)
            {
                return Ok(e.Message);
            }
        }

        return BadRequest("incorrect_headers");
    }


    [HttpGet]
    public IResult Mushrooms([FromQuery] MushroomsModel filterValues)
    {
        return Results.Json(MushroomsFilter.Filter(filterValues, _dbContext));
    }
}