namespace BackendFungi.Database.Entities;

public partial class Article
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public DateTime PublishDate { get; set; }
    public string AuthorString { get; set; } = null!;
    public string HeaderPhotoLink { get; set; } = null!;
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
    public virtual ICollection<Paragraph> Paragraphs { get; set; } = new List<Paragraph>();
}
