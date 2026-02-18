using System.Net;
using System.Text.Json;
using FluentValidation;

namespace TaskFlow.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception has occurred.");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var code = HttpStatusCode.InternalServerError;
        var result = JsonSerializer.Serialize(new { error = "An unexpected error occurred." });

        if (exception is ValidationException validationException)
        {
            code = HttpStatusCode.BadRequest;
            result = JsonSerializer.Serialize(new
            {
                error = "Validation failed",
                details = validationException.Errors.Select(e => new { e.PropertyName, e.ErrorMessage })
            });
        }
        else if (exception is UnauthorizedAccessException)
        {
            code = HttpStatusCode.Unauthorized;
            result = JsonSerializer.Serialize(new { error = "Unauthorized access" });
        }

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)code;

        return context.Response.WriteAsync(result);
    }
}
