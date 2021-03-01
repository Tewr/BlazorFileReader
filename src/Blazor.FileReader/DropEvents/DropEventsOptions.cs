namespace Tewr.Blazor.FileReader.DropEvents
{

    /// <summary>
    // Provides expert options for manipulating the default behaviour of the drag and drop events.
    /// </summary>
    public class DropEventsOptions
    {
        /// <summary>
        /// If set to true, drop target file list becomes additive. Defaults to false.
        /// </summary>
        public bool Additive { get; set; }

        /// <summary>
        /// Predefined global javascript function that will be executed on the drop event. 
        /// The method will be passed the following arguments: The Event, the target element, and the FileReaderComponent instance.
        /// </summary>
        public string OnDropMethod { get; set; }

        /// <summary>
        /// Javascript function snippet that will be executed on the drop event. 
        /// The method will be passed the following arguments: The DragEvent, the target element, and the FileReaderComponent instance.
        /// Do not set this property using user-provided data, as it would be a security risk.
        /// </summary>
        public string OnDropScript { get; set; }

        /// <summary>
        /// Predefined global javascript function that will be executed on the dragover event. 
        /// The method will be passed the following arguments: The DragEvent, the target element, and the FileReaderComponent instance.
        /// </summary>
        public string OnDragOverMethod { get; set; }

        /// <summary>
        /// Javascript function snippet that will be executed on the dragover event. 
        /// The method will be passed the following arguments: The DragEvent, the target element, and the FileReaderComponent instance.
        /// Do not set this property using user-provided data, as it would be a security risk.
        /// </summary>
        public string OnDragOverScript { get; set; }

        /// <summary>
        /// Predefined global javascript function that will be executed immediately after the drag and drop events have been registered. 
        /// The method will be passed the following arguments: null, the target element, and the FileReaderComponent instance.
        /// </summary>
        public string OnRegisterDropEventsMethod { get; set; }

        /// <summary>
        /// Javascript function snippet that will be executed immediately after the drag and drop events have been registered. 
        /// The method will be passed the following arguments: null, the target element, and the FileReaderComponent instance.
        /// Do not set this property using user-provided data, as it would be a security risk.
        /// </summary>
        public string OnRegisterDropEventsScript { get; set; }
    }

}
