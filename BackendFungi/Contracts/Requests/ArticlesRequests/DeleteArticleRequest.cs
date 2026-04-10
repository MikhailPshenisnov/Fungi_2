using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public record DeleteArticleRequest
{
    [BindRequired]
    public Guid ArticleId { get; init; }
}
