using BackendFungi.Models.Other;

namespace BackendFungi.Models;

public class MushroomRevision
{
    public const int MaxNameLength = 128;
    public const int MaxSynonymousNameLength = 128;
    public const int MaxLatinNameLength = 128;
    public const int MaxFamilyLength = 128;
    public const int MaxEatableLength = 16;
    public static readonly List<string> PossibleEatableVariants = new() { "Съедобный", "Полусъедобный", "Несъедобный" };
    public const int MaxStemTypeLength = 64;
    public const int MaxStemColorLength = 64;
    public const int MaxCapTypeLength = 64;
    public const int MaxCapColorLength = 64;
    public const int MaxCapUndersideTypeLength = 64;
    public const int MaxHeaderPhotoLinkLength = 256;
    public const int MaxExtraPhotoLinksLength = 1024;
    public const int MaxReviewNoteLength = 1000;

    private MushroomRevision(
        Guid id,
        Guid? sourceMushroomId,
        string name,
        string? synonymousName,
        string? latinName,
        string family,
        bool redBook,
        string eatable,
        bool hasStem,
        int? stemSizeFrom,
        int? stemSizeTo,
        string? stemType,
        string? stemColor,
        string capType,
        string capColor,
        string capUndersideType,
        string description,
        string? headerPhotoLink,
        List<string>? extraPhotoLinks,
        List<string> doppelgangerNames,
        MushroomRevisionStatus status,
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
        SourceMushroomId = sourceMushroomId;
        Name = name;
        SynonymousName = synonymousName;
        LatinName = latinName;
        Family = family;
        RedBook = redBook;
        Eatable = eatable;
        HasStem = hasStem;
        StemSizeFrom = stemSizeFrom;
        StemSizeTo = stemSizeTo;
        StemType = stemType;
        StemColor = stemColor;
        CapType = capType;
        CapColor = capColor;
        CapUndersideType = capUndersideType;
        Description = description;
        HeaderPhotoLink = headerPhotoLink;
        ExtraPhotoLinks = extraPhotoLinks;
        DoppelgangerNames = doppelgangerNames;
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
    public Guid? SourceMushroomId { get; }

    public string Name { get; }
    public string? SynonymousName { get; }
    public string? LatinName { get; }
    public string Family { get; }
    public bool RedBook { get; }
    public string Eatable { get; }
    public bool HasStem { get; }
    public int? StemSizeFrom { get; }
    public int? StemSizeTo { get; }
    public string? StemType { get; }
    public string? StemColor { get; }
    public string CapType { get; }
    public string CapColor { get; }
    public string CapUndersideType { get; }
    public string Description { get; }
    public string? HeaderPhotoLink { get; }
    public List<string>? ExtraPhotoLinks { get; }
    public List<string> DoppelgangerNames { get; }

    public MushroomRevisionStatus Status { get; }
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

        if (string.IsNullOrWhiteSpace(Name) || Name.Length > MaxNameLength)
        {
            error = $"Mushroom name can't be longer than {MaxNameLength} characters or empty";
        }
        else if (!string.IsNullOrEmpty(SynonymousName) && SynonymousName.Length > MaxSynonymousNameLength)
        {
            error = $"Synonymous mushroom name can't be longer than {MaxSynonymousNameLength} characters";
        }
        else if (!string.IsNullOrEmpty(LatinName) && LatinName.Length > MaxLatinNameLength)
        {
            error = $"Latin name can't be longer than {MaxLatinNameLength} characters";
        }
        else if (string.IsNullOrWhiteSpace(Family) || Family.Length > MaxFamilyLength)
        {
            error = $"Family can't be longer than {MaxFamilyLength} characters or empty";
        }
        else if (string.IsNullOrWhiteSpace(Eatable) || Eatable.Length > MaxEatableLength)
        {
            error = $"Eatable can't be longer than {MaxEatableLength} characters or empty";
        }
        else if (!PossibleEatableVariants.Contains(Eatable))
        {
            error = $"Eatable can be only one of: \"{string.Join("\", \"", PossibleEatableVariants)}\"";
        }
        else if (!HasStem && (StemSizeFrom is not null || StemSizeTo is not null || StemType is not null || StemColor is not null))
        {
            error = "If the mushroom doesn't have a stem information about its stem isn't needed";
        }
        else if (HasStem && (StemSizeFrom is null || StemSizeTo is null || StemType is null || StemColor is null))
        {
            error = "If the mushroom has a stem information about its stem is needed";
        }
        else if (StemSizeFrom < 0 || StemSizeTo < 0)
        {
            error = "Stem size can't be less than 0";
        }
        else if (StemSizeFrom > StemSizeTo)
        {
            error = "Stem size from must be less than stem size to or equal to it";
        }
        else if (!string.IsNullOrEmpty(StemType) && StemType.Length > MaxStemTypeLength)
        {
            error = $"Stem type can't be longer than {MaxStemTypeLength} characters";
        }
        else if (!string.IsNullOrEmpty(StemColor) && StemColor.Length > MaxStemColorLength)
        {
            error = $"Stem color can't be longer than {MaxStemColorLength} characters";
        }
        else if (string.IsNullOrWhiteSpace(CapType) || CapType.Length > MaxCapTypeLength)
        {
            error = $"Cap type can't be longer than {MaxCapTypeLength} characters or empty";
        }
        else if (string.IsNullOrWhiteSpace(CapColor) || CapColor.Length > MaxCapColorLength)
        {
            error = $"Cap color can't be longer than {MaxCapColorLength} characters or empty";
        }
        else if (string.IsNullOrWhiteSpace(CapUndersideType) || CapUndersideType.Length > MaxCapUndersideTypeLength)
        {
            error = $"Cap underside can't be longer than {MaxCapUndersideTypeLength} characters or empty";
        }
        else if (string.IsNullOrWhiteSpace(HeaderPhotoLink))
        {
            if (Status != MushroomRevisionStatus.Draft)
                error = "Header photo link is required for mushroom status other than Draft";
        }
        else if (HeaderPhotoLink.Length > MaxHeaderPhotoLinkLength)
        {
            error = $"Header photo link can't be longer than {MaxHeaderPhotoLinkLength} characters";
        }
        else if (!IsValidImageLink(HeaderPhotoLink))
        {
            error = "Header photo link must be a valid image link (absolute URL or /media/mushrooms/* path)";
        }
        else if (ExtraPhotoLinks is not null && string.Join(';', ExtraPhotoLinks).Length > MaxExtraPhotoLinksLength)
        {
            error = $"Extra photo links string can't be longer than {MaxExtraPhotoLinksLength} characters";
        }
        else if (ExtraPhotoLinks is not null && !ExtraPhotoLinks.All(IsValidImageLink))
        {
            error = "Photo link must be a valid image link (absolute URL or /media/mushrooms/* path)";
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

        var trimmed = value.Trim();

        if (trimmed.StartsWith("/media/mushrooms/", StringComparison.OrdinalIgnoreCase))
            return true;

        return Uri.TryCreate(trimmed, UriKind.Absolute, out var uri)
               && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
    }

    public static bool CanTransitionStatus(MushroomRevisionStatus from, MushroomRevisionStatus to)
    {
        if (from == to)
            return true;

        return from switch
        {
            MushroomRevisionStatus.Draft => to is MushroomRevisionStatus.InReview,
            MushroomRevisionStatus.InReview => to is MushroomRevisionStatus.Published or MushroomRevisionStatus.Rejected,
            MushroomRevisionStatus.Published => to is MushroomRevisionStatus.Archived,
            MushroomRevisionStatus.Rejected => to is MushroomRevisionStatus.Draft or MushroomRevisionStatus.InReview or MushroomRevisionStatus.Archived,
            MushroomRevisionStatus.Archived => false,
            _ => false
        };
    }

    public static (MushroomRevision Revision, string Error) Create(
        Guid id,
        Guid? sourceMushroomId,
        string name,
        string? synonymousName,
        string? latinName,
        string family,
        bool redBook,
        string eatable,
        bool hasStem,
        int? stemSizeFrom,
        int? stemSizeTo,
        string? stemType,
        string? stemColor,
        string capType,
        string capColor,
        string capUndersideType,
        string description,
        string? headerPhotoLink,
        List<string>? extraPhotoLinks,
        List<string> doppelgangerNames,
        MushroomRevisionStatus status,
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
        var normalizedExtraPhotos = extraPhotoLinks?
            .Select(x => x?.Trim())
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .Cast<string>()
            .ToList();

        if (normalizedExtraPhotos is not null && normalizedExtraPhotos.Count == 0)
            normalizedExtraPhotos = null;

        var normalizedDoppelgangers = doppelgangerNames
            .Select(x => x?.Trim())
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .Cast<string>()
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var revision = new MushroomRevision(
            id,
            sourceMushroomId,
            name,
            synonymousName,
            latinName,
            family,
            redBook,
            eatable,
            hasStem,
            stemSizeFrom,
            stemSizeTo,
            stemType,
            stemColor,
            capType,
            capColor,
            capUndersideType,
            description,
            headerPhotoLink,
            normalizedExtraPhotos,
            normalizedDoppelgangers,
            status,
            createdByUserId,
            updatedByUserId,
            createdAt.ToUniversalTime(),
            updatedAt.ToUniversalTime(),
            submittedAt?.ToUniversalTime(),
            publishedAt?.ToUniversalTime(),
            reviewedAt?.ToUniversalTime(),
            reviewedByUserId,
            string.IsNullOrWhiteSpace(reviewNote) ? null : reviewNote.Trim(),
            archivedAt?.ToUniversalTime());

        var error = revision.BasicChecks();
        return (revision, error);
    }
}
