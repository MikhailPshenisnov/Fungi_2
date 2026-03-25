namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public record ToggleArticleLikeRequest(
    Guid ArticleId
);
