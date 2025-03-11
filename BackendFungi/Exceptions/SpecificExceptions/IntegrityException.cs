using BackendFungi.Exceptions.BaseExceptions;

namespace BackendFungi.Exceptions.SpecificExceptions;

public class IntegrityException : ExpectedException
{
    public IntegrityException()
    {
    }

    public IntegrityException(string message) : base(message)
    {
    }

    public IntegrityException(string message, Exception inner) : base(message, inner)
    {
    }
}