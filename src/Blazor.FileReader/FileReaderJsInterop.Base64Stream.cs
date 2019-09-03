﻿using System;
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

            public Base64Stream(int fileReference, long length, FileReaderJsInterop fileReaderJsInterop)
            {
                this.fileRef = fileReference;
                this.length = length;
                this.fileReaderJsInterop = fileReaderJsInterop;
            }

            public long Position
            {
                get => ThrowIfDisposedOrReturn(position);
                set
                {
                    ThrowIfDisposed();
                    position = value;
                }
            }

            public long Length => ThrowIfDisposedOrReturn(length);

            public void Dispose()
            {
                if (!this.isDisposed)
                {
                    this.fileReaderJsInterop.DisposeStream(fileRef);
                    this.isDisposed = true;
                }
            }

            public async Task<string> ReadAsync(int offset, int count, CancellationToken cancellationToken)
            {
                ThrowIfDisposed();
                var result = await this.fileReaderJsInterop.ReadFileMarshalledBase64Async(this.fileRef, Position + offset, count, cancellationToken);
                Position += offset + count;
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
