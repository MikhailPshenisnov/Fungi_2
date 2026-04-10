using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public record DeleteMushroomFromArticleRequest
{
    [BindRequired]
    public Guid ArticleId { get; init; }

    [BindRequired]
    public Guid MushroomId { get; init; }
}
