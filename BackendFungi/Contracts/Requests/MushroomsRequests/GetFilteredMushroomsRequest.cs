namespace BackendFungi.Contracts.Requests.MushroomsRequests;

public record GetFilteredMushroomsRequest(
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
    string? CapUndersideType,
    int? Page,
    int? PageSize,
    string? Sort
);
