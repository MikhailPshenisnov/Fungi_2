namespace BackendFungi.Options;

public class MushroomMediaStorageOptions
{
    public string PhysicalRoot { get; set; } = "Storage/mushrooms";
    public string PublicBasePath { get; set; } = "/media/mushrooms";
    public int MaxFileSizeBytes { get; set; } = 8 * 1024 * 1024;
    public int MinImageSidePx { get; set; } = 128;
    public int MaxImageSidePx { get; set; } = 4096;
    public int MaxImageTotalPixels { get; set; } = 20_000_000;
    public int OutputMaxSidePx { get; set; } = 1600;
    public int WebpQuality { get; set; } = 82;
    public string[] AllowedExtensions { get; set; } = { ".jpg", ".jpeg", ".png", ".webp" };
    public string[] AllowedMimeTypes { get; set; } = { "image/jpeg", "image/png", "image/webp" };
}
