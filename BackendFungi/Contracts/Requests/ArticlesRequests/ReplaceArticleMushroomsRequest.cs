using System.ComponentModel.DataAnnotations;

namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public record ReplaceArticleMushroomsRequest
{
    [Required]
    public Guid ArticleId { get; init; }

    public List<Guid>? MushroomIds { get; init; }
}
