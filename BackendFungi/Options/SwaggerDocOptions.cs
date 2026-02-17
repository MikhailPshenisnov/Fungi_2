namespace BackendFungi.Options;

public class SwaggerDocOptions
{
    public string Name { get; set; } = "v1";
    public string Version { get; set; } = "v1";
    public string Title { get; set; } = "API";
    public string Description { get; set; } = "";
    public List<SwaggerServer> Servers { get; set; } = new();
}