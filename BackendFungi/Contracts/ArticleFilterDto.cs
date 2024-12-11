namespace BackendFungi.Contracts;

public record ArticleFilterDto(
    string? PartOfTitle,
    DateTime? PublishDateFrom,
    DateTime? PublishDateTo,
    string? PartOfAuthorString
);