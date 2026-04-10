using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public record GetArticleMushroomsRequest
{
    [BindRequired]
    public Guid ArticleId { get; init; }
}
