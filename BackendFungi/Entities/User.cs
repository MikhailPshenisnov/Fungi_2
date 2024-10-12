using System;
using System.Collections.Generic;

namespace BackendFungi.Entities;

public partial class User
{
    public string Id { get; set; } = null!;

    public string Username { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public int? Role { get; set; }

    public virtual Role? RoleNavigation { get; set; }
}
