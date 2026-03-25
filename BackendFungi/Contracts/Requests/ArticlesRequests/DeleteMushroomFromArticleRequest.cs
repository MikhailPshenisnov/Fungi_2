namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public record DeleteMushroomFromArticleRequest(
    Guid ArticleId,
    Guid MushroomId
);
