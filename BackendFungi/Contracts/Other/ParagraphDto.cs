namespace BackendFungi.Contracts.Other;

public record ParagraphDto(
    Guid Id,
    Guid ArticleId,
    string ParagraphText,
    int SerialNumber,
    bool IsSubtitle
);