namespace BackendFungi.Contracts.Responses.ArticlesResponses;

public record SubmitForReviewResponse(
    Guid ArticleId,
    string Status,
    DateTime SubmittedAt
);
