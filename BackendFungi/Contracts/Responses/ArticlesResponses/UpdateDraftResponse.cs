namespace BackendFungi.Contracts.Responses.ArticlesResponses;

public record UpdateDraftResponse(
    Guid UpdatedArticleId,
    string Status
);
