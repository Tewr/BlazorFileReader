<a name='assembly'></a>
# Tewr.Blazor.FileReader

## Contents

- [AsyncDisposableStream](#T-Tewr-Blazor-FileReader-AsyncDisposableStream 'Tewr.Blazor.FileReader.AsyncDisposableStream')
  - [DisposeAsync()](#M-Tewr-Blazor-FileReader-AsyncDisposableStream-DisposeAsync 'Tewr.Blazor.FileReader.AsyncDisposableStream.DisposeAsync')
- [BrowserFileReaderException](#T-Tewr-Blazor-FileReader-BrowserFileReaderException 'Tewr.Blazor.FileReader.BrowserFileReaderException')
- [DropEffect](#T-Tewr-Blazor-FileReader-DropEvents-DropEffect 'Tewr.Blazor.FileReader.DropEvents.DropEffect')
  - [Copy](#F-Tewr-Blazor-FileReader-DropEvents-DropEffect-Copy 'Tewr.Blazor.FileReader.DropEvents.DropEffect.Copy')
  - [Link](#F-Tewr-Blazor-FileReader-DropEvents-DropEffect-Link 'Tewr.Blazor.FileReader.DropEvents.DropEffect.Link')
  - [Move](#F-Tewr-Blazor-FileReader-DropEvents-DropEffect-Move 'Tewr.Blazor.FileReader.DropEvents.DropEffect.Move')
  - [None](#F-Tewr-Blazor-FileReader-DropEvents-DropEffect-None 'Tewr.Blazor.FileReader.DropEvents.DropEffect.None')
- [DropEventsOptions](#T-Tewr-Blazor-FileReader-DropEvents-DropEventsOptions 'Tewr.Blazor.FileReader.DropEvents.DropEventsOptions')
  - [Additive](#P-Tewr-Blazor-FileReader-DropEvents-DropEventsOptions-Additive 'Tewr.Blazor.FileReader.DropEvents.DropEventsOptions.Additive')
  - [OnDragOverMethod](#P-Tewr-Blazor-FileReader-DropEvents-DropEventsOptions-OnDragOverMethod 'Tewr.Blazor.FileReader.DropEvents.DropEventsOptions.OnDragOverMethod')
  - [OnDragOverScript](#P-Tewr-Blazor-FileReader-DropEvents-DropEventsOptions-OnDragOverScript 'Tewr.Blazor.FileReader.DropEvents.DropEventsOptions.OnDragOverScript')
  - [OnDropMethod](#P-Tewr-Blazor-FileReader-DropEvents-DropEventsOptions-OnDropMethod 'Tewr.Blazor.FileReader.DropEvents.DropEventsOptions.OnDropMethod')
  - [OnDropScript](#P-Tewr-Blazor-FileReader-DropEvents-DropEventsOptions-OnDropScript 'Tewr.Blazor.FileReader.DropEvents.DropEventsOptions.OnDropScript')
  - [OnRegisterDropEventsMethod](#P-Tewr-Blazor-FileReader-DropEvents-DropEventsOptions-OnRegisterDropEventsMethod 'Tewr.Blazor.FileReader.DropEvents.DropEventsOptions.OnRegisterDropEventsMethod')
  - [OnRegisterDropEventsScript](#P-Tewr-Blazor-FileReader-DropEvents-DropEventsOptions-OnRegisterDropEventsScript 'Tewr.Blazor.FileReader.DropEvents.DropEventsOptions.OnRegisterDropEventsScript')
- [DropEventsOptionsExtensions](#T-Tewr-Blazor-FileReader-DropEvents-DropEventsOptionsExtensions 'Tewr.Blazor.FileReader.DropEvents.DropEventsOptionsExtensions')
  - [SetDragOverDataTransferDropEffect(source,dropEffect)](#M-Tewr-Blazor-FileReader-DropEvents-DropEventsOptionsExtensions-SetDragOverDataTransferDropEffect-Tewr-Blazor-FileReader-DropEvents-DropEventsOptions,Tewr-Blazor-FileReader-DropEvents-DropEffect- 'Tewr.Blazor.FileReader.DropEvents.DropEventsOptionsExtensions.SetDragOverDataTransferDropEffect(Tewr.Blazor.FileReader.DropEvents.DropEventsOptions,Tewr.Blazor.FileReader.DropEvents.DropEffect)')
- [FileInfo](#T-Tewr-Blazor-FileReader-FileInfo 'Tewr.Blazor.FileReader.FileInfo')
  - [WebkitRelativePath](#P-Tewr-Blazor-FileReader-FileInfo-WebkitRelativePath 'Tewr.Blazor.FileReader.FileInfo.WebkitRelativePath')
- [FileReaderJsInterop](#T-Tewr-Blazor-FileReader-FileReaderJsInterop 'Tewr.Blazor.FileReader.FileReaderJsInterop')
  - [EndTask(taskId)](#M-Tewr-Blazor-FileReader-FileReaderJsInterop-EndTask-System-Int64- 'Tewr.Blazor.FileReader.FileReaderJsInterop.EndTask(System.Int64)')
- [FileReaderServiceOptions](#T-Tewr-Blazor-FileReader-FileReaderServiceOptions 'Tewr.Blazor.FileReader.FileReaderServiceOptions')
  - [MaximumRecieveMessageSize](#P-Tewr-Blazor-FileReader-FileReaderServiceOptions-MaximumRecieveMessageSize 'Tewr.Blazor.FileReader.FileReaderServiceOptions.MaximumRecieveMessageSize')
  - [UseBufferChunking](#P-Tewr-Blazor-FileReader-FileReaderServiceOptions-UseBufferChunking 'Tewr.Blazor.FileReader.FileReaderServiceOptions.UseBufferChunking')
- [IBase64Stream](#T-Tewr-Blazor-FileReader-IBase64Stream 'Tewr.Blazor.FileReader.IBase64Stream')
  - [Length](#P-Tewr-Blazor-FileReader-IBase64Stream-Length 'Tewr.Blazor.FileReader.IBase64Stream.Length')
  - [Position](#P-Tewr-Blazor-FileReader-IBase64Stream-Position 'Tewr.Blazor.FileReader.IBase64Stream.Position')
  - [ReadAsync(offset,count,cancellationToken)](#M-Tewr-Blazor-FileReader-IBase64Stream-ReadAsync-System-Int32,System-Int32,System-Threading-CancellationToken- 'Tewr.Blazor.FileReader.IBase64Stream.ReadAsync(System.Int32,System.Int32,System.Threading.CancellationToken)')
- [IFileInfo](#T-Tewr-Blazor-FileReader-IFileInfo 'Tewr.Blazor.FileReader.IFileInfo')
  - [LastModified](#P-Tewr-Blazor-FileReader-IFileInfo-LastModified 'Tewr.Blazor.FileReader.IFileInfo.LastModified')
  - [LastModifiedDate](#P-Tewr-Blazor-FileReader-IFileInfo-LastModifiedDate 'Tewr.Blazor.FileReader.IFileInfo.LastModifiedDate')
  - [Name](#P-Tewr-Blazor-FileReader-IFileInfo-Name 'Tewr.Blazor.FileReader.IFileInfo.Name')
  - [NonStandardProperties](#P-Tewr-Blazor-FileReader-IFileInfo-NonStandardProperties 'Tewr.Blazor.FileReader.IFileInfo.NonStandardProperties')
  - [PositionInfo](#P-Tewr-Blazor-FileReader-IFileInfo-PositionInfo 'Tewr.Blazor.FileReader.IFileInfo.PositionInfo')
  - [Size](#P-Tewr-Blazor-FileReader-IFileInfo-Size 'Tewr.Blazor.FileReader.IFileInfo.Size')
  - [Type](#P-Tewr-Blazor-FileReader-IFileInfo-Type 'Tewr.Blazor.FileReader.IFileInfo.Type')
  - [WebkitRelativePath](#P-Tewr-Blazor-FileReader-IFileInfo-WebkitRelativePath 'Tewr.Blazor.FileReader.IFileInfo.WebkitRelativePath')
- [IFilePositionInfo](#T-Tewr-Blazor-FileReader-IFilePositionInfo 'Tewr.Blazor.FileReader.IFilePositionInfo')
  - [DataStream](#P-Tewr-Blazor-FileReader-IFilePositionInfo-DataStream 'Tewr.Blazor.FileReader.IFilePositionInfo.DataStream')
  - [Percentage](#P-Tewr-Blazor-FileReader-IFilePositionInfo-Percentage 'Tewr.Blazor.FileReader.IFilePositionInfo.Percentage')
  - [PercentageDeltaSinceAcknowledge](#P-Tewr-Blazor-FileReader-IFilePositionInfo-PercentageDeltaSinceAcknowledge 'Tewr.Blazor.FileReader.IFilePositionInfo.PercentageDeltaSinceAcknowledge')
  - [PercentageOnAcknowledge](#P-Tewr-Blazor-FileReader-IFilePositionInfo-PercentageOnAcknowledge 'Tewr.Blazor.FileReader.IFilePositionInfo.PercentageOnAcknowledge')
  - [Position](#P-Tewr-Blazor-FileReader-IFilePositionInfo-Position 'Tewr.Blazor.FileReader.IFilePositionInfo.Position')
  - [PositionDeltaSinceAcknowledge](#P-Tewr-Blazor-FileReader-IFilePositionInfo-PositionDeltaSinceAcknowledge 'Tewr.Blazor.FileReader.IFilePositionInfo.PositionDeltaSinceAcknowledge')
  - [PositionOnAcknowledge](#P-Tewr-Blazor-FileReader-IFilePositionInfo-PositionOnAcknowledge 'Tewr.Blazor.FileReader.IFilePositionInfo.PositionOnAcknowledge')
  - [Acknowledge()](#M-Tewr-Blazor-FileReader-IFilePositionInfo-Acknowledge 'Tewr.Blazor.FileReader.IFilePositionInfo.Acknowledge')
- [IFileReaderRef](#T-Tewr-Blazor-FileReader-IFileReaderRef 'Tewr.Blazor.FileReader.IFileReaderRef')
  - [ClearValue()](#M-Tewr-Blazor-FileReader-IFileReaderRef-ClearValue 'Tewr.Blazor.FileReader.IFileReaderRef.ClearValue')
  - [EnumerateFilesAsync()](#M-Tewr-Blazor-FileReader-IFileReaderRef-EnumerateFilesAsync 'Tewr.Blazor.FileReader.IFileReaderRef.EnumerateFilesAsync')
  - [RegisterDropEventsAsync(additive)](#M-Tewr-Blazor-FileReader-IFileReaderRef-RegisterDropEventsAsync-System-Boolean- 'Tewr.Blazor.FileReader.IFileReaderRef.RegisterDropEventsAsync(System.Boolean)')
  - [RegisterDropEventsAsync(dropEventsOptions)](#M-Tewr-Blazor-FileReader-IFileReaderRef-RegisterDropEventsAsync-Tewr-Blazor-FileReader-DropEvents-DropEventsOptions- 'Tewr.Blazor.FileReader.IFileReaderRef.RegisterDropEventsAsync(Tewr.Blazor.FileReader.DropEvents.DropEventsOptions)')
  - [RegisterPasteEventAsync(additive)](#M-Tewr-Blazor-FileReader-IFileReaderRef-RegisterPasteEventAsync-System-Boolean- 'Tewr.Blazor.FileReader.IFileReaderRef.RegisterPasteEventAsync(System.Boolean)')
  - [RegisterPasteEventAsync(pasteEventOptions)](#M-Tewr-Blazor-FileReader-IFileReaderRef-RegisterPasteEventAsync-Tewr-Blazor-FileReader-DropEvents-PasteEventOptions- 'Tewr.Blazor.FileReader.IFileReaderRef.RegisterPasteEventAsync(Tewr.Blazor.FileReader.DropEvents.PasteEventOptions)')
  - [UnregisterDropEventsAsync()](#M-Tewr-Blazor-FileReader-IFileReaderRef-UnregisterDropEventsAsync 'Tewr.Blazor.FileReader.IFileReaderRef.UnregisterDropEventsAsync')
  - [UnregisterPasteEventAsync()](#M-Tewr-Blazor-FileReader-IFileReaderRef-UnregisterPasteEventAsync 'Tewr.Blazor.FileReader.IFileReaderRef.UnregisterPasteEventAsync')
- [IFileReaderService](#T-Tewr-Blazor-FileReader-IFileReaderService 'Tewr.Blazor.FileReader.IFileReaderService')
  - [CreateReference(element)](#M-Tewr-Blazor-FileReader-IFileReaderService-CreateReference-Microsoft-AspNetCore-Components-ElementReference- 'Tewr.Blazor.FileReader.IFileReaderService.CreateReference(Microsoft.AspNetCore.Components.ElementReference)')
  - [EnsureInitializedAsync()](#M-Tewr-Blazor-FileReader-IFileReaderService-EnsureInitializedAsync 'Tewr.Blazor.FileReader.IFileReaderService.EnsureInitializedAsync')
- [IFileReaderServiceOptions](#T-Tewr-Blazor-FileReader-IFileReaderServiceOptions 'Tewr.Blazor.FileReader.IFileReaderServiceOptions')
  - [InitializeOnFirstCall](#P-Tewr-Blazor-FileReader-IFileReaderServiceOptions-InitializeOnFirstCall 'Tewr.Blazor.FileReader.IFileReaderServiceOptions.InitializeOnFirstCall')
  - [UseWasmSharedBuffer](#P-Tewr-Blazor-FileReader-IFileReaderServiceOptions-UseWasmSharedBuffer 'Tewr.Blazor.FileReader.IFileReaderServiceOptions.UseWasmSharedBuffer')
- [IFileReference](#T-Tewr-Blazor-FileReader-IFileReference 'Tewr.Blazor.FileReader.IFileReference')
  - [CreateMemoryStreamAsync()](#M-Tewr-Blazor-FileReader-IFileReference-CreateMemoryStreamAsync 'Tewr.Blazor.FileReader.IFileReference.CreateMemoryStreamAsync')
  - [CreateMemoryStreamAsync()](#M-Tewr-Blazor-FileReader-IFileReference-CreateMemoryStreamAsync-System-Threading-CancellationToken- 'Tewr.Blazor.FileReader.IFileReference.CreateMemoryStreamAsync(System.Threading.CancellationToken)')
  - [CreateMemoryStreamAsync()](#M-Tewr-Blazor-FileReader-IFileReference-CreateMemoryStreamAsync-System-Int32- 'Tewr.Blazor.FileReader.IFileReference.CreateMemoryStreamAsync(System.Int32)')
  - [CreateMemoryStreamAsync()](#M-Tewr-Blazor-FileReader-IFileReference-CreateMemoryStreamAsync-System-Int32,System-Threading-CancellationToken- 'Tewr.Blazor.FileReader.IFileReference.CreateMemoryStreamAsync(System.Int32,System.Threading.CancellationToken)')
  - [GetJSObjectReferenceAsync()](#M-Tewr-Blazor-FileReader-IFileReference-GetJSObjectReferenceAsync 'Tewr.Blazor.FileReader.IFileReference.GetJSObjectReferenceAsync')
  - [GetObjectUrlAsync()](#M-Tewr-Blazor-FileReader-IFileReference-GetObjectUrlAsync 'Tewr.Blazor.FileReader.IFileReference.GetObjectUrlAsync')
  - [OpenReadAsync()](#M-Tewr-Blazor-FileReader-IFileReference-OpenReadAsync 'Tewr.Blazor.FileReader.IFileReference.OpenReadAsync')
  - [OpenReadBase64Async()](#M-Tewr-Blazor-FileReader-IFileReference-OpenReadBase64Async 'Tewr.Blazor.FileReader.IFileReference.OpenReadBase64Async')
  - [ReadFileInfoAsync()](#M-Tewr-Blazor-FileReader-IFileReference-ReadFileInfoAsync 'Tewr.Blazor.FileReader.IFileReference.ReadFileInfoAsync')
- [IObjectUrl](#T-Tewr-Blazor-FileReader-IObjectUrl 'Tewr.Blazor.FileReader.IObjectUrl')
  - [Url](#P-Tewr-Blazor-FileReader-IObjectUrl-Url 'Tewr.Blazor.FileReader.IObjectUrl.Url')
- [PasteEventOptions](#T-Tewr-Blazor-FileReader-DropEvents-PasteEventOptions 'Tewr.Blazor.FileReader.DropEvents.PasteEventOptions')
  - [Additive](#P-Tewr-Blazor-FileReader-DropEvents-PasteEventOptions-Additive 'Tewr.Blazor.FileReader.DropEvents.PasteEventOptions.Additive')
- [PlatformConfig](#T-Tewr-Blazor-FileReader-PlatformConfig 'Tewr.Blazor.FileReader.PlatformConfig')
  - [IsWasm](#P-Tewr-Blazor-FileReader-PlatformConfig-IsWasm 'Tewr.Blazor.FileReader.PlatformConfig.IsWasm')
  - [TryReadMaximumReceiveMessageSize(serviceProvider,maximumReceiveMessageSize)](#M-Tewr-Blazor-FileReader-PlatformConfig-TryReadMaximumReceiveMessageSize-System-IServiceProvider,System-Int64@- 'Tewr.Blazor.FileReader.PlatformConfig.TryReadMaximumReceiveMessageSize(System.IServiceProvider,System.Int64@)')
- [SetupExtension](#T-Tewr-Blazor-FileReader-SetupExtension 'Tewr.Blazor.FileReader.SetupExtension')
  - [AddFileReaderService(services)](#M-Tewr-Blazor-FileReader-SetupExtension-AddFileReaderService-Microsoft-Extensions-DependencyInjection-IServiceCollection- 'Tewr.Blazor.FileReader.SetupExtension.AddFileReaderService(Microsoft.Extensions.DependencyInjection.IServiceCollection)')
  - [AddFileReaderService(services,setOptions)](#M-Tewr-Blazor-FileReader-SetupExtension-AddFileReaderService-Microsoft-Extensions-DependencyInjection-IServiceCollection,System-Action{Tewr-Blazor-FileReader-IFileReaderServiceOptions}- 'Tewr.Blazor.FileReader.SetupExtension.AddFileReaderService(Microsoft.Extensions.DependencyInjection.IServiceCollection,System.Action{Tewr.Blazor.FileReader.IFileReaderServiceOptions})')

<a name='T-Tewr-Blazor-FileReader-AsyncDisposableStream'></a>
## AsyncDisposableStream `type`

##### Namespace

Tewr.Blazor.FileReader

##### Summary

Stream that implements [IAsyncDisposable](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.IAsyncDisposable 'System.IAsyncDisposable')

<a name='M-Tewr-Blazor-FileReader-AsyncDisposableStream-DisposeAsync'></a>
### DisposeAsync() `method`

##### Summary

*Inherit from parent.*

##### Parameters

This method has no parameters.

<a name='T-Tewr-Blazor-FileReader-BrowserFileReaderException'></a>
## BrowserFileReaderException `type`

##### Namespace

Tewr.Blazor.FileReader

##### Summary

Exception that is thrown if an exception occurs in the browser during file reader operations

<a name='T-Tewr-Blazor-FileReader-DropEvents-DropEffect'></a>
## DropEffect `type`

##### Namespace

Tewr.Blazor.FileReader.DropEvents

##### Summary

Possible values of the DataTransfer.dropEffect property

##### Remarks

https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/dropEffect

<a name='F-Tewr-Blazor-FileReader-DropEvents-DropEffect-Copy'></a>
### Copy `constants`

##### Summary

A copy of the source item is made at the new location.

<a name='F-Tewr-Blazor-FileReader-DropEvents-DropEffect-Link'></a>
### Link `constants`

##### Summary

A link is established to the source at the new location.

<a name='F-Tewr-Blazor-FileReader-DropEvents-DropEffect-Move'></a>
### Move `constants`

##### Summary

An item is moved to a new location.

<a name='F-Tewr-Blazor-FileReader-DropEvents-DropEffect-None'></a>
### None `constants`

##### Summary

The item may not be dropped.

<a name='T-Tewr-Blazor-FileReader-DropEvents-DropEventsOptions'></a>
## DropEventsOptions `type`

##### Namespace

Tewr.Blazor.FileReader.DropEvents

<a name='P-Tewr-Blazor-FileReader-DropEvents-DropEventsOptions-Additive'></a>
### Additive `property`

##### Summary

If set to true, drop target file list becomes additive. Defaults to false.

<a name='P-Tewr-Blazor-FileReader-DropEvents-DropEventsOptions-OnDragOverMethod'></a>
### OnDragOverMethod `property`

##### Summary

Predefined global javascript function that will be executed on the dragover event. 
The method will be passed the following arguments: The DragEvent, the target element, and the FileReaderComponent instance.

<a name='P-Tewr-Blazor-FileReader-DropEvents-DropEventsOptions-OnDragOverScript'></a>
### OnDragOverScript `property`

##### Summary

Javascript function snippet that will be executed on the dragover event. 
The method will be passed the following arguments: The DragEvent, the target element, and the FileReaderComponent instance.
Do not set this property using user-provided data, as it would be a security risk.

<a name='P-Tewr-Blazor-FileReader-DropEvents-DropEventsOptions-OnDropMethod'></a>
### OnDropMethod `property`

##### Summary

Predefined global javascript function that will be executed on the drop event. 
The method will be passed the following arguments: The Event, the target element, and the FileReaderComponent instance.

<a name='P-Tewr-Blazor-FileReader-DropEvents-DropEventsOptions-OnDropScript'></a>
### OnDropScript `property`

##### Summary

Javascript function snippet that will be executed on the drop event. 
The method will be passed the following arguments: The DragEvent, the target element, and the FileReaderComponent instance.
Do not set this property using user-provided data, as it would be a security risk.

<a name='P-Tewr-Blazor-FileReader-DropEvents-DropEventsOptions-OnRegisterDropEventsMethod'></a>
### OnRegisterDropEventsMethod `property`

##### Summary

Predefined global javascript function that will be executed immediately after the drag and drop events have been registered. 
The method will be passed the following arguments: null, the target element, and the FileReaderComponent instance.

<a name='P-Tewr-Blazor-FileReader-DropEvents-DropEventsOptions-OnRegisterDropEventsScript'></a>
### OnRegisterDropEventsScript `property`

##### Summary

Javascript function snippet that will be executed immediately after the drag and drop events have been registered. 
The method will be passed the following arguments: null, the target element, and the FileReaderComponent instance.
Do not set this property using user-provided data, as it would be a security risk.

<a name='T-Tewr-Blazor-FileReader-DropEvents-DropEventsOptionsExtensions'></a>
## DropEventsOptionsExtensions `type`

##### Namespace

Tewr.Blazor.FileReader.DropEvents

<a name='M-Tewr-Blazor-FileReader-DropEvents-DropEventsOptionsExtensions-SetDragOverDataTransferDropEffect-Tewr-Blazor-FileReader-DropEvents-DropEventsOptions,Tewr-Blazor-FileReader-DropEvents-DropEffect-'></a>
### SetDragOverDataTransferDropEffect(source,dropEffect) `method`

##### Summary

Sets the specified [](#!-dropEffect 'dropEffect') value on the dataTransfer property in the dragover event to the specified value.

##### Returns



##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| source | [Tewr.Blazor.FileReader.DropEvents.DropEventsOptions](#T-Tewr-Blazor-FileReader-DropEvents-DropEventsOptions 'Tewr.Blazor.FileReader.DropEvents.DropEventsOptions') |  |
| dropEffect | [Tewr.Blazor.FileReader.DropEvents.DropEffect](#T-Tewr-Blazor-FileReader-DropEvents-DropEffect 'Tewr.Blazor.FileReader.DropEvents.DropEffect') |  |

##### Remarks

https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/dropEffect

<a name='T-Tewr-Blazor-FileReader-FileInfo'></a>
## FileInfo `type`

##### Namespace

Tewr.Blazor.FileReader

<a name='P-Tewr-Blazor-FileReader-FileInfo-WebkitRelativePath'></a>
### WebkitRelativePath `property`

##### Summary

*Inherit from parent.*

<a name='T-Tewr-Blazor-FileReader-FileReaderJsInterop'></a>
## FileReaderJsInterop `type`

##### Namespace

Tewr.Blazor.FileReader

<a name='M-Tewr-Blazor-FileReader-FileReaderJsInterop-EndTask-System-Int64-'></a>
### EndTask(taskId) `method`

##### Summary

Called from Js

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| taskId | [System.Int64](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int64 'System.Int64') |  |

<a name='T-Tewr-Blazor-FileReader-FileReaderServiceOptions'></a>
## FileReaderServiceOptions `type`

##### Namespace

Tewr.Blazor.FileReader

<a name='P-Tewr-Blazor-FileReader-FileReaderServiceOptions-MaximumRecieveMessageSize'></a>
### MaximumRecieveMessageSize `property`

##### Summary

SignalR setting

<a name='P-Tewr-Blazor-FileReader-FileReaderServiceOptions-UseBufferChunking'></a>
### UseBufferChunking `property`

##### Summary

Activates server-side buffer chunking. Activated if not running on WASM.

<a name='T-Tewr-Blazor-FileReader-IBase64Stream'></a>
## IBase64Stream `type`

##### Namespace

Tewr.Blazor.FileReader

##### Summary

Provides a base64-encoded string view of a sequence of bytes from a file.

<a name='P-Tewr-Blazor-FileReader-IBase64Stream-Length'></a>
### Length `property`

##### Summary

Gets the length of the stream in bytes.

<a name='P-Tewr-Blazor-FileReader-IBase64Stream-Position'></a>
### Position `property`

##### Summary

Gets or sets the current byte position in the Stream.

<a name='M-Tewr-Blazor-FileReader-IBase64Stream-ReadAsync-System-Int32,System-Int32,System-Threading-CancellationToken-'></a>
### ReadAsync(offset,count,cancellationToken) `method`

##### Summary

Asynchronously reads a sequence of bytes as a base64 encoded string from the current stream 
and advances the position within the stream by the number of bytes read.

##### Returns

The requested sequence of bytes as a base64 encoded string. 
The resulting string can be shorter than the number of bytes requested if
the number of bytes currently available is less than the requested 
number, or it can be string.empty if the end of the stream has been reached.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| offset | [System.Int32](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int32 'System.Int32') | The byte offset in the source at which to begin reading data from the stream. |
| count | [System.Int32](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int32 'System.Int32') | The maximum number of bytes to read. |
| cancellationToken | [System.Threading.CancellationToken](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Threading.CancellationToken 'System.Threading.CancellationToken') |  |

<a name='T-Tewr-Blazor-FileReader-IFileInfo'></a>
## IFileInfo `type`

##### Namespace

Tewr.Blazor.FileReader

##### Summary

Provides properties for file metadata.

<a name='P-Tewr-Blazor-FileReader-IFileInfo-LastModified'></a>
### LastModified `property`

##### Summary

Returns the last modified time of the file, in millisecond since the UNIX epoch (January 1st, 1970 at Midnight).

<a name='P-Tewr-Blazor-FileReader-IFileInfo-LastModifiedDate'></a>
### LastModifiedDate `property`

##### Summary

Returns the last modified time of the file.

<a name='P-Tewr-Blazor-FileReader-IFileInfo-Name'></a>
### Name `property`

##### Summary

Returns the name of the file referenced by the File object.

<a name='P-Tewr-Blazor-FileReader-IFileInfo-NonStandardProperties'></a>
### NonStandardProperties `property`

##### Summary

Returns a list of non-standard DOM properties attached to the object, like the webkitRelativePath property.

<a name='P-Tewr-Blazor-FileReader-IFileInfo-PositionInfo'></a>
### PositionInfo `property`

##### Summary

Returns information of the position of any stream related to this file.

<a name='P-Tewr-Blazor-FileReader-IFileInfo-Size'></a>
### Size `property`

##### Summary

Returns the size of the file in bytes.

<a name='P-Tewr-Blazor-FileReader-IFileInfo-Type'></a>
### Type `property`

##### Summary

Returns the MIME type of the file.

<a name='P-Tewr-Blazor-FileReader-IFileInfo-WebkitRelativePath'></a>
### WebkitRelativePath `property`

##### Summary

Gets the relative path including the filename.

<a name='T-Tewr-Blazor-FileReader-IFilePositionInfo'></a>
## IFilePositionInfo `type`

##### Namespace

Tewr.Blazor.FileReader

##### Summary

Provides information on the position of a Stream currently reading this file.

<a name='P-Tewr-Blazor-FileReader-IFilePositionInfo-DataStream'></a>
### DataStream `property`

##### Summary

The underlying stream that was the source of the [Position](#P-Tewr-Blazor-FileReader-IFilePositionInfo-Position 'Tewr.Blazor.FileReader.IFilePositionInfo.Position') change.

<a name='P-Tewr-Blazor-FileReader-IFilePositionInfo-Percentage'></a>
### Percentage `property`

##### Summary

The current position of a Stream currently reading this file, relative to the file size.

<a name='P-Tewr-Blazor-FileReader-IFilePositionInfo-PercentageDeltaSinceAcknowledge'></a>
### PercentageDeltaSinceAcknowledge `property`

##### Summary

The delta between current [Percentage](#P-Tewr-Blazor-FileReader-IFilePositionInfo-Percentage 'Tewr.Blazor.FileReader.IFilePositionInfo.Percentage') and [PercentageOnAcknowledge](#P-Tewr-Blazor-FileReader-IFilePositionInfo-PercentageOnAcknowledge 'Tewr.Blazor.FileReader.IFilePositionInfo.PercentageOnAcknowledge')

<a name='P-Tewr-Blazor-FileReader-IFilePositionInfo-PercentageOnAcknowledge'></a>
### PercentageOnAcknowledge `property`

##### Summary

The value of [Percentage](#P-Tewr-Blazor-FileReader-IFilePositionInfo-Percentage 'Tewr.Blazor.FileReader.IFilePositionInfo.Percentage') when [Acknowledge](#M-Tewr-Blazor-FileReader-IFilePositionInfo-Acknowledge 'Tewr.Blazor.FileReader.IFilePositionInfo.Acknowledge') was last called

<a name='P-Tewr-Blazor-FileReader-IFilePositionInfo-Position'></a>
### Position `property`

##### Summary

The current position of a Stream currently reading this file.

<a name='P-Tewr-Blazor-FileReader-IFilePositionInfo-PositionDeltaSinceAcknowledge'></a>
### PositionDeltaSinceAcknowledge `property`

##### Summary

The delta between current [Position](#P-Tewr-Blazor-FileReader-IFilePositionInfo-Position 'Tewr.Blazor.FileReader.IFilePositionInfo.Position') and what the value was at the last call to [Acknowledge](#M-Tewr-Blazor-FileReader-IFilePositionInfo-Acknowledge 'Tewr.Blazor.FileReader.IFilePositionInfo.Acknowledge')

<a name='P-Tewr-Blazor-FileReader-IFilePositionInfo-PositionOnAcknowledge'></a>
### PositionOnAcknowledge `property`

##### Summary

The value of [Position](#P-Tewr-Blazor-FileReader-IFilePositionInfo-Position 'Tewr.Blazor.FileReader.IFilePositionInfo.Position') when [Acknowledge](#M-Tewr-Blazor-FileReader-IFilePositionInfo-Acknowledge 'Tewr.Blazor.FileReader.IFilePositionInfo.Acknowledge') was last called

<a name='M-Tewr-Blazor-FileReader-IFilePositionInfo-Acknowledge'></a>
### Acknowledge() `method`

##### Summary

Saves value of [Position](#P-Tewr-Blazor-FileReader-IFilePositionInfo-Position 'Tewr.Blazor.FileReader.IFilePositionInfo.Position') to [PositionOnAcknowledge](#P-Tewr-Blazor-FileReader-IFilePositionInfo-PositionOnAcknowledge 'Tewr.Blazor.FileReader.IFilePositionInfo.PositionOnAcknowledge')
and [Percentage](#P-Tewr-Blazor-FileReader-IFilePositionInfo-Percentage 'Tewr.Blazor.FileReader.IFilePositionInfo.Percentage') to [PercentageOnAcknowledge](#P-Tewr-Blazor-FileReader-IFilePositionInfo-PercentageOnAcknowledge 'Tewr.Blazor.FileReader.IFilePositionInfo.PercentageOnAcknowledge')

##### Parameters

This method has no parameters.

##### Remarks

The saved values may also be comsumed as deltas from convenience
properties [PositionDeltaSinceAcknowledge](#P-Tewr-Blazor-FileReader-IFilePositionInfo-PositionDeltaSinceAcknowledge 'Tewr.Blazor.FileReader.IFilePositionInfo.PositionDeltaSinceAcknowledge') and [PercentageDeltaSinceAcknowledge](#P-Tewr-Blazor-FileReader-IFilePositionInfo-PercentageDeltaSinceAcknowledge 'Tewr.Blazor.FileReader.IFilePositionInfo.PercentageDeltaSinceAcknowledge')

<a name='T-Tewr-Blazor-FileReader-IFileReaderRef'></a>
## IFileReaderRef `type`

##### Namespace

Tewr.Blazor.FileReader

##### Summary

Provides methods for interacting with an element that provides file streams.

<a name='M-Tewr-Blazor-FileReader-IFileReaderRef-ClearValue'></a>
### ClearValue() `method`

##### Summary

Clears any value set on the source element

##### Returns

An awaitable Task representing the operation

##### Parameters

This method has no parameters.

<a name='M-Tewr-Blazor-FileReader-IFileReaderRef-EnumerateFilesAsync'></a>
### EnumerateFilesAsync() `method`

##### Summary

Enumerates the currently selected file references

##### Returns

An awaitable Task that provides an enumeration of the currently selected file references

##### Parameters

This method has no parameters.

<a name='M-Tewr-Blazor-FileReader-IFileReaderRef-RegisterDropEventsAsync-System-Boolean-'></a>
### RegisterDropEventsAsync(additive) `method`

##### Summary

Register for drop events on the source element

##### Returns

An awaitable task representing the operation

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| additive | [System.Boolean](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Boolean 'System.Boolean') | If set to true, drop target file list becomes additive. Defaults to false. |

<a name='M-Tewr-Blazor-FileReader-IFileReaderRef-RegisterDropEventsAsync-Tewr-Blazor-FileReader-DropEvents-DropEventsOptions-'></a>
### RegisterDropEventsAsync(dropEventsOptions) `method`

##### Summary

Register for drop events on the source element

##### Returns

An awaitable task representing the operation

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| dropEventsOptions | [Tewr.Blazor.FileReader.DropEvents.DropEventsOptions](#T-Tewr-Blazor-FileReader-DropEvents-DropEventsOptions 'Tewr.Blazor.FileReader.DropEvents.DropEventsOptions') | Provides expert options for manipulating the default javascript behaviour of the drag and drop events. |

<a name='M-Tewr-Blazor-FileReader-IFileReaderRef-RegisterPasteEventAsync-System-Boolean-'></a>
### RegisterPasteEventAsync(additive) `method`

##### Summary

Register for paste events on the source element

##### Returns

An awaitable task representing the operation

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| additive | [System.Boolean](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Boolean 'System.Boolean') | If set to true, target file list becomes additive. Defaults to false. |

<a name='M-Tewr-Blazor-FileReader-IFileReaderRef-RegisterPasteEventAsync-Tewr-Blazor-FileReader-DropEvents-PasteEventOptions-'></a>
### RegisterPasteEventAsync(pasteEventOptions) `method`

##### Summary

Register for paste events on the source element

##### Returns

An awaitable task representing the operation

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| pasteEventOptions | [Tewr.Blazor.FileReader.DropEvents.PasteEventOptions](#T-Tewr-Blazor-FileReader-DropEvents-PasteEventOptions 'Tewr.Blazor.FileReader.DropEvents.PasteEventOptions') | Provides expert options for manipulating the default javascript behaviour of the paste events. |

<a name='M-Tewr-Blazor-FileReader-IFileReaderRef-UnregisterDropEventsAsync'></a>
### UnregisterDropEventsAsync() `method`

##### Summary

Unregister drop events on the source element

##### Returns

An awaitable Task representing the operation

##### Parameters

This method has no parameters.

<a name='M-Tewr-Blazor-FileReader-IFileReaderRef-UnregisterPasteEventAsync'></a>
### UnregisterPasteEventAsync() `method`

##### Summary

Unregister paste events on the source element

##### Returns

An awaitable Task representing the operation

##### Parameters

This method has no parameters.

<a name='T-Tewr-Blazor-FileReader-IFileReaderService'></a>
## IFileReaderService `type`

##### Namespace

Tewr.Blazor.FileReader

##### Summary

Servive for creating a [IFileReaderRef](#T-Tewr-Blazor-FileReader-IFileReaderRef 'Tewr.Blazor.FileReader.IFileReaderRef') instance from an element.

<a name='M-Tewr-Blazor-FileReader-IFileReaderService-CreateReference-Microsoft-AspNetCore-Components-ElementReference-'></a>
### CreateReference(element) `method`

##### Summary

Creates a new instance of [IFileReaderRef](#T-Tewr-Blazor-FileReader-IFileReaderRef 'Tewr.Blazor.FileReader.IFileReaderRef') for the specified element.

##### Returns

a new instance of [IFileReaderRef](#T-Tewr-Blazor-FileReader-IFileReaderRef 'Tewr.Blazor.FileReader.IFileReaderRef')

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| element | [Microsoft.AspNetCore.Components.ElementReference](#T-Microsoft-AspNetCore-Components-ElementReference 'Microsoft.AspNetCore.Components.ElementReference') | A reference to an element that can provide file streams. 
Should be obtained using the @ref attribute. 
Should reference either an input element of type file or a drop target. |

<a name='M-Tewr-Blazor-FileReader-IFileReaderService-EnsureInitializedAsync'></a>
### EnsureInitializedAsync() `method`

##### Summary

Explicitly initializes this instance by loading the neccessary interop code to the browser.

##### Returns



##### Parameters

This method has no parameters.

<a name='T-Tewr-Blazor-FileReader-IFileReaderServiceOptions'></a>
## IFileReaderServiceOptions `type`

##### Namespace

Tewr.Blazor.FileReader

##### Summary

Provides configuration options for [IFileReaderService](#T-Tewr-Blazor-FileReader-IFileReaderService 'Tewr.Blazor.FileReader.IFileReaderService')

<a name='P-Tewr-Blazor-FileReader-IFileReaderServiceOptions-InitializeOnFirstCall'></a>
### InitializeOnFirstCall `property`

##### Summary

Initializes the file service on the first interop call.
Redundant for client-side blazor.

##### Remarks

Initializing on the first call is neccessary only if the javascript 
interop file (FileReaderComponent.js)
has not been loaded manually using a script tag.

<a name='P-Tewr-Blazor-FileReader-IFileReaderServiceOptions-UseWasmSharedBuffer'></a>
### UseWasmSharedBuffer `property`

##### Summary

For client-side blazor, uses shared memory buffer to transfer data quickly.
Not available for server-side blazor.

<a name='T-Tewr-Blazor-FileReader-IFileReference'></a>
## IFileReference `type`

##### Namespace

Tewr.Blazor.FileReader

##### Summary

Provides properties and instance methods for the reading file metadata and aids in the creation of Readonly Stream objects.

<a name='M-Tewr-Blazor-FileReader-IFileReference-CreateMemoryStreamAsync'></a>
### CreateMemoryStreamAsync() `method`

##### Summary

Convenience method to read the file fully into memory using a single interop call 
and returns it as a [MemoryStream](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.IO.MemoryStream 'System.IO.MemoryStream'). Buffer size will be equal to the file size.
The length of the resulting [MemoryStream](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.IO.MemoryStream 'System.IO.MemoryStream') will be the same as the file size.

##### Returns

A [MemoryStream](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.IO.MemoryStream 'System.IO.MemoryStream') representing the full file, with [Position](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.IO.MemoryStream.Position 'System.IO.MemoryStream.Position') set to 0.

##### Parameters

This method has no parameters.

##### Remarks

In most cases the fastest way to read a file into ram, but also the method that uses the most memory. 
Will use at least twice the file size of memory at the end of the read operation.

<a name='M-Tewr-Blazor-FileReader-IFileReference-CreateMemoryStreamAsync-System-Threading-CancellationToken-'></a>
### CreateMemoryStreamAsync() `method`

##### Summary

Convenience method to read the file fully into memory using a single interop call 
and returns it as a [MemoryStream](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.IO.MemoryStream 'System.IO.MemoryStream'). Buffer size will be equal to the file size.
The length of the resulting [MemoryStream](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.IO.MemoryStream 'System.IO.MemoryStream') will be the same as the file size.

##### Returns

A [MemoryStream](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.IO.MemoryStream 'System.IO.MemoryStream') representing the full file, with [Position](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.IO.MemoryStream.Position 'System.IO.MemoryStream.Position') set to 0.

##### Parameters

This method has no parameters.

##### Remarks

In most cases the fastest way to read a file into ram, but the most expensive in memory usage. 
Will use at least twice the file size of memory at the end of the read operation.

<a name='M-Tewr-Blazor-FileReader-IFileReference-CreateMemoryStreamAsync-System-Int32-'></a>
### CreateMemoryStreamAsync() `method`

##### Summary

Convenience method to read the file fully into memory represented as a [MemoryStream](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.IO.MemoryStream 'System.IO.MemoryStream'), using the specified `bufferSize`.
The length of the resulting [MemoryStream](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.IO.MemoryStream 'System.IO.MemoryStream') will be the same as the file size.

##### Returns

A [MemoryStream](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.IO.MemoryStream 'System.IO.MemoryStream') representing the full file, with [Position](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.IO.MemoryStream.Position 'System.IO.MemoryStream.Position') set to 0.

##### Parameters

This method has no parameters.

<a name='M-Tewr-Blazor-FileReader-IFileReference-CreateMemoryStreamAsync-System-Int32,System-Threading-CancellationToken-'></a>
### CreateMemoryStreamAsync() `method`

##### Summary

Convenience method to read the file fully into memory represented as a [MemoryStream](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.IO.MemoryStream 'System.IO.MemoryStream'), using the specified `bufferSize`.
The length of the resulting [MemoryStream](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.IO.MemoryStream 'System.IO.MemoryStream') will be the same as the file size.

##### Returns

A [MemoryStream](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.IO.MemoryStream 'System.IO.MemoryStream') representing the full file, with [Position](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.IO.MemoryStream.Position 'System.IO.MemoryStream.Position') set to 0.

##### Parameters

This method has no parameters.

<a name='M-Tewr-Blazor-FileReader-IFileReference-GetJSObjectReferenceAsync'></a>
### GetJSObjectReferenceAsync() `method`

##### Summary

Returns the underlying file object as an [IJSObjectReference](#T-Microsoft-JSInterop-IJSObjectReference 'Microsoft.JSInterop.IJSObjectReference')

##### Returns



##### Parameters

This method has no parameters.

<a name='M-Tewr-Blazor-FileReader-IFileReference-GetObjectUrlAsync'></a>
### GetObjectUrlAsync() `method`

##### Summary

Returns an object url for a file.

##### Returns



##### Parameters

This method has no parameters.

<a name='M-Tewr-Blazor-FileReader-IFileReference-OpenReadAsync'></a>
### OpenReadAsync() `method`

##### Summary

Opens a read-only [Stream](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.IO.Stream 'System.IO.Stream') to read the file.

##### Returns

A read-only [Stream](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.IO.Stream 'System.IO.Stream') to read the file.

##### Parameters

This method has no parameters.

<a name='M-Tewr-Blazor-FileReader-IFileReference-OpenReadBase64Async'></a>
### OpenReadBase64Async() `method`

##### Summary

Opens a read-only base64-encoded string stream to read the file

##### Returns

A read-only [IBase64Stream](#T-Tewr-Blazor-FileReader-IBase64Stream 'Tewr.Blazor.FileReader.IBase64Stream') to read the file.

##### Parameters

This method has no parameters.

<a name='M-Tewr-Blazor-FileReader-IFileReference-ReadFileInfoAsync'></a>
### ReadFileInfoAsync() `method`

##### Summary

Reads the file metadata.

##### Returns

An object containing the file metadata

##### Parameters

This method has no parameters.

<a name='T-Tewr-Blazor-FileReader-IObjectUrl'></a>
## IObjectUrl `type`

##### Namespace

Tewr.Blazor.FileReader

##### Summary

Represents an object url for a file.

##### Remarks

https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL

<a name='P-Tewr-Blazor-FileReader-IObjectUrl-Url'></a>
### Url `property`

##### Summary

Returns the Object Url.

<a name='T-Tewr-Blazor-FileReader-DropEvents-PasteEventOptions'></a>
## PasteEventOptions `type`

##### Namespace

Tewr.Blazor.FileReader.DropEvents

##### Summary

Provides expert options for manipulating the default behaviour of the paste event.

<a name='P-Tewr-Blazor-FileReader-DropEvents-PasteEventOptions-Additive'></a>
### Additive `property`

##### Summary

If set to true, paste target file list becomes additive. Defaults to false.

<a name='T-Tewr-Blazor-FileReader-PlatformConfig'></a>
## PlatformConfig `type`

##### Namespace

Tewr.Blazor.FileReader

<a name='P-Tewr-Blazor-FileReader-PlatformConfig-IsWasm'></a>
### IsWasm `property`

##### Summary

Returns true if the application is running on WASM.

<a name='M-Tewr-Blazor-FileReader-PlatformConfig-TryReadMaximumReceiveMessageSize-System-IServiceProvider,System-Int64@-'></a>
### TryReadMaximumReceiveMessageSize(serviceProvider,maximumReceiveMessageSize) `method`

##### Summary

Tries reading HubOptions<ComponentHub>.MaximumReceiveMessageSize using reflection.

##### Returns

`true` if the value could be sucessfully read.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| serviceProvider | [System.IServiceProvider](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.IServiceProvider 'System.IServiceProvider') |  |
| maximumReceiveMessageSize | [System.Int64@](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int64@ 'System.Int64@') |  |

<a name='T-Tewr-Blazor-FileReader-SetupExtension'></a>
## SetupExtension `type`

##### Namespace

Tewr.Blazor.FileReader

##### Summary

Provides extension methods for setting up [IFileReaderService](#T-Tewr-Blazor-FileReader-IFileReaderService 'Tewr.Blazor.FileReader.IFileReaderService')

<a name='M-Tewr-Blazor-FileReader-SetupExtension-AddFileReaderService-Microsoft-Extensions-DependencyInjection-IServiceCollection-'></a>
### AddFileReaderService(services) `method`

##### Summary

Adds [IFileReaderService](#T-Tewr-Blazor-FileReader-IFileReaderService 'Tewr.Blazor.FileReader.IFileReaderService') as a scoped service
to the specified [IServiceCollection](#T-Microsoft-Extensions-DependencyInjection-IServiceCollection 'Microsoft.Extensions.DependencyInjection.IServiceCollection').

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| services | [Microsoft.Extensions.DependencyInjection.IServiceCollection](#T-Microsoft-Extensions-DependencyInjection-IServiceCollection 'Microsoft.Extensions.DependencyInjection.IServiceCollection') |  |

<a name='M-Tewr-Blazor-FileReader-SetupExtension-AddFileReaderService-Microsoft-Extensions-DependencyInjection-IServiceCollection,System-Action{Tewr-Blazor-FileReader-IFileReaderServiceOptions}-'></a>
### AddFileReaderService(services,setOptions) `method`

##### Summary

Adds [IFileReaderService](#T-Tewr-Blazor-FileReader-IFileReaderService 'Tewr.Blazor.FileReader.IFileReaderService') as a scoped service
to the specified [IServiceCollection](#T-Microsoft-Extensions-DependencyInjection-IServiceCollection 'Microsoft.Extensions.DependencyInjection.IServiceCollection') with the specifed `setOptions`

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| services | [Microsoft.Extensions.DependencyInjection.IServiceCollection](#T-Microsoft-Extensions-DependencyInjection-IServiceCollection 'Microsoft.Extensions.DependencyInjection.IServiceCollection') |  |
| setOptions | [System.Action{Tewr.Blazor.FileReader.IFileReaderServiceOptions}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Action 'System.Action{Tewr.Blazor.FileReader.IFileReaderServiceOptions}') | Delegate that modifies the options for [IFileReaderService](#T-Tewr-Blazor-FileReader-IFileReaderService 'Tewr.Blazor.FileReader.IFileReaderService') |
