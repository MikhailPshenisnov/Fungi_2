using System.ComponentModel.DataAnnotations;

namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public record ArchiveArticleRequest
{
    [Required]
    public Guid ArticleId { get; init; }
}
