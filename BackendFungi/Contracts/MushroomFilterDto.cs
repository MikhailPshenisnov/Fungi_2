namespace BackendFungi.Contracts;

public record MushroomFilterDto(
    string? PartOfName,
    string? Family,
    bool? RedBook,
    string? Eatable,
    bool? HasStem,
    int? StemSizeFrom,
    int? StemSizeTo,
    string? StemType,
    string? StemColor,
    string? CapType,
    string? CapColor,
    string? CapUndersideType
);