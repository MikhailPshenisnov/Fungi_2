using BackendFungi.Abstractions.Services;

namespace BackendFungi.Middlewares;

public class DataInitializationMiddleware
{
    private readonly RequestDelegate _next;

    public DataInitializationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        using var scope = context.RequestServices.CreateScope();
        var dataInitializationService = scope.ServiceProvider
            .GetRequiredService<IDataInitializationService>();

        if (await dataInitializationService.IsReinitializationNeededCheck(CancellationToken.None))
            await dataInitializationService.InitializeData(CancellationToken.None);

        await _next(context);
    }
}