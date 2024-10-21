namespace BackendFungi.Models;

public class ArticleModel
{
    public string Title { get; set; } = null!;
    public DateTime? PublishDate { get; set; }
    public List<ParagraphModel> Paragraphs { get; set; } = null!;
}