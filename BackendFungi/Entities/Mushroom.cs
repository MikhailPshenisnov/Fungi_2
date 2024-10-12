using System;
using System.Collections.Generic;

namespace BackendFungi.Entities;

public partial class Mushroom
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? SynonymousName { get; set; }

    public bool RedBook { get; set; }

    public string Eatable { get; set; } = null!;

    public bool HasStem { get; set; }

    public int? StemSizeFrom { get; set; }

    public int? StemSizeTo { get; set; }

    public string? StemType { get; set; }

    public string? SteamColor { get; set; }

    public string? Description { get; set; }

    public virtual ICollection<Mushroom> Doppelgangers { get; set; } = new List<Mushroom>();

    public virtual ICollection<Mushroom> Mushrooms { get; set; } = new List<Mushroom>();
}
