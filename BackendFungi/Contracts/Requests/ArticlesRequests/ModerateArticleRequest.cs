using System.ComponentModel.DataAnnotations;
using BackendFungi.Models.Other;

namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public record ModerateArticleRequest
{
    [Required]
    public Guid ArticleId { get; init; }

    [Required]
    public ModerationDecision? Decision { get; init; }

    public string? ReviewNote { get; init; }
}
