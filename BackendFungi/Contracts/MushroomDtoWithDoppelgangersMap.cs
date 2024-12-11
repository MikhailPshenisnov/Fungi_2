namespace BackendFungi.Contracts;

public record MushroomDtoWithDoppelgangersMap(
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
    List<DoppelgangerDto> Doppelgangers,
    List<bool> DoppelgangersMap
);