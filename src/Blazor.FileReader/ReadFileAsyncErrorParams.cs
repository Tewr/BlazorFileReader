namespace Blazor.FileReader
{
    public partial class FileReaderJsInterop
    {
        public class ReadFileAsyncErrorParams
        {
            public long CallBackId { get; set; }
            public string Exception { get; set; }
        }
    }
}
