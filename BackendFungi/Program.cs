using BackendFungi.Abstractions.Repositories;
using BackendFungi.Abstractions.Services;
using BackendFungi.Database.Context;
using BackendFungi.Exceptions.SpecificExceptions;
using BackendFungi.Middlewares;
using BackendFungi.Repositories;
using BackendFungi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using BackendFungi.Options;
using BackendFungi.Contracts.Other;
using BackendFungi.Contracts.Responses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Net;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var messages = context.ModelState.Values
            .SelectMany(v => v.Errors)
            .Select(e => string.IsNullOrWhiteSpace(e.ErrorMessage) ? "Invalid request payload" : e.ErrorMessage)
            .Distinct()
            .ToArray();

        var errorText = string.Join("; ", messages);
        var response = new BaseResponse<object>(
            null,
            new ExceptionDto(
                ErrorCodes.InvalidRequest,
                "Validation error",
                string.IsNullOrWhiteSpace(errorText) ? "Invalid request payload" : errorText));

        return new BadRequestObjectResult(response);
    };
});

// Swagger settings
var swaggerOptions = configuration.GetSection("SwaggerDocOptions").Get<SwaggerDocOptions>()
                     ?? throw new InvalidOperationException(
                         "SwaggerDocOptions section is missing in appsettings.json");
builder.Services.AddSwaggerGen(opt =>
{
    opt.SwaggerDoc(swaggerOptions.Name, new OpenApiInfo
    {
        Version = swaggerOptions.Version,
        Title = swaggerOptions.Title,
        Description = swaggerOptions.Description
    });

    foreach (var server in swaggerOptions.Servers)
    {
        opt.AddServer(new OpenApiServer
        {
            Url = server.Url,
            Description = server.Description
        });
    }

    opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Enter JWT token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "bearer"
    });

    opt.AddSecurityRequirement(new OpenApiSecurityRequirement
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
    });

    opt.EnableAnnotations();
    opt.SupportNonNullableReferenceTypes();

    Action<SwaggerGenOptions>? configure = null;

    configure?.Invoke(opt);
});

// Authentication and authorization configuration
builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = true;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],

            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],

            ValidateLifetime = true,

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]
                                       ?? throw new ConfigurationException("JWT-key is missing")))
        };
    });
builder.Services.AddAuthorization();

/*
// Service for data initialization
builder.Services.AddSingleton<IDataInitializationService, DataInitializationService>();
*/

// Services for access rights demarcation
builder.Services.AddScoped<IAccessCheckService, AccessCheckService>();
builder.Services.AddScoped<IAuthorizationService, AuthorizationService>();

// Services for services
builder.Services.AddScoped<IArticlesService, ArticlesService>();
builder.Services.AddScoped<IMushroomsService, MushroomsService>();
builder.Services.AddScoped<IRolesService, RolesService>();
builder.Services.AddScoped<IUsersService, UsersService>();
builder.Services.AddScoped<IArticleLikesService, ArticleLikesService>();
builder.Services.AddScoped<IMushroomLikesService, MushroomLikesService>();
builder.Services.AddScoped<IArticleMushroomsService, ArticleMushroomsService>();

// Services for repositories
builder.Services.AddScoped<IArticlesRepository, ArticlesRepository>();
builder.Services.AddScoped<IMushroomsRepository, MushroomsRepository>();
builder.Services.AddScoped<IRolesRepository, RolesRepository>();
builder.Services.AddScoped<IUsersRepository, UsersRepository>();
builder.Services.AddScoped<IArticleLikesRepository, ArticleLikesRepository>();
builder.Services.AddScoped<IMushroomLikesRepository, MushroomLikesRepository>();
builder.Services.AddScoped<IArticleMushroomsRepository, ArticleMushroomsRepository>();

// Service for correct response data wrapping
builder.Services.AddSingleton<IActionResultExecutor<ObjectResult>, CustomObjectResultExecutor>();

// Database context
builder.Services.AddDbContext<FungiDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("FungiDbContext")));

// Avatar storage
builder.Services.Configure<AvatarStorageOptions>(configuration.GetSection("AvatarStorage"));
builder.Services.AddSingleton<IAvatarStorageService, AvatarStorageService>();
builder.Services.Configure<ArticleMediaStorageOptions>(configuration.GetSection("ArticleMediaStorage"));
builder.Services.AddSingleton<IArticleMediaStorageService, ArticleMediaStorageService>();
builder.Services.Configure<MushroomMediaStorageOptions>(configuration.GetSection("MushroomMediaStorage"));
builder.Services.AddSingleton<IMushroomMediaStorageService, MushroomMediaStorageService>();
builder.Services.AddHostedService<ArticlePublishingHostedService>();

// CORS policy
var allowedOrigins = builder.Configuration.GetSection("Frontend:AllowedOrigins").Get<string[]>();
var allowLocalhostOrigins = (builder.Environment.IsDevelopment() || builder.Environment.IsEnvironment("Docker")) &&
                            builder.Configuration.GetValue<bool>("Frontend:AllowLocalhostOrigins");

