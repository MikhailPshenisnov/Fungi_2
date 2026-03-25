namespace BackendFungi.Contracts.Responses.ArticlesResponses;

public record ArchiveArticleResponse(
    Guid ArticleId,
    string Status,
    DateTime ArchivedAt
);
