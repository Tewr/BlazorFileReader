namespace Blazor.FileReader
{
    public delegate TRes InvokeUnmarshalled<T1, T2, TRes>(string identifier, T1 arg1, T2 arg2);

    public interface IInvokeUnmarshalled
    {
        TRes InvokeUnmarshalled<T1, T2, TRes>(string identifier, T1 arg1, T2 arg2);
    }
}