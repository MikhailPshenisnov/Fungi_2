namespace BackendFungi.Models;

public class User
{
    public const int MaxUsernameLength = 128;
    public const int MinUsernameLength = 8;
    public const int MaxEmailLength = 128;
    public const int MaxPasswordHashLength = 128;

    public const int MinPasswordLength = 8;
    public const int MaxPasswordLength = 32;

    private User(Guid id, string username, string? email, string passwordHash, Role role)
    {
        Id = id;
        Username = username;
        Email = email;
        PasswordHash = passwordHash;
        Role = role;
    }

    public Guid Id { get; }
    public string Username { get; }
    public string? Email { get; }
    public string PasswordHash { get; }
    public Role Role { get; }

    private string BasicChecks()
    {
        var error = string.Empty;

        if (string.IsNullOrEmpty(Username) || Username.Length > MaxUsernameLength)
        {
            error = $"Username can't be longer than {MaxUsernameLength} characters or empty";
        }
        else if (Username.Length < MinUsernameLength)
        {
            error = $"Username can't be shorter than {MinUsernameLength} characters";
        }
        else if (string.IsNullOrWhiteSpace(Username))
        {
            error = "Username can't be line only with whitespaces";
        }
        else if (!System.Text.RegularExpressions.Regex.IsMatch(Username, "^[a-zA-Z0-9_.-]+$"))
        {
            error = "Incorrect symbols in login";
        }
        else if (Email is not null && (string.IsNullOrEmpty(Email) || Email.Length > MaxEmailLength))
        {
            error = $"Email can't be longer than {MaxEmailLength} characters or empty";
        }
        else if (string.IsNullOrEmpty(PasswordHash) || PasswordHash.Length > MaxPasswordHashLength)
        {
            error = $"Password hash can't be longer than {MaxPasswordHashLength} characters or empty.";
        }

        return error;
    }
    
    public static (User User, string Error) Create(Guid id, string username, string? email, string password,
        bool isPasswordAlreadyHash, Role role)
    {
        var error = string.Empty;

        var passwordHash = password;

        if (!isPasswordAlreadyHash)
        {
            error = PasswordCheck(password);
            passwordHash = BCrypt.Net.BCrypt.EnhancedHashPassword(password);
        }

        var user = new User(id, username, email, passwordHash, role);

        if (string.IsNullOrEmpty(error))
            error = user.BasicChecks();

        return (user, error);
    }

    public static string PasswordCheck(string password)
    {
        var passwordCheckError = string.Empty;

        if (string.IsNullOrEmpty(password) || password.Length > MaxPasswordLength)
        {
            passwordCheckError = $"Password can't be longer than {MaxUsernameLength} characters or empty";
        }
        else if (password.Length < MinPasswordLength)
        {
            passwordCheckError = $"Password can't be shorter than {MinPasswordLength} characters";
        }
        else if (string.IsNullOrWhiteSpace(password))
        {
            passwordCheckError = "The password cannot be line only with whitespaces";
        }
        else if (!password.Any(char.IsDigit))
        {
            passwordCheckError = "The password must contain at least one number";
        }
        else if (!password.Any(char.IsUpper))
        {
            passwordCheckError = "The password must contain at least one capital letter";
        }
        else if (!password.Any(char.IsLower))
        {
            passwordCheckError = "The password must contain at least one lowercase letter";
        }
        else if (!System.Text.RegularExpressions.Regex.IsMatch(password, @"[!@#$%^&*(),.?""{}|<>]"))
        {
            passwordCheckError = "The password must contain at least one special character";
        }

        return passwordCheckError;
    }
}