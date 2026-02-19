using System.Net;
using System.Text.Json;
using BackendFungi.Contracts.Other;
using BackendFungi.Contracts.Responses;
using BackendFungi.Exceptions.BaseExceptions;
using BackendFungi.Exceptions.SpecificExceptions;
using EntityFramework.Exceptions.Common;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace BackendFungi.Middlewares;

public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public ErrorHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (AuthorizationException e)
        {
            await HandleExceptionAsync(
                context,
                HttpStatusCode.Unauthorized,
                "Authorization error",
                e,
                isLogNeeded: false,
                logLevel: LogLevel.Warning);
        }
        catch (AccessException e)
        {
            await HandleExceptionAsync(
                context,
                HttpStatusCode.Forbidden,
                "Access error",
                e,
                isLogNeeded: false,
                logLevel: LogLevel.Warning);
        }
        catch (ConversionException e)
        {
            await HandleExceptionAsync(
                context,
                HttpStatusCode.BadRequest,
                "Wrong format error",
                e,
                isLogNeeded: false,
                logLevel: LogLevel.Warning);
        }
        catch (UnknownIdentifierException e)
        {
            await HandleExceptionAsync(
                context,
                HttpStatusCode.NotFound,
                "Not found error",
                e,
                isLogNeeded: false,
                logLevel: LogLevel.Warning);
        }
        catch (UniqueConstraintException e)
        {
            var ex = new Exception("Usernames, emails, role names, mushroom names, article titles must be unique", e);

            await HandleExceptionAsync(
                context,
                HttpStatusCode.Conflict,
                "Database error",
                ex,
                isLogNeeded: false,
                logLevel: LogLevel.Warning);
        }
        catch (CannotInsertNullException e)
        {
            var ex = new Exception("Unable to insert null into some row in the database", e);

            await HandleExceptionAsync(
                context,
                HttpStatusCode.BadRequest,
                "Database error",
                ex,
                isLogNeeded: false,
                logLevel: LogLevel.Warning);
        }
        catch (MaxLengthExceededException e)
        {
            var ex = new Exception("Some string value is too long", e);

            await HandleExceptionAsync(
                context,
                HttpStatusCode.BadRequest,
                "Database error",
                ex,
                isLogNeeded: false,
                logLevel: LogLevel.Warning);
        }
        catch (NumericOverflowException e)
        {
            var ex = new Exception("Some numeric value is too big", e);

            await HandleExceptionAsync(
                context,
                HttpStatusCode.BadRequest,
                "Database error",
                ex,
                isLogNeeded: false,
                logLevel: LogLevel.Warning);
        }
        catch (ReferenceConstraintException e)
        {
            var ex = new Exception("Destructive action, object has some dependencies or unknown object reference", e);

            await HandleExceptionAsync(
                context,
                HttpStatusCode.Conflict,
                "Database error",
                ex,
                isLogNeeded: false,
                logLevel: LogLevel.Warning);
        }
        catch (PostgresException e) when (e.SqlState == PostgresErrorCodes.UniqueViolation)
        {
            var ex = new Exception("Usernames, emails, role names, mushroom names, article titles must be unique", e);

            await HandleExceptionAsync(
                context,
                HttpStatusCode.Conflict,
                "Database error",
                ex,
                isLogNeeded: false,
                logLevel: LogLevel.Warning);
        }
        catch (DbUpdateException e)
        {
            var ex = new Exception("Unexpected database exception", e);

            await HandleExceptionAsync(
                context,
                HttpStatusCode.InternalServerError,
                "Database error",
                ex,
                isLogNeeded: true,
                logLevel: LogLevel.Error);
        }
        catch (ExpectedException e) when (e is IntegrityException or InitializationException or ConfigurationException)
        {
            await HandleExceptionAsync(
                context,
                HttpStatusCode.InternalServerError,
                "Critical system error",
                e,
                isLogNeeded: true,
                logLevel: LogLevel.Critical);
        }
        catch (ExpectedException e)
        {
            var ex = new Exception("Unexpected exception, probably you did not register new exception type in the " +
                                   "error handling middleware", e);

            await HandleExceptionAsync(
                context,
                HttpStatusCode.InternalServerError,
                "Unregistered exception",
                ex,
                isLogNeeded: true,
                logLevel: LogLevel.Critical);
        }
        catch (Exception e)
        {
            var ex = new Exception("Unexpected server exception, check logs for more information", e);

            await HandleExceptionAsync(
                context,
                HttpStatusCode.InternalServerError,
                "Unexpected exception",
                ex,
                isLogNeeded: true,
                logLevel: LogLevel.Critical);
        }
    }

    private async Task HandleExceptionAsync(
        HttpContext context,
        HttpStatusCode statusCode,
        string exceptionGroup,
        Exception exception,
        bool isLogNeeded,
        LogLevel logLevel)
    {
        if (isLogNeeded)
        {
            using var scope = context.RequestServices.CreateScope();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<ErrorHandlingMiddleware>>();

            logger.Log(logLevel, exception,
                "Error while request processing. Group: {ExceptionGroup}, StatusCode: {StatusCode}, ErrorMessage: {ErrorMessage}\n" +
                "Inner exception: {InnerException}\n" +
                "Stack trace: {StackTrace}",
                exceptionGroup,
                (int)statusCode,
                exception.Message,
                exception.InnerException?.ToString() ?? "(null)",
                exception.StackTrace ?? exception.InnerException?.StackTrace ?? "(null)");
        }

        var errorResponse = new BaseResponse<string>(
            null,
            new ExceptionDto(
                exceptionGroup,
                exception.Message));

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;
        await context.Response.WriteAsync(JsonSerializer.Serialize(errorResponse));
    }
}
