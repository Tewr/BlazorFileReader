using Microsoft.JSInterop;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Tewr.Blazor.FileReader
{
#if NET5_0_OR_GREATER

    /// <summary>
    /// Represents an object url for a file.
    /// </summary>
    /// <remarks>https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL</remarks>
    public interface IObjectUrl : IAsyncDisposable
    {
        /// <summary>
        /// Returns the Object Url.
        /// </summary>
        string Url => ToString();
    }

    internal class ObjectUrl : IObjectUrl
    {
        private string objectUrlDomString;
        private readonly IJSRuntime jSRuntime;
        private readonly IJSObjectReference file;

        internal ObjectUrl(IJSRuntime jSRuntime, IJSObjectReference file)
        {
            this.jSRuntime = jSRuntime;
            this.file = file;
        }

        public async ValueTask InitAsync()
        {
            this.objectUrlDomString = await jSRuntime.InvokeAsync<string>("URL.createObjectURL", this.file);
        }

        public async ValueTask DisposeAsync()
        {
            await jSRuntime.InvokeVoidAsync("URL.revokeObjectURL", this.file);
            await file.DisposeAsync();
        }

        public override string ToString()
        {
            return this.objectUrlDomString;
        }
    }
#endif
}
