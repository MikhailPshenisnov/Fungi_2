namespace BackendFungi.Contracts.Responses.ArticlesResponses;

public record AddMushroomToArticleResponse(
    Guid ArticleId,
    Guid MushroomId
);
