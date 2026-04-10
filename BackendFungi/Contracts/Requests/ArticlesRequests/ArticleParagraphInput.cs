using System.ComponentModel.DataAnnotations;

namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public record ArticleParagraphInput
{
    [Required]
    [MinLength(1)]
    public string Text { get; init; } = string.Empty;

    public bool IsSubtitle { get; init; }
}
