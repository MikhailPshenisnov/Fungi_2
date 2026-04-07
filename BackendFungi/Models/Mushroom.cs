namespace BackendFungi.Models;

public class Mushroom
{
    public const int MaxNameLength = 128;
    public const int MaxSynonymousNameLength = 256;
    public const int MaxLatinNameLength = 128;
    public const int MaxFamilyLength = 128;
    public const int MaxEatableLength = 16;
    public static readonly List<string> PossibleEatableVariants = new() { "Съедобный", "Полусъедобный", "Несъедобный", "Неизвестно" };
    public const int MaxStemTypeLength = 64;
    public const int MaxStemColorLength = 256;
    public const int MaxCapTypeLength = 64;
    public const int MaxCapColorLength = 256;
    public const int MaxCapUndersideTypeLength = 64;
    public const int MaxHeaderPhotoLinkLength = 256;
    public const int MaxExtraPhotoLinksLength = 1024;

    private Mushroom(Guid id, string name, string? synonymousName, string? latinName, string family, bool redBook,
        string eatable, bool hasStem, int? stemSizeFrom, int? stemSizeTo, string? stemType, string? stemColor,
        string capType, string capColor, string capUndersideType, string description, string headerPhotoLink,
        List<string>? extraPhotoLinks, List<Doppelganger> doppelgangers)
    {
        Id = id;
        Name = name;
        SynonymousName = synonymousName;
        LatinName = latinName;
        Family = family;
        RedBook = redBook;
        Eatable = eatable;
        HasStem = hasStem;
        StemSizeFrom = stemSizeFrom;
        StemSizeTo = stemSizeTo;
        StemType = stemType;
        StemColor = stemColor;
        CapType = capType;
        CapColor = capColor;
        CapUndersideType = capUndersideType;
        Description = description;
        HeaderPhotoLink = headerPhotoLink;
        ExtraPhotoLinks = extraPhotoLinks;
        Doppelgangers = doppelgangers;
    }

    public Guid Id { get; }
    public string Name { get; }
    public string? SynonymousName { get; }
    public string? LatinName { get; }
    public string Family { get; }
    public bool RedBook { get; }
    public string Eatable { get; }
    public bool HasStem { get; }
    public int? StemSizeFrom { get; }
    public int? StemSizeTo { get; }
    public string? StemType { get; }
    public string? StemColor { get; }
    public string CapType { get; }
    public string CapColor { get; }
    public string CapUndersideType { get; }
    public string Description { get; }
    public string HeaderPhotoLink { get; }
    public List<string>? ExtraPhotoLinks { get; }
    public List<Doppelganger> Doppelgangers { get; }

