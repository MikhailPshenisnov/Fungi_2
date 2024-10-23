namespace BackendFungi.Database.Entities;

public partial class Article
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public DateTime? PublishDate { get; set; }

    public virtual ICollection<Paragraph> Paragraphs { get; set; } = new List<Paragraph>();
}