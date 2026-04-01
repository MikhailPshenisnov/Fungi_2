using BackendFungi.Database.Context;
using BackendFungi.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Testcontainers.PostgreSql;
using Xunit;

namespace BackendFungi.IntegrationTests.Infrastructure;

public sealed class BackendFungiApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _postgres = new PostgreSqlBuilder()
        .WithImage("postgres:16-alpine")
        .WithDatabase("fungi_tests")
        .WithUsername("postgres")
        .WithPassword("postgres")
        .Build();

    private readonly string _storageRoot = Path.Combine(Path.GetTempPath(), $"backendfungi-int-{Guid.NewGuid():N}");

    public SeedUser GetUser(TestUserKey userKey) => TestUsers.All[userKey];

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Docker");

        builder.ConfigureAppConfiguration((_, configBuilder) =>
        {
            configBuilder.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:FungiDbContext"] = _postgres.GetConnectionString(),
                ["Frontend:FrontendAddress"] = "http://localhost:5173",
                ["Frontend:AllowLocalhostOrigins"] = "true",
                ["Jwt:Key"] = "integration-tests-jwt-signing-key-32-chars-min",
                ["AvatarStorage:PhysicalRoot"] = Path.Combine(_storageRoot, "avatars"),
                ["ArticleMediaStorage:PhysicalRoot"] = Path.Combine(_storageRoot, "articles"),
                ["MushroomMediaStorage:PhysicalRoot"] = Path.Combine(_storageRoot, "mushrooms"),
                ["Logging:LogLevel:Default"] = "Warning",
                ["Logging:LogLevel:Microsoft.EntityFrameworkCore"] = "Warning",
                ["Logging:LogLevel:Microsoft"] = "Warning"
            });
        });

        builder.ConfigureServices(services =>
        {
            services.RemoveAll<DbContextOptions<FungiDbContext>>();
            services.RemoveAll<FungiDbContext>();

            services.AddDbContext<FungiDbContext>(options =>
                options.UseNpgsql(_postgres.GetConnectionString()));

            var hostedServiceDescriptors = services
                .Where(descriptor => descriptor.ServiceType == typeof(IHostedService)
                    && descriptor.ImplementationType == typeof(ArticlePublishingHostedService))
                .ToList();

            foreach (var descriptor in hostedServiceDescriptors)
                services.Remove(descriptor);
        });
    }

    public async Task InitializeAsync()
    {
        Directory.CreateDirectory(_storageRoot);
        await _postgres.StartAsync();

        _ = CreateClient(new() { AllowAutoRedirect = false });

        await using var scope = Services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<FungiDbContext>();

        await dbContext.Database.EnsureCreatedAsync();
        await TestDatabaseSeeder.SeedAsync(dbContext, CancellationToken.None);
    }

    async Task IAsyncLifetime.DisposeAsync()
    {
        await _postgres.DisposeAsync();
        Dispose();

        if (Directory.Exists(_storageRoot))
            Directory.Delete(_storageRoot, recursive: true);
    }
}
