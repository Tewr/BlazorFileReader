using Microsoft.AspNetCore.Blazor.Browser.Rendering;
using Microsoft.AspNetCore.Blazor.Browser.Services;
using Microsoft.Extensions.DependencyInjection;
using System;
using FileReaderComponent;

namespace BlazorFileReader
{
    public class Program
    {
        // Github sub-directory
        public static readonly string BasePath
#if RELEASE
             = "/BlazorFileReader";
#else
            = "";
#endif

        static void Main(string[] args)
        {
            var serviceProvider = new BrowserServiceProvider(services =>
            {
                services.AddSingleton<IFileReaderService>(sp => new FileReaderService());
            });

            new BrowserRenderer(serviceProvider).AddComponent<App>("app");
        }
    }
}
