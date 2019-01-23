namespace Blazor.FileReader
{
    public partial class FileReaderJsInterop
    {
        public class ReadFileAsyncCallbackParams
        {
            public string CallBackId { get; set; }
            public long BytesRead { get; set; }
        }
    }
}
