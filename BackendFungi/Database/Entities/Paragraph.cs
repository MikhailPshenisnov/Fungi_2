namespace BackendFungi.Database.Entities;

public partial class Paragraph
{
    public Guid Id { get; set; }
    public Guid ArticleId { get; set; }
    public string? ParagraphText { get; set; }
    public int SerialNumber { get; set; }

    public virtual Article Article { get; set; } = null!;
}