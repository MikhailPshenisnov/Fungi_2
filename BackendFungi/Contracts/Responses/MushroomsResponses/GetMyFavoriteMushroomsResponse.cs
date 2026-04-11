namespace BackendFungi.Contracts.Responses.MushroomsResponses;

public record FavoriteMushroomItemDto(
    Guid MushroomId,
    string Name,
    string? SynonymousName,
    string? LatinName,
    string Family,
    string HeaderPhotoLink,
    DateTime LikedAt,
    int LikesCount
);

public record GetMyFavoriteMushroomsResponse(
    List<FavoriteMushroomItemDto> Items,
    int TotalCount,
    int Page,
    int PageSize
);
