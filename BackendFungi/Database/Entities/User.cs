namespace BackendFungi.Database.Entities;

public partial class User
{
    public Guid Id { get; set; }
    public string Username { get; set; } = null!;
    public string? Email { get; set; }
    public string PasswordHash { get; set; } = null!;
    public string? AvatarPath { get; set; }
    public Guid RoleId { get; set; }

    public virtual Role Role { get; set; } = null!;
    public virtual ICollection<Article> CreatedArticles { get; set; } = new List<Article>();
    public virtual ICollection<Article> UpdatedArticles { get; set; } = new List<Article>();
    public virtual ICollection<Article> ReviewedArticles { get; set; } = new List<Article>();
    public virtual ICollection<UserConsent> UserConsents { get; set; } = new List<UserConsent>();
}
