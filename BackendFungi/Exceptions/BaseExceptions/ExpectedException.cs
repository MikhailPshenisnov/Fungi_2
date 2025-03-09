namespace BackendFungi.Exceptions.BaseExceptions;

public class ExpectedException : Exception
{
    protected ExpectedException()
    {
    }

    protected ExpectedException(string message)
        : base(message)
    {
    }

    public ExpectedException(string message, Exception inner) : base(message, inner)
    {
    }
}