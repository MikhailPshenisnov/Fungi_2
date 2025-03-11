using BackendFungi.Abstractions.Repositories;
using BackendFungi.Abstractions.Services;
using BackendFungi.Exceptions.SpecificExceptions;
using BackendFungi.Models;
using BackendFungi.Models.Filters;

namespace BackendFungi.Services;

public class ArticlesService : IArticlesService
{
    private readonly IArticlesRepository _articlesRepository;

    public ArticlesService(IArticlesRepository articlesRepository)
    {
        _articlesRepository = articlesRepository;
    }

    // Creates a new article and its paragraphs in the system via the repository
    // Parameters: article model with article data and cancellation token
    // Returns: guid of the created article
    public async Task<Guid> CreateArticleAsync(Article article, CancellationToken cancellationToken)
    {
        var createdArticleId = await _articlesRepository.CreateArticle(article, cancellationToken);

        return createdArticleId;
    }

    // Retrieves an article by its guid from the repository
    // Parameters: guid of the article and cancellation token
    // Returns: article model if found or throws UnknownIdentifierException if the article guid is unknown
    public async Task<Article> GetArticleAsync(Guid articleId, CancellationToken cancellationToken)
    {
        var allArticles = await _articlesRepository.GetAllArticles(cancellationToken);

        var article = allArticles.FirstOrDefault(a => a.Id == articleId);

        if (article == null)
            throw new UnknownIdentifierException("Unknown article id");

        return article;
    }

    // Retrieves a filtered list of articles based on the provided filter from the repository
    // Parameters: optional article filter model to filter articles and cancellation token
    // Returns: list of article models matching the filter, sorted by publish date and then by title
    public async Task<List<Article>> GetFilteredArticlesAsync(ArticleFilter? articleFilter,
        CancellationToken cancellationToken)
    {
        var articles = await _articlesRepository.GetAllArticles(cancellationToken);

        if (articleFilter is null)
            return articles;

        if (articleFilter.PartOfTitle is not null)
        {
            articles = articles
                .Where(a => a.Title.ToLower().Contains(articleFilter.PartOfTitle.ToLower()))
                .ToList();
        }

        if (articleFilter.PublishDateFrom is not null)
        {
            articles = articles
                .Where(a => a.PublishDate >= articleFilter.PublishDateFrom)
                .ToList();
        }

        if (articleFilter.PublishDateTo is not null)
        {
            articles = articles
                .Where(a => a.PublishDate <= articleFilter.PublishDateTo)
                .ToList();
        }

        if (articleFilter.PartOfAuthorString is not null)
        {
            articles = articles
                .Where(a => a.AuthorString.ToLower().Contains(articleFilter.PartOfAuthorString.ToLower()))
                .ToList();
        }

        return articles.OrderBy(a => a.PublishDate).ThenBy(a => a.Title).ToList();
    }

    // Updates an existing article in the system via the repository
    // Parameters: guid of the article, article model with updated data, and cancellation token
    // Returns: guid of the updated article
    public async Task<Guid> UpdateArticleAsync(Guid articleId, Article newArticle, CancellationToken cancellationToken)
    {
        var updatedArticleId = await _articlesRepository.UpdateArticle(articleId, newArticle, cancellationToken);

        return updatedArticleId;
    }

    // Deletes an article from the system via the repository
    // Parameters: guid of the article and cancellation token
    // Returns: guid of the deleted article
    public async Task<Guid> DeleteArticleAsync(Guid articleId, CancellationToken cancellationToken)
    {
        var deletedArticleId = await _articlesRepository.DeleteArticle(articleId, cancellationToken);

        return deletedArticleId;
    }
}