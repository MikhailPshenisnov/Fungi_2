using BackendFungi.Abstractions;
using BackendFungi.Database.Context;
using BackendFungi.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendFungi.Database.Repositories;

public class ArticlesRepository : IArticlesRepository
{
    private readonly FungiDbContext _context;
    private readonly IParagraphsRepository _paragraphsRepository;

    public ArticlesRepository(FungiDbContext context, IParagraphsRepository paragraphsRepository)
    {
        _context = context;
        _paragraphsRepository = paragraphsRepository;
    }

    // Creates an article and paragraphs to it in the database according to the article model,
    // returns the id of the created article
    public async Task<Guid> CreateArticle(Article article)
    {
        var articleEntity = new Entities.Article
        {
            Id = article.Id,
            Title = article.Title,
            PublishDate = article.PublishDate
        };

        await _context.Articles.AddAsync(articleEntity);
        await _context.SaveChangesAsync();

        var addedParagraphs = new List<Guid>();
        foreach (var paragraph in article.Paragraphs)
        {
            addedParagraphs.Add(await _paragraphsRepository.CreateParagraph(paragraph));
        }

        return article.Id;
    }

    // Gets list of all articles and paragraphs to them from the database
    public async Task<List<Article>> GetAllArticles()
    {
        var articleEntities = await _context.Articles
            .AsNoTracking()
            .ToListAsync();

        var articles = new List<Article>();

        foreach (var articleEntity in articleEntities)
        {
            var paragraphs = await _paragraphsRepository.GetArticleParagraphs(articleEntity.Id);

            articles.Add(Article
                .Create(articleEntity.Id, articleEntity.Title, articleEntity.PublishDate, paragraphs).Article);
        }

        return articles;
    }

    // Finds the article id by title in the database and returns it
    public async Task<Guid> GetArticleId(string articleTitle)
    {
        var articleEntity = await (from article in _context.Articles
            where article.Title == articleTitle
            select article).FirstOrDefaultAsync();
        if (articleEntity == null)
            throw new Exception("Unknown article title");

        return articleEntity.Id;
    }

    // Finds an article by id and returns it
    public async Task<Article> GetArticle(Guid articleId)
    {
        var articleEntity = await (from a in _context.Articles
            where a.Id == articleId
            select a).FirstOrDefaultAsync();
        if (articleEntity == null)
            throw new Exception("Unknown article id");

        var paragraphs = await _paragraphsRepository.GetArticleParagraphs(articleEntity.Id);

        var article = Article.Create(articleEntity.Id, articleEntity.Title, articleEntity.PublishDate, paragraphs)
            .Article;

        return article;
    }

    // Gets new parameters for an article, deletes all paragraphs for the searched article,
    // updates the article parameters and creates new paragraphs for it
    public async Task<Guid> UpdateArticle(Guid articleId, string newArticleTitle, DateTime? newPublishDate,
        List<Paragraph> newParagraphs)
    {
        var oldArticle = await GetArticle(articleId);

        foreach (var paragraph in oldArticle.Paragraphs)
        {
            await _paragraphsRepository.DeleteParagraph(paragraph.Id);
        }

        await _context.Articles
            .Where(a => a.Id == articleId)
            .ExecuteUpdateAsync(x => x
                .SetProperty(a => a.Title, a => newArticleTitle)
                .SetProperty(a => a.PublishDate, a => newPublishDate));

        foreach (var paragraph in newParagraphs)
        {
            await _paragraphsRepository.CreateParagraph(paragraph);
        }

        return articleId;
    }

    // Deletes an article, and along with it, thanks to the database settings,
    // all its paragraphs are deleted, returns the id of the deleted article
    public async Task<Guid> DeleteArticle(Guid articleId)
    {
        var numUpdated = await _context.Articles
            .Where(a => a.Id == articleId)
            .ExecuteDeleteAsync();
        
        if (numUpdated == 0)
        {
            throw new Exception("Unknown article id");
        }

        return articleId;
    }
}