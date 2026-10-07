using AuctionApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace AuctionApi.Controllers;

[ApiController]
public abstract class ApiControllerBase : ControllerBase
{
    /// <summary>
    /// Översätter ett misslyckat ServiceResult till rätt HTTP-svar.
    /// Felmeddelandet skickas som { message } så att klienten kan visa det.
    /// </summary>
    protected ActionResult ErrorResult<T>(ServiceResult<T> result)
    {
        var body = new { message = result.Error };
        return result.ErrorType switch
        {
            ServiceErrorType.NotFound => NotFound(body),
            ServiceErrorType.Forbidden => StatusCode(StatusCodes.Status403Forbidden, body),
            ServiceErrorType.Conflict => Conflict(body),
            _ => BadRequest(body)
        };
    }
}
