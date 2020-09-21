using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System;
using System.Threading.Tasks;
using System.Xml.Schema;

namespace Tewr.Blazor.FileReader
{
    /// <summary>
    /// Provides configuration options for <see cref="IFileReaderService"/>
    /// </summary>
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
        public bool InitializeOnFirstCall { get; set; } = true;

        public bool UseWasmSharedBuffer { get; set; } = false;

    }


    internal class InternalFileReaderServiceOptions : IFileReaderServiceOptions
    {

        private readonly IFileReaderServiceOptions userProvidedOptions;

        public InternalFileReaderServiceOptions(IFileReaderServiceOptions userProvidedOptions)
        {
            this.userProvidedOptions = userProvidedOptions;
        }

        public bool InitializeOnFirstCall
        {
            get => userProvidedOptions.InitializeOnFirstCall;
            set => userProvidedOptions.InitializeOnFirstCall = value;
        }

        public bool UseWasmSharedBuffer { 
            get => userProvidedOptions.UseWasmSharedBuffer; 
            set => userProvidedOptions.UseWasmSharedBuffer = value; 
        }

        /// <summary>
        /// Activates server-side buffer chunking
        /// </summary>
        public bool UseBufferChunking { get; set; } = false;

        /// <summary>
        /// SignalR
        /// </summary>
        public long MaximumRecieveMessageSize { get; set; }
        
    }

    /// <summary>
    /// Servive for creating a <see cref="IFileReaderRef"/> instance from an element.
    /// </summary>
    public interface IFileReaderService
    {
        /// <summary>
        /// Explicitly initializes this instance by loading the neccessary interop code to the browser.
        /// </summary>
        /// <returns></returns>
        Task EnsureInitializedAsync();

        /// <summary>
        /// Creates a new instance of <see cref="IFileReaderRef"/> for the specified element.
        /// </summary>
        /// <param name="element">A reference to an element that can provide file streams. 
        /// Should be obtained using the @ref attribute. 
        /// Should reference either an input element of type file or a drop target.</param>
        /// <returns>a new instance of <see cref="IFileReaderRef"/></returns>
        IFileReaderRef CreateReference(ElementReference element);
    }

    internal class FileReaderService : IFileReaderService
    {
        private readonly FileReaderJsInterop _fileReaderJsInterop;
        private const long DefaultMaximumReceiveMessageSize = 32 * 1024;
        private static long? MaximumReceiveMessageSize;

        public FileReaderService(IJSRuntime jsRuntime, IFileReaderServiceOptions options, IServiceProvider serviceProvider)
        {
            this.Options = options;

            var internalOptions = new InternalFileReaderServiceOptions(options);
            if (!PlatformConfig.IsWasm)
            {
                if (MaximumReceiveMessageSize == null)
                {
                    if (!PlatformConfig.TryReadMaximumReceiveMessageSize(serviceProvider, out var maximumRecieveMessageSize))
                    {
                        System.Diagnostics.Trace.TraceWarning($"{typeof(FileReaderService).FullName}: Unable to read SignalR MaximumReceiveMessageSize, defaulting to {DefaultMaximumReceiveMessageSize}");
                        MaximumReceiveMessageSize = DefaultMaximumReceiveMessageSize;
                    }
                    else
                    {
                        MaximumReceiveMessageSize = maximumRecieveMessageSize;
                    }
                }

                internalOptions.UseBufferChunking = true;
                internalOptions.MaximumRecieveMessageSize = MaximumReceiveMessageSize.Value;
            }

            this._fileReaderJsInterop = new FileReaderJsInterop(jsRuntime, internalOptions);
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
