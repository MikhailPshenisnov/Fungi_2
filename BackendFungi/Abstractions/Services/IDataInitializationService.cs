namespace BackendFungi.Abstractions.Services;

public interface IDataInitializationService
{
    Task InitializeData(CancellationToken ct);

    Task<bool> IsReinitializationNeededCheck(CancellationToken ct);
}
