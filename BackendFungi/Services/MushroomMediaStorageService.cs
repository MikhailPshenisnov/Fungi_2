using BackendFungi.Abstractions.Services;
using BackendFungi.Exceptions.SpecificExceptions;
using BackendFungi.Options;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using SkiaSharp;

namespace BackendFungi.Services;

public class MushroomMediaStorageService : IMushroomMediaStorageService
{
    private readonly MushroomMediaStorageOptions _options;
    private readonly string _rootPath;
    private readonly HashSet<string> _allowedExtensions;
    private readonly HashSet<string> _allowedMimeTypes;

    public MushroomMediaStorageService(IOptions<MushroomMediaStorageOptions> options, IWebHostEnvironment environment)
    {
        _options = options.Value;
        _rootPath = Path.GetFullPath(Path.Combine(environment.ContentRootPath, _options.PhysicalRoot));
        Directory.CreateDirectory(_rootPath);

        _allowedExtensions = _options.AllowedExtensions
            .Select(x => x.Trim().ToLowerInvariant())
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        _allowedMimeTypes = _options.AllowedMimeTypes
            .Select(x => x.Trim().ToLowerInvariant())
            .ToHashSet(StringComparer.OrdinalIgnoreCase);
    }

    public async Task<string> SaveMushroomImageAsync(IFormFile file, CancellationToken ct)
    {
        ValidateIncomingFile(file);

        await using var sourceStream = file.OpenReadStream();
        await using var bufferedStream = new MemoryStream();
        await sourceStream.CopyToAsync(bufferedStream, ct);
        bufferedStream.Position = 0;

        using var codec = SKCodec.Create(bufferedStream);
        if (codec is null)
            throw new ConversionException("Incorrect data format: Invalid image file");

        var sourceWidth = codec.Info.Width;
        var sourceHeight = codec.Info.Height;

        if (sourceWidth < _options.MinImageSidePx || sourceHeight < _options.MinImageSidePx)
            throw new ConversionException($"Incorrect data format: Image must be at least {_options.MinImageSidePx}px on each side");

        if (sourceWidth > _options.MaxImageSidePx || sourceHeight > _options.MaxImageSidePx)
            throw new ConversionException($"Incorrect data format: Image must be at most {_options.MaxImageSidePx}px on each side");

        var totalPixels = (long)sourceWidth * sourceHeight;
        if (totalPixels > _options.MaxImageTotalPixels)
            throw new ConversionException($"Incorrect data format: Image must be at most {_options.MaxImageTotalPixels} total pixels");

        bufferedStream.Position = 0;
        using var sourceBitmap = SKBitmap.Decode(bufferedStream);
        if (sourceBitmap is null)
            throw new ConversionException("Incorrect data format: Invalid image file");

        var targetWidth = sourceBitmap.Width;
        var targetHeight = sourceBitmap.Height;
        var maxSide = Math.Max(sourceBitmap.Width, sourceBitmap.Height);

        if (maxSide > _options.OutputMaxSidePx)
        {
            var ratio = (double)_options.OutputMaxSidePx / maxSide;
            targetWidth = Math.Max(1, (int)Math.Round(sourceBitmap.Width * ratio));
            targetHeight = Math.Max(1, (int)Math.Round(sourceBitmap.Height * ratio));
        }

        var outputInfo = new SKImageInfo(targetWidth, targetHeight, SKColorType.Rgba8888, SKAlphaType.Premul);
        using var surface = SKSurface.Create(outputInfo);
        if (surface is null)
            throw new IntegrityException("Unable to create image processing surface");

        var destinationRect = new SKRect(0, 0, targetWidth, targetHeight);
        var canvas = surface.Canvas;
        canvas.Clear(SKColors.Transparent);

        using (var paint = new SKPaint
               {
                   IsAntialias = true,
                   FilterQuality = SKFilterQuality.High
               })
        {
            canvas.DrawBitmap(sourceBitmap, destinationRect, paint);
        }

        canvas.Flush();

        using var outputImage = surface.Snapshot();
        using var outputData = outputImage.Encode(SKEncodedImageFormat.Webp, _options.WebpQuality);
        if (outputData is null)
            throw new IntegrityException("Unable to encode mushroom image");

        var relativePath = NormalizeRelativePath(Path.Combine(
            DateTime.UtcNow.Year.ToString("0000"),
            DateTime.UtcNow.Month.ToString("00"),
            $"{Guid.NewGuid():N}.webp"));

        var fullPath = ResolveFullPath(relativePath);
        var outputDirectory = Path.GetDirectoryName(fullPath) ?? throw new IntegrityException("Unable to determine media directory");
        Directory.CreateDirectory(outputDirectory);

        await using var outputFileStream = new FileStream(fullPath, FileMode.Create, FileAccess.Write, FileShare.None);
        outputData.SaveTo(outputFileStream);
        await outputFileStream.FlushAsync(ct);

        return relativePath;
    }

