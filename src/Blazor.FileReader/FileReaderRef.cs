using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Tewr.Blazor.FileReader.DropEvents;

namespace Tewr.Blazor.FileReader
{
    /// <summary>
    /// Provides methods for interacting with an element that provides file streams.
    /// </summary>
    public interface IFileReaderRef
    {
        /// <summary>
        /// Register for drop events on the source element
        /// </summary>
        /// <param name="additive">If set to true, drop target file list becomes additive. Defaults to false.</param>
        /// <returns>An awaitable task representing the operation</returns>
        Task RegisterDropEventsAsync(bool additive = false);

        /// <summary>
        /// Register for drop events on the source element
        /// </summary>
        /// <param name="dropEventsOptions">Provides expert options for manipulating the default javascript behaviour of the drag and drop events.</param>
        /// <returns>An awaitable task representing the operation</returns>
        Task RegisterDropEventsAsync(DropEventsOptions dropEventsOptions);

        /// <summary>
        /// Unregister drop events on the source element
        /// </summary>
        /// <returns>An awaitable Task representing the operation</returns>
        Task UnregisterDropEventsAsync();

        /// <summary>
        /// Register for paste events on the source element
        /// </summary>
        /// <param name="additive">If set to true, target file list becomes additive. Defaults to false.</param>
        /// <returns>An awaitable task representing the operation</returns>
        Task RegisterPasteEventAsync(bool additive = false);

        /// <summary>
        /// Register for paste events on the source element
        /// </summary>
        /// <param name="pasteEventOptions">Provides expert options for manipulating the default javascript behaviour of the paste events.</param>
        /// <returns>An awaitable task representing the operation</returns>
        Task RegisterPasteEventAsync(PasteEventOptions pasteEventOptions);

        /// <summary>
        /// Unregister paste events on the source element
        /// </summary>
        /// <returns>An awaitable Task representing the operation</returns>
        Task UnregisterPasteEventAsync();

        /// <summary>
        /// Clears any value set on the source element
        /// </summary>
        /// <returns>An awaitable Task representing the operation</returns>
        Task ClearValue();

        /// <summary>
        /// Enumerates the currently selected file references
        /// </summary>
        /// <returns>An awaitable Task that provides an enumeration of the currently selected file references</returns>
        Task<IEnumerable<IFileReference>> EnumerateFilesAsync();
    }

    /// <summary>
    /// Provides properties and instance methods for the reading file metadata and aids in the creation of Readonly Stream objects. 
    /// </summary>
    public interface IFileReference
    {

#if NET5_0_OR_GREATER
        /// <summary>
        /// Returns the underlying file object as an <see cref="IJSObjectReference"/>
        /// </summary>
        /// <returns></returns>
        Task<IJSObjectReference> GetJSObjectReferenceAsync();

        /// <summary>
        /// Returns an object url for a file.
        /// </summary>
        /// <returns></returns>
        Task<IObjectUrl> GetObjectUrlAsync();
#endif

        /// <summary>
        /// Opens a read-only <see cref="Stream"/> to read the file.
        /// </summary>
        /// <returns>A read-only <see cref="Stream"/> to read the file.</returns>
        Task<AsyncDisposableStream> OpenReadAsync();

        /// <summary>
        /// Opens a read-only base64-encoded string stream to read the file
        /// </summary>
        /// <returns>A read-only <see cref="IBase64Stream"/> to read the file.</returns>
        Task<IBase64Stream> OpenReadBase64Async();

        /// <summary>
        /// Convenience method to read the file fully into memory using a single interop call 
        /// and returns it as a <see cref="MemoryStream"/>. Buffer size will be equal to the file size.
        /// The length of the resulting <see cref="MemoryStream"/> will be the same as the file size.
        /// </summary>
        /// <remarks>In most cases the fastest way to read a file into ram, but also the method that uses the most memory. 
        /// Will use at least twice the file size of memory at the end of the read operation.</remarks>
        /// <returns>A <see cref="MemoryStream"/> representing the full file, with <see cref="MemoryStream.Position"/> set to 0.</returns>
        Task<MemoryStream> CreateMemoryStreamAsync();

        /// <summary>
        /// Convenience method to read the file fully into memory using a single interop call 
        /// and returns it as a <see cref="MemoryStream"/>. Buffer size will be equal to the file size.
        /// The length of the resulting <see cref="MemoryStream"/> will be the same as the file size.
        /// </summary>
        /// <remarks>In most cases the fastest way to read a file into ram, but the most expensive in memory usage. 
        /// Will use at least twice the file size of memory at the end of the read operation.</remarks>
        /// <returns>A <see cref="MemoryStream"/> representing the full file, with <see cref="MemoryStream.Position"/> set to 0.</returns>
        Task<MemoryStream> CreateMemoryStreamAsync(CancellationToken cancellationToken);

