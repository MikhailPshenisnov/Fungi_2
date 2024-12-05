namespace BackendFungi.Models;

public class Role
{
    public const int MaxNameLength = 30;
    public const int MinAccessLevel = 0;
    public const int MaxAccessLevel = 100;

    private Role(Guid id, string name, int accessLevel)
    {
        Id = id;
        Name = name;
        AccessLevel = accessLevel;
    }

    public Guid Id { get; }
    public string Name { get; }
    public int AccessLevel { get; }

    private static string RoleBasicChecks(string name, int accessLevel)
    {
        var error = string.Empty;

        if (string.IsNullOrEmpty(name) || name.Length > MaxNameLength)
        {
            error = $"Role name can't be longer than {MaxNameLength} characters or empty";
        }
        else if (accessLevel < MinAccessLevel || accessLevel > MaxAccessLevel)
        {
            error = $"Role access level must be between {MinAccessLevel} and {MaxAccessLevel}";
        }

        return error;
    }

    public static (Role Role, string Error) Create(Guid id, string name, int accessLevel)
    {
        var error = RoleBasicChecks(name, accessLevel);

        var role = new Role(id, name, accessLevel);

        return (role, error);
    }
}