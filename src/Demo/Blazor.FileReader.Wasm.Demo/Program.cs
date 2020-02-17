using Microsoft.AspNetCore.Blazor.Hosting;
using System.Threading.Tasks;

namespace Blazor.FileReader.Wasm.Demo
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebAssemblyHostBuilder.CreateDefault(args);
            builder.RootComponents.Add<App>("app");

            builder.Services.AddFileReaderService(options => options.UseWasmSharedBuffer = true);
            
            await builder.Build().RunAsync();
        }
    }
}
