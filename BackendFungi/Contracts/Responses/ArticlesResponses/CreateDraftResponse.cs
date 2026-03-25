namespace BackendFungi.Contracts.Responses.ArticlesResponses;

public record CreateDraftResponse(
    Guid CreatedArticleId,
    string Status
);
