using Microsoft.AspNetCore.Components;
using System;
using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Tewr.Blazor.FileReader;

namespace Blazor.FileReader.E2ETestAppShared
{
    public class CommonIndexBase : ComponentBase
    {
        [Inject]
        public IFileReaderService fileReaderService { get; set; }

        public ElementReference inputElement;

        public string Output { get; set; }

        public bool UseBufferSize { get; set; } = false;
        public bool DebugOutput { get; set; } = true;

        public bool OutputString { get; set; } = false;

        public int BufferSize { get; set; } = 32768;

        public async Task HashFile()

        {
            await HashFile(false);
        }

        public async Task HashFileRam()
        {
            await HashFile(true);
        }

        public async Task HashFileOffset()

        {
            await HashFile(false, true);
        }

        public async Task HashFileRamOffset()
        {
            await HashFile(true, true);
        }

        public async Task HashFile(bool useMemoryStream, bool offset = false)
        {
            Output = string.Empty;
            this.StateHasChanged();
            var nl = Environment.NewLine;
            foreach (var file in await fileReaderService.CreateReference(inputElement).EnumerateFilesAsync())
            {
                IFileInfo fileInfo = null;
                fileInfo = await file.ReadFileInfoAsync();
                if (DebugOutput)
                {   
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

                            var targetBufferSize = bufferSize;
                            if (offset)
                            {
                                targetBufferSize = (int)fileInfo?.Size;
                            }
                            var buffer = new byte[targetBufferSize];
                            int count = 0;

                            var targetOffset = 0;
                            var len = offset ? Math.Min(bufferSize, (int)fileInfo.Size) : buffer.Length;
                            while ((count = await fs.ReadAsync(buffer, targetOffset, len)) != 0)
                            {
                                if (offset)
                                {
                                    targetOffset += count;
                                }
                                if (DebugOutput)
                                {
                                    outputBuffer.AppendLine($"Hashing {count} bytes. {fs.Position} / {fs.Length}");

                                }
                                if (!offset)
                                {
                                    hash.TransformBlock(buffer, 0, count, buffer, 0);
                                }

                                if (OutputString)
                                {
                                    outputBuffer.AppendLine("BEGIN BUFFER DUMP");
                                    outputBuffer.AppendLine(Encoding.UTF8.GetString(buffer));
                                    outputBuffer.AppendLine("END BUFFER DUMP");
                                }
                            }
                            if (!offset)
                            {
                                hash.TransformFinalBlock(buffer, 0, count);
                            }
                            else
                            {
                                hash.ComputeHash(buffer);
                            }


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
