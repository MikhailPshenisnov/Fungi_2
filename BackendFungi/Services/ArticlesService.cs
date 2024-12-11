using BackendFungi.Abstractions;
using BackendFungi.Models;

namespace BackendFungi.Services;

public class ArticlesService : IArticlesService
{
    private readonly IArticlesRepository _articlesRepository;

    public ArticlesService(IArticlesRepository articlesRepository)
    {
        _articlesRepository = articlesRepository;
    }

    // Returns an article model based on the article title
    public async Task<Article> GetArticleAsync(string articleTitle, CancellationToken ct)
    {
        try
        {
            var allArticles = await _articlesRepository.GetAllArticles();

            var article = allArticles.FirstOrDefault(a => a.Title == articleTitle);
            if (article == null)
                throw new Exception("Unknown article title");

            return article;
        }
        catch (Exception e)
        {
            throw new Exception($"Unable to get article \"{articleTitle}\": \"{e.Message}\"");
        }
    }

    // Returns a list of all article models
    public async Task<List<Article>> GetAllArticlesAsync(CancellationToken ct)
    {
        try
        {
            var articles = await _articlesRepository.GetAllArticles();

            return articles.OrderBy(a => a.PublishDate).ToList();
        }
        catch (Exception e)
        {
            throw new Exception($"Unable to get articles: \"{e.Message}\"");
        }
    }

    // Returns a list of articles after filtering
    public async Task<List<Article>> GetFilteredArticlesAsync(ArticleFilter articleFilter, CancellationToken ct)
    {
        var articles = await _articlesRepository.GetAllArticles();

        try
        {
            if (articleFilter.PartOfTitle is not null)
            {
                articles = articles
                    .Where(a => a.Title.Contains(articleFilter.PartOfTitle))
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
                    .Where(a => a.AuthorString.Contains(articleFilter.PartOfAuthorString))
                    .ToList();
            }

            return articles.OrderBy(x => x.PublishDate).ToList();
        }

        catch (Exception e)
        {
            throw new Exception($"Unable to get filtered articles: \"{e.Message}\"");
        }
    }

    // Creates an article and paragraphs for it in the database,
    // returns the id of the created article
    public async Task<Guid> CreateArticleAsync(Article article, CancellationToken ct)
    {
        try
        {
            var allArticles = await _articlesRepository.GetAllArticles();
            var existedArticle = allArticles.FirstOrDefault(a => a.Title == article.Title);

            if (existedArticle == null)
                throw new Exception("Unknown article title");

            throw new Exception($"Article \"{article.Title}\" has already existed");
        }
        catch (Exception e)
        {
            if (e.Message == $"Article \"{article.Title}\" has already existed")
            {
                throw new Exception($"Unable to create article \"{article.Title}\": \"{e.Message}\"");
            }

            if (e.Message == "Unknown article title")
            {
                try
                {
                    await _articlesRepository.CreateArticle(article);
                    return article.Id;
                }
                catch (Exception ex)
                {
                    throw new Exception($"Unable to create article \"{article.Title}\": \"{ex.Message}\"");
                }
            }

            throw new Exception($"Unable to create article \"{article.Title}\": \"{e.Message}\"");
        }
    }

    // Changes the article parameters to new ones, returns the id of the changed article
    public async Task<Guid> UpdateArticleAsync(string articleTitle, Article newArticle, CancellationToken ct)
    {
        try
        {
            var allArticles = await _articlesRepository.GetAllArticles();
            var existedArticle = allArticles.FirstOrDefault(a => a.Title == articleTitle);

            await _articlesRepository.UpdateArticle(articleTitle, newArticle);

            return existedArticle!.Id;
        }
        catch (Exception e)
        {
            throw new Exception($"Unable to update article \"{articleTitle}\": \"{e.Message}\"");
        }
    }

    // Deletes an article and returns its id
    public async Task<Guid> DeleteArticleAsync(string articleTitle, CancellationToken ct)
    {
        try
        {
            var allArticles = await _articlesRepository.GetAllArticles();
            var existedArticle = allArticles.FirstOrDefault(a => a.Title == articleTitle);

            await _articlesRepository.DeleteArticle(articleTitle);

            return existedArticle!.Id;
        }
        catch (Exception e)
        {
            throw new Exception($"Unable to delete article \"{articleTitle}\": \"{e.Message}\"");
        }
    }
}