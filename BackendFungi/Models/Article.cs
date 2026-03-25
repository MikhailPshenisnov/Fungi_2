using BackendFungi.Models.Other;

namespace BackendFungi.Models;

public class Article
{
    public const int MaxTitleLength = 256;
    public const int MaxAuthorStringLength = 128;
    public const int MaxHeaderPhotoLinkLength = 256;
    public const int MaxExtraPhotoLinksLength = 1024;
    public const int MaxReviewNoteLength = 1000;

    private Article(
        Guid id,
        string title,
        DateTime publishDate,
        string authorString,
        string headerPhotoLink,
        List<string>? extraPhotoLinks,
        List<Paragraph> paragraphs,
        ArticleStatus status,
        Guid createdByUserId,
        Guid? updatedByUserId,
        DateTime createdAt,
        DateTime updatedAt,
        DateTime? submittedAt,
        DateTime? publishedAt,
        DateTime? reviewedAt,
        Guid? reviewedByUserId,
        string? reviewNote,
        DateTime? archivedAt)
    {
        Id = id;
        Title = title;
        PublishDate = publishDate;
        AuthorString = authorString;
        HeaderPhotoLink = headerPhotoLink;
        ExtraPhotoLinks = extraPhotoLinks;
        Paragraphs = paragraphs;

        Status = status;
        CreatedByUserId = createdByUserId;
        UpdatedByUserId = updatedByUserId;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
        SubmittedAt = submittedAt;
        PublishedAt = publishedAt;
        ReviewedAt = reviewedAt;
        ReviewedByUserId = reviewedByUserId;
        ReviewNote = reviewNote;
        ArchivedAt = archivedAt;
    }

    public Guid Id { get; }
    public string Title { get; }
    public DateTime PublishDate { get; }
    public string AuthorString { get; }
    public string HeaderPhotoLink { get; }
    public List<string>? ExtraPhotoLinks { get; }
    public List<Paragraph> Paragraphs { get; }

    public ArticleStatus Status { get; }
    public Guid CreatedByUserId { get; }
    public Guid? UpdatedByUserId { get; }
    public DateTime CreatedAt { get; }
    public DateTime UpdatedAt { get; }
    public DateTime? SubmittedAt { get; }
    public DateTime? PublishedAt { get; }
    public DateTime? ReviewedAt { get; }
    public Guid? ReviewedByUserId { get; }
    public string? ReviewNote { get; }
    public DateTime? ArchivedAt { get; }

    private string BasicChecks()
    {
        var error = string.Empty;

        if (string.IsNullOrWhiteSpace(Title) || Title.Length > MaxTitleLength)
        {
            error = $"Title can't be longer than {MaxTitleLength} characters or empty";
        }
        else if (string.IsNullOrWhiteSpace(AuthorString) || AuthorString.Length > MaxAuthorStringLength)
        {
            error = $"Author string can't be longer than {MaxAuthorStringLength} characters or empty";
        }
        else if (string.IsNullOrWhiteSpace(HeaderPhotoLink))
        {
            if (Status != ArticleStatus.Draft)
                error = "Header photo link is required for article status other than Draft";
        }
        else if (HeaderPhotoLink.Length > MaxHeaderPhotoLinkLength)
        {
            error = $"Header photo link can't be longer than {MaxHeaderPhotoLinkLength} characters";
        }
        else if (!IsValidImageLink(HeaderPhotoLink))
        {
            error = "Header photo link must be a valid image link (absolute URL or /media/* path)";
        }
        else if (ExtraPhotoLinks is not null && string.Join(';', ExtraPhotoLinks).Length > MaxExtraPhotoLinksLength)
        {
            error = $"Extra photo links string can't be longer than {MaxExtraPhotoLinksLength} characters";
        }
        else if (ExtraPhotoLinks is not null && !ExtraPhotoLinks.All(IsValidImageLink))
        {
            error = "Photo link must be a valid image link (absolute URL or /media/* path)";
        }
        else if (Paragraphs.Count == 0)
        {
            error = "The article must contain paragraphs";
        }
        else if (CreatedByUserId == Guid.Empty)
        {
            error = "CreatedByUserId must be a non-empty guid";
        }
        else if (!string.IsNullOrWhiteSpace(ReviewNote) && ReviewNote.Length > MaxReviewNoteLength)
        {
            error = $"Review note can't be longer than {MaxReviewNoteLength} characters";
        }

        return error;
    }

