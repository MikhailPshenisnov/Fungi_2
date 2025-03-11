namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public record CreateArticleRequest(
    string Title,
    DateTime PublishDate,
    string AuthorString,
    string HeaderPhotoLink,
    List<string>? ExtraPhotoLinks,
    string ArticleText
);