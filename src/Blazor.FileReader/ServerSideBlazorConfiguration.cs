using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;

namespace Tewr.Blazor.FileReader
{
    public class ServerSideBlazorConfiguration
    {
        /// <summary>
        /// Tries reading HubOptions&lt;ComponentHub&gt;.MaximumReceiveMessageSize using reflection.
        /// </summary>
        /// <param name="serviceProvider"></param>
        /// <param name="maximumReceiveMessageSize"></param>
        /// <returns><c>true</c> if the value could be sucessfully read.</returns>
        public static bool TryReadMaximumReceiveMessageSize(IServiceProvider serviceProvider, out long maximumReceiveMessageSize)
        {
            maximumReceiveMessageSize = -1;
            var hubOptionsGeneric = Type.GetType("Microsoft.AspNetCore.SignalR.HubOptions`1, Microsoft.AspNetCore.SignalR.Core");
            if (hubOptionsGeneric == null)
            {
                return false;
            }
            var componentHub = Type.GetType("Microsoft.AspNetCore.Components.Server.ComponentHub, Microsoft.AspNetCore.Components.Server");
            if (componentHub == null)
            {
                return false;
            }

            // Microsoft.Extensions.Options.IOptions<HubOptions<ComponentHub>>
            var fullGenericType = typeof(IOptions<>).MakeGenericType(hubOptionsGeneric.MakeGenericType(componentHub));
            var hubOptionsInstance = fullGenericType.GetProperty("Value")?.GetValue(serviceProvider.GetService(fullGenericType));

            if (hubOptionsInstance == null)
            {
                return false;
            }

            maximumReceiveMessageSize = (long)hubOptionsInstance.GetType().GetProperty("MaximumReceiveMessageSize")?.GetValue(hubOptionsInstance);

            return true;
        }
    }
}
