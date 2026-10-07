namespace AuctionApi.Services;

public enum ServiceErrorType
{
    None,
    NotFound,
    BadRequest,
    Forbidden,
    Conflict
}

/// <summary>
/// Resultat från en tjänst. Gör att controllers kan välja rätt HTTP-statuskod
/// utan att affärslogiken behöver känna till HTTP.
/// </summary>
public class ServiceResult<T>
{
    public bool Success { get; private init; }
    public T? Data { get; private init; }
    public string? Error { get; private init; }
    public ServiceErrorType ErrorType { get; private init; }

    public static ServiceResult<T> Ok(T data) =>
        new() { Success = true, Data = data, ErrorType = ServiceErrorType.None };

    public static ServiceResult<T> Fail(ServiceErrorType type, string error) =>
        new() { Success = false, Error = error, ErrorType = type };
}
