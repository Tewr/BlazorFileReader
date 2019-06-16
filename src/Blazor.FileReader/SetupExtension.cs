using Microsoft.Extensions.DependencyInjection;
using System;

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
            services.AddSingleton<IFileReaderServiceOptions, FileReaderServiceOptions>();
            services.AddScoped<IFileReaderService, FileReaderService>();
            return services;
        }

        /// <summary>
        /// Adds <see cref="IFileReaderService"/> as a scoped service
        /// to the specified <see cref="IServiceCollection"/> with the specifed <paramref name="setOptions"/>
        /// </summary>
        /// <param name="services"></param>
        public static IServiceCollection AddFileReaderService(this IServiceCollection services, Action<IFileReaderServiceOptions> setOptions)
        {
            if (setOptions is null)
            {
                throw new ArgumentNullException(nameof(setOptions));
            }

            services.AddSingleton<IFileReaderServiceOptions, FileReaderServiceOptions>(_sp => {
                var options = new FileReaderServiceOptions();
                setOptions(options);
                return options;
            });
            services.AddScoped<IFileReaderService, FileReaderService>();
            return services;
        }
    }
}
