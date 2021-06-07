using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System;
using System.Linq;
using System.Threading.Tasks;
using Tewr.Blazor.FileReader;

namespace Blazor.FileReader.Demo.Common
{
    public partial class ObjectReferenceCommonBase : ComponentBase
    {
        [Inject]
        IFileReaderService fileReaderService { get; set; }
        [Inject]
        IJSRuntime CurrentJSRuntime { get; set; }

        public ElementReference inputElement;
        public string Output { get; set; }

        public async Task ReadFile()
        {
            Output = string.Empty;
            this.StateHasChanged();
            var files = await fileReaderService.CreateReference(inputElement).EnumerateFilesAsync();
            var isCustomGetLengthMethodInitialized =  await CurrentJSRuntime.InvokeAsync<bool>("window.hasOwnProperty", "customGetLengthMethod");
            if (!isCustomGetLengthMethodInitialized)
            {
                await WriteLine("Defining custom method 'customGetLengthMethod'");
                await CurrentJSRuntime.InvokeVoidAsync("eval", 
                    @"window.customGetLengthMethod = (jsFileFromDotNet) => {
                            return jsFileFromDotNet.size;
                    };");
            }

            if (!files.Any())
            {
                await WriteLine("No file selected");
            }

            foreach (var file in files)
            {
                var jsFile = await file.GetJSObjectReferenceAsync();
                await using (jsFile)
                {
                    
                    // get length manually using a custom method
                    var length = await this.CurrentJSRuntime.InvokeAsync<long>("customGetLengthMethod", jsFile);
                    await WriteLine($"Length from customGetLengthMethod: {length}");
                }

            }
        }

        public async Task WriteLine(string log)
        {
            Output += $"{log}{Environment.NewLine}";
            await InvokeAsync(StateHasChanged);
        }
    }
}
