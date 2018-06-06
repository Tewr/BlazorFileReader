using System;
using Microsoft.AspNetCore.Blazor.Browser.Interop;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using System.IO;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Blazor;
using System.Collections.Generic;
using System.Threading;
using System.Diagnostics.Contracts;
using System.Text;

namespace FileReaderComponent
{
    public class FileReaderJsInterop
    { 

        private static ConcurrentDictionary<string, TaskCompletionSource<int>> readFileAsyncCalls =
            new ConcurrentDictionary<string, TaskCompletionSource<int>>();

        public static Stream OpenFileStream(ElementRef elementReference, int index)
        {
            return new InteropFileStream(OpenRead(elementReference, index));
        }
        
        public static int GetFileCount(ElementRef elementReference)
        {
            return RegisteredFunction.Invoke<int>($"{nameof(FileReaderComponent)}.GetFileCount", elementReference);
        }

        public static string GetFileProperty(ElementRef elementReference, int index, string propertyName)
        {
            return RegisteredFunction.Invoke<string>($"{nameof(FileReaderComponent)}.GetFileProperty", elementReference, index, propertyName);
        }

        public static string GetFilePropertyByRef(int fileRef, string propertyName)
        {
            return RegisteredFunction.Invoke<string>($"{nameof(FileReaderComponent)}.FileStream.GetProperty", fileRef, propertyName);
        }

        private static int OpenRead(ElementRef elementReference, int fileIndex)
        {
            return RegisteredFunction.Invoke<int>($"{nameof(FileReaderComponent)}.FileStream.OpenRead", elementReference, fileIndex);
        }

        private static bool Dispose(int fileRef)
        {
            return RegisteredFunction.Invoke<bool>($"{nameof(FileReaderComponent)}.FileStream.Dispose", fileRef);
        }

        private static Task<int> ReadFileAsync(int fileRef, byte[] buffer, long position, int count, CancellationToken cancellationToken)
        {
            var taskCompletionSource = new TaskCompletionSource<int>();
            cancellationToken.Register(() => taskCompletionSource.TrySetCanceled());

            var callBackId = Guid.NewGuid().ToString("n");
            if (readFileAsyncCalls.TryAdd(callBackId, taskCompletionSource))
            {
                var startCallBack = RegisteredFunction.InvokeUnmarshalled<byte[], string, bool>(
                $"{nameof(FileReaderComponent)}.FileStream.ReadFileAsync",
                    buffer, JsonUtil.Serialize(new { position, count, callBackId, fileRef }));
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
            private readonly Lazy<long> length;
            private bool isDisposed;

            public InteropFileStream(int fileReference)
            {
                this.fileRef = fileReference;
                this.length = new Lazy<long>(() => 
                    long.Parse(GetFilePropertyByRef(this.fileRef, "size")));
            }

            public override bool CanRead => true;

            public override bool CanSeek => true;

            public override bool CanWrite => false;

            public override long Length => length.Value;

            public override long Position { get; set; }

            public override void Flush()
            {
            }

            public override async Task<int> ReadAsync(byte[] buffer, int offset, int count, CancellationToken cancellationToken)
            {   
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
        }



        private class InMemoryFileStream : Stream
        {
            readonly Stream innerStream;
            readonly IDisposable[] toDispose;
            bool isDisposed;

            public InMemoryFileStream(Stream innerStream, params IDisposable[] toDispose)
            {
                this.innerStream = innerStream;
                this.toDispose = toDispose;
            }

            public static Stream FromBase64String(string base64ASCIIString)
            {
                MemoryStream memoryStream = new MemoryStream();
                using (var writer = new StreamWriter(memoryStream, System.Text.Encoding.ASCII, 512, true))
                {
                    writer.Write(base64ASCIIString);
                }
                memoryStream.Position = 0;
                ICryptoTransform base64 = new FromBase64Transform();
                CryptoStream cryptoStream = new CryptoStream(memoryStream, base64, CryptoStreamMode.Read);
                
                return new InMemoryFileStream(cryptoStream, memoryStream, base64, cryptoStream);
            }

            public override bool CanRead => ThrowIfDisposedOrReturn(() => this.innerStream.CanRead);

            public override bool CanSeek => ThrowIfDisposedOrReturn(() => this.innerStream.CanSeek);

            public override bool CanWrite => ThrowIfDisposedOrReturn(() => false);

            public override long Length => ThrowIfDisposedOrReturn(() => this.innerStream.Length);

            public override long Position {
                get => ThrowIfDisposedOrReturn(()=> this.innerStream.Position);
                set => ThrowIfDisposedOrReturn(() => this.innerStream.Position = value);
            }

            public override void Flush()
                => ThrowIfDisposedOrDo(() => this.innerStream.Flush());
            
            
            public override int Read(byte[] buffer, int offset, int count)
                => ThrowIfDisposedOrReturn(() => this.innerStream.Read(buffer, offset, count));

            public override long Seek(long offset, SeekOrigin origin)
               => ThrowIfDisposedOrReturn(() => this.innerStream.Seek(offset, origin));

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
                if (this.isDisposed)
                {
                    return;
                }

                this.isDisposed = true;
                if (this.toDispose != null)
                {
                    foreach (var item in this.toDispose)
                    {
                        item.Dispose();
                    }
                }
            }

            private void ThrowIfDisposed()
            {
                if (this.isDisposed)
                {
                    throw new ObjectDisposedException(nameof(InMemoryFileStream));
                }
            }

            private void ThrowIfDisposedOrDo(Action value)
            {
                ThrowIfDisposed();
                value();
            }

            private T ThrowIfDisposedOrReturn<T>(Func<T> value)
            {
                ThrowIfDisposed();

                return value();
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
