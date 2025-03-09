namespace BackendFungi.Contracts.Other;

public record ArticleDto(
    Guid Id,
    string Title,
    DateTime PublishDate,
    string AuthorString,
    string HeaderPhotoLink,
    List<string>? ExtraPhotoLinks,
    List<ParagraphDto> Paragraphs
);