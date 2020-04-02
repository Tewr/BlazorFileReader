[![Build status](https://ci.appveyor.com/api/projects/status/rr7pchwk7wbc3mn1/branch/master?svg=true)](https://ci.appveyor.com/project/Tewr/blazorfilereader/branch/master)
[![NuGet](https://img.shields.io/nuget/dt/Tewr.Blazor.FileReader.svg?label=Tewr.Blazor.FileReader)](https://www.nuget.org/packages/Tewr.Blazor.FileReader)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=AC77J8GFQ6LYA&item_name=Blazor+File+Reader+Project&currency_code=EUR&source=url)

<p align="center">
  <img width="150" height="150" src="icon.svg">
</p>

# BlazorFileReader
Blazor library exposing read-only file streams in [Blazor](https://github.com/dotnet/aspnetcore/tree/master/src/Components#blazor) 
 using ```<input type="file" />```
and [FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader). Drag and drop targets may also be used to initialize streams.

Here is a [Live demo](https://tewr.github.io/BlazorFileReader/) that contains the output of [the wasm demo project](src/Demo/Blazor.FileReader.Wasm.Demo). Currently, its a build based on ```v1.3.0```.

## Installation

Use [Nuget](https://www.nuget.org/packages/Tewr.Blazor.FileReader): ```Install-Package Tewr.Blazor.FileReader```

Make sure your environment is up to date with the appropriate SDK and VS2019 16.4. See [this article](https://devblogs.microsoft.com/aspnet/asp-net-core-and-blazor-updates-in-net-core-3-0/) for more details.
Depending on your [project type](https://docs.microsoft.com/en-us/aspnet/core/razor-components/faq?view=aspnetcore-3.0), use one of the two examples below. 
For a complete use-case, see the [client](src/Demo/Blazor.FileReader.Wasm.Demo) or [server-side](/src/Demo/Blazor.FileReader.ServerSide.Demo) demo projects.

### Client-side / Wasm Project type / "CSB"

Setup IoC for ```IFileReaderService```as in ([Program.cs](/src/Demo/Blazor.FileReader.Wasm.Demo/Program.cs#L13)):

```cs
services.AddFileReaderService(options => options.UseWasmSharedBuffer = true);

```

### Server-side / asp.net core Project type / "SSB"

Setup IoC for  ```IFileReaderService``` as in the example ([Startup.cs](src/Demo/Blazor.FileReader.ServerSide.Demo/Startup.cs#L16)):

```cs
services.AddFileReaderService();

```

#### IIS Hosting Bug (Fixed)
<details><summary>Read this for versions 0.12-0.16</summary>

⚠️🐛 If you are using IIS to host your server-side application, you should also add the following as the first statement of the [Startup.cs Configure() method](src/Demo/Blazor.FileReader.ServerSide.Demo/Startup.cs#L21) to avoid a SignalR / IIS bug. This bug will only appear after a certain time, or never, for most applications, but may appear quickly when using this library as it depends on the amount of data being transferred over SignalR (by default slightly less than 22MB of file data, or 30MB of raw data). Credits to [IVData](https://github.com/IVData) for the find. The bug is [fixed in release 3.0](https://github.com/aspnet/AspNetCore/issues/13470#issuecomment-525478423), at that point the following can (should) be removed.

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

</details>

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
Calling `IFileReference.CreateMemoryStreamAsync()` may thus be unsuitable for large files (at least for client-side Blazor as the UI will be blocked during the transfer).

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
            await using (Stream stream = await file.OpenReadAsync()) {
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

### Version notes
Version <code>1.5.0.20093</code> reverts a dependency to latest stable version of <code>Microsoft.AspNetCore.Components (5.0.0-preview.1.20124.5 -> 3.1.3)</code>

Version <code>1.5.0.20092</code> adds compatibility with Blazor 3.2 (CSB / Wasm) preview 3. Package now depends on latest version of <code>Microsoft.AspNetCore.Components (3.0.0 -> 5.0.0-preview.1.20124.5)</code>

<details><summary>Version <code>1.4.0.20072</code></summary> adds compatibility with Blazor 3.2 (CSB / Wasm) preview 2. Also Adds support for the <code>IAsyncDisposable</code> interface.</details>

<details><summary>Version <code>1.3.0.20049</code></summary> fixes [a bug](https://github.com/Tewr/BlazorFileReader/issues/55) that would throw an exception when attempting to use reflection on the assembly (Server-side / SSB).</details>

<details><summary>Version <code>1.3.0.20041</code></summary> fixes a faulty assembly version in the package.</details>

<details><summary>Version <code>1.3.0.20033</code></summary> adds compatibility with Blazor 3.2 (CSB / Wasm). Attention, ```ReadAsync``` is no longer a fully async implementation and may run on the UI thread. If you are using a progress bar or similar progress reporting it might be necessary to yield back to the renderer. See the demo project for an example - it is using ```await Task.Delay(1);``` to render while reading.</details>

<details><summary>Version <code>1.2.0.19363</code></summary> fixes a bug in how the offset parameter is interpreted - now represents target buffer offset, not source buffer offset. The setup option ```InitializeOnFirstCall``` now defaults to ```true```.</details>

<details><summary>Version <code>1.1.0.19274</code></summary> adds a parameter to ```IFileReaderRef.RegisterDropEventsAsync``` for specifying additive drag n drop: When called with parameter set to true, will not reset file list of drop target (see [demo](https://github.com/Tewr/BlazorFileReader/blob/821a8307743d23375642bf9db505d3377dcdf8f3/src/Demo/Blazor.FileReader.Demo.Common/DragnDropCommon.razor#L72) for usage). Thanks [@DNF-SaS](https://github.com/DNF-Sas) for the [feature suggestion](https://github.com/Tewr/BlazorFileReader/issues/91).</details>

<details><summary>Version <code>1.0.0.19267</code></summary> adds support for ```v3.0.100```</details>

<details><summary>Version <code>0.16.0.19262</code></summary> fixes [a packaging issue](https://github.com/Tewr/BlazorFileReader/issues/55).</details>

<details><summary>Version <code>0.16.0.19261</code></summary> adds support for ```v3.0.100-rc1-014190```</details>

<details><summary>Version <code>0.15.0.19242</code></summary> adds support for ```v3.0.0-preview9-014004```. Also fixes [a minor packaging issue](https://github.com/Tewr/BlazorFileReader/issues/55). New API: [IBase64Stream](https://github.com/Tewr/BlazorFileReader/blob/d9cdea5d954eeac6f3ba2a99ec5dbc9181bc23de/src/Blazor.FileReader/FileReaderRef.cs#L50), for optimizing third-party cloud uploads (data exposed as raw base64 strings). Mostly interesting for server-side deployments.</details>

<details><summary>Version <code>0.14.19242</code></summary> fixes [a possible race condition for server-side initialization](https://github.com/Tewr/BlazorFileReader/issues/71).</details>

<details><summary>Version <code>0.14.19226</code></summary> adds support for sdk  ```3.0.0-preview8-013656```. Adds shared Buffer back again for WASM, this can be activated by setting the ```UseWasmSharedBuffer``` option to true (recommended).</details>

<details><summary>Version <code>0.13.19207</code></summary>` Fixes a regression with the ```ClearValue``` method and adds some essential events to the drag and drop api.</details>

<details><summary>Version <code>0.13.19206</code></summary> adds support for sdk ```3.0.0-preview7.19365.7```. New feature: Drag and drop (contribution by [@catlan](https://github.com/catlan))</details>

<details><summary>Version <code>0.12.19186</code></summary> fixes an issue with server-side setup which was only visible when having multiple users.</details>

<details><summary>Version <code>0.12.19168</code></summary> adds support for sdk ```3.0.0-preview6.19307.2```, and several issues are resolved with this release, notably meticulous setup and issues with buffer size for server-side projects. Also, the Wasm helper package has been deprecated.</details>

<details><summary>Version <code>0.11.0</code></summary> adds support for sdk ```3.0.0-preview5-19227-01```. It also introduces a tiny feature: The ```IFileReaderRef.ClearValue()``` method, used to clear the value of a referenced file input. Also, fixes a bug in Edge and a package issue.</details>

<details><summary>Version <code>0.10.0</code></summary> adds support for sdk ```v3.0.0-preview-4-19216-03```</details>

<details><summary>Versions <code>0.9.0</code></summary> introduces a small helper-package for the IoC setup of Wasm, injecting an implementation of ```IInvokeUnmarshalled```.</details>

<details><summary>Versions <code>0.8.0</code></summary> requires copy-paste implementation of ```IInvokeUnmarshalled```.</details>

<details><summary>Versions previous to <code>0.7.1</code></summary> did not support server-side Blazor and would throw ```[System.PlatformNotSupportedException] Requires MonoWebAssemblyJSRuntime as the JSRuntime```.</details>

<details><summary>Versions previous to <code>0.5.1</code></summary> wrapped the input element in a Blazor Component, this has been removed for better configurability and general lack of value.</details>
