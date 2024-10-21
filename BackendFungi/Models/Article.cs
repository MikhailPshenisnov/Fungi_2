namespace BackendFungi.Models;

public class Article
{
    public const int MaxTitleLength = 255;

    private Article(int id, string title, DateTime publishDate, List<Paragraph> paragraphs)
    {
        Id = id;
        Title = title;
        PublishDate = publishDate;
        Paragraphs = paragraphs;
    }

    public int Id { get; }
    public string Title { get; }
    public DateTime? PublishDate { get; }
    public List<Paragraph> Paragraphs { get; }

    public static (Article Article, string Error)
        Create(int id, string title, DateTime publishDate, List<Paragraph> paragraphs)
    {
        var error = string.Empty;

        if (id < 0)
        {
            error = "Id can't be less than 0";
        }
        else if (string.IsNullOrEmpty(title) || title.Length > MaxTitleLength)
        {
            error = $"Title can't be longer than {MaxTitleLength} characters or empty";
        }
        else if (publishDate > DateTime.Now)
        {
            error = "Publish date can't be from the future";
        }
        else if (paragraphs.Count == 0)
        {
            error = "The article must contain paragraphs";
        }

        var article = new Article(id, title, publishDate, paragraphs);

        return (article, error);
    }
}