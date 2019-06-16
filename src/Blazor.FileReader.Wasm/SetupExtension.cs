using Microsoft.Extensions.DependencyInjection;
using Microsoft.JSInterop;
using Mono.WebAssembly.Interop;

namespace Blazor.FileReader
{
    public static class SetupExtension
    {
        /// <summary>
        /// Adds <see cref="IFileReaderService"/> and necessary dependencies as a singleton service
        /// to the specified <see cref="IServiceCollection"/>. Should only be used with Blazor WebAssembly Projects.
        /// </summary>
        /// <param name="services"></param>
        public static IServiceCollection AddFileReaderService(this IServiceCollection services)
        {
            services.AddSingleton<IInvokeUnmarshalled, WasmJsRuntimeInvokeProvider>();
            services.AddSingleton<IFileReaderService, FileReaderService>();
            return services;
        }

        /// <summary>
        /// Provides an optional bridge for unmarshalled calls
        /// </summary>
        private class WasmJsRuntimeInvokeProvider : IInvokeUnmarshalled
        {
            private IJSRuntime CurrentJSRuntime { get; }

            public WasmJsRuntimeInvokeProvider(IJSRuntime currentJSRuntime)
            {
                CurrentJSRuntime = currentJSRuntime;
            }

            private MonoWebAssemblyJSRuntime MonoWebAssemblyJSRuntime => 
                CurrentJSRuntime as MonoWebAssemblyJSRuntime;
            public TRes InvokeUnmarshalled<T1, T2, TRes>(string identifier, T1 arg1, T2 arg2) =>
                MonoWebAssemblyJSRuntime.InvokeUnmarshalled<T1, T2, TRes>(identifier, arg1, arg2);
        }
    }
}
