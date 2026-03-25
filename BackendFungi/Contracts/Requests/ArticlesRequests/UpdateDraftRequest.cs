namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public record UpdateDraftRequest(
    Guid ArticleId,
    string Title,
    DateTime PublishDate,
    string AuthorString,
    string HeaderPhotoLink,
    List<string>? ExtraPhotoLinks,
    List<ArticleParagraphInput> Paragraphs,
    List<Guid>? LinkedMushroomIds
);