if (allowedOrigins is null || allowedOrigins.Length == 0)
{
    var frontendAddress = builder.Configuration["Frontend:FrontendAddress"];
    if (string.IsNullOrWhiteSpace(frontendAddress))
        throw new ConfigurationException("Frontend allowed origins are missing");

    allowedOrigins = new[] { frontendAddress };
}

builder.Services.AddCors(options => options.AddPolicy(
    "FungiApiPolicy", b =>
    {
        if (allowLocalhostOrigins)
        {
            b.SetIsOriginAllowed(origin =>
            {
                if (!Uri.TryCreate(origin, UriKind.Absolute, out var uri))
                    return false;

                if (uri.Scheme is not ("http" or "https"))
                    return false;

                if (uri.Host.Equals("localhost", StringComparison.OrdinalIgnoreCase))
                    return true;

                return IPAddress.TryParse(uri.Host, out var ipAddress) && IPAddress.IsLoopback(ipAddress);
            });
        }
        else
        {
            b.WithOrigins(allowedOrigins);
        }

        b.AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    }));

// TODO: FIX CORS

/*
    Необходимо сделать так, чтобы при работе API данные не хранились в куки, 
    а использовалось локальное хранилище в браузере
    Таким образом удастся легко прикрутить мобилку без проблем с корсами
    По итогу надо убрать AllowCredentials() и разрешить AllowAnyOrigin()
*/

// builder.Services.AddCors(options => options.AddPolicy(
//     "FungiApiPolicy", b => b
//         .AllowAnyOrigin()
//         .AllowAnyHeader()
//         .AllowAnyMethod()));

var app = builder.Build();

var avatarStorageOptions = app.Services.GetRequiredService<IOptions<AvatarStorageOptions>>().Value;
var avatarRootPath = Path.GetFullPath(Path.Combine(app.Environment.ContentRootPath, avatarStorageOptions.PhysicalRoot));
Directory.CreateDirectory(avatarRootPath);
var avatarRequestPath = avatarStorageOptions.PublicBasePath.StartsWith('/')
    ? avatarStorageOptions.PublicBasePath
    : $"/{avatarStorageOptions.PublicBasePath}";
var articleMediaStorageOptions = app.Services.GetRequiredService<IOptions<ArticleMediaStorageOptions>>().Value;
var articleMediaRootPath = Path.GetFullPath(Path.Combine(app.Environment.ContentRootPath, articleMediaStorageOptions.PhysicalRoot));
Directory.CreateDirectory(articleMediaRootPath);
var articleMediaRequestPath = articleMediaStorageOptions.PublicBasePath.StartsWith('/')
    ? articleMediaStorageOptions.PublicBasePath
    : $"/{articleMediaStorageOptions.PublicBasePath}";
var mushroomMediaStorageOptions = app.Services.GetRequiredService<IOptions<MushroomMediaStorageOptions>>().Value;
var mushroomMediaRootPath = Path.GetFullPath(Path.Combine(app.Environment.ContentRootPath, mushroomMediaStorageOptions.PhysicalRoot));
Directory.CreateDirectory(mushroomMediaRootPath);
var mushroomMediaRequestPath = mushroomMediaStorageOptions.PublicBasePath.StartsWith('/')
    ? mushroomMediaStorageOptions.PublicBasePath
    : $"/{mushroomMediaStorageOptions.PublicBasePath}";

// Error handling middleware
app.UseMiddleware<ErrorHandlingMiddleware>();

// Middleware for wrapping response data in basic http errors
app.UseMiddleware<StatusCodeMiddleware>();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(avatarRootPath),
    RequestPath = avatarRequestPath
});
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(articleMediaRootPath),
    RequestPath = articleMediaRequestPath
});
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(mushroomMediaRootPath),
    RequestPath = mushroomMediaRequestPath
});

/*
// Data initialization middleware
app.UseMiddleware<DataInitializationMiddleware>();
*/

// CORS settings
app.UseCors("FungiApiPolicy");

// Authentication and authorization
app.UseAuthentication();
app.UseAuthorization();

// Swagger
if (app.Environment.IsDevelopment() || app.Environment.IsEnvironment("Docker"))
{
    app.UseSwagger();
    app.UseSwaggerUI(opt =>
    {
        opt.SwaggerEndpoint($"/swagger/{swaggerOptions.Name}/swagger.json",
            $"{swaggerOptions.Title} {swaggerOptions.Version}");
    });
}

if (!app.Environment.IsEnvironment("Docker"))
{
    app.UseHttpsRedirection();
}

app.MapControllers();

/*
// Data initialization
using (var scope = app.Services.CreateScope())
{
    try
    {
        var dataInitializationService = scope.ServiceProvider.GetRequiredService<IDataInitializationService>();
        await dataInitializationService.InitializeData(CancellationToken.None);

        var logger = scope.ServiceProvider.GetRequiredService<ILogger<IDataInitializationService>>();
        logger.LogInformation("Start initialization completed successfully");
    }
    catch (Exception e)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<IDataInitializationService>>();
        logger.LogCritical(e, "An error occurred during start initialization process");

        Environment.Exit(1);
    }
}
*/

app.Run();
