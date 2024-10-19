using System;
using System.Collections.Generic;

namespace BackendFungi.DataBase.Entities;

public partial class User
{
    public int Id { get; set; }

    public string Username { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public int RoleId { get; set; }

    public string? Email { get; set; }

    public virtual Role Role { get; set; } = null!;
}
