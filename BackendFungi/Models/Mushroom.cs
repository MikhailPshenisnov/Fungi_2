using BackendFungi.Contracts;

namespace BackendFungi.Models;

public class Mushroom
{
    public const int MaxNameLength = 100;
    public const int MaxSynonymousNameLength = 100;
    public const int MaxLatinNameLength = 100;
    public const int MaxFamilyLength = 100;
    public const int MaxEatableLength = 15;
    public static readonly List<string> PossibleEatableVariants = new() { "да", "полусъедобен", "нет" };
    public const int MaxStemTypeLength = 50;
    public const int MaxStemColorLength = 50;
    public const int MaxCapTypeLength = 50;
    public const int MaxCapColorLength = 50;
    public const int MaxCapUndersideTypeLength = 50;
    public const int MaxHeaderPhotoLinkLength = 200;

    private Mushroom(Guid id, string name, string? synonymousName, string? latinName, string family, bool redBook,
        string eatable, bool hasStem, int? stemSizeFrom, int? stemSizeTo, string? stemType, string? stemColor,
        string capType, string capColor, string capUndersideType, string description, string headerPhotoLink,
        List<Doppelganger> doppelgangers)
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
    public List<Doppelganger> Doppelgangers { get; }

    private static string MushroomBasicChecks(string name, string? synonymousName, string? latinName, string family,
        string eatable, bool hasStem, int? stemSizeFrom, int? stemSizeTo, string? stemType, string? stemColor,
        string capType, string capColor, string capUndersideType, string headerPhotoLink)
    {
        var error = string.Empty;

        if (string.IsNullOrEmpty(name) || name.Length > MaxNameLength)
        {
            error = $"Mushroom name can't be longer than {MaxNameLength} characters or empty";
        }
        else if (synonymousName is not null && synonymousName.Length > MaxSynonymousNameLength)
        {
            error = $"Synonymous mushroom name can't be longer than {MaxSynonymousNameLength} characters";
        }
        else if (latinName is not null && latinName.Length > MaxLatinNameLength)
        {
            error = $"Latin name can't be longer than {MaxLatinNameLength} characters";
        }
        else if (string.IsNullOrEmpty(family) || family.Length > MaxFamilyLength)
        {
            error = $"Family can't be longer than {MaxFamilyLength} characters or empty";
        }
        else if (string.IsNullOrEmpty(eatable) || eatable.Length > MaxEatableLength)
        {
            error = $"Eatable can't be longer than {MaxEatableLength} characters or empty";
        }
        else if (!PossibleEatableVariants.Contains(eatable.ToLower()))
        {
            error = $"Eatable can be only \"{PossibleEatableVariants[0]}\", " +
                    $"\"{PossibleEatableVariants[1]}\" or \"{PossibleEatableVariants[2]}\"";
        }
        else if (!hasStem && (stemSizeFrom is not null ||
                              stemSizeTo is not null ||
                              stemType is not null ||
                              stemColor is not null))
        {
            error = "If the mushroom doesn't have a stem information about its stem isn't needed";
        }
        else if (hasStem && (stemSizeFrom is null ||
                             stemSizeTo is null ||
                             stemType is null ||
                             stemColor is null))
        {
            error = "If the mushroom has a stem information about its stem is needed";
        }
        else if (stemSizeFrom is not null && stemSizeFrom < 0 ||
                 stemSizeTo is not null && stemSizeTo < 0)
        {
            error = "Stem size can't be less than 0";
        }
        else if (stemSizeFrom is not null && stemSizeTo is not null && stemSizeFrom > stemSizeTo)
        {
            error = "Stem size from must be less than stem size to or equal to it";
        }
        else if (stemType is not null && stemType.Length > MaxStemTypeLength)
        {
            error = $"Stem type can't be longer than {MaxStemTypeLength} characters";
        }
        else if (stemColor is not null && stemColor.Length > MaxStemColorLength)
        {
            error = $"Stem color can't be longer than {MaxStemColorLength} characters";
        }
        else if (string.IsNullOrEmpty(capType) || capType.Length > MaxCapTypeLength)
        {
            error = $"Cap type can't be longer than {MaxCapTypeLength} characters or empty";
        }
        else if (string.IsNullOrEmpty(capColor) || capColor.Length > MaxCapColorLength)
        {
            error = $"Cap color can't be longer than {MaxCapColorLength} characters or empty";
        }
        else if (string.IsNullOrEmpty(capUndersideType) || capUndersideType.Length > MaxCapUndersideTypeLength)
        {
            error = $"Cap underside can't be longer than {MaxCapUndersideTypeLength} characters or empty";
        }
        else if (string.IsNullOrEmpty(headerPhotoLink) || headerPhotoLink.Length > MaxHeaderPhotoLinkLength)
        {
            error = $"Header photo link can't be longer than {MaxHeaderPhotoLinkLength} characters or empty";
        }

        return error;
    }

    public static (Mushroom Mushroom, string Error) Create(Guid id, string name, string? synonymousName,
        string? latinName, string family, bool redBook, string eatable, bool hasStem, int? stemSizeFrom,
        int? stemSizeTo, string? stemType, string? stemColor, string capType, string capColor, string capUndersideType,
        string description, string headerPhotoLink, List<DoppelgangerDto> doppelgangers)
    {
        var error = MushroomBasicChecks(name, synonymousName, latinName, family, eatable, hasStem, stemSizeFrom,
            stemSizeTo, stemType, stemColor, capType, capColor, capUndersideType, headerPhotoLink);

        var doppelgangerList = new List<Doppelganger>();
        foreach (var x in doppelgangers)
        {
            var (d, e) = Doppelganger.Create(Guid.NewGuid(), id, x.DoppelgangerName);

            if (!string.IsNullOrEmpty(e))
            {
                if (string.IsNullOrEmpty(error))
                {
                    error = $"One of the doppelgangers caused an error \"{e}\"";
                }
            }

            doppelgangerList.Add(d);
        }

        var mushroom = new Mushroom(id, name, synonymousName, latinName, family, redBook, eatable, hasStem,
            stemSizeFrom,
            stemSizeTo, stemType, stemColor, capType, capColor, capUndersideType, description, headerPhotoLink,
            doppelgangerList);

        return (mushroom, error);
    }

    public static (Mushroom Mushroom, string Error) Create(Guid id, string name, string? synonymousName,
        string? latinName, string family, bool redBook, string eatable, bool hasStem, int? stemSizeFrom,
        int? stemSizeTo, string? stemType, string? stemColor, string capType, string capColor, string capUndersideType,
        string description, string headerPhotoLink, List<Doppelganger> doppelgangers)
    {
        var error = MushroomBasicChecks(name, synonymousName, latinName, family, eatable, hasStem, stemSizeFrom,
            stemSizeTo, stemType, stemColor, capType, capColor, capUndersideType, headerPhotoLink);

        var mushroom = new Mushroom(id, name, synonymousName, latinName, family, redBook, eatable, hasStem,
            stemSizeFrom,
            stemSizeTo, stemType, stemColor, capType, capColor, capUndersideType, description, headerPhotoLink,
            doppelgangers);

        return (mushroom, error);
    }
}