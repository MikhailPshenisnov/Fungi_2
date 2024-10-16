namespace BackendFungi.DataBase.Models;

public class MushroomsModel
{
    public bool? RedBook { get; set; }
    public string? Eatable { get; set; }
    public bool? HasStem { get; set; }
    public int? StemSizeFrom { get; set; }
    public int? StemSizeTo { get; set; }
    public string? StemType { get; set; }
    public string? SteamColor { get; set; }
}