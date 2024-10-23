namespace BackendFungi.Contracts;

public record ArticleDto(string Title, DateTime? PublishDate, List<ParagraphDto> Paragraphs);