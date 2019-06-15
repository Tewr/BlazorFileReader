using Microsoft.Extensions.DependencyInjection;

namespace Blazor.FileReader
{
    public static class SetupExtension
    {
        /// <summary>
        /// Adds <see cref="IFileReaderService"/> as a scoped service
        /// to the specified <see cref="IServiceCollection"/>.
        /// </summary>
        /// <param name="services"></param>
        public static IServiceCollection AddFileReaderService(this IServiceCollection services)
        {
            services.AddScoped<IFileReaderService, FileReaderService>();
            return services;
        }
    }
}
