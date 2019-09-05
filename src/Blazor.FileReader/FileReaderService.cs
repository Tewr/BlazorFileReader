using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System.Threading.Tasks;

namespace Blazor.FileReader
{
    public interface IFileReaderServiceOptions
    {
        /// <summary>
        /// Initializes the file service on the first interop call.
        /// Redundant for client-side blazor.
        /// </summary>
        /// <remarks>
        /// Initializing on the first call is neccessary only if the javascript 
        /// interop file (FileReaderComponent.js)
        /// has not been loaded manually using a script tag.
        /// </remarks>
        bool InitializeOnFirstCall { get; set; }

        /// <summary>
        /// For client-side blazor, uses shared memory buffer to transfer data quickly.
        /// Not available for server-side blazor.
        /// </summary>
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