    public Task<bool> DeleteMushroomImageAsync(string? mediaPath, CancellationToken ct)
    {
        ct.ThrowIfCancellationRequested();

        if (string.IsNullOrWhiteSpace(mediaPath))
            return Task.FromResult(false);

        var normalizedRelativePath = NormalizeRelativePath(mediaPath);
        var fullPath = ResolveFullPath(normalizedRelativePath);
        var existed = File.Exists(fullPath);

        if (existed)
        {
            File.Delete(fullPath);
            TryDeleteEmptyParentDirectory(fullPath);
        }

        return Task.FromResult(existed);
    }

    public string? BuildPublicUrl(string? mediaPath)
    {
        if (string.IsNullOrWhiteSpace(mediaPath))
            return null;

        var normalizedRelativePath = NormalizeRelativePath(mediaPath);
        var normalizedBasePath = _options.PublicBasePath.TrimEnd('/');
        return $"{normalizedBasePath}/{normalizedRelativePath}";
    }

    private void ValidateIncomingFile(IFormFile file)
    {
        if (file.Length <= 0)
            throw new ConversionException("Incorrect data format: Image file is empty");

        if (file.Length > _options.MaxFileSizeBytes)
            throw new ConversionException($"Incorrect data format: Image file size must be <= {_options.MaxFileSizeBytes} bytes");

        var extension = Path.GetExtension(file.FileName)?.Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(extension) || !_allowedExtensions.Contains(extension))
            throw new ConversionException("Incorrect data format: Unsupported image file extension");

        var contentType = file.ContentType?.Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(contentType) || !_allowedMimeTypes.Contains(contentType))
            throw new ConversionException("Incorrect data format: Unsupported image file type");
    }

    private string NormalizeRelativePath(string path)
    {
        var normalized = path.Replace('\\', '/').Trim();
        normalized = normalized.TrimStart('/');

        if (string.IsNullOrWhiteSpace(normalized))
            throw new ConversionException("Incorrect data format: Invalid media path");

        return normalized;
    }

    private string ResolveFullPath(string relativePath)
    {
        var combined = Path.Combine(_rootPath, relativePath.Replace('/', Path.DirectorySeparatorChar));
        var fullPath = Path.GetFullPath(combined);

        var rootWithSeparator = _rootPath.EndsWith(Path.DirectorySeparatorChar)
            ? _rootPath
            : _rootPath + Path.DirectorySeparatorChar;

        if (!fullPath.StartsWith(rootWithSeparator, StringComparison.OrdinalIgnoreCase))
            throw new ConversionException("Incorrect data format: Invalid media path");

        return fullPath;
    }

    private static void TryDeleteEmptyParentDirectory(string fullPath)
    {
        var directory = Path.GetDirectoryName(fullPath);
        while (!string.IsNullOrWhiteSpace(directory) && Directory.Exists(directory))
        {
            if (Directory.EnumerateFileSystemEntries(directory).Any())
                return;

            var parent = Directory.GetParent(directory)?.FullName;
            Directory.Delete(directory, false);
            directory = parent;
        }
    }
}
