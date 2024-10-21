namespace BackendFungi.Models;

public class Mushroom
{
    public const int MaxNameLength = 100;
    public const int MaxSynonymousNameLength = 100;
    public const int MaxEatableLength = 15;
    public const int MaxStemTypeLength = 30;
    public const int MaxSteamColorLength = 100;

    private Mushroom(int id, string name, string? synonymousName, bool redBook, string eatable,
        bool hasStem, int? stemSizeFrom, int? stemSizeTo, string? stemType, string? steamColor,
        string? description, List<Doppelganger> doppelgangers)
    {
        Id = id;
        Name = name;
        SynonymousName = synonymousName;
        RedBook = redBook;
        Eatable = eatable;
        HasStem = hasStem;
        StemSizeFrom = stemSizeFrom;
        StemSizeTo = stemSizeTo;
        StemType = stemType;
        SteamColor = steamColor;
        Description = description;
        Doppelgangers = doppelgangers;
    }

    public int Id { get; }
    public string Name { get; }
    public string? SynonymousName { get; }
    public bool RedBook { get; }
    public string Eatable { get; }
    public bool HasStem { get; }
    public int? StemSizeFrom { get; }
    public int? StemSizeTo { get; }
    public string? StemType { get; }
    public string? SteamColor { get; }
    public string? Description { get; }
    public List<Doppelganger> Doppelgangers { get; }

    public static (Mushroom Mushroom, string Error)
        Create(int id, string name, string? synonymousName, bool redBook, string eatable,
            bool hasStem, int? stemSizeFrom, int? stemSizeTo, string? stemType, string? steamColor,
            string? description, List<Doppelganger> doppelgangers)
    {
        var error = string.Empty;

        if (id < 0)
        {
            error = "Id can't be less than 0";
        }
        else if (string.IsNullOrEmpty(name) || name.Length > MaxNameLength)
        {
            error = $"Mushroom name can't be longer than {MaxNameLength} characters or empty";
        }
        else if (synonymousName is not null && synonymousName.Length > MaxSynonymousNameLength)
        {
            error = $"Synonymous mushroom name can't be longer than {MaxSynonymousNameLength} characters";
        }
        else if (eatable.Length > MaxEatableLength)
        {
            error = $"Eatable can't be longer than {MaxEatableLength} characters";
        }
        else if (hasStem && (stemSizeFrom is not null ||
                             stemSizeTo is not null ||
                             stemType is not null ||
                             steamColor is not null))
        {
            error = "If the mushroom doesn't have a stem information about its stem isn't needed";
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
        else if (steamColor is not null && steamColor.Length > MaxSteamColorLength)
        {
            error = $"Stem color can't be longer than {MaxSteamColorLength} characters";
        }

        var mushroom = new Mushroom(id, name, synonymousName, redBook, eatable,
            hasStem, stemSizeFrom, stemSizeTo, stemType, steamColor, description, doppelgangers);

        return (mushroom, error);
    }
}