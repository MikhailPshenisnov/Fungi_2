using BackendFungi.Models.Other;

namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public record ModerateArticleRequest(
    Guid ArticleId,
    ModerationDecision Decision,
    string? ReviewNote
);
