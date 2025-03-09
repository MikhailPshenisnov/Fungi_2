namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public record UpdateArticleRequest(
    Guid ArticleId,
    string NewTitle,
    DateTime NewPublishDate,
    string NewAuthorString,
    string NewHeaderPhotoLink,
    List<string>? NewExtraPhotoLinks,
    string NewArticleText
);