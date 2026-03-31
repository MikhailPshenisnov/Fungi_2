namespace BackendFungi.Contracts.Other;

public record MushroomDto(
    Guid Id,
    string Name,
    string? SynonymousName,
    string? LatinName,
    string Family,
    bool RedBook,
    string Eatable,
    bool HasStem,
    int? StemSizeFrom,
    int? StemSizeTo,
    string? StemType,
    string? StemColor,
    string CapType,
    string CapColor,
    string CapUndersideType,
    string Description,
    string HeaderPhotoLink,
    List<string>? ExtraPhotoLinks,
    List<DoppelgangerDto> Doppelgangers,
    int LikesCount = 0
);
