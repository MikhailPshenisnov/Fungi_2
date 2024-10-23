using BackendFungi.Abstractions;
using BackendFungi.Models;

namespace BackendFungi.Services;

public class ArticleService : IArticleService
{
    private readonly IArticlesRepository _articleRepository;

    public ArticleService(IArticlesRepository articleRepository)
    {
        _articleRepository = articleRepository;
    }

    // Returns an article model based on the article title
    public async Task<Article> GetArticleAsync(string articleTitle, CancellationToken ct)
    {
        try
        {
            var articleId = await _articleRepository.GetArticleId(articleTitle);

            var article = await _articleRepository.GetArticle(articleId);

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
            var articles = await _articleRepository.GetAllArticles();

            return articles;
        }
        catch (Exception e)
        {
            throw new Exception($"Unable to get articles: \"{e.Message}\"");
        }
    }

    // Creates an article and paragraphs for it in the database,
    // returns a tuple of the id of the created article and a list of ids of the created paragraphs
    public async Task<(Guid, List<Guid>)> CreateArticleAsync(Article article, CancellationToken ct)
    {
        try
        {
            await _articleRepository.GetArticleId(article.Title);
            throw new Exception($"Article \"{article.Title}\" has already existed");
        }
        catch (Exception e)
        {
            if (e.Message == $"Article \"{article.Title}\" has already existed")
            {
                throw new Exception($"Unable to create article \"{article.Title}\": \"{e.Message}\"");
            }

            try
            {
                var createdObjectsIds = await _articleRepository.CreateArticle(article);

                return createdObjectsIds;
            }
            catch (Exception ex)
            {
                throw new Exception($"Unable to create article \"{article.Title}\": \"{ex.Message}\"");
            }
        }
    }

    // Changes the article parameters to new ones, returns the id of the changed article
    public async Task<Guid> UpdateArticleAsync(string articleTitle, string newArticleTitle, DateTime? newPublishDate,
        List<Paragraph> newParagraphs, CancellationToken ct)
    {
        try
        {
            var existedArticleId = await _articleRepository.GetArticleId(articleTitle);

            var updatedArticleId = await _articleRepository
                .UpdateArticle(existedArticleId, newArticleTitle, newPublishDate, newParagraphs);

            return updatedArticleId;
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
            var articleId = await _articleRepository.GetArticleId(articleTitle);

            var deletedArticleId = await _articleRepository.DeleteArticle(articleId);

            return deletedArticleId;
        }
        catch (Exception e)
        {
            throw new Exception($"Unable to delete article \"{articleTitle}\": \"{e.Message}\"");
        }
    }
}