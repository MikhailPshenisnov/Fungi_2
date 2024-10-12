using BackendFungi.Context;
using BackendFungi.Models;
using BackendFungi.Supports;
using Microsoft.AspNetCore.Mvc;

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


    [HttpGet]
    public IActionResult Test()
    {
        return Ok();
    }

    [HttpGet]
    public IResult Mushrooms([FromQuery] MushroomsModel filterValues)
    {
        return Results.Json(MushroomsFilter.Filter(filterValues, _dbContext));
    }

}