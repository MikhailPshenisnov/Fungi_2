namespace BackendFungi.Contracts.Responses.ArticlesResponses;

public record DeleteMushroomFromArticleResponse(
    Guid ArticleId,
    Guid MushroomId
);
