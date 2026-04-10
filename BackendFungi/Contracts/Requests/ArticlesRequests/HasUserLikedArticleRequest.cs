using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public record HasUserLikedArticleRequest
{
    [BindRequired]
    public Guid ArticleId { get; init; }
}
