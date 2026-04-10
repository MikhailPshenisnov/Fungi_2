using System.ComponentModel.DataAnnotations;

namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public record SubmitForReviewRequest
{
    [Required]
    public Guid ArticleId { get; init; }
}
