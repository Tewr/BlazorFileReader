[![Build status](https://ci.appveyor.com/api/projects/status/rr7pchwk7wbc3mn1/branch/master?svg=true)](https://ci.appveyor.com/project/Tewr/blazorfilereader/branch/master)
[![NuGet](https://img.shields.io/nuget/dt/Tewr.Blazor.FileReader.svg?label=Tewr.Blazor.FileReader)](https://www.nuget.org/packages/Tewr.Blazor.FileReader)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=AC77J8GFQ6LYA&item_name=Blazor+File+Reader+Project&currency_code=EUR&source=url)

<p align="center">
  <img width="150" height="150" src="icon.svg">
</p>

# BlazorFileReader
Blazor library exposing read-only file streams in [Blazor](https://github.com/aspnet/AspNetCore/tree/master/src/Components). 

This library exposes read-only streams using ```<input type="file" />```
and [FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader). Drag and drop may also be used to initialize streams.

Originally built for Wasm ("Client-side" Blazor), Server-side Blazor (previously aka RazorComponents) is also supported as of version 0.7.1.

Here is a [Live demo](https://tewr.github.io/BlazorFileReader/) that contains the output of [the wasm demo project](src/Demo/Blazor.FileReader.Wasm.Demo). Currently, its a build based on ```v0.15.0```.

## Installation

```0.15.0``` is a pre-release version. First of all, make sure your environment is up to date with the appropriate SDK and VS2019 preview 8. See [this article](https://devblogs.microsoft.com/aspnet/asp-net-core-and-blazor-updates-in-net-core-3-0-preview-8/) for more details.
Depending on your [project type](https://docs.microsoft.com/en-us/aspnet/core/razor-components/faq?view=aspnetcore-3.0), use one of the two examples below. 
For a complete use-case, see the [client](src/Demo/Blazor.FileReader.Wasm.Demo) or [server-side](/src/Demo/Blazor.FileReader.ServerSide.Demo) demo projects.

### Client-side / Wasm Project type
Use [Nuget](https://www.nuget.org/packages/Tewr.Blazor.FileReader): ```Install-Package Tewr.Blazor.FileReader```

Setup IoC for ```IFileReaderService```as in ([Startup.cs](src/Demo/Blazor.FileReader.Wasm.Demo/Startup.cs#L11)):

```cs
services.AddFileReaderService(options => options.UseWasmSharedBuffer = true);

```

### Server-side / asp.net core Project type

Use [Nuget](https://www.nuget.org/packages/Tewr.Blazor.FileReader): ```Install-Package Tewr.Blazor.FileReader```

Setup IoC for  ```IFileReaderService``` as in the example ([Startup.cs](src/Demo/Blazor.FileReader.ServerSide.Demo/Startup.cs#L16)):

```cs
services.AddFileReaderService(options => options.InitializeOnFirstCall = true);

```

#### IIS Hosting Bug
⚠️🐛 If you are using IIS to host your server-side application, you should also add the following as the first statement of the [Startup.cs Configure() method](src/Demo/Blazor.FileReader.ServerSide.Demo/Startup.cs#L21) to avoid a SignalR / IIS bug. This bug will only appear after a certain time, or never, for most applications, but may appear quickly when using this library as it depends on the amount of data being transferred over SignalR (by default slightly less than 22MB of file data, or 30MB of raw data). Credits to [IVData](https://github.com/IVData) for the find. The bug should be [fixed in release 3.0](https://github.com/aspnet/AspNetCore/issues/13470#issuecomment-525478423), at that point the following can be removed.

```cs
using Microsoft.AspNetCore.Http.Features;

        // (...)
        
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // Temporary workaround for https://github.com/aspnet/AspNetCore/issues/13470
            app.Use(async (context, next) =>
            {
                context.Features.Get<IHttpMaxRequestBodySizeFeature>().MaxRequestBodySize = null;
                await next.Invoke();
            });
            
            // (...)
```

#### Optional SignalR Configuration for large buffer sizes
For server-side hosting, `bufferSize` + metadata (up to ~30%, depending on `buffersize`) should not exceed the SignalR `MaximumReceiveMessageSize` setting, or you will encounter a client-side exception if the file is larger than `bufferSize`.
Make sure `MaximumReceiveMessageSize` exceeds your `bufferSize` with 30% to be on the safe side. It is also recommended to set a fixed upper file size in the input tag or validate `file.Size` in code before starting the uploading. The default settings is `32KB`. Thus, if you leave this setting untouched, you should not use a buffer size exceeding `22KB`.

You can set the `MaximumReceiveMessageSize` like this in `Startup.cs` (creds [@ADefWebserver](https://github.com/ADefWebserver) for mentioning this). [Microsoft Docs](https://docs.microsoft.com/en-us/aspnet/core/signalr/configuration?view=aspnetcore-3.0&tabs=dotnet#configure-server-options)
```
services.AddServerSideBlazor().AddHubOptions(o =>
{
    o.MaximumReceiveMessageSize = 10 * 1024 * 1024; // 10MB
});
```
## Gotcha's

### IFileReference.CreateMemoryStreamAsync()
The `IFileReference.CreateMemoryStreamAsync()` method (without any argument) is basically the same as calling `IFileReference.CreateMemoryStreamAsync(bufferSize: file.Size)`.
Calling `IFileReference.CreateMemoryStreamAsync()` may thus be unsuitable for large files.

## Usage in a Blazor View

The code for views looks the same for both [client](src/Demo/Blazor.FileReader.Wasm.Demo)- and [server-side](/src/Demo/Blazor.FileReader.ServerSide.Demo) projects. The demo projects also contains [a drag and drop example](src/Demo/Blazor.FileReader.Demo.Common/DragnDropCommon.razor). While the demo projects are the reference, examples also exist in the [wiki](https://github.com/Tewr/BlazorFileReader/wiki).

```cs
@page "/MyPage"
@using System.IO;
@inject IFileReaderService fileReaderService;

<input type="file" @ref=inputTypeFileElement /><button @onclick=ReadFile>Read file</button>

@functions {

    public async Task ReadFile()
    {
        foreach (var file in await fileReaderService.CreateReference(inputTypeFileElement).EnumerateFilesAsync())
        {
            // Read into buffer and act (uses less memory)
            using (Stream stream = await file.OpenReadAsync()) {
                // Do (async) stuff with stream...
                await stream.ReadAsync(buffer, ...);
                // The following will fail. Only async read is allowed.
                stream.Read(buffer, ...)
            }

            // Read into memory and act
            using (MemoryStream memoryStream = await file.CreateMemoryStreamAsync(4096)) {
                // Sync calls are ok once file is in memory
                memoryStream.Read(buffer, ...)
            }
        }
    }
}
```



## Notes

To use the code in this demo in your own project you need to use at least version 
```0.4.0``` of blazor (see branch 0.4.0). 

The ```master``` branch uses the ```v3.0.0-preview9-014004``` sdk.

Blazor is a ~~experimental~~ preview project, but ~~not~~ [ready for production use](https://devblogs.microsoft.com/dotnet/announcing-net-core-3-0-preview-9/#user-content-go-live). Just as Blazor API frequently has breaking changes, so does the API of this library.

### Version notes

Version ```0.15.0.19242``` adds support for ```v3.0.0-preview9-014004```. Also fixes [a minor packaging issue](https://github.com/Tewr/BlazorFileReader/issues/55). New API: [IBase64Stream](https://github.com/Tewr/BlazorFileReader/blob/d9cdea5d954eeac6f3ba2a99ec5dbc9181bc23de/src/Blazor.FileReader/FileReaderRef.cs#L50), for optimizing third-party cloud uploads (data exposed as raw base64 strings). Mostly interesting for server-side deployments.

Version ```0.14.19242``` fixes [a possible race condition for server-side initialization](https://github.com/Tewr/BlazorFileReader/issues/71).

Version ```0.14.19226``` adds support for sdk  ```3.0.0-preview8-013656```. Adds shared Buffer back again for WASM, this can be activated by setting the ```UseWasmSharedBuffer``` option to true (recommended).

Version ```0.13.19207``` Fixes a regression with the ```ClearValue``` method and adds some essential events to the drag and drop api.

Version ```0.13.19206``` adds support for sdk ```3.0.0-preview7.19365.7```. New feature: Drag and drop (contribution by [@catlan](https://github.com/catlan))

Version ```0.12.19186``` fixes an issue with server-side setup which was only visible when having multiple users.

Version ```0.12.19168``` adds support for sdk ```3.0.0-preview6.19307.2```, and several issues are resolved with this release, notably meticulous setup and issues with buffer size for server-side projects. Also, the Wasm helper package has been deprecated.

Version ```0.11.0``` adds support for sdk ```3.0.0-preview5-19227-01```. It also introduces a tiny feature: The ```IFileReaderRef.ClearValue()``` method, used to clear the value of a referenced file input. Also, fixes a bug in Edge and a package issue.

Version ```0.10.0``` adds support for sdk ```v3.0.0-preview-4-19216-03```

Versions ```0.9.0``` introduces a small helper-package for the IoC setup of Wasm, injecting an implementation of ```IInvokeUnmarshalled```.

Versions ```0.8.0``` requires copy-paste implementation of ```IInvokeUnmarshalled```.

Versions previous to ```0.7.1``` did not support server-side Blazor and would throw ```[System.PlatformNotSupportedException] Requires MonoWebAssemblyJSRuntime as the JSRuntime```.

Versions previous to ```0.5.1``` wrapped the input element in a Blazor Component, this has been removed for better configurability and general lack of value.


