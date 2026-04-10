using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public record ToggleArticleLikeRequest
{
    [BindRequired]
    public Guid ArticleId { get; init; }
}
