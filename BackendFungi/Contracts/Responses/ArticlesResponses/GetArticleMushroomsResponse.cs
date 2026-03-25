namespace BackendFungi.Contracts.Responses.ArticlesResponses;

public record GetArticleMushroomsResponse(
    Guid ArticleId,
    List<Guid> MushroomIds
);