        /// <summary>
        /// Convenience method to read the file fully into memory represented as a <see cref="MemoryStream"/>, using the specified <paramref name="bufferSize"/>.
        /// The length of the resulting <see cref="MemoryStream"/> will be the same as the file size.
        /// </summary>
        /// <returns>A <see cref="MemoryStream"/> representing the full file, with <see cref="MemoryStream.Position"/> set to 0.</returns>
        Task<MemoryStream> CreateMemoryStreamAsync(int bufferSize);

        /// <summary>
        /// Convenience method to read the file fully into memory represented as a <see cref="MemoryStream"/>, using the specified <paramref name="bufferSize"/>.
        /// The length of the resulting <see cref="MemoryStream"/> will be the same as the file size.
        /// </summary>
        /// <returns>A <see cref="MemoryStream"/> representing the full file, with <see cref="MemoryStream.Position"/> set to 0.</returns>
        Task<MemoryStream> CreateMemoryStreamAsync(int bufferSize, CancellationToken cancellationToken);

        /// <summary>
        /// Reads the file metadata.
        /// </summary>
        /// <returns>An object containing the file metadata</returns>
        Task<IFileInfo> ReadFileInfoAsync();
    }

    /// <summary>
    /// Provides a base64-encoded string view of a sequence of bytes from a file.
    /// </summary>
    public interface IBase64Stream : IDisposable, IAsyncDisposable
    {
        /// <summary>
        /// Gets or sets the current byte position in the Stream.
        /// </summary>
        long Position { get; set; }

        /// <summary>
        /// Gets the length of the stream in bytes.
        /// </summary>
        long Length { get; }

        /// <summary>
        /// Asynchronously reads a sequence of bytes as a base64 encoded string from the current stream 
        /// and advances the position within the stream by the number of bytes read.
        /// </summary>
        /// <param name="offset">The byte offset in the source at which to begin reading data from the stream.</param>
        /// <param name="count">The maximum number of bytes to read.</param>
        /// <param name="cancellationToken"></param>
        /// <returns>The requested sequence of bytes as a base64 encoded string. 
        /// The resulting string can be shorter than the number of bytes requested if
        /// the number of bytes currently available is less than the requested 
        /// number, or it can be string.empty if the end of the stream has been reached. </returns>
        Task<string> ReadAsync(int offset, int count, CancellationToken cancellationToken);
    }

    /// <summary>
    /// Provides properties for file metadata.
    /// </summary>
    public interface IFileInfo
    {
        /// <summary>
        /// Returns the name of the file referenced by the File object.
        /// </summary>
        string Name { get; }

        /// <summary>
        /// Returns a list of non-standard DOM properties attached to the object, like the webkitRelativePath property.
        /// </summary>
        Dictionary<string,object> NonStandardProperties { get; }

        /// <summary>
        /// Returns the size of the file in bytes.
        /// </summary>
        long Size { get; }

        /// <summary>
        /// Returns the MIME type of the file.
        /// </summary>
        string Type { get; }

        /// <summary>
        /// Returns the last modified time of the file, in millisecond since the UNIX epoch (January 1st, 1970 at Midnight).
        /// </summary>
        long? LastModified { get; }

        /// <summary>
        /// Returns the last modified time of the file.
        /// </summary>
        DateTime? LastModifiedDate { get; }

        /// <summary>
        /// Returns information of the position of any stream related to this file.
        /// </summary>
        IFilePositionInfo PositionInfo { get; }
    }
    
    internal class FileReaderRef : IFileReaderRef
    {
        public async Task<IEnumerable<IFileReference>> EnumerateFilesAsync() => 
            Enumerable.Range(0, Math.Max(0, await this.FileReaderJsInterop.GetFileCount(this.ElementRef)))
                .Select(index => (IFileReference)new FileReference(this, index));

        public async Task RegisterDropEventsAsync(bool additive) => 
            await RegisterDropEventsAsync(new DropEventsOptions { Additive = additive });

        public async Task RegisterDropEventsAsync(DropEventsOptions dropEventsOptions)
        {
            if (dropEventsOptions is null)
            {
                throw new ArgumentNullException(nameof(dropEventsOptions));
            }

            await this.FileReaderJsInterop.RegisterDropEvents(this.ElementRef, dropEventsOptions);
        }

        public async Task UnregisterDropEventsAsync() => await this.FileReaderJsInterop.UnregisterDropEvents(this.ElementRef);

        public async Task RegisterPasteEventAsync(bool additive) =>
            await RegisterPasteEventAsync(new PasteEventOptions { Additive = additive });

        public async Task RegisterPasteEventAsync(PasteEventOptions pasteEventOptions)
        {
            if (pasteEventOptions is null)
            {
                throw new ArgumentNullException(nameof(pasteEventOptions));
            }

            await this.FileReaderJsInterop.RegisterPasteEvent(this.ElementRef, pasteEventOptions);
        }

        public async Task UnregisterPasteEventAsync() => await this.FileReaderJsInterop.UnregisterPasteEvent(this.ElementRef);

