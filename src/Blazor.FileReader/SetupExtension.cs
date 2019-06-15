using Microsoft.Extensions.DependencyInjection;

namespace Blazor.FileReader
{
    public static class SetupExtension
    {
        /// <summary>
        /// Adds <see cref="IFileReaderService"/> as a singleton service
        /// to the specified <see cref="IServiceCollection"/>.
        /// </summary>
        /// <param name="services"></param>
        public static IServiceCollection AddFileReaderService(this IServiceCollection services)
        {
            services.AddSingleton<IFileReaderService, FileReaderService>();
            return services;
        }
    }
}
