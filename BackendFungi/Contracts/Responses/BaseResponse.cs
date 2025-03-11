using BackendFungi.Contracts.Other;

namespace BackendFungi.Contracts.Responses;

public record BaseResponse<T>(
    T? Data,
    ExceptionDto? ErrorMessage
);