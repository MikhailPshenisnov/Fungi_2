using BackendFungi.Abstractions.Repositories;
using BackendFungi.Abstractions.Services;
using BackendFungi.Database.Entities;

namespace BackendFungi.Services
{
    public class ArticleMushroomsService : IArticleMushroomsService
    {
        private readonly IArticleMushroomsRepository _repository;

        public ArticleMushroomsService(IArticleMushroomsRepository repository)
        {
            _repository = repository;
        }
        public async Task<Guid> AddMushroomToArticleAsync(Guid articleId, Guid mushroomId, CancellationToken ct)
        {
            return await _repository.AddMushroomToArticleAsync(articleId, mushroomId, ct);
        }

        public async Task<Guid> DeleteMushroomFromArticle(Guid articleId, Guid mushroomId, CancellationToken ct)
        {
            return await _repository.DeleteMushroomFromArticle(articleId, mushroomId, ct);
        }

        public async Task<List<ArticleMushroom>> GetAllMushroomsAsync(Guid articleId, CancellationToken ct)
        {
            return await _repository.GetAllMushroomsAsync(articleId, ct);
        }
    }
}
