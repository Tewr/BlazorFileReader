namespace Tewr.Blazor.FileReader.DropEvents
{

    /// <summary>
    /// Provides expert options for manipulating the default behaviour of the paste event.
    /// </summary>
    public class PasteEventOptions
    {
        /// <summary>
        /// If set to true, paste target file list becomes additive. Defaults to false.
        /// </summary>
        public bool Additive { get; set; }
    }
}