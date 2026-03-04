namespace BackendFungi.Options;

public class AvatarStorageOptions
{
    public string PhysicalRoot { get; set; } = "Storage/avatars";
    public string PublicBasePath { get; set; } = "/media/avatars";
    public int MaxFileSizeBytes { get; set; } = 5 * 1024 * 1024;
    public int MinImageSidePx { get; set; } = 128;
    public int MaxImageSidePx { get; set; } = 4096;
    public int MaxImageTotalPixels { get; set; } = 16_000_000;
    public int OutputSizePx { get; set; } = 512;
    public int WebpQuality { get; set; } = 80;
    public string[] AllowedExtensions { get; set; } = { ".jpg", ".jpeg", ".png", ".webp" };
    public string[] AllowedMimeTypes { get; set; } = { "image/jpeg", "image/png", "image/webp" };
}
