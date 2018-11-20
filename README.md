[![Build status](https://ci.appveyor.com/api/projects/status/rr7pchwk7wbc3mn1/branch/master?svg=true)](https://ci.appveyor.com/project/Tewr/blazorfilereader/branch/master)
[![NuGet](https://img.shields.io/nuget/v/Tewr.Blazor.FileReader.svg)](https://www.nuget.org/packages/Tewr.Blazor.FileReader)

# BlazorFileReader
Blazor library and Demo of read-only file streams in [Blazor](https://github.com/aspnet/Blazor). 

This demo exposes read-only streams using ```<input type="file" />```
and [FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader).

Here is a [Live demo](https://tewr.github.io/BlazorFileReader/) that contains the output of [the demo project](src/Blazor.FileReader.Demo). Currently, its a build based on ```v0.5.1```.

## Installation

Use [Nuget](https://www.nuget.org/packages/Tewr.Blazor.FileReader): ```Tewr.Blazor.FileReader```

## Usage

Setup IoC for ```IFileReaderService``` in ([Program.cs](src/Blazor.FileReader.Demo/Program.cs#L24)):

```cs
   using Blazor.FileReader;
   static void Main(string[] args)
   {
       var serviceProvider = new BrowserServiceProvider(services =>
       {
            services.AddSingleton<IFileReaderService>(sp => new FileReaderService());
       });
       new BrowserRenderer(serviceProvider).AddComponent<App>("app");
       (...)
```

And then use in a view:

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
			  // Do stuff with stream...
			  await stream.ReadAsync(buffer, ...);
			  // This following will fail. Only async read is allowed.
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
```0.4.0``` of blazor (branch 0.4.0). 

The ```master``` branch uses ```0.7.0``` of Blazor.

Blazor is an experimental project, not ready for production use. Just as Blazor frequently has breaking changes, so does the API of this library.

Versions previous to ```0.5.1``` wrapped the input element in a Blazor Component, this has been removed for better configurability and general lack of value.
