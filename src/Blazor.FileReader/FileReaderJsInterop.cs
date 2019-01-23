using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using System.IO;
using Microsoft.AspNetCore.Blazor;
using System.Threading;
using Microsoft.JSInterop;

namespace Blazor.FileReader
{
    public partial class FileReaderJsInterop
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
                $"FileReaderComponent.ReadFileMarshalledAsync",
                new { position, count, callBackId, fileRef });

            var longResult = await taskCompletionSource.Task;
            var bytesRead = 0;
            if (!string.IsNullOrEmpty(longResult.Data?.Trim()))
            {
                var byteResult = Convert.FromBase64String(longResult.Data);
                bytesRead = byteResult.Length;
                Array.Copy(byteResult, buffer, bytesRead);
            }

            return bytesRead;
        }

        [JSInvokable(nameof(ReadFileAsyncCallback))]
        public static bool ReadFileAsyncCallback(ReadFileAsyncCallbackParams args)
        {
            if (!readFileAsyncCalls.TryRemove(args.CallBackId, out TaskCompletionSource<long> taskCompletionSource))
            {
                return false;
            }

            taskCompletionSource.SetResult(args.BytesRead);
            return true;
        }

        [JSInvokable(nameof(ReadFileMarshalledAsyncCallback))]
        public static bool ReadFileMarshalledAsyncCallback(ReadFileMarshalledAsyncCallbackParams args)
        {

            if (!readFileMarshalledAsyncCalls.TryRemove(args.CallBackId, out TaskCompletionSource<ReadFileMarshalledAsyncCallbackParams> taskCompletionSource))
            {
                return false;
            }
            
            taskCompletionSource.SetResult(args);
            return true;
        }

        [JSInvokable(nameof(ReadFileAsyncError))]
        public static bool ReadFileAsyncError(ReadFileAsyncErrorParams args) { 
            if (!readFileAsyncCalls.TryRemove(args.CallBackId, out TaskCompletionSource<long> taskCompletionSource))
            {
                return false;
            }

            taskCompletionSource.SetException(new BrowserFileReaderException(args.Exception));
            return true;
        }
    }
}
