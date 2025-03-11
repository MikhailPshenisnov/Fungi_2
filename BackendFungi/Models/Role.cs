using BackendFungi.Models.Other;

namespace BackendFungi.Models;

public class Role
{
    public const int MaxNameLength = 32;
    public const int MaxAccessLevelValue = (int)AccessLevelEnumerator.CommonUser;
    public const int MinAccessLevelValue = (int)AccessLevelEnumerator.SuperUser;

    private Role(Guid id, string name, int accessLevel)
    {
        Id = id;
        Name = name;
        AccessLevel = accessLevel;
    }

    public Guid Id { get; }
    public string Name { get; }
    public int AccessLevel { get; }

    private string BasicChecks()
    {
        var error = string.Empty;

        if (string.IsNullOrEmpty(Name) || Name.Length > MaxNameLength)
        {
            error = $"Role name can't be longer than {MaxNameLength} characters or empty.";
        }
        else if (AccessLevel is < MinAccessLevelValue or > MaxAccessLevelValue)
        {
            error = $"Role access level must be between {MinAccessLevelValue} and {MaxAccessLevelValue}";
        }

        return error;
    }

    public static (Role Role, string Error) Create(Guid id, string name, int accessLevel)
    {
        var role = new Role(id, name, accessLevel);

        var error = role.BasicChecks();

        return (role, error);
    }
}