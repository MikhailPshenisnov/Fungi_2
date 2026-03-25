namespace BackendFungi.Contracts.Other;

public record ArticleDto(
    Guid Id,
    string Title,
    DateTime PublishDate,
    string AuthorString,
    string HeaderPhotoLink,
    List<string>? ExtraPhotoLinks,
    string Status,
    Guid CreatedByUserId,
    Guid? UpdatedByUserId,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    DateTime? SubmittedAt,
    DateTime? PublishedAt,
    DateTime? ReviewedAt,
    Guid? ReviewedByUserId,
    string? ReviewNote,
    DateTime? ArchivedAt,
    int LikesCount,
    List<ParagraphDto> Paragraphs
);
