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
    // returns the title of the created article
    public async Task<string> CreateArticle(Article article)
    {
        var articleEntity = new Entities.Article
        {
            Id = article.Id,
            Title = article.Title,
            PublishDate = article.PublishDate,
            AuthorString = article.AuthorString,
            HeaderPhotoLink = article.HeaderPhotoLink
        };

        await _context.Articles.AddAsync(articleEntity);
        await _context.SaveChangesAsync();

        var addedParagraphs = new List<Guid>();
        foreach (var paragraph in article.Paragraphs)
        {
            addedParagraphs.Add(await _paragraphsRepository.CreateParagraph(paragraph));
        }

        return "ok";
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
                .Create(articleEntity.Id,
                    articleEntity.Title,
                    articleEntity.PublishDate,
                    articleEntity.AuthorString,
                    articleEntity.HeaderPhotoLink,
                    paragraphs).Article);
        }

        return articles;
    }

    // Gets new parameters for an article, deletes all paragraphs for the searched article,
    // updates the article parameters and creates new paragraphs for it
    public async Task<string> UpdateArticle(string articleTitle, Article newArticleModel)
    {
        var oldArticle = (await GetAllArticles()).FirstOrDefault(a => a.Title == articleTitle);

        if (oldArticle == null)
            throw new Exception("Unknown article title");

        foreach (var paragraph in oldArticle.Paragraphs)
        {
            await _paragraphsRepository.DeleteParagraph(paragraph.Id);
        }

        await _context.Articles
            .Where(a => a.Title == articleTitle)
            .ExecuteUpdateAsync(x => x
                .SetProperty(a => a.Title, a => newArticleModel.Title)
                .SetProperty(a => a.PublishDate, a => newArticleModel.PublishDate)
                .SetProperty(a => a.AuthorString, a => newArticleModel.AuthorString)
                .SetProperty(a => a.HeaderPhotoLink, a => newArticleModel.HeaderPhotoLink));

        foreach (var paragraph in newArticleModel.Paragraphs)
        {
            await _paragraphsRepository.CreateParagraph(paragraph);
        }

        return "ok";
    }

    // Deletes an article, and along with it, thanks to the database settings,
    // all its paragraphs are deleted, returns the title of the deleted article
    public async Task<string> DeleteArticle(string articleTitle)
    {
        var numUpdated = await _context.Articles
            .Where(a => a.Title == articleTitle)
            .ExecuteDeleteAsync();

        if (numUpdated == 0)
        {
            throw new Exception("Unknown article id");
        }

        return "ok";
    }
}