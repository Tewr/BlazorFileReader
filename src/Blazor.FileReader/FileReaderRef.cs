using Microsoft.AspNetCore.Components;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Blazor.FileReader
{
    public interface IFileReaderRef
    {
        /// <summary>
        /// Register for drop events on the source element
        /// </summary>
        /// <returns></returns>
        Task RegisterDropEventsAsync();

        /// <summary>
        /// Clears any value set on the source element
        /// </summary>
        /// <returns></returns>
        Task ClearValue();

        /// <summary>
        /// Enumerates the currently selected file references
        /// </summary>
        /// <returns></returns>
        Task<IEnumerable<IFileReference>> EnumerateFilesAsync();
    }

    public interface IFileReference
    {
        /// <summary>
        /// Opens a stream to read the file
        /// </summary>
        /// <returns></returns>
        Task<Stream> OpenReadAsync();

        /// <summary>
        /// Read the file into memory using a single interop call and returns it as a MemoryStream.
        /// </summary>
        /// <returns></returns>
        Task<MemoryStream> CreateMemoryStreamAsync();

        /// <summary>
        /// Read the file into memory and returns it as a MemoryStream, using the specified buffersize.
        /// </summary>
        /// <returns></returns>
        Task<MemoryStream> CreateMemoryStreamAsync(int bufferSize);

        /// <summary>
        /// Reads the available file metadata
        /// </summary>
        /// <returns></returns>
        Task<IFileInfo> ReadFileInfoAsync();
    }

    public interface IFileInfo
    {
        /// <summary>
        /// Returns the name of the file referenced by the File object.
        /// </summary>
        string Name { get; }

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
    }
    
    internal class FileReaderRef : IFileReaderRef
    {
        public async Task<IEnumerable<IFileReference>> EnumerateFilesAsync() => 
            Enumerable.Range(0, Math.Max(0, await this.FileReaderJsInterop.GetFileCount(this.ElementRef)))
                .Select(index => (IFileReference)new FileReference(this, index));

        public async Task RegisterDropEventsAsync() => await this.FileReaderJsInterop.RegisterDropEvents(this.ElementRef);
        public async Task ClearValue() 
            => await this.FileReaderJsInterop.ClearValue(this.ElementRef);

        public ElementRef ElementRef { get; private set; }
        public FileReaderJsInterop FileReaderJsInterop { get; }

        internal FileReaderRef(ElementRef elementRef, FileReaderJsInterop fileReaderJsInterop)
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

        public Task<MemoryStream> CreateMemoryStreamAsync() {
            return InnerCreateMemoryStreamAsync(null);
        }
        public Task<MemoryStream> CreateMemoryStreamAsync(int bufferSize)
        {
            return InnerCreateMemoryStreamAsync(bufferSize);
        }

        private async Task<MemoryStream> InnerCreateMemoryStreamAsync(int? bufferSizeParam)
        {
            MemoryStream memoryStream;
            var file = await ReadFileInfoAsync();
            var bufferSize = bufferSizeParam.GetValueOrDefault((int)file.Size);
            if (bufferSize < 1)
            {
                throw new InvalidOperationException("Unable to determine buffersize or provided buffersize was 0 or less");
            }
            else
            {
                memoryStream = new MemoryStream(bufferSize);
            }

            var buffer = new byte[bufferSize];
            
            using (var fs = await OpenReadAsync())
            {
                int count;
                while ((count = await fs.ReadAsync(buffer, 0, buffer.Length)) != 0)
                {
                    await memoryStream.WriteAsync(buffer, 0, count);
                }
            }
            memoryStream.Position = 0;
            return memoryStream;
        }

        public Task<Stream> OpenReadAsync()
        {
            return this.fileLoaderRef.FileReaderJsInterop.OpenFileStream(this.fileLoaderRef.ElementRef, index);
        }

        public async Task<IFileInfo> ReadFileInfoAsync()
        {
            if (fileInfo == null)
            {
                fileInfo = await this.fileLoaderRef.FileReaderJsInterop.GetFileInfoFromElement(fileLoaderRef.ElementRef, index); ;
            }

            return fileInfo;
        }
    }

    public class FileInfo : IFileInfo
    {
        private static readonly DateTime Epoch = new DateTime(1970, 01, 01);
        private readonly Lazy<DateTime?> lastModifiedDate;
        public FileInfo()
        {
            this.lastModifiedDate = new Lazy<DateTime?>(() =>
                LastModified == null ? null : (DateTime?)Epoch.AddMilliseconds(this.LastModified.Value));
        }

        public string Name { get; set; }

        public long Size { get; set; }

        public string Type { get; set; }

        public long? LastModified { get; set; }

        public DateTime? LastModifiedDate => this.lastModifiedDate.Value;
    }

}
