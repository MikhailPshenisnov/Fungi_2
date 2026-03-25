namespace BackendFungi.Contracts.Responses.ArticlesResponses;

public record ReplaceArticleMushroomsResponse(
    Guid ArticleId,
    List<Guid> MushroomIds
);
