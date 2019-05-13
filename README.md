[![Build status](https://ci.appveyor.com/api/projects/status/rr7pchwk7wbc3mn1/branch/master?svg=true)](https://ci.appveyor.com/project/Tewr/blazorfilereader/branch/master)
[![NuGet](https://img.shields.io/nuget/dt/Tewr.Blazor.FileReader.Wasm.svg?label=Tewr.Blazor.FileReader.Wasm)](https://www.nuget.org/packages/Tewr.Blazor.FileReader.Wasm)
[![NuGet](https://img.shields.io/nuget/dt/Tewr.Blazor.FileReader.svg?label=Tewr.Blazor.FileReader)](https://www.nuget.org/packages/Tewr.Blazor.FileReader)

# BlazorFileReader
Blazor library and Demo of read-only file streams in [Blazor](https://github.com/aspnet/Blazor). 
Originally built for Wasm ("Client-side" Blazor), Server-side Blazor (previously aka RazorComponents) is also supported as of version 0.7.1.

This library exposes read-only streams using ```<input type="file" />```
and [FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader).

Here is a [Live demo](https://tewr.github.io/BlazorFileReader/) that contains the output of [the wasm demo project](src/Blazor.FileReader.Wasm.Demo). Currently, its a build based on ```v0.5.1```.

## Installation

```0.12.0``` is a pre-release version. First of all, make sure your environment is up to date with the appropriate SDK and VS2019 preview. See [this article](https://devblogs.microsoft.com/aspnet/blazor-now-in-official-preview/) for more details.
Depending on your [project type](https://docs.microsoft.com/en-us/aspnet/core/razor-components/faq?view=aspnetcore-3.0), use one of the two examples below.

### Client-side / Wasm Project type
Use [Nuget](https://www.nuget.org/packages/Tewr.Blazor.FileReader.Wasm): ```Install-Package Tewr.Blazor.FileReader.Wasm```

Setup IoC for ```IFileReaderService```as in ([Startup.cs](src/Blazor.FileReader.Wasm.Demo/Startup.cs#L11)):

```cs
services.AddFileReaderService();

```

### Server-side / asp.net core Project type

Use [Nuget](https://www.nuget.org/packages/Tewr.Blazor.FileReader): ```Install-Package Tewr.Blazor.FileReader```

Setup IoC for  ```IFileReaderService``` as in the example ([Startup.cs](src/Blazor.FileReader.ServerSide.Demo/Startup.cs#L27)) as a scoped dependency:

```cs
services.AddScoped<IFileReaderService, FileReaderService>();

```

Blazor View (.razor page)

Most use-cases are outline in the [example](src/Blazor.FileReader.Wasm.Demo/) [projects](src/Blazor.FileReader.ServerSide.Demo/).
The code for views mostly looks the same for both client- and server-side projects, 
but take a look at [known issues](README.md#known-issues) for server-side projects.


```cs
@page "/MyPage"
@using System.IO;
@inject IFileReaderService fileReaderService;

<input type="file" ref="myInput" />
<button onclick="@ReadFile">Read file</button>

@functions {
    ElementRef myInput;

    public async Task ReadFile()
    {
        foreach (var file in await fileReaderService.CreateReference(myInput).EnumerateFilesAsync())
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

## Known issues

As of dotnet sdk 3.0.100-preview4, Server-side blazor has [a problem with "big" messages](https://github.com/Tewr/BlazorFileReader/issues/24). For now, buffersize must be set, and must be set to something quite low for this to work without crashes. 2k bytes seems to work alright in chrome, YMMV.

## Notes

To use the code in this demo in your own project you need to use at least version 
```0.4.0``` of blazor (see branch 0.4.0). 

The ```master``` branch uses ```v3.0.0-preview-4-19216-03``` of Blazor.

Blazor is an ~~experimental~~ preview project. Just as Blazor API frequently has breaking changes, so does the API of this library.

### Version notes

Version ```0.12.0``` Simplifies the setup experience. It is no longer neccessary to include the library js file. For WASM / Client side, the loading is supported out of the box by the blazor framework. 
For server-side, by default, the js code will be lazy-loaded, the first call doing any interop. 
The loading can optionally be forced preemptively using ```IFileReaderService.EnsureInitializedAsync()```

Version ```0.11.0``` adds support for sdk ```3.0.0-preview5-19227-01```. It also introduces a tiny feature: The ```IFileReaderRef.ClearValue()``` method, used to clear the value of a referenced file input. Also, fixes a bug in Edge and a package issue.

Version ```0.10.0``` adds support for sdk ```v3.0.0-preview-4-19216-03```

Versions ```0.9.0``` introduces a small helper-package for the IoC setup of Wasm, injecting an implementation of ```IInvokeUnmarshalled```.

Versions ```0.8.0``` requires copy-paste implementation of ```IInvokeUnmarshalled```.

Versions previous to ```0.7.1``` did not support server-side Blazor and would throw ```[System.PlatformNotSupportedException] Requires MonoWebAssemblyJSRuntime as the JSRuntime```.

Versions previous to ```0.5.1``` wrapped the input element in a Blazor Component, this has been removed for better configurability and general lack of value.


