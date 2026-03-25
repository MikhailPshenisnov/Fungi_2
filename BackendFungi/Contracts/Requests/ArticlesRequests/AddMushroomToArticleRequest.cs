namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public record AddMushroomToArticleRequest(
    Guid ArticleId,
    Guid MushroomId
);
