using System.Collections.Generic;

namespace Tewr.Blazor.FileReader.DropEvents
{
    /// <summary>
    /// Possible values of the DataTransfer.dropEffect property
    /// </summary>
    /// <remarks>
    /// https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/dropEffect
    /// </remarks>
    public enum DropEffect
    {
        /// <summary>
        /// A copy of the source item is made at the new location.
        /// </summary>
        Copy,
        /// <summary>
        /// An item is moved to a new location.
        /// </summary>
        Move,
        /// <summary>
        /// A link is established to the source at the new location.
        /// </summary>
        Link,
        /// <summary>
        /// The item may not be dropped.
        /// </summary>
        None
    }

    public static class DropEventsOptionsExtensions
    {
        private static readonly Dictionary<DropEffect, string> dropeffectDomstringValues 
            = new Dictionary<DropEffect, string>
            {
                { DropEffect.Copy, "copy" },
                { DropEffect.Move, "move" },
                { DropEffect.Link, "link" },
                { DropEffect.None, "none" },
            };

        /// <summary>
        /// Sets the specified <see cref="dropEffect"/> value on the dataTransfer property in the dragover event to the specified value.
        /// </summary>
        /// <param name="source"></param>
        /// <param name="dropEffect"></param>
        /// <remarks>https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/dropEffect</remarks>
        /// <returns></returns>
        public static DropEventsOptions SetDragOverDataTransferDropEffect(this DropEventsOptions source, DropEffect dropEffect)
        {
            if (source is null)
            {
                throw new System.ArgumentNullException(nameof(source));
            }

            if (!dropeffectDomstringValues.TryGetValue(dropEffect, out var value))
            {
                throw new System.ArgumentException($"{dropEffect} is not a valid value for parameter {nameof(dropEffect)}", nameof(dropEffect));
            }
            
            source.OnDragOverScript = @$"(dragEvent) => {{
                if (dragEvent.dataTransfer) {{
                    dragEvent.dataTransfer.dropEffect = ""{value}"";
                }}
            }}";

            return source;
        }
    }
}
