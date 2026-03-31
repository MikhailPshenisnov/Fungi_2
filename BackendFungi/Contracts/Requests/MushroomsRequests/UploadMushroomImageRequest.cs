using Microsoft.AspNetCore.Mvc;

namespace BackendFungi.Contracts.Requests.MushroomsRequests;

public class UploadMushroomImageRequest
{
    [FromForm(Name = "image")]
    public IFormFile Image { get; set; } = null!;
}
