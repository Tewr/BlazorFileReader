﻿using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Tewr.Blazor.FileReader.DropEvents
{
    public static class FileReaderRefExtensions { 
    
        public static Task RegisterDropEventsAsync(this IFileReaderRef source, Action<DropEventsOptions> dropEventsModifier)
        {
            if (source is null)
            {
                throw new ArgumentNullException(nameof(source));
            }

            if (dropEventsModifier is null)
            {
                throw new ArgumentNullException(nameof(dropEventsModifier));
            }

            var options = new DropEventsOptions();
            dropEventsModifier(options);
            return source.RegisterDropEventsAsync(options);
        }

        public static Task RegisterPasteEventAsync(this IFileReaderRef source, Action<PasteEventOptions> pasteEventModifier)
        {
            if (source is null)
            {
                throw new ArgumentNullException(nameof(source));
            }

            if (pasteEventModifier is null)
            {
                throw new ArgumentNullException(nameof(pasteEventModifier));
            }

            var options = new PasteEventOptions();
            pasteEventModifier(options);
            return source.RegisterPasteEventAsync(options);
        }
    }
}
