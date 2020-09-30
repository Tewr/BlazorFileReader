using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Tewr.Blazor.FileReader
{
    public partial class FileReaderJsInterop
    {
        private static readonly IReadOnlyDictionary<string, string> escapeScriptTextReplacements =
            new Dictionary<string, string> { { @"\", @"\\" }, { "\r", @"\r" }, { "\n", @"\n" }, { "'", @"\'" }, { "\"", @"\""" } };
        private readonly bool _needsInitialization = false;
        private readonly FileReaderServiceOptions _options;
        private static long _readFileUnmarshalledCallIdSource;
        private static readonly Dictionary<long, TaskCompletionSource<int>> _readFileUnmarshalledCalls
            = new Dictionary<long, TaskCompletionSource<int>>();

        internal IJSRuntime CurrentJSRuntime;
        internal IJSUnmarshalledRuntime UnmarshalledRuntime;

        internal FileReaderJsInterop(IJSRuntime jsRuntime, FileReaderServiceOptions options)
        {
            CurrentJSRuntime = jsRuntime;
            _options = options;
            _needsInitialization = options.InitializeOnFirstCall;
        }

        internal void Initialize()
        {
            if (_options.UseWasmSharedBuffer)
            {
                UnmarshalledRuntime = CurrentJSRuntime as IJSUnmarshalledRuntime;
                if (UnmarshalledRuntime is null)
                {
                    throw new PlatformNotSupportedException($"{nameof(_options.UseWasmSharedBuffer)}=true is not supported on this platform: Unable to acquire {nameof(IJSUnmarshalledRuntime)}.");
                }
            }
        }

        public async Task<bool> RegisterDropEvents(ElementReference elementReference, bool additive)
        {
            await EnsureInitializedAsync();
            return await CurrentJSRuntime.InvokeAsync<bool>($"FileReaderComponent.RegisterDropEvents", elementReference, additive);
        }

        public async Task<bool> UnregisterDropEvents(ElementReference elementReference)
        {
            await EnsureInitializedAsync();
            return await CurrentJSRuntime.InvokeAsync<bool>($"FileReaderComponent.UnregisterDropEvents", elementReference);
        }

        public async Task<AsyncDisposableStream> OpenFileStream(ElementReference elementReference, int index, IFileInfo fileInfo)
        {
            return new InteropFileStream(await OpenReadAsync(elementReference, index), fileInfo, this);
        }

        public async Task<IBase64Stream> OpenBase64Stream(ElementReference elementReference, int index, IFileInfo fileInfo)
        {
            return new Base64Stream(await OpenReadAsync(elementReference, index), fileInfo, this);
        }

        public async Task<int> GetFileCount(ElementReference elementReference)
        {
            await EnsureInitializedAsync();
            return (int)await CurrentJSRuntime.InvokeAsync<long>($"FileReaderComponent.GetFileCount", elementReference);
        }

        public async Task<int> ClearValue(ElementReference elementReference)
        {
            await EnsureInitializedAsync();
            return (int)await CurrentJSRuntime.InvokeAsync<long>($"FileReaderComponent.ClearValue", elementReference);
        }

        public async Task<IFileInfo> GetFileInfoFromElement(ElementReference elementReference, int index)
        {
            return await CurrentJSRuntime.InvokeAsync<FileInfo>($"FileReaderComponent.GetFileInfoFromElement", elementReference, index);
        }

        public async Task EnsureInitializedAsync(bool force = false)
        {
            if (!_needsInitialization && !force)
            {
                return;
            }

            await InitializeAsync();
        }

        private async Task<int> OpenReadAsync(ElementReference elementReference, int fileIndex)
        {
            return (int)await CurrentJSRuntime.InvokeAsync<long>($"FileReaderComponent.OpenRead", elementReference, fileIndex, _options.UseWasmSharedBuffer);
        }

        private async Task<bool> DisposeStream(int fileRef)
        {
            return await CurrentJSRuntime.InvokeAsync<bool>($"FileReaderComponent.Dispose", fileRef);
        }

        private async Task<int> ReadFileAsync(int fileRef, byte[] buffer, long position, long bufferOffset, int count, CancellationToken cancellationToken)
        {
            if (this._options.UseWasmSharedBuffer)
            {
                return await ReadFileUnmarshalledAsync(fileRef, buffer, position, bufferOffset, count, cancellationToken);
            }

            return await ReadFileMarshalledAsync(fileRef, buffer, position, bufferOffset, count, cancellationToken);
        }

        private async Task<int> ReadFileMarshalledAsync(
            int fileRef, byte[] buffer, long position, long bufferOffset, int count,
            CancellationToken cancellationToken)
        {
            // At 60% we should be pretty safe to acccount for metadata size.
            // Theoretically, MaximumRecieveMessageSize could be larger than int32, so this is accounted for.
            var MaxCallSize = (int)Math.Min(int.MaxValue, (long)Math.Floor(_options.MaximumRecieveMessageSize * 0.6));
            string result;

            if (_options.UseBufferChunking && count > MaxCallSize)
            {
                var tasks = new Queue<Task<byte[]>>();
                var chunkPosition = position;
                var chunkCount = count;
                while (chunkCount > 0)
                {
                    var smallChunkSize = Math.Min(chunkCount, MaxCallSize);
                    var taskChunkPos = chunkPosition;
                    tasks.Enqueue(Task.Run(async () =>
                    {
                         var chunk = await ReadFileMarshalledBase64Async(fileRef, taskChunkPos, smallChunkSize, cancellationToken);
                         return string.IsNullOrEmpty(chunk) ? new byte[0]: Convert.FromBase64String(chunk);
                    }, cancellationToken));
                    chunkPosition += smallChunkSize;
                    chunkCount -= smallChunkSize;
                }
                
                var bytesRead = 0;
                while(tasks.Any())
                {
                    // Start waiting for the first task, it can be copied to consumer buffer even if the others are not done
                    var array = await tasks.Dequeue();
                    Array.Copy(array, 0, buffer, bufferOffset + bytesRead, array.Length);
                    bytesRead += array.Length;
                }

                return bytesRead;
            }
            else
            {
                result = await ReadFileMarshalledBase64Async(fileRef, position, count, cancellationToken);
                var bytesRead = 0;
                if (!string.IsNullOrEmpty(result))
                {
                    var byteResult = Convert.FromBase64String(result);
                    bytesRead = byteResult.Length;
                    Array.Copy(byteResult, 0, buffer, bufferOffset, bytesRead);
                }
                return bytesRead;
            }
        }

        private async Task<string> ReadFileMarshalledBase64Async(
            int fileRef, long position, int count,
            CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            var data = await CurrentJSRuntime.InvokeAsync<string>(
                $"FileReaderComponent.ReadFileMarshalledAsync", cancellationToken,
                new { position, count, fileRef });

            return data;

        }

        private async Task<int> ReadFileUnmarshalledAsync(
            int fileRef, byte[] buffer, long position, long bufferOffset, int count,
            CancellationToken cancellationToken)
        {
            var taskCompletionSource = new TaskCompletionSource<int>();
            var id = ++_readFileUnmarshalledCallIdSource;
            _readFileUnmarshalledCalls[id] = taskCompletionSource;
            cancellationToken.Register(() => taskCompletionSource.TrySetCanceled());

            // Buffer is not allocated here, 
            UnmarshalledRuntime.InvokeUnmarshalled<ReadFileParams, int>(
                $"FileReaderComponent.ReadFileUnmarshalledAsync",
                new ReadFileParams { 
                    BufferOffset = bufferOffset, 
                    Count = count, 
                    FileRef = fileRef,
                    Position = position,
                    TaskId = id
                });

            // as the corresponding TypeArray might not survive the heap charge of the following statement
            await taskCompletionSource.Task;
         
            // It is safely filled up here instead
            var bytesRead = UnmarshalledRuntime.InvokeUnmarshalled<BufferParams, int>(
                $"FileReaderComponent.FillBufferUnmarshalled",
                new BufferParams
                {
                    TaskId = id,
                    Buffer = buffer
                });
            
            return bytesRead;
        }

        /// <summary>
        /// Called from Js
        /// </summary>
        /// <param name="taskId"></param>
        public static void EndTask(long taskId)
        {
            if (!_readFileUnmarshalledCalls.TryGetValue(taskId, out var taskCompletionSource))
            {
                Console.Error.WriteLine($"{nameof(EndTask)}: Unknown {nameof(taskId)} '{taskId}'");
                return;
            }

            _readFileUnmarshalledCalls.Remove(taskId);
            taskCompletionSource.SetResult(0);
        }

        [JSInvokable(nameof(EndReadFileUnmarshalledAsyncError))]
        public static void EndReadFileUnmarshalledAsyncError(long taskId, string error)
        {
            if (!_readFileUnmarshalledCalls.TryGetValue(taskId, out var taskCompletionSource))
            {
                Console.Error.WriteLine($"{nameof(EndReadFileUnmarshalledAsyncError)}: Unknown {nameof(taskId)} '{taskId}'");
                return;
            }

            _readFileUnmarshalledCalls.Remove(taskId);
            taskCompletionSource.SetException(new BrowserFileReaderException(error));
        }

        private async Task InitializeAsync()
        {
            var isLoaded = await IsLoaded();
            if (isLoaded)
            {
                return;
            }

            string scriptContent;
            using (var stream = this.GetType().Assembly.GetManifestResourceStream("blazor:js:FileReaderComponent.js"))
            {
                using var streamReader = new StreamReader(stream);
                scriptContent = await streamReader.ReadToEndAsync();
            }

            // Load the script
            await ExecuteRawScriptAsync<object>(scriptContent);
            var loaderLoopBreaker = 0;
            while (!await IsLoaded())
            {
                loaderLoopBreaker++;
                await Task.Delay(100);

                // Fail after 3s not to block and hide any other possible error
                if (loaderLoopBreaker > 25)
                {
                    throw new InvalidOperationException("Unable to initialize FileReaderComponent script");
                }
            }
        }

        private async Task<bool> IsLoaded()
        {
            return await CurrentJSRuntime.InvokeAsync<bool>("window.hasOwnProperty", "FileReaderComponent");
        }

        private async Task<T> ExecuteRawScriptAsync<T>(string scriptContent)
        {
            scriptContent = escapeScriptTextReplacements.Aggregate(scriptContent, (r, pair) => r.Replace(pair.Key, pair.Value));
            var blob = $"URL.createObjectURL(new Blob([\"{scriptContent}\"],{{ \"type\": \"text/javascript\"}}))";
            var bootStrapScript = $"(function(){{var d = document; var s = d.createElement('script'); s.src={blob}; s.async=false; d.head.appendChild(s); d.head.removeChild(s);}})();";
            return await CurrentJSRuntime.InvokeAsync<T>("eval", bootStrapScript);
        }
    }
}
