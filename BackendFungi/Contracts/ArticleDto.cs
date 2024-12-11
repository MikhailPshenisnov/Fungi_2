namespace BackendFungi.Contracts;

public record ArticleDto(
    string Title,
    DateTime PublishDate,
    string AuthorString,
    string HeaderPhotoLink,
    List<ParagraphDto> Paragraphs
);