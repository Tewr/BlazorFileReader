using Microsoft.AspNetCore.Blazor.Hosting;

namespace Blazor.FileReader.Wasm.Demo
{
    public class Program
    {
        // Github sub-directory
        public static readonly string BasePath
#if GHPAGES
             = "/BlazorFileReader";
#else
            = "";
#endif

        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IWebAssemblyHostBuilder CreateHostBuilder(string[] args) =>
            BlazorWebAssemblyHost.CreateDefaultBuilder()
                .UseBlazorStartup<Startup>();
    }
}
