using System;

namespace Blazor.FileReader
{
    public class BrowserFileReaderException : Exception
    {
        public BrowserFileReaderException(string message):base(message)
        {
        }
    }
}
