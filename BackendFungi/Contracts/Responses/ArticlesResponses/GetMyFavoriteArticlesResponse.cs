namespace BackendFungi.Contracts.Responses.ArticlesResponses;

public record FavoriteArticleItemDto(
    Guid ArticleId,
    string Title,
    string AuthorString,
    DateTime PublishDate,
    string HeaderPhotoLink,
    DateTime LikedAt,
    int LikesCount
);

public record GetMyFavoriteArticlesResponse(
    List<FavoriteArticleItemDto> Items,
    int TotalCount,
    int Page,
    int PageSize
);
