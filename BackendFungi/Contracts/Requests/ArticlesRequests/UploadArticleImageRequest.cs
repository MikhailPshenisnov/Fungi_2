using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.ComponentModel.DataAnnotations;

namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public class UploadArticleImageRequest
{
    [BindRequired]
    [Required]
    [FromForm(Name = "image")]
    public IFormFile Image { get; init; } = null!;
}
