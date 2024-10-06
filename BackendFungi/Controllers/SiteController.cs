using Microsoft.AspNetCore.Mvc;

namespace BackendFungi.Controllers;

[ApiController]
[Route("/[action]")]
public class SiteController : ControllerBase
{
    [HttpGet]
    public IActionResult Test()
    {
        return Ok();
    }
}