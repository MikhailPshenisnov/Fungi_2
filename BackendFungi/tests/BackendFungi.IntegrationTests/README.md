# Backend integration tests

Проект: `BackendFungi/tests/BackendFungi.IntegrationTests`.

Что внутри:
- `xUnit` + `WebApplicationFactory<Program>`.
- PostgreSQL поднимается через `Testcontainers`.
- Тестовый host использует реальный backend pipeline и real login через `/Authorization/LoginUser`.
- База создается через `EnsureCreated`, затем сидятся минимальные роли, permissions и пользователи.

Seed assumptions:
- `editor@fungi.test` / `Editor123!`.
- `moderator@fungi.test` / `Moderator123!`.
- `reader@fungi.test` / `Reader123!`.
- `outsider@fungi.test` / `Outsider123!`.
- Роли и права задаются в [`Infrastructure/TestUsers.cs`](./Infrastructure/TestUsers.cs).

Prerequisites:
- .NET SDK 7.0.x.
- Docker daemon running.

Run:
```bash
dotnet test BackendFungi/BackendFungi.sln --filter BackendFungi.IntegrationTests
```

Run a single test project:
```bash
dotnet test BackendFungi/tests/BackendFungi.IntegrationTests/BackendFungi.IntegrationTests.csproj
```

Если запускаете `dotnet test` внутри Docker-контейнера с подключенным `docker.sock`, добавьте:

```bash
TESTCONTAINERS_RYUK_DISABLED=true TESTCONTAINERS_HOST_OVERRIDE=host.docker.internal \
dotnet test BackendFungi/tests/BackendFungi.IntegrationTests/BackendFungi.IntegrationTests.csproj
```
