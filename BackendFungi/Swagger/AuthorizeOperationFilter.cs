using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace BackendFungi.Swagger;

public class AuthorizeOperationFilter : IOperationFilter
{
    private static readonly OpenApiSecurityRequirement BearerRequirement = new()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new List<string>()
        }
    };

    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var hasAllowAnonymous =
            context.MethodInfo.GetCustomAttributes(true).OfType<AllowAnonymousAttribute>().Any()
            || (context.MethodInfo.DeclaringType?.GetCustomAttributes(true).OfType<AllowAnonymousAttribute>().Any()
                ?? false);

        if (hasAllowAnonymous)
        {
            operation.Security = new List<OpenApiSecurityRequirement>();
            return;
        }

        var hasAuthorize =
            context.MethodInfo.GetCustomAttributes(true).OfType<AuthorizeAttribute>().Any()
            || (context.MethodInfo.DeclaringType?.GetCustomAttributes(true).OfType<AuthorizeAttribute>().Any()
                ?? false);

        operation.Security = hasAuthorize
            ? new List<OpenApiSecurityRequirement> { BearerRequirement }
            : new List<OpenApiSecurityRequirement>();
    }
}
