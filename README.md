[![Build status](https://ci.appveyor.com/api/projects/status/rr7pchwk7wbc3mn1/branch/master?svg=true)](https://ci.appveyor.com/project/Tewr/blazorfilereader/branch/master)
[![NuGet](https://img.shields.io/nuget/dt/Tewr.Blazor.FileReader.svg?label=Tewr.Blazor.FileReader)](https://www.nuget.org/packages/Tewr.Blazor.FileReader)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=AC77J8GFQ6LYA&item_name=Blazor+File+Reader+Project&currency_code=EUR&source=url)

<p align="center">
  <img width="150" height="150" src="icon.svg" align="right">
</p>

# BlazorFileReader
Blazor library exposing read-only file streams in [Blazor](https://github.com/dotnet/aspnetcore/tree/master/src/Components#blazor) 
 using ```<input type="file" />```
and [FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader). Drag and drop targets may also be used to initialize streams.

Here is a [Live demo](https://tewr.github.io/BlazorFileReader/) that contains the output of [the wasm demo project](src/Demo/Blazor.FileReader.Wasm.Demo). Currently, its a build based on ```v2.0.0```.

## Installation
⚠️ Breaking changes in version <code>2.0.0.20200</code> : Changes Root Namespace from `Blazor.FileReader` to `Tewr.Blazor.FileReader`. Update your using statements and / or type references.

Use [Nuget](https://www.nuget.org/packages/Tewr.Blazor.FileReader): ```Install-Package Tewr.Blazor.FileReader```

Make sure your environment is up to date with the appropriate SDK and VS2019 16.6. See [this article](https://devblogs.microsoft.com/aspnet/blazor-webassembly-3-2-0-preview-3-release-now-available/) for more details.
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

<details><summary>Serverside/SSB: Important usage notice for versions prior to 2.1</summary>

Optional SignalR Configuration for large buffer sizes

The following notice is important for versions prior to 2.1. As of 2.1, it is no longer neccessary to modify `MaximumReceiveMessageSize`. While doing so may slightly increase transfer speed, _"we recommend < 32K per message since they are being stored in a ring buffer (default size 5000). Storing larger messages will be awful for performance"_ (<a href="https://github.com/SignalR/SignalR/issues/1205">@DavidFowl, msft, 2012</a>).

For server-side hosting, `bufferSize` + metadata (up to ~30%, depending on `buffersize`) should not exceed the SignalR `MaximumReceiveMessageSize` setting, or you will encounter a client-side exception if the file is larger than `bufferSize`.
Make sure `MaximumReceiveMessageSize` exceeds your `bufferSize` with 30% to be on the safe side. It is also recommended to set a fixed upper file size in the input tag or validate `file.Size` in code before starting the uploading. The default settings is `32KB`. Thus, if you leave this setting untouched, you should not use a buffer size exceeding `22KB`.

You can set the `MaximumReceiveMessageSize` like this in `Startup.cs` (creds [@ADefWebserver](https://github.com/ADefWebserver) for mentioning this). [Microsoft Docs](https://docs.microsoft.com/en-us/aspnet/core/signalr/configuration?view=aspnetcore-3.0&tabs=dotnet#configure-server-options)
```
services.AddServerSideBlazor().AddHubOptions(o =>
{
    o.MaximumReceiveMessageSize = 10 * 1024 * 1024; // 10MB
});
```
</details>

## Gotcha's

### Problems with reading strings using StreamReader in while header
When publishing or compiling in Release mode, the <code>Optimize</code> flag is set by default. 
Compiling with this flag set may result in problems if you are using <code>StreamReader</code>.
An [bug is open on this subject](https://github.com/mono/mono/issues/19936), being investigated by the mono team. Tracked locally [here](https://github.com/Tewr/BlazorFileReader/issues/132).
A simple workaround is available in [this issue](https://github.com/Tewr/BlazorFileReader/issues/97). Basically, don't call await in the while header, call it somewhere else.
This has been fixed in Blazor 5rc1.

### IFileReference.CreateMemoryStreamAsync()
The `IFileReference.CreateMemoryStreamAsync()` method (without any argument) is basically the same as calling `IFileReference.CreateMemoryStreamAsync(bufferSize: file.Size)`.
Calling `IFileReference.CreateMemoryStreamAsync()` may thus be unsuitable for large files (at least for client-side Blazor as the UI will be blocked during the transfer).

## Usage in a Blazor View

The code for views looks the same for both [client](src/Demo/Blazor.FileReader.Wasm.Demo)- and [server-side](/src/Demo/Blazor.FileReader.ServerSide.Demo) projects. The demo projects also contains [a drag and drop example](src/Demo/Blazor.FileReader.Demo.Common/DragnDropCommon.razor). While the demo projects are the reference, examples also exist in the [wiki](https://github.com/Tewr/BlazorFileReader/wiki).

```cs
@page "/MyPage"
@using Tewr.Blazor.FileReader
@using System.IO;
@inject IFileReaderService fileReaderService;

<input type="file" @ref=inputTypeFileElement /><button @onclick=ReadFile>Read file</button>

@code
{
    private ElementReference inputTypeFileElement;

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

            // Read file fully into memory and act
            using (MemoryStream memoryStream = await file.CreateMemoryStreamAsync(4096)) {
                // Sync calls are ok once file is in memory
                memoryStream.Read(buffer, ...)
            }
        }
    }
}
```

## Version notes
Version <code>2.1.0.20274</code> WASM/CSB: Fixes a problem with large files and small buffer sizes.
Server-side/SSB: Simplifies Setup, removes need for SignalR max size setting (`MaximumReceiveMessageSize`). It is recommended to remove the modification of this value, if present. Adds multithreaded fetch & message chunking for SignalR.

<details><summary>Older versions</summary>
<details><summary>Version <code>2.0.0.20242</code></summary> Fixes a bug when working with file larger than 2Gb in InteropStream.Seek (#153)</details>

<details><summary>Version <code>2.0.0.20200</code></summary> ⚠️ Breaking changes: Changes Root Namespace from `Blazor.FileReader` to `Tewr.Blazor.FileReader` to avoid conflicts.
- `CancellationToken` can now be used in most relevant methods to cancel ongoing upload.
- Native support for displaying progress. See <a href="/src/Demo/Blazor.FileReader.Demo.Common/IndexCommon.razor#L74">demo project</a> for usage.</details>

<details><summary>Version <code>1.6.0.20166</code></summary> Fixes a <a href="https://github.com/Tewr/BlazorFileReader/issues/139">a memory allocation bug</a> (before this fix - since <code>v1.3.0.20033</code> - the browser would allocate the whole file in ram). 
Also, introduces a new collection property on <code>File</code> for non-standard properties (thanks to <a href="https://github.com/DouglasDwyer/">@DouglasDwyer</a> for idea and implementation)</details>

<details><summary>Version <code>1.5.0.20109</code></summary> Fixes a <a href="https://github.com/Tewr/BlazorFileReader/issues/124">a minor bug</a> in drag and drop (before this fix, could not drop on child elements) </details>

<details><summary>Version <code>1.5.0.20093</code></summary> reverts a dependency to latest stable version of <code>Microsoft.AspNetCore.Components (5.0.0-preview.1.20124.5 -> 3.1.3)</code></details>

<details><summary>Version <code>1.5.0.20092</code></summary> adds compatibility with Blazor 3.2 (CSB / Wasm) preview 3. Package now depends on latest version of <code>Microsoft.AspNetCore.Components (3.0.0 -> 5.0.0-preview.1.20124.5)</code></details>

<details><summary>Version <code>1.4.0.20072</code></summary> adds compatibility with Blazor 3.2 (CSB / Wasm) preview 2. Also Adds support for the <code>IAsyncDisposable</code> interface.</details>

<details><summary>Version <code>1.3.0.20049</code></summary> fixes <a href="https://github.com/Tewr/BlazorFileReader/issues/55">a bug</a> that would throw an exception when attempting to use reflection on the assembly (Server-side / SSB).</details>

<details><summary>Version <code>1.3.0.20041</code></summary> fixes a faulty assembly version in the package.</details>

<details><summary>Version <code>1.3.0.20033</code></summary> adds compatibility with Blazor 3.2 (CSB / Wasm). Attention, <code>ReadAsync</code> is no longer a fully async implementation and may run on the UI thread. If you are using a progress bar or similar progress reporting it might be necessary to yield back to the renderer. See the demo project for an example - it is using <code>await Task.Delay(1);</code> to render while reading.</details>

<details><summary>Version <code>1.2.0.19363</code></summary> fixes a bug in how the offset parameter is interpreted - now represents target buffer offset, not source buffer offset. The setup option <code>InitializeOnFirstCall</code> now defaults to <code>true</code>.</details>

<details><summary>Version <code>1.1.0.19274</code></summary> adds a parameter to <code>IFileReaderRef.RegisterDropEventsAsync</code> for specifying additive drag n drop: When called with parameter set to true, will not reset file list of drop target (see <a href="https://github.com/Tewr/BlazorFileReader/blob/821a8307743d23375642bf9db505d3377dcdf8f3/src/Demo/Blazor.FileReader.Demo.Common/DragnDropCommon.razor#L72">demo</a> for usage). Thanks <a href="https://github.com/DNF-Sas">@DNF-SaS</a> for the <a href="https://github.com/Tewr/BlazorFileReader/issues/91">feature suggestion</a>.</details>

<details><summary>Version <code>1.0.0.19267</code></summary> adds support for <code>v3.0.100</code></details>

<details><summary>Version <code>0.16.0.19262</code></summary> fixes <a href="https://github.com/Tewr/BlazorFileReader/issues/55">a packaging issue</a>.</details>

<details><summary>Version <code>0.16.0.19261</code></summary> adds support for <code>v3.0.100-rc1-014190</code></details>

<details><summary>Version <code>0.15.0.19242</code></summary> adds support for <code>v3.0.0-preview9-014004</code>. Also fixes <a href="https://github.com/Tewr/BlazorFileReader/issues/55">a minor packaging issue</a>. New API: <a href="https://github.com/Tewr/BlazorFileReader/blob/d9cdea5d954eeac6f3ba2a99ec5dbc9181bc23de/src/Blazor.FileReader/FileReaderRef.cs#L50">IBase64Stream</a>, for optimizing third-party cloud uploads (data exposed as raw base64 strings). Mostly interesting for server-side deployments.</details>

<details><summary>Version <code>0.14.19242</code></summary> fixes <a href="https://github.com/Tewr/BlazorFileReader/issues/71">a possible race condition for server-side initialization</a>.</details>

<details><summary>Version <code>0.14.19226</code></summary> adds support for sdk  <code>3.0.0-preview8-013656</code>. Adds shared Buffer back again for WASM, this can be activated by setting the <code>UseWasmSharedBuffer</code> option to true (recommended).</details>

<details><summary>Version <code>0.13.19207</code></summary>` Fixes a regression with the <code>ClearValue</code> method and adds some essential events to the drag and drop api.</details>

<details><summary>Version <code>0.13.19206</code></summary> adds support for sdk <code>3.0.0-preview7.19365.7</code>. New feature: Drag and drop (contribution by <a href="https://github.com/catlan">@catlan</a>)</details>

<details><summary>Version <code>0.12.19186</code></summary> fixes an issue with server-side setup which was only visible when having multiple users.</details>

<details><summary>Version <code>0.12.19168</code></summary> adds support for sdk <code>3.0.0-preview6.19307.2</code>, and several issues are resolved with this release, notably meticulous setup and issues with buffer size for server-side projects. Also, the Wasm helper package has been deprecated.</details>

<details><summary>Version <code>0.11.0</code></summary> adds support for sdk <code>3.0.0-preview5-19227-01</code>. It also introduces a tiny feature: The <code>IFileReaderRef.ClearValue()</code> method, used to clear the value of a referenced file input. Also, fixes a bug in Edge and a package issue.</details>

<details><summary>Version <code>0.10.0</code></summary> adds support for sdk <code>v3.0.0-preview-4-19216-03</code></details>

<details><summary>Versions <code>0.9.0</code></summary> introduces a small helper-package for the IoC setup of Wasm, injecting an implementation of <code>IInvokeUnmarshalled</code>.</details>

<details><summary>Versions <code>0.8.0</code></summary> requires copy-paste implementation of <code>IInvokeUnmarshalled</code>.</details>

<details><summary>Versions previous to <code>0.7.1</code></summary> did not support server-side Blazor and would throw <code>[System.PlatformNotSupportedException] Requires MonoWebAssemblyJSRuntime as the JSRuntime</code>.</details>

<details><summary>Versions previous to <code>0.5.1</code></summary> wrapped the input element in a Blazor Component, this has been removed for better configurability and general lack of value.</details>
</details>
