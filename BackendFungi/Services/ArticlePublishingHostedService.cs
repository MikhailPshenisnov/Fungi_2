using BackendFungi.Abstractions.Services;
using Microsoft.Extensions.Hosting;

namespace BackendFungi.Services;

public class ArticlePublishingHostedService : BackgroundService
{
    private static readonly TimeSpan PublishInterval = TimeSpan.FromSeconds(60);

    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<ArticlePublishingHostedService> _logger;

    public ArticlePublishingHostedService(IServiceScopeFactory scopeFactory, ILogger<ArticlePublishingHostedService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await PublishDueArticlesSafe(stoppingToken);

        using var timer = new PeriodicTimer(PublishInterval);
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var hasNextTick = await timer.WaitForNextTickAsync(stoppingToken);
                if (!hasNextTick)
                    break;
            }
            catch (OperationCanceledException)
            {
                break;
            }

            await PublishDueArticlesSafe(stoppingToken);
        }
    }

    private async Task PublishDueArticlesSafe(CancellationToken ct)
    {
        try
        {
            using var scope = _scopeFactory.CreateScope();
            var articlesService = scope.ServiceProvider.GetRequiredService<IArticlesService>();
            await articlesService.PublishDueScheduledArticlesAsync(ct);
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Failed to publish scheduled articles");
        }
    }
}
