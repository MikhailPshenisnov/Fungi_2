using BackendFungi.Models.Other;

namespace BackendFungi.IntegrationTests.Infrastructure;

public enum TestUserKey
{
    Editor,
    Moderator,
    Reader,
    Outsider
}

public sealed record SeedRole(Guid Id, string Name, int AccessLevel, IReadOnlyCollection<string> PermissionCodes);

public sealed record SeedUser(Guid Id, Guid RoleId, string Username, string Email, string Password);

public static class TestUsers
{
    public static readonly SeedRole CommonRole = new(
        Guid.Parse("10000000-0000-0000-0000-000000000001"),
        "CommonUser",
        20,
        Array.Empty<string>());

    public static readonly SeedRole EditorRole = new(
        Guid.Parse("10000000-0000-0000-0000-000000000002"),
        "ContentEditor",
        10,
        new[]
        {
            PermissionCodes.ArticlesArchive,
            PermissionCodes.ArticlesWrite,
            PermissionCodes.MushroomsArchive,
            PermissionCodes.MushroomsWrite
        });

    public static readonly SeedRole ModeratorRole = new(
        Guid.Parse("10000000-0000-0000-0000-000000000003"),
        "ContentModerator",
        5,
        new[]
        {
            PermissionCodes.ArticlesReview,
            PermissionCodes.MushroomsPublish,
            PermissionCodes.MushroomsReview
        });

    public static readonly SeedRole ReaderRole = new(
        Guid.Parse("10000000-0000-0000-0000-000000000004"),
        "DirectoryReader",
        4,
        new[]
        {
            PermissionCodes.UsersRead
        });

    public static readonly IReadOnlyDictionary<TestUserKey, SeedUser> All =
        new Dictionary<TestUserKey, SeedUser>
        {
            [TestUserKey.Editor] = new(
                Guid.Parse("20000000-0000-0000-0000-000000000001"),
                EditorRole.Id,
                "editor_api",
                "editor@fungi.test",
                "Editor123!"),
            [TestUserKey.Moderator] = new(
                Guid.Parse("20000000-0000-0000-0000-000000000002"),
                ModeratorRole.Id,
                "moderator_api",
                "moderator@fungi.test",
                "Moderator123!"),
            [TestUserKey.Reader] = new(
                Guid.Parse("20000000-0000-0000-0000-000000000003"),
                ReaderRole.Id,
                "reader_api",
                "reader@fungi.test",
                "Reader123!"),
            [TestUserKey.Outsider] = new(
                Guid.Parse("20000000-0000-0000-0000-000000000004"),
                CommonRole.Id,
                "outsider_api",
                "outsider@fungi.test",
                "Outsider123!")
        };

    public static IReadOnlyList<SeedRole> Roles => new[]
    {
        CommonRole,
        EditorRole,
        ModeratorRole,
        ReaderRole
    };
}
