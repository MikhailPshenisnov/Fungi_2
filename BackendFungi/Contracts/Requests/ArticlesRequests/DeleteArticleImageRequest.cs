using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public record DeleteArticleImageRequest
{
    [BindRequired]
    [Required]
    [MinLength(1)]
    public string MediaPath { get; init; } = string.Empty;
}
