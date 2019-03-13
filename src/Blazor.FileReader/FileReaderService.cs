using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Blazor.FileReader
{

    public interface IFileReaderService
    {
        IFileReaderRef CreateReference(ElementRef inputFileElement);
    }

    public class FileReaderService : IFileReaderService
    {
        /// <summary>
        /// May be null.
        /// </summary>
        private readonly IInvokeUnmarshalled _invokeUnmarshalled;

        public FileReaderService(IInvokeUnmarshalled invokeUnmarshalled)
        {
            this._invokeUnmarshalled = invokeUnmarshalled;
        }

        public FileReaderService()
        {
        }

        public IFileReaderRef CreateReference(ElementRef inputFileElement)
        {
            return new FileReaderRef(inputFileElement, this._invokeUnmarshalled);
        }
    }
}
