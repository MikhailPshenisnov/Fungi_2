using System;
using System.Collections.Generic;

namespace BackendFungi.Database.Entities;

public partial class Doppelganger
{
    public int Id { get; set; }

    public int MushroomId { get; set; }

    public string DoppelgangerName { get; set; } = null!;
}
