using System.ComponentModel.DataAnnotations;
using BackendFungi.Models.Other;

namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public record ModerateArticleRequest(
    Guid ArticleId,
    [Required] ModerationDecision? Decision,
    string? ReviewNote
);
