namespace BackendFungi.Contracts.Other;

public record ExceptionDto
{
    public ExceptionDto(string errorGroup, string errorMessage)
        : this(ErrorCodes.UnknownError, errorGroup, errorMessage)
    {
    }

    public ExceptionDto(string errorCode, string errorGroup, string errorMessage)
    {
        ErrorCode = errorCode;
        ErrorGroup = errorGroup;
        ErrorMessage = errorMessage;
    }

    public string ErrorCode { get; init; }
    public string ErrorGroup { get; init; }
    public string ErrorMessage { get; init; }
}
