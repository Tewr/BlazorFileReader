[![Build status](https://ci.appveyor.com/api/projects/status/rr7pchwk7wbc3mn1/branch/master?svg=true)](https://ci.appveyor.com/project/Tewr/blazorfilereader/branch/master)
[![NuGet](https://img.shields.io/nuget/vpre/Tewr.Blazor.FileReader.Wasm.svg?label=Tewr.Blazor.FileReader.Wasm)](https://www.nuget.org/packages/Tewr.Blazor.FileReader.Wasm)
[![NuGet](https://img.shields.io/nuget/vpre/Tewr.Blazor.FileReader.svg?label=Tewr.Blazor.FileReader)](https://www.nuget.org/packages/Tewr.Blazor.FileReader)

# BlazorFileReader
Blazor library and Demo of read-only file streams in [Blazor](https://github.com/aspnet/Blazor). 
Originally built for Wasm ("Client-side" Blazor), Server-side Blazor (previously aka RazorComponents) is also supported as of version 0.7.1.

This library exposes read-only streams using ```<input type="file" />```
and [FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader).

Here is a [Live demo](https://tewr.github.io/BlazorFileReader/) that contains the output of [the wasm demo project](src/Blazor.FileReader.Wasm.Demo). Currently, its a build based on ```v0.5.1```.

## Installation

```0.9.0``` is a pre-release version. First of all, make sure your environment is up to date with the appropriate SDK and VS2019 preview 4. See [this article](https://devblogs.microsoft.com/aspnet/blazor-0-9-0-experimental-release-now-available/ ) for more details.
Depending on your [project type](https://docs.microsoft.com/en-us/aspnet/core/razor-components/faq?view=aspnetcore-3.0), use one of the two examples below.

### Client-side / Wasm Project type
Use [Nuget](https://www.nuget.org/packages/Tewr.Blazor.FileReader.Wasm): ```Install-Package Tewr.Blazor.FileReader.Wasm -Version 0.9.0-preview-13032019```

Setup IoC for ```IFileReaderService```as in ([Startup.cs](src/Blazor.FileReader.Wasm.Demo/Startup.cs#L11)):

```cs
services.AddFileReaderService();

```

You must manually include the javascript required due to a [missing](https://github.com/Tewr/BlazorFileReader/issues/13) 
[feature](https://github.com/aspnet/AspNetCore/issues/7300) in Server components 
Download [FileReaderComponent.js](src/Blazor.FileReader/content/FileReaderComponent.js) (or extract it from the nuget package content folder) and reference it in 
[wwwroot/index.html](src/Blazor.FileReader.Wasm.Demo/wwwroot/index.html#L153) after the line
```html
<script src="_framework/components.server.js"></script>

```

### Server-side / asp.net core Project type

Use [Nuget](https://www.nuget.org/packages/Tewr.Blazor.FileReader): ```Install-Package Tewr.Blazor.FileReader -Version 0.9.0-preview-13032019```

Setup IoC for  ```IFileReaderService``` as in the example ([Startup.cs](src/Blazor.FileReader.ServerSideBlazor.Demo/Startup.cs#L27)) as a scoped dependency:

```cs
services.AddScoped<IFileReaderService, FileReaderService>();

```

You must manually include the javascript required due to a [missing](https://github.com/Tewr/BlazorFileReader/issues/13) 
[feature](https://github.com/aspnet/AspNetCore/issues/7300) in Server components 
Download [FileReaderComponent.js](/src/Blazor.FileReader/content/FileReaderComponent.js) (or extract it from the nuget package content folder) and reference it in 
[Pages/index.cshtml](src/Blazor.FileReader.ServerSideBlazor.Demo/Pages/Index.cshtml#L25) after the line
```html
<script src="_framework/components.server.js"></script>

```
## Usage in a Blazor View

The code for views looks the same for both client- and server-side projects.

```cs
@page "/MyPage"
@using System.IO;
@inject IFileReaderService fileReaderService;

<input type="file" ref="inputTypeFileElement" /><button onclick="@ReadFile">Read file</button>

@functions {
    ElementRef inputTypeFileElement;

    public async Task ReadFile()
    {
        foreach (var file in await fileReaderService.CreateReference(inputTypeFileElement).EnumerateFilesAsync())
        {
            // Read into buffer and act (uses less memory)
            using(Stream stream = await file.OpenReadAsync()) {
                // Do (async) stuff with stream...
                await stream.ReadAsync(buffer, ...);
                // The following will fail. Only async read is allowed.
                stream.Read(buffer, ...)
            }

            // Read into memory and act
            using(MemoryStream memoryStream = await file.CreateMemoryStreamAsync(4096)) {
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

The ```master``` branch uses ```v0.9.0``` of Blazor.

Blazor is an experimental project, not ready for production use. Just as Blazor frequently has breaking changes, so does the API of this library.

### Version notes

Versions ```0.9.0``` introduces a small helper-package for the IoC setup of Wasm, injecting an implementation of ```IInvokeUnmarshalled```.

Versions ```0.8.0``` requires copy-paste implementation of ```IInvokeUnmarshalled```.

Versions previous to ```0.7.1``` did not support server-side Blazor and would throw ```[System.PlatformNotSupportedException] Requires MonoWebAssemblyJSRuntime as the JSRuntime```.

Versions previous to ```0.5.1``` wrapped the input element in a Blazor Component, this has been removed for better configurability and general lack of value.


