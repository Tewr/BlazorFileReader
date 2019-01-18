using Microsoft.AspNetCore.Blazor.Browser.Rendering;
using Microsoft.AspNetCore.Blazor.Browser.Services;
using Microsoft.Extensions.DependencyInjection;
using System;
using Blazor.FileReader;


namespace Blazor.FileReader.Demo
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

        static void Main(string[] args)
        {
            var serviceProvider = new BrowserServiceProvider(services =>
            {
                services.AddSingleton<IFileReaderService, FileReaderService>();
            });

            new BrowserRenderer(serviceProvider).AddComponent<App>("app");
        }
    }
}
