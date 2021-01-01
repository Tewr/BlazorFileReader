using System.Collections.Generic;

namespace Tewr.Blazor.FileReader.DropEvents
{
    /// <summary>
    /// Possible values of the DataTransfer.dropEffect property
    /// https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/dropEffect
    /// </summary>
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
        /// Sets the dropEffect (https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/dropEffect) on the dragover event to the specified value.
        /// </summary>
        /// <param name="source"></param>
        /// <param name="dropEffect"></param>
        /// <returns></returns>
        public static DropEventsOptions SetDragOverDataTransferDropEffect(this DropEventsOptions source, DropEffect dropEffect)
        {
            if (source is null)
            {
                throw new System.ArgumentNullException(nameof(source));
            }

            var value = dropeffectDomstringValues[dropEffect];
            source.OnDragOverScript = @$"(dragEvent) => {{
                if (dragEvent.dataTransfer) {{
                    dragEvent.dataTransfer.dropEffect = ""{value}"";
                }}
            }}";

            return source;
        }
    }
}
