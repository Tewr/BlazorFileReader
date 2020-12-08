using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;

namespace Tewr.Blazor.FileReader
{
    public class PlatformConfig
    {
        private const string HubOptionsGenericFullTypeName 
            = "Microsoft.AspNetCore.SignalR.HubOptions`1, Microsoft.AspNetCore.SignalR.Core";

        private const string ComponentHubFullTypeName
            = "Microsoft.AspNetCore.Components.Server.ComponentHub, Microsoft.AspNetCore.Components.Server";

        private static bool? _isWasm;

        /// <summary>
        /// Returns true if the application is running on WASM.
        /// </summary>
        public static bool IsWasm => _isWasm ??=
            RuntimeInformation.IsOSPlatform(OSPlatform.Create("BROWSER")) ||
            RuntimeInformation.IsOSPlatform(OSPlatform.Create("WEBASSEMBLY"));

        /// <summary>
        /// Tries reading HubOptions&lt;ComponentHub&gt;.MaximumReceiveMessageSize using reflection.
        /// </summary>
        /// <param name="serviceProvider"></param>
        /// <param name="maximumReceiveMessageSize"></param>
        /// <returns><c>true</c> if the value could be sucessfully read.</returns>
        public static bool TryReadMaximumReceiveMessageSize(IServiceProvider serviceProvider, out long maximumReceiveMessageSize)
        {
            maximumReceiveMessageSize = -1;
            var hubOptionsGeneric = Type.GetType(HubOptionsGenericFullTypeName);
            if (hubOptionsGeneric == null)
            {
                System.Diagnostics.Trace.TraceWarning(
                    $"{typeof(PlatformConfig).FullName}.{nameof(TryReadMaximumReceiveMessageSize)}: " +
                    $"Unable to load type {HubOptionsGenericFullTypeName}");
                return false;
            }
            var componentHub = Type.GetType(ComponentHubFullTypeName);
            if (componentHub == null)
            {
                System.Diagnostics.Trace.TraceWarning(
                    $"{typeof(PlatformConfig).FullName}.{nameof(TryReadMaximumReceiveMessageSize)}: " +
                    $"Unable to load type {ComponentHubFullTypeName}");
                return false;
            }

            // Microsoft.Extensions.Options.IOptions<HubOptions<ComponentHub>>
            var fullGenericType = typeof(IOptions<>).MakeGenericType(hubOptionsGeneric.MakeGenericType(componentHub));
            var hubOptionsInstance = fullGenericType.GetProperty("Value")?.GetValue(serviceProvider.GetService(fullGenericType));

            if (hubOptionsInstance == null)
            {
                System.Diagnostics.Trace.TraceWarning(
                    $"{typeof(PlatformConfig).FullName}.{nameof(TryReadMaximumReceiveMessageSize)}: " +
                    $"Unable to load instance of HubOptions<ComponentHub> from {nameof(IServiceProvider)}");
                return false;
            }

            maximumReceiveMessageSize = (long)hubOptionsInstance.GetType().GetProperty("MaximumReceiveMessageSize")?.GetValue(hubOptionsInstance);

            return true;
        }
    }
}
