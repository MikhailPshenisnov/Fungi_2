using System.Text.RegularExpressions;

namespace BackendFungi.Models;

public class Permission
{
    public const int MaxCodeLength = 128;
    public const int MaxNameLength = 64;
    public const int MaxDescriptionLength = 512;
    public const string CodePattern = "^[a-z0-9._:-]+$";

    private Permission(Guid id, string code, string name, string? description, bool isSystem)
    {
        Id = id;
        Code = code;
        Name = name;
        Description = description;
        IsSystem = isSystem;
    }

    public Guid Id { get; }
    public string Code { get; }
    public string Name { get; }
    public string? Description { get; }
    public bool IsSystem { get; }

    private string BasicChecks()
    {
        if (string.IsNullOrWhiteSpace(Code) || Code.Length > MaxCodeLength)
            return $"Permission code can't be longer than {MaxCodeLength} characters or empty.";

        if (!Regex.IsMatch(Code, CodePattern))
            return "Permission code contains invalid symbols.";

        if (string.IsNullOrWhiteSpace(Name) || Name.Length > MaxNameLength)
            return $"Permission name can't be longer than {MaxNameLength} characters or empty.";

        if (Description is not null && Description.Length > MaxDescriptionLength)
            return $"Permission description can't be longer than {MaxDescriptionLength} characters.";

        return string.Empty;
    }

    public static (Permission Permission, string Error) Create(Guid id, string code, string name, string? description,
        bool isSystem)
    {
        var normalizedCode = code.Trim().ToLowerInvariant();
        var normalizedName = name.Trim();
        var normalizedDescription = string.IsNullOrWhiteSpace(description) ? null : description.Trim();

        var permission = new Permission(id, normalizedCode, normalizedName, normalizedDescription, isSystem);
        var error = permission.BasicChecks();

        return (permission, error);
    }
}
