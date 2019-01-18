using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using System.IO;
using Microsoft.AspNetCore.Blazor;
using System.Threading;
using System.Diagnostics.Contracts;
using Microsoft.JSInterop;

namespace Blazor.FileReader
{
    public class FileReaderJsInterop
    {
        private class TaskList<T> : ConcurrentDictionary<long, TaskCompletionSource<T>> {}

        private static long nextPendingTaskId = 1; // Start at 1 because zero signals "no response needed"
        private static readonly TaskList<long> readFileAsyncCalls =
            new TaskList<long>();

        private static readonly TaskList<ReadFileMarshalledAsyncCallbackParams> readFileMarshalledAsyncCalls =
            new TaskList<ReadFileMarshalledAsyncCallbackParams>();

        public static async Task<Stream> OpenFileStream(ElementRef elementReference, int index)
        {
            var fileInfo = await GetFileInfoFromElement(elementReference, index);
            return new InteropFileStream(await OpenReadAsync(elementReference, index), fileInfo.Size);
        }
        
        public static async Task<int> GetFileCount(ElementRef elementReference)
        {
            return (int)await JSRuntime.Current.InvokeAsync<long>($"FileReaderComponent.GetFileCount", elementReference);
        }

        public static async Task<FileInfo> GetFileInfoFromElement(ElementRef elementReference, int index)
        {
            return Json.Deserialize<FileInfo>(await JSRuntime.Current.InvokeAsync<string>($"FileReaderComponent.GetFileInfoFromElement", elementReference, index));
        }

        public static async Task<FileInfo> GetFileInfoFromReference(int fileRef)
        {
            return Json.Deserialize<FileInfo>(await JSRuntime.Current.InvokeAsync<string>($"FileReaderComponent.GetFileInfoFromReference", fileRef));
        }

        private static async Task<int> OpenReadAsync(ElementRef elementReference, int fileIndex)
        {
            return (int)await JSRuntime.Current.InvokeAsync<long>($"FileReaderComponent.OpenRead", elementReference, fileIndex);
        }

        private static Task<bool> Dispose(int fileRef)
        {
            return JSRuntime.Current.InvokeAsync<bool>($"FileReaderComponent.Dispose", fileRef);
        }

        private static async Task<int> ReadFileAsync(int fileRef, byte[] buffer, long position, int count, CancellationToken cancellationToken)
        {

            if (ExtendedJSRuntime.IsAvailable)
            {
                return await ReadFileUnmarshalledAsync(fileRef, buffer, position, count, cancellationToken);
            }
            else
            {
                return await ReadFileMarshalledAsync(fileRef, buffer, position, count, 
                    cancellationToken);
            }
        }

        private static async Task<int> ReadFileUnmarshalledAsync(
            int fileRef, byte[] buffer, long position, int count,
            CancellationToken cancellationToken)
        {
            var taskCompletionSource = new TaskCompletionSource<long>();
            cancellationToken.Register(() => taskCompletionSource.TrySetCanceled());
            var callBackId = Interlocked.Increment(ref nextPendingTaskId);
            readFileAsyncCalls[callBackId] = taskCompletionSource;

            var startCallBack = ExtendedJSRuntime.Current.InvokeUnmarshalled<byte[], string, bool>(
                $"FileReaderComponent.ReadFileUnmarshalledAsync",
                buffer, Json.Serialize(new {position, count, callBackId, fileRef}));
            
            var longResult = await taskCompletionSource.Task;
            
            return (int) longResult;
        }

        private static async Task<int> ReadFileMarshalledAsync(
            int fileRef, byte[] buffer, long position, int count,
            CancellationToken cancellationToken)
        {
            var taskCompletionSource = new TaskCompletionSource<ReadFileMarshalledAsyncCallbackParams>();
            cancellationToken.Register(() => taskCompletionSource.TrySetCanceled());
            var callBackId = Interlocked.Increment(ref nextPendingTaskId);
            readFileMarshalledAsyncCalls[callBackId] = taskCompletionSource;
            var startCallBack = JSRuntime.Current.InvokeAsync<long>(
                $"FileReaderComponent.ReadFileToBufferAsync",
                Json.Serialize(new { position, count, callBackId, fileRef }));

            var longResult = await taskCompletionSource.Task;

            Array.Copy(Convert.FromBase64String(longResult.Data), buffer, longResult.BytesRead);

            return (int)longResult.BytesRead;
        }

        public class ReadFileAsyncCallbackParams
        {
            public long CallBackId { get; set; }
            public long BytesRead { get; set; }
        }

        public class ReadFileMarshalledAsyncCallbackParams
        {
            public long CallBackId { get; set; }

            public long BytesRead { get; set; }

            public string Data { get; set; }
        }

        private static bool ReadFileAsyncCallback(string readFileAsyncCallback)
        {
            var args = Json.Deserialize<ReadFileAsyncCallbackParams>(readFileAsyncCallback);
            if (!readFileAsyncCalls.TryRemove(args.CallBackId, out TaskCompletionSource<long> taskCompletionSource))
            {
                return false;
            }

            taskCompletionSource.SetResult(args.BytesRead);
            return true;
        }

        private static bool ReadFileMarshalledAsyncCallback(string readFileAsyncCallback)
        {
            var args = Json.Deserialize<ReadFileMarshalledAsyncCallbackParams>(readFileAsyncCallback);
            if (!readFileMarshalledAsyncCalls.TryRemove(args.CallBackId, out TaskCompletionSource<ReadFileMarshalledAsyncCallbackParams> taskCompletionSource))
            {
                return false;
            }
            
            taskCompletionSource.SetResult(args);
            return true;
        }

        public class ReadFileAsyncErrorParams
        {
            public long CallBackId { get; set; }
            public string Exception { get; set; }
        }

        private static bool ReadFileAsyncError(string readFileAsyncError)
        {
            var args = Json.Deserialize<ReadFileAsyncErrorParams>(readFileAsyncError);
            //Console.WriteLine($"ReadFileAsyncCallback({readFileAsyncError})");
            
            if (!readFileAsyncCalls.TryRemove(args.CallBackId, out TaskCompletionSource<long> taskCompletionSource))
            {
                return false;
            }

            taskCompletionSource.SetException(new BrowserFileReaderException(args.Exception));
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
                this.length = length;
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
                var bytesRead = await FileReaderJsInterop.ReadFileAsync(fileRef, buffer, Position + offset, count, cancellationToken);
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
    public class BrowserFileReaderException : Exception
    {
        public BrowserFileReaderException(string message):base(message)
        {
            //Console.WriteLine($"{nameof(BrowserFileReaderException)}: {message}");
        }
    }
}
