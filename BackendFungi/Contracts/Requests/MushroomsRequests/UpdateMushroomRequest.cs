namespace BackendFungi.Contracts.Requests.MushroomsRequests;

public record UpdateMushroomRequest(
    Guid MushroomId,
    string NewName,
    string? NewSynonymousName,
    string? NewLatinName,
    string NewFamily,
    bool NewRedBook,
    string NewEatable,
    bool NewHasStem,
    int? NewStemSizeFrom,
    int? NewStemSizeTo,
    string? NewStemType,
    string? NewStemColor,
    string NewCapType,
    string NewCapColor,
    string NewCapUndersideType,
    string NewDescription,
    string NewHeaderPhotoLink,
    List<string>? NewExtraPhotoLinks,
    List<string> NewDoppelgangers
);