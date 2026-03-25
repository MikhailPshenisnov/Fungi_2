using Microsoft.AspNetCore.Mvc;

namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public class UploadArticleImageRequest
{
    [FromForm(Name = "image")]
    public IFormFile Image { get; set; } = null!;
}
