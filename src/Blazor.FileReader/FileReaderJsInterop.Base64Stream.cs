using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace Blazor.FileReader
{
    public partial class FileReaderJsInterop
    {
        private class Base64Stream : IBase64Stream
        {
            private readonly int fileRef;
            private readonly long length;
            private readonly FileReaderJsInterop fileReaderJsInterop;
            private bool isDisposed;
            private long position;

            public Base64Stream(int fileReference, IFileInfo fileInfo, FileReaderJsInterop fileReaderJsInterop)
            {
                this.fileRef = fileReference;
                this.FileInfo = fileInfo;
                this.length = fileInfo.Size;
                this.fileReaderJsInterop = fileReaderJsInterop;
            }
            public IFileInfo FileInfo { get; private set; }

            public long Position
            {
                get => ThrowIfDisposedOrReturn(position);
                set
                {
                    ThrowIfDisposed();
                    var oldPosition = position;
                    position = value;
                    if (position != oldPosition)
                    {
                        var filePositionInfo = this.FileInfo.PositionInfo as FilePositionInfo;
                        filePositionInfo.Update(this, Position, this.FileInfo.Size);
                    }
                }
            }

            public long Length => ThrowIfDisposedOrReturn(length);

            public void Dispose()
            {
                if (!this.isDisposed)
                {
#pragma warning disable CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
                    // Fire-and-forget dispose as the only impact is the js GC
                    this.fileReaderJsInterop.DisposeStream(fileRef);
#pragma warning restore CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
                    this.isDisposed = true;
                }
            }

            public async ValueTask DisposeAsync()
            {
                if (!this.isDisposed)
                {
                    await this.fileReaderJsInterop.DisposeStream(fileRef);
                }
            }

            public async Task<string> ReadAsync(int offset, int count, CancellationToken cancellationToken)
            {
                ThrowIfDisposed();
                var result = await this.fileReaderJsInterop.ReadFileMarshalledBase64Async(this.fileRef, Position + offset, count, cancellationToken);
                Position = Math.Min(position + offset + count, length);

                return result ?? string.Empty;
            }

            private void ThrowIfDisposed()
            {
                if (this.isDisposed)
                {
                    throw new ObjectDisposedException(nameof(InteropFileStream));
                }
            }

            private T ThrowIfDisposedOrReturn<T>(T value)
            {
                ThrowIfDisposed();

                return value;
            }
        }
    }
}
