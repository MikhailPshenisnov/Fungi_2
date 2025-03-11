namespace BackendFungi.Models.Filters;

public class MushroomFilter
{
    private MushroomFilter(string? partOfName, string? family, bool? redBook, string? eatable, bool? hasStem,
        int? stemSizeFrom, int? stemSizeTo, string? stemType, string? stemColor, string? capType, string? capColor,
        string? capUndersideType)
    {
        PartOfName = partOfName;
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
    }

    public string? PartOfName { get; }
    public string? Family { get; }
    public bool? RedBook { get; }
    public string? Eatable { get; }
    public bool? HasStem { get; }
    public int? StemSizeFrom { get; }
    public int? StemSizeTo { get; }
    public string? StemType { get; }
    public string? StemColor { get; }
    public string? CapType { get; }
    public string? CapColor { get; }
    public string? CapUndersideType { get; }

    private string BasicChecks()
    {
        var error = string.Empty;

        if (StemSizeFrom > StemSizeTo)
        {
            error = "Wrong order of stem size from and stem size to";
        }

        return error;
    }

    public static (MushroomFilter MushroomFilter, string Error) Create(string? partOfName, string? family,
        bool? redBook, string? eatable, bool? hasStem, int? stemSizeFrom, int? stemSizeTo, string? stemType,
        string? stemColor, string? capType, string? capColor, string? capUndersideType)
    {
        var mushroomFilter = new MushroomFilter(partOfName, family, redBook, eatable, hasStem, stemSizeFrom, stemSizeTo,
            stemType, stemColor, capType, capColor, capUndersideType);

        var error = mushroomFilter.BasicChecks();

        return (mushroomFilter, error);
    }
}