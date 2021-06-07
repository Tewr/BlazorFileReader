using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System;
using System.Diagnostics;
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

        private static string nl = Environment.NewLine;
        [Parameter]
        public int BufferSize { get; set; } = 20480;
        public long max;
        public long value;
        public ElementReference inputElement;
        public System.Threading.CancellationTokenSource cancellationTokenSource;
        public string Output { get; set; }

        public bool CanCancel { get; set; }
        public bool IsCancelDisabled => !CanCancel;
        

        public async Task ReadOneFile(IFileReference file)
        {
            
            

            
        }


        public async Task ReadFile()
        {
            max = 0;
            value = 0;
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

            if (files.Count() < 1 )
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

        public async Task CancelFile()
        {
            await WriteLine("Cancel requested.");
            await Task.Delay(1);
            cancellationTokenSource.Cancel();
        }

        public async Task ClearFile()
        {
            await fileReaderService.CreateReference(inputElement).ClearValue();
        }

        public async Task WriteLine(string log)
        {
            Output += $"{log}{Environment.NewLine}";
            await InvokeAsync(StateHasChanged);
        }
    }
}