    private string BasicChecks()
    {
        var error = string.Empty;

        if (string.IsNullOrEmpty(Name) || Name.Length > MaxNameLength)
        {
            error = $"Mushroom name can't be longer than {MaxNameLength} characters or empty";
        }
        else if (SynonymousName is not null && SynonymousName.Length > MaxSynonymousNameLength)
        {
            error = $"Synonymous mushroom name can't be longer than {MaxSynonymousNameLength} characters";
        }
        else if (LatinName is not null && LatinName.Length > MaxLatinNameLength)
        {
            error = $"Latin name can't be longer than {MaxLatinNameLength} characters";
        }
        else if (string.IsNullOrEmpty(Family) || Family.Length > MaxFamilyLength)
        {
            error = $"Family can't be longer than {MaxFamilyLength} characters or empty";
        }
        else if (string.IsNullOrEmpty(Eatable) || Eatable.Length > MaxEatableLength)
        {
            error = $"Eatable can't be longer than {MaxEatableLength} characters or empty";
        }
        else if (!PossibleEatableVariants.Contains(Eatable))
        {
            error = $"Eatable can be only one of: \"{string.Join("\", \"", PossibleEatableVariants)}\"";
        }
        else if (!HasStem && (StemSizeFrom is not null ||
                              StemSizeTo is not null ||
                              StemType is not null ||
                              StemColor is not null))
        {
            error = "If the mushroom doesn't have a stem information about its stem isn't needed";
        }
        else if (HasStem && (StemSizeFrom is null ||
                             StemSizeTo is null ||
                             StemType is null ||
                             StemColor is null))
        {
            error = "If the mushroom has a stem information about its stem is needed";
        }
        else if (StemSizeFrom < 0 || StemSizeTo < 0)
        {
            error = "Stem size can't be less than 0";
        }
        else if (StemSizeFrom > StemSizeTo)
        {
            error = "Stem size from must be less than stem size to or equal to it";
        }
        else if (StemType?.Length > MaxStemTypeLength)
        {
            error = $"Stem type can't be longer than {MaxStemTypeLength} characters";
        }
        else if (StemColor?.Length > MaxStemColorLength)
        {
            error = $"Stem color can't be longer than {MaxStemColorLength} characters";
        }
        else if (string.IsNullOrEmpty(CapType) || CapType.Length > MaxCapTypeLength)
        {
            error = $"Cap type can't be longer than {MaxCapTypeLength} characters or empty";
        }
        else if (string.IsNullOrEmpty(CapColor) || CapColor.Length > MaxCapColorLength)
        {
            error = $"Cap color can't be longer than {MaxCapColorLength} characters or empty";
        }
        else if (string.IsNullOrEmpty(CapUndersideType) || CapUndersideType.Length > MaxCapUndersideTypeLength)
        {
            error = $"Cap underside can't be longer than {MaxCapUndersideTypeLength} characters or empty";
        }
        else if (string.IsNullOrEmpty(HeaderPhotoLink) || HeaderPhotoLink.Length > MaxHeaderPhotoLinkLength)
        {
            error = $"Header photo link can't be longer than {MaxHeaderPhotoLinkLength} characters or empty";
        }
        else if (!IsValidImageLink(HeaderPhotoLink))
        {
            error = "Header photo link must be a valid image link (absolute URL or /media/mushrooms/* path)";
        }
        else if (ExtraPhotoLinks is not null && string.Join(';', ExtraPhotoLinks).Length > MaxExtraPhotoLinksLength)
        {
            error = $"Extra photo links string can't be longer than {MaxExtraPhotoLinksLength} characters";
        }
        else if (ExtraPhotoLinks is not null && !ExtraPhotoLinks.All(IsValidImageLink))
        {
            error = "Photo link must be a valid image link (absolute URL or /media/mushrooms/* path)";
        }

        return error;
    }

    private static bool IsValidImageLink(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return false;

        var trimmed = value.Trim();

        if (trimmed.StartsWith("/media/mushrooms/", StringComparison.OrdinalIgnoreCase))
            return true;

        return Uri.TryCreate(trimmed, UriKind.Absolute, out var uri)
               && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
    }

    public static (Mushroom Mushroom, string Error) Create(Guid id, string name, string? synonymousName,
        string? latinName, string family, bool redBook, string eatable, bool hasStem, int? stemSizeFrom,
        int? stemSizeTo, string? stemType, string? stemColor, string capType, string capColor, string capUndersideType,
        string description, string headerPhotoLink, List<string>? extraPhotoLinks, List<string> doppelgangers)
    {
        var error = string.Empty;

        var doppelgangerList = new List<Doppelganger>();
        foreach (var doppelgangerName in doppelgangers)
        {
            var (doppelganger, doppelgangerError) = Doppelganger.Create(Guid.NewGuid(), id, doppelgangerName);

            if (!string.IsNullOrEmpty(doppelgangerError) && string.IsNullOrEmpty(error))
                error = $"One of the doppelgangers caused an error: {doppelgangerError}";

            doppelgangerList.Add(doppelganger);
        }

        var mushroom = new Mushroom(id, name, synonymousName, latinName, family, redBook, eatable, hasStem,
            stemSizeFrom, stemSizeTo, stemType, stemColor, capType, capColor, capUndersideType, description,
            headerPhotoLink, extraPhotoLinks, doppelgangerList);

        if (string.IsNullOrEmpty(error))
            error = mushroom.BasicChecks();

        return (mushroom, error);
    }

    public static (Mushroom Mushroom, string Error) Create(Guid id, string name, string? synonymousName,
        string? latinName, string family, bool redBook, string eatable, bool hasStem, int? stemSizeFrom,
        int? stemSizeTo, string? stemType, string? stemColor, string capType, string capColor, string capUndersideType,
        string description, string headerPhotoLink, List<string>? extraPhotoLinks, List<Doppelganger> doppelgangers)
    {
        var mushroom = new Mushroom(id, name, synonymousName, latinName, family, redBook, eatable, hasStem,
            stemSizeFrom, stemSizeTo, stemType, stemColor, capType, capColor, capUndersideType, description,
            headerPhotoLink, extraPhotoLinks, doppelgangers);

        var error = mushroom.BasicChecks();

        return (mushroom, error);
    }
}
