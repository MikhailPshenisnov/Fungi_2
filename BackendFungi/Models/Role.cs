namespace BackendFungi.Models;

public class Role
{
    public const int MaxNameLength = 32;
    public const int MinAccessLevelValue = 0;

    private Role(Guid id, string name, int accessLevel, IReadOnlyCollection<string>? permissionCodes)
    {
        Id = id;
        Name = name;
        AccessLevel = accessLevel;
        PermissionCodes = permissionCodes ?? Array.Empty<string>();
    }

    public Guid Id { get; }
    public string Name { get; }
    public int AccessLevel { get; }
    public IReadOnlyCollection<string> PermissionCodes { get; }

    private string BasicChecks()
    {
        var error = string.Empty;

        if (string.IsNullOrEmpty(Name) || Name.Length > MaxNameLength)
        {
            error = $"Role name can't be longer than {MaxNameLength} characters or empty.";
        }
        else if (AccessLevel < MinAccessLevelValue)
        {
            error = $"Role access level must be greater than or equal to {MinAccessLevelValue}";
        }

        return error;
    }

    public static (Role Role, string Error) Create(Guid id, string name, int accessLevel,
        IReadOnlyCollection<string>? permissionCodes = null)
    {
        var role = new Role(id, name, accessLevel, permissionCodes);

        var error = role.BasicChecks();

        return (role, error);
    }
}
