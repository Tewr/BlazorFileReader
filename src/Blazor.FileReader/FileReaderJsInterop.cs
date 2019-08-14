﻿using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Blazor.FileReader
{
    public partial class FileReaderJsInterop
    {
        private static readonly IReadOnlyDictionary<string, string> escapeScriptTextReplacements =
            new Dictionary<string, string> { { @"\", @"\\" }, { "\r", @"\r" }, { "\n", @"\n" }, { "'", @"\'" }, { "\"", @"\""" } };
        private readonly bool _needsInitialization = false;
        private readonly IFileReaderServiceOptions _options;

        private static readonly object _bufferIdLock = new object();
        private static readonly IDictionary<int, byte[]> buffers = new Dictionary<int, byte[]>();
        private static int _nextBufferId = 0;

        internal IJSRuntime CurrentJSRuntime { get; }

        public FileReaderJsInterop(IJSRuntime jsRuntime, IFileReaderServiceOptions options)
        {
            CurrentJSRuntime = jsRuntime;
            _options = options;
            _needsInitialization = options.InitializeOnFirstCall;
        }

        public async Task<bool> RegisterDropEvents(ElementReference elementReference)
        {
            await EnsureInitializedAsync();
            return await CurrentJSRuntime.InvokeAsync<bool>($"FileReaderComponent.RegisterDropEvents", elementReference);
        }

        public async Task<bool> UnregisterDropEvents(ElementReference elementReference)
        {
            await EnsureInitializedAsync();
            return await CurrentJSRuntime.InvokeAsync<bool>($"FileReaderComponent.UnregisterDropEvents", elementReference);
        }

        public async Task<Stream> OpenFileStream(ElementReference elementReference, int index)
        {
            var fileInfo = await GetFileInfoFromElement(elementReference, index);
            return new InteropFileStream(await OpenReadAsync(elementReference, index), fileInfo.Size, this);
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

        public async Task<FileInfo> GetFileInfoFromElement(ElementReference elementReference, int index)
        {
            return await CurrentJSRuntime.InvokeAsync<FileInfo>($"FileReaderComponent.GetFileInfoFromElement", elementReference, index);
        }

        public async Task EnsureInitializedAsync()
        {
            if (!_needsInitialization)
            {
                return;
            }

            await Initialize();
        }

        private async Task<int> OpenReadAsync(ElementReference elementReference, int fileIndex)
        {
            return (int)await CurrentJSRuntime.InvokeAsync<long>($"FileReaderComponent.OpenRead", elementReference, fileIndex);
        }

        private Task<bool> DisposeStream(int fileRef)
        {
            return CurrentJSRuntime.InvokeAsync<bool>($"FileReaderComponent.Dispose", fileRef);
        }

        private async Task<int> ReadFileAsync(int fileRef, byte[] buffer, long position, int count, CancellationToken cancellationToken)
        {
            if (this._options.UseWasmSharedBuffer)
            {
                return await ReadFileUnmarshalledAsync(fileRef, buffer, position, count, cancellationToken);
            }

            return await ReadFileMarshalledAsync(fileRef, buffer, position, count, cancellationToken);
        }

        private async Task<int> ReadFileMarshalledAsync(
            int fileRef, byte[] buffer, long position, int count,
            CancellationToken cancellationToken)
        {
            var data = await CurrentJSRuntime.InvokeAsync<string>(
                $"FileReaderComponent.ReadFileMarshalledAsync",
                new { position, count, fileRef });
            
            var bytesRead = 0;
            if (!string.IsNullOrEmpty(data))
            {
                var byteResult = Convert.FromBase64String(data);
                bytesRead = byteResult.Length;
                Array.Copy(byteResult, buffer, bytesRead);
            }

            return bytesRead;
        }

        private async Task<int> ReadFileUnmarshalledAsync(
            int fileRef, byte[] buffer, long position, int count,
            CancellationToken cancellationToken)
        {
            var callBackId = 0;
            lock (_bufferIdLock)
            {
                callBackId = _nextBufferId++;
                buffers.Add(callBackId, buffer);
            }
            var bytesRead = await CurrentJSRuntime.InvokeAsync<long>(
                $"FileReaderComponent.ReadFileUnmarshalledAsync",
                new { position, count, fileRef, callBackId });

            lock (_bufferIdLock)
            {
                buffers.Remove(callBackId);
            }

            return (int)bytesRead;
        }

        private async Task Initialize()
        {
            var isLoaded = await CurrentJSRuntime.InvokeAsync<bool>("eval", "(function() { return !!window.FileReaderComponent })()");
            if (isLoaded)
            {
                return;
            }

            string scriptContent;
            using (var stream = this.GetType().Assembly.GetManifestResourceStream("blazor:js:FileReaderComponent.js"))
            {
                using (var streamReader = new StreamReader(stream))
                {
                    scriptContent = await streamReader.ReadToEndAsync();
                }
            }

            // Load the script
            await ExecuteRawScriptAsync<object>(scriptContent);
        }

        private async Task<T> ExecuteRawScriptAsync<T>(string scriptContent)
        {
            scriptContent = escapeScriptTextReplacements.Aggregate(scriptContent, (r, pair) => r.Replace(pair.Key, pair.Value));
            var blob = $"URL.createObjectURL(new Blob([\"{scriptContent}\"],{{ \"type\": \"text/javascript\"}}))";
            var bootStrapScript = $"(function(){{var d = document; var s = d.createElement('script'); s.src={blob}; d.head.appendChild(s); d.head.removeChild(s);}})();";
            return await CurrentJSRuntime.InvokeAsync<T>("eval", bootStrapScript);
        }

        /// <remarks>
        /// While it may be tempting to remove this method because it appears to be unused,
        /// this method is referenced by client code and must persist.
        /// </remarks>
#pragma warning disable IDE0051 // Remove unused private members
        private static byte[] GetStreamBuffer(string bufferId) => buffers[int.Parse(bufferId)];
#pragma warning restore IDE0051 // Remove unused private members
    }
}
