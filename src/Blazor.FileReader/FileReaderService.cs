using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System.Threading.Tasks;

namespace Blazor.FileReader
{

    public interface IFileReaderService
    {
        Task EnsureInitialized();

        IFileReaderRef CreateReference(ElementRef inputFileElement);
    }

    public class FileReaderService : IFileReaderService
    {
        private readonly FileReaderJsInterop _fileReaderJsInterop;

        public FileReaderService(IJSRuntime jsRuntime, IInvokeUnmarshalled invokeUnmarshalled)
        {
            this._fileReaderJsInterop = new FileReaderJsInterop(jsRuntime, invokeUnmarshalled);
        }

        public FileReaderService(IJSRuntime jsRuntime) : this(jsRuntime, null) { }

        public IFileReaderRef CreateReference(ElementRef inputFileElement)
        {
            return new FileReaderRef(inputFileElement, this._fileReaderJsInterop);
        }

        public Task EnsureInitialized()
        {
            return this._fileReaderJsInterop.EnsureInitialized();
        }
    }
}
