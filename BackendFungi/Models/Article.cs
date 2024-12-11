using BackendFungi.Contracts;

namespace BackendFungi.Models;

public class Article
{
    public const int MaxTitleLength = 255;
    public const int MaxAuthorStringLength = 100;
    public const int MaxHeaderPhotoLinkLength = 200;

    private Article(Guid id, string title, DateTime publishDate,
        string authorString, string headerPhotoLink, List<Paragraph> paragraphs)
    {
        Id = id;
        Title = title;
        PublishDate = publishDate;
        AuthorString = authorString;
        HeaderPhotoLink = headerPhotoLink;
        Paragraphs = paragraphs;
    }

    public Guid Id { get; }
    public string Title { get; }
    public DateTime PublishDate { get; }
    public string AuthorString { get; }
    public string HeaderPhotoLink { get; }
    public List<Paragraph> Paragraphs { get; }

    private static string ArticleBasicChecks(string title, DateTime publishDate, string authorString,
        string headerPhotoLink, List<ParagraphDto>? paragraphsDto = null, List<Paragraph>? paragraphs = null)
    {
        if (paragraphsDto is null && paragraphs is null)
        {
            throw new ArgumentException("At least one type of paragraph list is required");
        }

        var error = string.Empty;

        if (string.IsNullOrEmpty(title) || title.Length > MaxTitleLength)
        {
            error = $"Title can't be longer than {MaxTitleLength} characters or empty";
        }
        else if (publishDate > DateTime.Now)
        {
            error = "Publish date can't be from the future";
        }
        else if (string.IsNullOrEmpty(authorString) || authorString.Length > MaxAuthorStringLength)
        {
            error = $"Author string can't be longer than {MaxAuthorStringLength} characters or empty";
        }
        else if (string.IsNullOrEmpty(headerPhotoLink) || headerPhotoLink.Length > MaxHeaderPhotoLinkLength)
        {
            error = $"Header photo link can't be longer than {MaxHeaderPhotoLinkLength} characters or empty";
        }
        else if (!string.IsNullOrEmpty(headerPhotoLink) && !headerPhotoLink.Contains("imgur.com"))
        {
            error = $"Header photo link must be a link to an image on imgur.com";
        }
        else if ((paragraphsDto is not null && paragraphsDto.Count == 0) ||
                 (paragraphs is not null && paragraphs.Count == 0))
        {
            error = "The article must contain paragraphs";
        }

        return error;
    }

    public static (Article Article, string Error) Create(Guid id, string title, DateTime publishDate,
        string authorString, string headerPhotoLink, List<ParagraphDto> paragraphs)
    {
        var error = ArticleBasicChecks(title, publishDate, authorString,
            headerPhotoLink, paragraphsDto: paragraphs);

        var universalPublishDate = publishDate.ToUniversalTime();

        var paragraphList = new List<Paragraph>();
        for (var i = 0; i < paragraphs.Count; i++)
        {
            var (p, e) = Paragraph.Create(Guid.NewGuid(), id, paragraphs[i].ParagraphText, i);

            if (!string.IsNullOrEmpty(e))
            {
                if (string.IsNullOrEmpty(error))
                {
                    error = $"One of the paragraphs caused an error \"{e}\"";
                }
            }

            paragraphList.Add(p);
        }

        var article = new Article(id, title, universalPublishDate, authorString, headerPhotoLink, paragraphList);

        return (article, error);
    }

    public static (Article Article, string Error) Create(Guid id, string title, DateTime publishDate,
        string authorString, string headerPhotoLink, List<Paragraph> paragraphs)
    {
        var error = ArticleBasicChecks(title, publishDate, authorString, headerPhotoLink, paragraphs: paragraphs);

        var universalPublishDate = publishDate.ToUniversalTime();

        var article = new Article(id, title, universalPublishDate, authorString, headerPhotoLink, paragraphs);

        return (article, error);
    }
}