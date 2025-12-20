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
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

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

// CORS policy
builder.Services.AddCors(options => options.AddPolicy(
    "FungiApiPolicy", b => b
        .WithOrigins(
            builder.Configuration["Frontend:FrontendAddress"] ??
            throw new ConfigurationException("Frontend address is missing"),
            "MOBILE APP ADDRESS" // Вот сюда вставьте адрес вашего эмулятора/устройства (пример: http://localhost:1234/)
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()));

// TODO: FIX CORS
// Пока что мне лень нормально нстроить CORS, пусть пока что тут будет такой костыль

// builder.Services.AddCors(options => options.AddPolicy(
//     "FungiApiPolicy", b => b
//         .WithOrigins(builder.Configuration["Frontend:FrontendAddress"]
//                      ?? throw new ConfigurationException("Frontend address is missing"))
//         .AllowAnyHeader()
//         .AllowAnyMethod()
//         .AllowCredentials()));

var app = builder.Build();

// Error handling middleware
app.UseMiddleware<ErrorHandlingMiddleware>();

// Middleware for wrapping response data in basic http errors
app.UseMiddleware<StatusCodeMiddleware>();

/*
// Data initialization middleware
app.UseMiddleware<DataInitializationMiddleware>();
*/

// Authentication and authorization
app.UseAuthentication();
app.UseAuthorization();

// CORS settings
app.UseCors("FungiApiPolicy");

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