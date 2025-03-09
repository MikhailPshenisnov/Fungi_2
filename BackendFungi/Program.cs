using BackendFungi.Abstractions.Repositories;
using BackendFungi.Abstractions.Services;
using BackendFungi.Database.Context;
using BackendFungi.Middlewares;
using BackendFungi.Repositories;
using BackendFungi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Main services ASP.NET Core
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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
                                       ?? throw new ArgumentException("JWT-key is missing")))
        };
    });
builder.Services.AddAuthorization();

// Service for data initialization
builder.Services.AddSingleton<IDataInitializationService, DataInitializationService>();

// Services for access rights demarcation
builder.Services.AddScoped<IAccessCheckService, AccessCheckService>();
builder.Services.AddScoped<IAuthorizationService, AuthorizationService>();

// Services for services
builder.Services.AddScoped<IArticlesService, ArticlesService>();
builder.Services.AddScoped<IMushroomsService, MushroomsService>();
builder.Services.AddScoped<IRolesService, RolesService>();
builder.Services.AddScoped<IUsersService, UsersService>();

// Services for repositories
builder.Services.AddScoped<IArticlesRepository, ArticlesRepository>();
builder.Services.AddScoped<IMushroomsRepository, MushroomsRepository>();
builder.Services.AddScoped<IRolesRepository, RolesRepository>();
builder.Services.AddScoped<IUsersRepository, UsersRepository>();

// Database context
builder.Services.AddDbContext<FungiDbContext>();

// CORS policy
builder.Services.AddCors(options => options.AddPolicy(
    "FungiApiPolicy", b => b
        .WithOrigins(builder.Configuration["Frontend:FrontendAddress"]
                     ?? throw new ArgumentException("Frontend address is missing"))
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()));

var app = builder.Build();

// Error handling middleware
app.UseMiddleware<ErrorHandlingMiddleware>();

// Data initialization middleware
app.UseMiddleware<DataInitializationMiddleware>();

// Authentication and authorization
app.UseAuthentication();
app.UseAuthorization();

// CORS
app.UseCors("FungiApiPolicy");

// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();

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

app.Run();