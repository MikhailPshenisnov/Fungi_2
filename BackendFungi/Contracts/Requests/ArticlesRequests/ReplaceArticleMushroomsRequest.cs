namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public record ReplaceArticleMushroomsRequest(
    Guid ArticleId,
    List<Guid>? MushroomIds
);