        public async Task ClearValue() 
            => await this.FileReaderJsInterop.ClearValue(this.ElementRef);

        public ElementReference ElementRef { get; private set; }
        public FileReaderJsInterop FileReaderJsInterop { get; }

        internal FileReaderRef(ElementReference elementRef, FileReaderJsInterop fileReaderJsInterop)
        {
            this.ElementRef = elementRef;
            this.FileReaderJsInterop = fileReaderJsInterop;
        }

    }

    internal class FileReference : IFileReference
    {
        private readonly FileReaderRef fileLoaderRef;
        private readonly int index;
        private IFileInfo fileInfo;

        public FileReference(FileReaderRef fileLoaderRef, int index)
        {
            this.fileLoaderRef = fileLoaderRef;
            this.index = index;
        }

        public async Task<MemoryStream> CreateMemoryStreamAsync()
        {
            return await CreateMemoryStreamAsync(CancellationToken.None);
        }

        public async Task<MemoryStream> CreateMemoryStreamAsync(CancellationToken cancellationToken) {
            return await CreateMemoryStreamAsync((int)(await ReadFileInfoAsync()).Size, cancellationToken);
        }

        public Task<MemoryStream> CreateMemoryStreamAsync(int bufferSize)
        {
            return CreateMemoryStreamAsync(bufferSize, CancellationToken.None);
        }

        public Task<MemoryStream> CreateMemoryStreamAsync(int bufferSize, CancellationToken cancellationToken)
        {
            return InnerCreateMemoryStreamAsync(bufferSize, cancellationToken);
        }

        public async Task<AsyncDisposableStream> OpenReadAsync()
        {
            return await this.fileLoaderRef.FileReaderJsInterop.OpenFileStream(this.fileLoaderRef.ElementRef, index, await ReadFileInfoAsync());
        }

        public async Task<IFileInfo> ReadFileInfoAsync()
        {
            if (fileInfo == null)
            {
                fileInfo = await this.fileLoaderRef.FileReaderJsInterop.GetFileInfoFromElement(fileLoaderRef.ElementRef, index);
            }

            return fileInfo;
        }

        public async Task<IBase64Stream> OpenReadBase64Async()
        {
            return await this.fileLoaderRef.FileReaderJsInterop.OpenBase64Stream(fileLoaderRef.ElementRef, index, await ReadFileInfoAsync());
        }

        private async Task<MemoryStream> InnerCreateMemoryStreamAsync(int bufferSize, CancellationToken cancellationToken)
        {
            MemoryStream memoryStream;
            if (bufferSize < 1)
            {
                throw new InvalidOperationException("Unable to determine buffersize or provided buffersize was 0 or less");
            }
            else
            {
                memoryStream = new MemoryStream(bufferSize);
            }
            
            await using (var fs = await OpenReadAsync())
            {
                await fs.CopyToAsync(memoryStream, bufferSize, cancellationToken);
            }
            memoryStream.Position = 0;
            return memoryStream;
        }

#if NET5_0_OR_GREATER
        public Task<IJSObjectReference> GetJSObjectReferenceAsync()
        {
            return this.fileLoaderRef.FileReaderJsInterop.GetJSObjectReferenceAsync(fileLoaderRef.ElementRef, this.index);
        }

        public async Task<IObjectUrl> GetObjectUrlAsync()
        {
            var file = await GetJSObjectReferenceAsync();

            var objectUrl = new ObjectUrl(this.fileLoaderRef.FileReaderJsInterop.CurrentJSRuntime, file);
            await objectUrl.InitAsync();
            return objectUrl;
        }

#endif

    }

    internal class FileInfo : IFileInfo
    {
        private static readonly DateTime Epoch = new DateTime(1970, 01, 01);
        private readonly Lazy<DateTime?> lastModifiedDate;
        private readonly FilePositionInfo filePositionInfo;
        private long size;

        public FileInfo()
        {
            this.lastModifiedDate = new Lazy<DateTime?>(() =>
                LastModified == null ? null : (DateTime?)Epoch.AddMilliseconds(this.LastModified.Value));
            this.filePositionInfo = new FilePositionInfo();
        }

        public string Name { get; set; }

        public Dictionary<string, object> NonStandardProperties { get; set; }

        public long Size { 
            get => size; 
            set { 
                size = value;
                this.filePositionInfo.FileSize = size;
            } 
        }

        public string Type { get; set; }

        public long? LastModified { get; set; }

        public DateTime? LastModifiedDate => this.lastModifiedDate.Value;

        public IFilePositionInfo PositionInfo => filePositionInfo;
    }

    /// <summary>
    /// Stream that implements <see cref="IAsyncDisposable"/>
    /// </summary>
    public abstract class AsyncDisposableStream : Stream, IAsyncDisposable
    {
        /// <inheritdoc/>
        public abstract ValueTask DisposeAsync();
    }

}
