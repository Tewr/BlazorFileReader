# BlazorFileReader
Demo of file streams in [Blazor](https://github.com/aspnet/Blazor). 

This demo exposes read-only streams using a Blazor component that wraps 
```<input type="file" />```
and [FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader).

Here is a [Live demo](https://tewr.github.io/BlazorFileReader/) that contains the output of this project. 

## Usage
```cs
@page "/MyPage"
@using System.IO;
@using BlazorFileReader.FileReaderComponent;

<FileReader FileReference="@MyFileReference" /><button onclick="@ReadFile">Read file</button>

@functions {
    IFileReaderRef MyFileReference;
    protected override void OnInit()
    {
        FileReference = FileReaderReference.Create();
        base.OnInit();
    }
    public async Task ReadFile()
    {
        foreach (var file in FileReference.Files)
        {
            using(Stream stream = file.OpenRead()) {
              /// Do stuff with stream...
            }
        }
    }
}
```

To use the code in this demo in your own project you need to use at least version 
```0.4.0-preview1-10303``` of blazor.


