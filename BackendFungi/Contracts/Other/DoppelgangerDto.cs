namespace BackendFungi.Contracts.Other;

public record DoppelgangerDto(
    Guid Id,
    Guid MushroomId,
    string DoppelgangerName,
    bool IsContainedInDatabase
);