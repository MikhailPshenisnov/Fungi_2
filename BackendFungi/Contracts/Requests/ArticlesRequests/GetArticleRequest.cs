using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public record GetArticleRequest
{
    [BindRequired]
    public Guid ArticleId { get; init; }
}