    private static bool IsValidImageLink(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return false;

        var trimmedValue = value.Trim();

        if (trimmedValue.StartsWith("/media/", StringComparison.OrdinalIgnoreCase))
            return true;

        return Uri.TryCreate(trimmedValue, UriKind.Absolute, out var uri)
               && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
    }

    public static bool CanTransitionStatus(ArticleStatus from, ArticleStatus to)
    {
        if (from == to)
            return true;

        return from switch
        {
            ArticleStatus.Draft => to is ArticleStatus.InReview or ArticleStatus.Archived,
            ArticleStatus.InReview => to is ArticleStatus.Published or ArticleStatus.Scheduled or ArticleStatus.Rejected or ArticleStatus.Archived,
            ArticleStatus.Scheduled => to is ArticleStatus.Published or ArticleStatus.Archived,
            ArticleStatus.Published => to is ArticleStatus.Archived,
            ArticleStatus.Rejected => to is ArticleStatus.Draft or ArticleStatus.InReview or ArticleStatus.Archived,
            ArticleStatus.Archived => false,
            _ => false
        };
    }

    public static (Article Article, string Error) Create(
        Guid id,
        string title,
        DateTime publishDate,
        string authorString,
        string headerPhotoLink,
        List<string>? extraPhotoLinks,
        List<string> paragraphs,
        ArticleStatus status = ArticleStatus.Published,
        Guid? createdByUserId = null,
        Guid? updatedByUserId = null,
        DateTime? createdAt = null,
        DateTime? updatedAt = null,
        DateTime? submittedAt = null,
        DateTime? publishedAt = null,
        DateTime? reviewedAt = null,
        Guid? reviewedByUserId = null,
        string? reviewNote = null,
        DateTime? archivedAt = null)
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

            var (paragraph, paragraphError) = Paragraph.Create(
                Guid.NewGuid(),
                id,
                paragraphs[serialNumber],
                serialNumber,
                isSubtitle);

            if (!string.IsNullOrEmpty(paragraphError) && string.IsNullOrEmpty(error))
                error = $"One of the paragraphs caused an error: {paragraphError}";

            paragraphList.Add(paragraph);
        }

        var article = new Article(
            id,
            title,
            universalPublishDate,
            authorString,
            headerPhotoLink,
            extraPhotoLinks,
            paragraphList,
            status,
            createdByUserId ?? Guid.Empty,
            updatedByUserId,
            createdAt?.ToUniversalTime() ?? DateTime.UtcNow,
            updatedAt?.ToUniversalTime() ?? DateTime.UtcNow,
            submittedAt?.ToUniversalTime(),
            publishedAt?.ToUniversalTime(),
            reviewedAt?.ToUniversalTime(),
            reviewedByUserId,
            reviewNote,
            archivedAt?.ToUniversalTime());

        if (string.IsNullOrEmpty(error))
            error = article.BasicChecks();

        return (article, error);
    }

    public static (Article Article, string Error) Create(
        Guid id,
        string title,
        DateTime publishDate,
        string authorString,
        string headerPhotoLink,
        List<string>? extraPhotoLinks,
        List<Paragraph> paragraphs,
        ArticleStatus status,
        Guid createdByUserId,
        Guid? updatedByUserId,
        DateTime createdAt,
        DateTime updatedAt,
        DateTime? submittedAt,
        DateTime? publishedAt,
        DateTime? reviewedAt,
        Guid? reviewedByUserId,
        string? reviewNote,
        DateTime? archivedAt)
    {
        var universalPublishDate = publishDate.ToUniversalTime();

        var article = new Article(
            id,
            title,
            universalPublishDate,
            authorString,
            headerPhotoLink,
            extraPhotoLinks,
            paragraphs,
            status,
            createdByUserId,
            updatedByUserId,
            createdAt.ToUniversalTime(),
            updatedAt.ToUniversalTime(),
            submittedAt?.ToUniversalTime(),
            publishedAt?.ToUniversalTime(),
            reviewedAt?.ToUniversalTime(),
            reviewedByUserId,
            reviewNote,
            archivedAt?.ToUniversalTime());

        var error = article.BasicChecks();

        return (article, error);
    }
}
