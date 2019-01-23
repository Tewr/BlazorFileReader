namespace Blazor.FileReader
{
    public partial class FileReaderJsInterop
    {
        public class ReadFileMarshalledAsyncCallbackParams
        {
            public long CallBackId { get; set; }

            public string Data { get; set; }
        }
    }
}
