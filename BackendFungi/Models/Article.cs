namespace BackendFungi.Models;

public class Article
{
    public const int MaxTitleLength = 256;
    public const int MaxAuthorStringLength = 128;
    public const int MaxHeaderPhotoLinkLength = 256;
    public const int MaxExtraPhotoLinksLength = 1024;

    private Article(Guid id, string title, DateTime publishDate, string authorString, string headerPhotoLink,
        List<string>? extraPhotoLinks, List<Paragraph> paragraphs)
    {
        Id = id;
        Title = title;
        PublishDate = publishDate;
        AuthorString = authorString;
        HeaderPhotoLink = headerPhotoLink;
        ExtraPhotoLinks = extraPhotoLinks;
        Paragraphs = paragraphs;
    }

    public Guid Id { get; }
    public string Title { get; }
    public DateTime PublishDate { get; }
    public string AuthorString { get; }
    public string HeaderPhotoLink { get; }
    public List<string>? ExtraPhotoLinks { get; }
    public List<Paragraph> Paragraphs { get; }

    private string BasicChecks()
    {
        var error = string.Empty;

        if (string.IsNullOrEmpty(Title) || Title.Length > MaxTitleLength)
        {
            error = $"Title can't be longer than {MaxTitleLength} characters or empty";
        }
        else if (PublishDate > DateTime.Now)
        {
            error = "Publish date can't be from the future";
        }
        else if (string.IsNullOrEmpty(AuthorString) || AuthorString.Length > MaxAuthorStringLength)
        {
            error = $"Author string can't be longer than {MaxAuthorStringLength} characters or empty";
        }
        else if (string.IsNullOrEmpty(HeaderPhotoLink) || HeaderPhotoLink.Length > MaxHeaderPhotoLinkLength)
        {
            error = $"Header photo link can't be longer than {MaxHeaderPhotoLinkLength} characters or empty";
        }
        else if (!HeaderPhotoLink.Contains("imgur.com"))
        {
            error = "Header photo link must be a link to an image on imgur.com";
        }
        else if (ExtraPhotoLinks is not null && ExtraPhotoLinks.Count == 0)
        {
            error = "Extra photo links must contain at least one link or be null";
        }
        else if (ExtraPhotoLinks is not null && string.Join(';', ExtraPhotoLinks).Length > MaxExtraPhotoLinksLength)
        {
            error = $"Extra photo links string can't be longer than {MaxExtraPhotoLinksLength} characters";
        }
        else if (ExtraPhotoLinks is not null && !ExtraPhotoLinks.All(x => x.Contains("imgur.com")))
        {
            error = "Photo link must be a link to an image on imgur.com";
        }
        else if (Paragraphs.Count == 0)
        {
            error = "The article must contain paragraphs";
        }

        return error;
    }

    public static (Article Article, string Error) Create(Guid id, string title, DateTime publishDate,
        string authorString, string headerPhotoLink, List<string>? extraPhotoLinks, List<string> paragraphs)
    {
        var error = string.Empty;

        var universalPublishDate = publishDate.ToUniversalTime();

        var paragraphList = new List<Paragraph>();
        for (var serialNumber = 0; serialNumber < paragraphs.Count; serialNumber++)
        {
            var isSubtitle = false;
            if (paragraphs[serialNumber].StartsWith("~"))
            {
                isSubtitle = true;
                paragraphs[serialNumber] = paragraphs[serialNumber].Remove(0, 1);
            }
            else if (paragraphs[serialNumber].StartsWith("\\~"))
            {
                paragraphs[serialNumber] = paragraphs[serialNumber].Remove(0, 1);
            }

            var (paragraph, paragraphError) = Paragraph.Create(Guid.NewGuid(), id, paragraphs[serialNumber],
                serialNumber, isSubtitle);

            if (!string.IsNullOrEmpty(paragraphError) && string.IsNullOrEmpty(error))
                error = $"One of the paragraphs caused an error: {paragraphError}";

            paragraphList.Add(paragraph);
        }

        var article = new Article(id, title, universalPublishDate, authorString, headerPhotoLink, extraPhotoLinks,
            paragraphList);

        if (string.IsNullOrEmpty(error))
            error = article.BasicChecks();

        return (article, error);
    }

    public static (Article Article, string Error) Create(Guid id, string title, DateTime publishDate,
        string authorString, string headerPhotoLink, List<string>? extraPhotoLinks, List<Paragraph> paragraphs)
    {
        var universalPublishDate = publishDate.ToUniversalTime();

        var article = new Article(id, title, universalPublishDate, authorString, headerPhotoLink, extraPhotoLinks,
            paragraphs);

        var error = article.BasicChecks();

        return (article, error);
    }
}