using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System.Threading.Tasks;

namespace Blazor.FileReader
{
    public interface IFileReaderServiceOptions
    {
        bool InitializeOnFirstCall { get; set; }

        bool UseWasmSharedBuffer { get; set; }
    }

    internal class FileReaderServiceOptions : IFileReaderServiceOptions
    {
        public bool InitializeOnFirstCall { get; set; } = false;

        public bool UseWasmSharedBuffer { get; set; } = false;
    }

    public interface IFileReaderService
    {
        Task EnsureInitializedAsync();

        IFileReaderRef CreateReference(ElementReference element);
    }

    public class FileReaderService : IFileReaderService
    {
        private readonly FileReaderJsInterop _fileReaderJsInterop;

        public FileReaderService(IJSRuntime jsRuntime, IFileReaderServiceOptions options)
        {
            this.Options = options;
            this._fileReaderJsInterop = new FileReaderJsInterop(jsRuntime, options);
        }

        public IFileReaderServiceOptions Options { get; }

        public IFileReaderRef CreateReference(ElementReference element)
        {
            return new FileReaderRef(element, this._fileReaderJsInterop);
        }

        public async Task EnsureInitializedAsync()
        {
            await this._fileReaderJsInterop.EnsureInitializedAsync(true);
        }
    }
}
