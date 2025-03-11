namespace BackendFungi.Database.Entities;

public partial class Mushroom
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? SynonymousName { get; set; }
    public string? LatinName { get; set; }
    public string Family { get; set; } = null!;
    public bool RedBook { get; set; }
    public string Eatable { get; set; } = null!;
    public bool HasStem { get; set; }
    public int? StemSizeFrom { get; set; }
    public int? StemSizeTo { get; set; }
    public string? StemType { get; set; }
    public string? StemColor { get; set; }
    public string CapType { get; set; } = null!;
    public string CapColor { get; set; } = null!;
    public string CapUndersideType { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string HeaderPhotoLink { get; set; } = null!;
    public string? ExtraPhotoLinks { get; set; }

    public virtual ICollection<Doppelganger> Doppelgangers { get; set; } = new List<Doppelganger>();
}