namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public record GetFilteredArticlesRequest(
    string? PartOfTitle,
    DateTime? PublishDateFrom,
    DateTime? PublishDateTo,
    string? PartOfAuthorString,
    int? Page,
    int? PageSize,
    string? Sort
);
