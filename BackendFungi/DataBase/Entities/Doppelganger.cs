using System;
using System.Collections.Generic;

namespace BackendFungi.DataBase.Entities;

public partial class Doppelganger
{
    public int Id { get; set; }

    public int MushroomId { get; set; }

    public string DoppelgangerName { get; set; } = null!;
}
