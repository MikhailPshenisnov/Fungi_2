namespace BackendFungi.Database.Entities;

public partial class MushroomRevision
{
    public Guid Id { get; set; }
    public Guid? SourceMushroomId { get; set; }

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
    public string? HeaderPhotoLink { get; set; }
    public string? ExtraPhotoLinks { get; set; }

    public string Status { get; set; } = null!;
    public Guid CreatedByUserId { get; set; }
    public Guid? UpdatedByUserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public Guid? ReviewedByUserId { get; set; }
    public string? ReviewNote { get; set; }
    public DateTime? ArchivedAt { get; set; }

    public virtual User CreatedByUser { get; set; } = null!;
    public virtual User? UpdatedByUser { get; set; }
    public virtual User? ReviewedByUser { get; set; }
    public virtual Mushroom? SourceMushroom { get; set; }

    public virtual ICollection<MushroomRevisionDoppelganger> Doppelgangers { get; set; } =
        new List<MushroomRevisionDoppelganger>();
}
