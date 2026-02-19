using BackendFungi.Contracts.Other;
using BackendFungi.Contracts.Responses;

namespace BackendFungi.Middlewares;

public class StatusCodeMiddleware
{
    private readonly RequestDelegate _next;

    public StatusCodeMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        await _next(context);

        if (context.Response.HasStarted || context.Response.StatusCode < 400)
            return;

        // Keep explicitly written error payloads untouched and wrap only empty HTTP errors.
        if (!string.IsNullOrWhiteSpace(context.Response.ContentType) || context.Response.ContentLength is > 0)
            return;

        var response = new BaseResponse<object>(
            null,
            new ExceptionDto(
                $"Http error {context.Response.StatusCode}",
                context.Response.StatusCode switch
                {
                    StatusCodes.Status401Unauthorized => "Unauthorized access",
                    StatusCodes.Status403Forbidden => "Forbidden access",
                    StatusCodes.Status404NotFound => "Resource not found",
                    _ => "An error occurred"
                }
            )
        );

        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(response);
    }
}
