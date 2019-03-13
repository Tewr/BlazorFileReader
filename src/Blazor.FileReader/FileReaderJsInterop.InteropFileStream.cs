using System;
using System.Threading.Tasks;
using System.IO;
using System.Threading;
using System.Diagnostics.Contracts;

namespace Blazor.FileReader
{
    public partial class FileReaderJsInterop
    {
        private class InteropFileStream : Stream
        {
            private readonly int fileRef;
            private readonly long length;
            private readonly IInvokeUnmarshalled invokeUnmarshalled;
            private bool isDisposed;
            private long _position;

            public InteropFileStream(int fileReference, long length, IInvokeUnmarshalled invokeUnmarshalled)
            {
                this.fileRef = fileReference;
                this.length = length;
                this.invokeUnmarshalled = invokeUnmarshalled;
            }

            public override bool CanRead => ThrowIfDisposedOrReturn(true);

            public override bool CanSeek => ThrowIfDisposedOrReturn(true);

            public override bool CanWrite => ThrowIfDisposedOrReturn(false);

            public override long Length => ThrowIfDisposedOrReturn(length);

            public override long Position {
                get => ThrowIfDisposedOrReturn(_position);
                set {
                    ThrowIfDisposed();
                    _position = value;
                }
            }

            public override void Flush()
            {
                ThrowIfDisposed();
            }

            public override async Task<int> ReadAsync(byte[] buffer, int offset, int count, CancellationToken cancellationToken)
            {
                ThrowIfDisposed();
                //Console.WriteLine($"{nameof(InteropFileStream)}.{nameof(ReadAsync)}({nameof(buffer)}=byte[{buffer.Length}], {nameof(offset)}={offset}, {nameof(count)}={count})");
                var bytesRead = await FileReaderJsInterop.ReadFileAsync(fileRef, invokeUnmarshalled, buffer, Position + offset, count, cancellationToken);
                Position += bytesRead;
                return bytesRead;
            }

            public override int Read(byte[] buffer, int offset, int count)
            {
                throw new NotImplementedException();
            }

            public override long Seek(long offset, SeekOrigin origin)
            {
                ThrowIfDisposed();
                if (offset > Length)
                    throw new ArgumentOutOfRangeException("offset");
                switch (origin)
                {
                    case SeekOrigin.Begin:
                        {
                            if (offset < 0)
                                throw new IOException("SeekBeforeBegin");
                            Position = offset;
                            break;
                        }
                    case SeekOrigin.Current:
                        {
                            int tempPosition = unchecked((int)Position + (int)offset);
                            if (unchecked((int)Position + offset) < 0 || tempPosition < 0)
                                throw new IOException("SeekBeforeBegin");
                            Position = tempPosition;
                            break;
                        }
                    case SeekOrigin.End:
                        {
                            int tempPosition = unchecked((int)(Length + (int)offset));
                            if (unchecked(Length + offset) < 0 || tempPosition < 0)
                                throw new IOException("IO.IO_SeekBeforeBegin");
                            Position = tempPosition;
                            break;
                        }
                    default:
                        throw new ArgumentException("Argument_InvalidSeekOrigin");
                }

                Contract.Assert(Position >= 0, "_position >= 0");
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
                if (!isDisposed)
                {
                    FileReaderJsInterop.Dispose(this.fileRef);
                    isDisposed = true;
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
        }
    }
}
