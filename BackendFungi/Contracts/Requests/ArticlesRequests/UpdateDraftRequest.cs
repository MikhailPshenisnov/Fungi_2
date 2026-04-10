using System.ComponentModel.DataAnnotations;

namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public record UpdateDraftRequest
{
    [Required]
    public Guid ArticleId { get; init; }

    [Required]
    [MinLength(1)]
    public string Title { get; init; } = string.Empty;

    [Required]
    public DateTime PublishDate { get; init; }

    [Required]
    [MinLength(1)]
    public string AuthorString { get; init; } = string.Empty;

    public string HeaderPhotoLink { get; init; } = string.Empty;

    public List<string>? ExtraPhotoLinks { get; init; }

    [Required]
    [MinLength(1)]
    public List<ArticleParagraphInput> Paragraphs { get; init; } = new();

    public List<Guid>? LinkedMushroomIds { get; init; }
}
