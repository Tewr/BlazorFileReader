using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Blazor.FileReader
{

    public interface IFileReaderService
    {
        IFileReaderRef CreateReference(ElementRef inputFileElement);
    }

    public class FileReaderService : IFileReaderService
    {
        private readonly FileReaderJsInterop _fileReaderJsInterop;

        public FileReaderService(IJSRuntime jsRuntime, IInvokeUnmarshalled invokeUnmarshalled)
        {
            this._fileReaderJsInterop = new FileReaderJsInterop(jsRuntime, invokeUnmarshalled);
        }

        public FileReaderService()
        {
        }

        public IFileReaderRef CreateReference(ElementRef inputFileElement)
        {
            return new FileReaderRef(inputFileElement, this._fileReaderJsInterop);
        }
    }
}
