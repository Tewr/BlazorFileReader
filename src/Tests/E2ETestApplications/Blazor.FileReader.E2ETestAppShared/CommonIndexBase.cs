using Microsoft.AspNetCore.Components;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Blazor.FileReader.E2ETestAppShared
{
    public class CommonIndexBase : ComponentBase
    {
        [Inject]
        public IFileReaderService fileReaderService { get; set; }

        public ElementRef inputElement;

        public string Output { get; set; }

        public bool UseBufferSize { get; set; } = false;
        public bool DebugOutput { get; set; } = true;

        public int BufferSize { get; set; } = 4096;

        protected override void OnInit()
        {
            base.OnInit();
        }

        public async Task HashFile()

        {
            await HashFile(false);
        }

        public async Task HashFileRam()
        {
            await HashFile(true);
        }

        public async Task HashFile(bool useMemoryStream)
        {
            Output = string.Empty;
            this.StateHasChanged();
            var nl = Environment.NewLine;
            foreach (var file in await fileReaderService.CreateReference(inputElement).EnumerateFilesAsync())
            {
                IFileInfo fileInfo = null;
                if (DebugOutput)
                {
                    fileInfo = await file.ReadFileInfoAsync();
                    Output += $"{nameof(IFileInfo)}.{nameof(fileInfo.Name)}: {fileInfo.Name}{nl}";
                    Output += $"{nameof(IFileInfo)}.{nameof(fileInfo.Size)}: {fileInfo.Size}{nl}";
                    Output += $"{nameof(IFileInfo)}.{nameof(fileInfo.Type)}: {fileInfo.Type}{nl}";
                    Output += $"{nameof(IFileInfo)}.{nameof(fileInfo.LastModifiedDate)}: {fileInfo.LastModifiedDate?.ToString(CultureInfo.InvariantCulture) ?? "(N/A)"}{nl}";
                    Output += $"Reading file...";
                    this.StateHasChanged();
                }
                var stopWatch = new System.Diagnostics.Stopwatch();

                stopWatch.Start();
                var outputBuffer = new StringBuilder();
                using (var hash = new SHA256Managed())
                {
                    if (useMemoryStream)
                    {
                        using (var fs = UseBufferSize ?
                            await file.CreateMemoryStreamAsync(BufferSize) :
                            await file.CreateMemoryStreamAsync())
                        {
                            hash.ComputeHash(fs);
                        }
                    }
                    else
                    {
                        using (var fs = await file.OpenReadAsync())
                        {
                            var bufferSize = UseBufferSize ? BufferSize : 4096 * 8;
                            if (DebugOutput)
                            {
                                outputBuffer.AppendLine($"Using chunks of size {bufferSize}");
                            }
                            var buffer = new byte[bufferSize];
                            int count;

                            while ((count = await fs.ReadAsync(buffer, 0, buffer.Length)) != 0)
                            {
                                if (DebugOutput)
                                {
                                    outputBuffer.AppendLine($"Hashing {count} bytes. {fs.Position} / {fs.Length}");
                                }
                                hash.TransformBlock(buffer, 0, count, buffer, 0);
                            }
                            hash.TransformFinalBlock(buffer, 0, count);
                        }
                    }
                    var sb = new StringBuilder(hash.HashSize / 4);
                    foreach (var b in hash.Hash)
                    {
                        sb.AppendFormat("{0:x2}", b);
                    }

                    stopWatch.Stop();
                    if (DebugOutput)
                    {
                        Output += $"Done hashing file {fileInfo.Name}.{nl}";
                    }

                    Output += sb.ToString();
                    if (outputBuffer.Length > 0)
                    {
                        Output += $"{nl}{nl}Debug output:{nl}";
                        Output += outputBuffer.ToString();
                    }
                }
            }

            Output += $"{nl}--DONE";
            this.StateHasChanged();
        }
    }
}
