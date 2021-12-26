using System;
using System.Threading.Tasks;
using System.IO;
using System.Threading;

namespace Tewr.Blazor.FileReader
{
    public partial class FileReaderJsInterop
    {
        internal class InteropFileStream : AsyncDisposableStream
        {
            private readonly int fileRef;
            private readonly long length;
            private readonly FileReaderJsInterop fileReaderJsInterop;
            private bool isDisposed;
            private long _position;

            public InteropFileStream(int fileReference, IFileInfo fileInfo, FileReaderJsInterop fileReaderJsInterop)
            {
                this.fileRef = fileReference;
                this.FileInfo = fileInfo;
                this.length = fileInfo.Size;
                this.fileReaderJsInterop = fileReaderJsInterop;
            }

            public IFileInfo FileInfo { get; private set; }

            public override bool CanRead => ThrowIfDisposedOrReturn(true);

            public override bool CanSeek => ThrowIfDisposedOrReturn(true);

            public override bool CanWrite => ThrowIfDisposedOrReturn(false);

            public override long Length => ThrowIfDisposedOrReturn(length);

            public override long Position {
                get => ThrowIfDisposedOrReturn(_position);
                set {
                    ThrowIfDisposed();
                    var oldPosition = _position;
                    _position = value;
                    if (_position != oldPosition)
                    {
                        var filePositionInfo = this.FileInfo.PositionInfo as FilePositionInfo;
                        filePositionInfo.Update(this, Position);
                    }
                }
            }

            public override void Flush()
            {
                ThrowIfDisposed();
            }

            public override async Task<int> ReadAsync(byte[] buffer, int offset, int count, CancellationToken cancellationToken)
            {
                ThrowIfDisposed();
                if (Position >= length)
                {
                    return 0;
                }

                var bytesRead = await fileReaderJsInterop.ReadFileAsync(fileRef, buffer, Position, offset, count, cancellationToken);
                Position += bytesRead;
                return bytesRead;
            }

            public override int Read(byte[] buffer, int offset, int count)
            {
                throw new NotSupportedException("Synchronous read is not supported by this stream. Use ReadAsync().");
            }

            public override long Seek(long offset, SeekOrigin origin)
            {
                ThrowIfDisposed();
                if (offset > Length)
                    throw new ArgumentOutOfRangeException(nameof(offset));
                switch (origin)
                {
                    case SeekOrigin.Begin:
                        {
                            if (offset < 0)
                                throw new IOException("An attempt was made to move the position before the beginning of the stream");
                            Position = offset;
                            break;
                        }
                    case SeekOrigin.Current:
                        {
                            var tempPosition = unchecked(Position + offset);
                            if (tempPosition < 0)
                            {
                                throw new IOException("An attempt was made to move the position before the beginning of the stream");
                            }
                            Position = tempPosition;
                            break;
                        }
                    case SeekOrigin.End:
                        {
                            var tempPosition = unchecked(Length + offset);
                            if (tempPosition < 0)
                                throw new IOException("An attempt was made to move the position before the beginning of the stream");
                            Position = tempPosition;
                            break;
                        }
                    default:
                        throw new ArgumentException("Invalid Seek Origin");
                }

                return Position;
            }

            public override void SetLength(long value)
            {
                throw new NotSupportedException();
            }

            public override void Write(byte[] buffer, int offset, int count)
            {
                throw new NotSupportedException();
            }

            protected override void Dispose(bool disposing)
            {
                base.Dispose(disposing);
                if (!this.isDisposed)
                {
#pragma warning disable CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
                    // Fire-and-forget dispose as the only impact is the js GC
                    this.fileReaderJsInterop.DisposeStream(fileRef);
#pragma warning restore CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
                    this.isDisposed = true;
                }
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

            public override async ValueTask DisposeAsync()
            {
                if (!isDisposed)
                {
                    await this.fileReaderJsInterop.DisposeStream(fileRef);
                    this.isDisposed = true;
                }
            }
        }
    }
}
