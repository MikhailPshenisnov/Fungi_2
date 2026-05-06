namespace BackendFungi.Database.Entities;

public partial class UserConsent
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string ConsentType { get; set; } = null!;
    public string DocumentVersion { get; set; } = null!;
    public DateTime AcceptedAt { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string Source { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
