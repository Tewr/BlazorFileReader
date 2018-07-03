# BlazorFileReader
Blazor component and Demo of file streams in [Blazor](https://github.com/aspnet/Blazor). 

This demo exposes read-only streams using a Blazor component that wraps 
```<input type="file" />```
and [FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader).

Here is a [Live demo](https://tewr.github.io/BlazorFileReader/) that contains the output of this project (master branch compiled in Release configuration). 

## Usage
```cs
@page "/MyPage"
@using System.IO;
@using BlazorFileReader.FileReaderComponent;

<FileReader ReaderRef="@MyFileReaderReference" /><button onclick="@ReadFile">Read file</button>

@functions {
    IFileReaderRef MyFileReaderReference;
    protected override void OnInit()
    {
        MyFileReaderReference = FileReaderReference.Create();
        base.OnInit();
    }
    public async Task ReadFile()
    {
        foreach (var file in await MyFileReaderReference.EnumerateFilesAsync())
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

To use the code in this demo in your own project you need to use at least version 
```0.4.0``` of blazor (branch 0.4.0). 

The ```master``` branch uses ```0.5.0-preview1-10327```.


