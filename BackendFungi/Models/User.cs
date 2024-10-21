namespace BackendFungi.Models;

public class User
{
    public const int MaxUsernameLength = 128;
    public const int MaxEmailLength = 128;
    public const int MaxPasswordHashLength = 128;

    private User(int id, string username, string? email, string passwordHash, Role role)
    {
        Id = id;
        Username = username;
        Email = email;
        PasswordHash = passwordHash;
        Role = role;
    }

    public int Id { get; }
    public string Username { get; }
    public string? Email { get; }
    public string PasswordHash { get; }
    public Role Role { get; }

    public static (User User, string Error)
        Create(int id, string username, string? email, string passwordHash, Role role)
    {
        var error = string.Empty;

        if (id < 0)
        {
            error = "Id can't be less than 0";
        }
        else if (string.IsNullOrEmpty(username) || username.Length > MaxUsernameLength)
        {
            error = $"Username can't be longer than {MaxUsernameLength} characters or empty";
        }
        else if (email is not null && email.Length > MaxEmailLength)
        {
            error = $"Email can't be longer than {MaxEmailLength} characters";
        }
        else if (string.IsNullOrEmpty(passwordHash) || passwordHash.Length > MaxPasswordHashLength)
        {
            error = $"Password hash can't be longer than {MaxPasswordHashLength} characters or empty";
        }

        var user = new User(id, username, email, passwordHash, role);

        return (user, error);
    }
}