using Microsoft.AspNetCore.Components.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.JSInterop;
using Mono.WebAssembly.Interop;

namespace Blazor.FileReader.Wasm.Demo
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IInvokeUnmarshalled, WasmJsRuntimeInvokeProvider>();
            services.AddSingleton<IFileReaderService, FileReaderService>();
        }

        /// <summary>
        /// Provides an optional bridge for unmarshalled calls
        /// </summary>
        private class WasmJsRuntimeInvokeProvider : IInvokeUnmarshalled
        {
            private static MonoWebAssemblyJSRuntime MonoWebAssemblyJSRuntime = 
                JSRuntime.Current as MonoWebAssemblyJSRuntime;

            public static bool IsAvailable { get; } = 
                MonoWebAssemblyJSRuntime != null;

            public TRes InvokeUnmarshalled<T1, T2, TRes>(string identifier, T1 arg1, T2 arg2)
            {
                return MonoWebAssemblyJSRuntime.InvokeUnmarshalled<T1, T2, TRes>(identifier, arg1, arg2);
            }
        }

        public void Configure(IComponentsApplicationBuilder app)
        {
            app.AddComponent<App>("app");
        }
    }
}
