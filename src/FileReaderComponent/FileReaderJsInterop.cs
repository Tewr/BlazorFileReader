using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using System.IO;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Blazor;
using System.Collections.Generic;
using System.Threading;
using System.Diagnostics.Contracts;
using System.Text;
using Microsoft.JSInterop;
using Mono.WebAssembly.Interop;

namespace FileReaderComponent
{
    public class FileReaderJsInterop
    { 

        private static ConcurrentDictionary<string, TaskCompletionSource<int>> readFileAsyncCalls =
            new ConcurrentDictionary<string, TaskCompletionSource<int>>();

        public static async Task<Stream> OpenFileStream(ElementRef elementReference, int index)
        {
            var length = long.Parse(await GetFileProperty(elementReference, index, "length"));
            return new InteropFileStream(await OpenRead(elementReference, index), length);
        }
        
        public static Task<int> GetFileCount(ElementRef elementReference)
        {
            return JSRuntime.Current.InvokeAsync<int>($"{nameof(FileReaderComponent)}.GetFileCount", elementReference);
        }

        public static Task<string> GetFileProperty(ElementRef elementReference, int index, string propertyName)
        {
            return JSRuntime.Current.InvokeAsync<string>($"{nameof(FileReaderComponent)}.GetFileProperty", elementReference, index, propertyName);
        }

        public static Task<string> GetFilePropertyByRef(int fileRef, string propertyName)
        {
            return JSRuntime.Current.InvokeAsync<string>($"{nameof(FileReaderComponent)}.FileStream.GetProperty", fileRef, propertyName);
        }

        private static Task<int> OpenRead(ElementRef elementReference, int fileIndex)
        {
            return JSRuntime.Current.InvokeAsync<int>($"{nameof(FileReaderComponent)}.FileStream.OpenRead", elementReference, fileIndex);
        }

        private static Task<bool> Dispose(int fileRef)
        {
            return JSRuntime.Current.InvokeAsync<bool>($"{nameof(FileReaderComponent)}.FileStream.Dispose", fileRef);
        }

        private static Task<int> ReadFileAsync(int fileRef, byte[] buffer, long position, int count, CancellationToken cancellationToken)
        {
            var taskCompletionSource = new TaskCompletionSource<int>();
            cancellationToken.Register(() => taskCompletionSource.TrySetCanceled());

            var callBackId = Guid.NewGuid().ToString("n");
            if (readFileAsyncCalls.TryAdd(callBackId, taskCompletionSource))
            {
                var startCallBack = ExtendedJSRuntime.Current.InvokeUnmarshalled<byte[], string, bool>(
                $"{nameof(FileReaderComponent)}.FileStream.ReadFileAsync",
                    buffer, Json.Serialize(new { position, count, callBackId, fileRef }));
                return taskCompletionSource.Task;
            }

            throw new InvalidOperationException("Guid Conflict, unable to register callback");
        }
        
        private static bool ReadFileAsyncCallback(string callBackId, string countInt)
        {
            if (!readFileAsyncCalls.TryRemove(callBackId, out TaskCompletionSource<int> taskCompletionSource))
            {
                return false;
            }

            taskCompletionSource.SetResult(int.Parse(countInt));
            return true;
        }

        private static bool ReadFileAsyncError(string callBackId, string exception)
        {
            if (!readFileAsyncCalls.TryRemove(callBackId, out TaskCompletionSource<int> taskCompletionSource))
            {
                return false;
            }

            taskCompletionSource.SetException(new BrowserFileReaderException(exception));
            return true;
        }
        private class InteropFileStream : Stream
        {
            private readonly int fileRef;
            private readonly long length;
            private bool isDisposed;
            private long _position;

            public InteropFileStream(int fileReference, long length)
            {
                this.fileRef = fileReference;
                this.length = new Lazy<long>(() =>
                    long.Parse(GetFilePropertyByRef(this.fileRef, "size")));
            }

            public override bool CanRead => ThrowIfDisposedOrReturn(true);

            public override bool CanSeek => ThrowIfDisposedOrReturn(true);

            public override bool CanWrite => ThrowIfDisposedOrReturn(false);

            public override long Length => ThrowIfDisposedOrReturn(() => length.Value);

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
                Console.WriteLine($"{nameof(InteropFileStream)}.{nameof(ReadAsync)}({nameof(buffer)}=byte[{buffer.Length}], {nameof(offset)}={offset}, {nameof(count)}={count})");
                var bytesRead = await ReadFileAsync(fileRef, buffer, Position + offset, count, cancellationToken);
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

            private T ThrowIfDisposedOrReturn<T>(Func<T> value)
            {
                ThrowIfDisposed();

                return value();
            }

            private T ThrowIfDisposedOrReturn<T>(T value)
            {
                ThrowIfDisposed();

                return value;
            }
        }
    }
    public class BrowserFileReaderException : Exception
    {
        public BrowserFileReaderException(string message):base(message)
        {
            Console.WriteLine($"{nameof(BrowserFileReaderException)}: {message}");
        }
    }
}
