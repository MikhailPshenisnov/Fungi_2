namespace BackendFungi.Contracts.Responses.ArticlesResponses;

public record UploadArticleImageResponse(
    string MediaUrl,
    string MediaPath
);
