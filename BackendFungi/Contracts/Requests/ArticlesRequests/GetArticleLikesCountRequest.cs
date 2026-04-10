using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public record GetArticleLikesCountRequest
{
    [BindRequired]
    public Guid ArticleId { get; init; }
}
