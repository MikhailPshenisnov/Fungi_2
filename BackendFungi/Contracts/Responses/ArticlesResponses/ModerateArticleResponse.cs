namespace BackendFungi.Contracts.Responses.ArticlesResponses;

public record ModerateArticleResponse(
    Guid ArticleId,
    string Status,
    DateTime ReviewedAt
);
