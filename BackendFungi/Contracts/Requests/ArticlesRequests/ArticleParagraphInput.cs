namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public record ArticleParagraphInput(
    string Text,
    bool IsSubtitle
);
