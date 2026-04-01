using Xunit;

namespace BackendFungi.IntegrationTests.Infrastructure;

[CollectionDefinition(Name)]
public sealed class IntegrationTestCollection : ICollectionFixture<BackendFungiApiFactory>
{
    public const string Name = "backend-api";
}
