namespace BackendFungi.Contracts.Other;

public record ExceptionDto(
    string ErrorGroup,
    string ErrorMessage
);