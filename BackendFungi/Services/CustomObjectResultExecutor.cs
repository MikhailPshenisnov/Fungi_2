using BackendFungi.Contracts.Responses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Extensions.Options;

namespace BackendFungi.Services;

public class CustomObjectResultExecutor : ObjectResultExecutor
{
    public CustomObjectResultExecutor(
        OutputFormatterSelector formatterSelector,
        IHttpResponseStreamWriterFactory writerFactory,
        ILoggerFactory loggerFactory,
        IOptions<MvcOptions> mvcOptions)
        : base(formatterSelector, writerFactory, loggerFactory, mvcOptions)
    {
    }

    public override async Task ExecuteAsync(ActionContext context, ObjectResult result)
    {
        if (result.Value is BaseResponse<object>)
        {
            await base.ExecuteAsync(context, result);
            return;
        }

        var wrappedResponse = new BaseResponse<object>(
            result.Value,
            null
        );

        var wrappedResult = new ObjectResult(wrappedResponse)
        {
            StatusCode = result.StatusCode ?? StatusCodes.Status200OK,
            ContentTypes = result.ContentTypes,
            DeclaredType = typeof(BaseResponse<object>)
        };

        await base.ExecuteAsync(context, wrappedResult);
    }
}