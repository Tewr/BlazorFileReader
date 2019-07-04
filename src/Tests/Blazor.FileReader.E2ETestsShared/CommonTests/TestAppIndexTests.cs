// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using System;
using System.Linq;
using Xunit;
using Xunit.Abstractions;
using System.Threading.Tasks;
using OpenQA.Selenium.Interactions;
using Blazor.FileReader.E2ETestsShared.Infrastructure;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Collections.Generic;

namespace Blazor.FileReader.Tests.Common
{
    public abstract class TestSha256<TStartup, TFixture> : TestBase<TStartup, TFixture>
        where TFixture : EndToEndFixture<TStartup>
        where TStartup : class
    {
        public List<Action> Disposables { get; private set; } = new List<Action>();

        public TestSha256(TFixture fixture)
            : base(fixture)
        {
            GoToPage();
            WaitUntilLoaded();

        }

        protected void GoToPage()
        {
            Navigate("/");
        }


        public (string, string) HashFile(bool useMemoryStream, bool debugOutput, int? bufferSize)
        {
            var tempFile = System.IO.Path.GetTempFileName();
            Disposables.Add(() => File.Delete(tempFile));
            var Output = "";
            File.WriteAllText(tempFile, "Test file contents!");
            var nl = Environment.NewLine;

            var fileInfo = new FileInfo(tempFile);
            Output += $"IFileInfo.Name: {fileInfo.Name}{nl}";
            Output += $"IFileInfo.Size: {fileInfo.Length}{nl}";
            Output += $"IFileInfo.Type: {nl}";
            Output += $"IFileInfo.LastModifiedDate: {fileInfo.LastWriteTime.ToUniversalTime().ToString() ?? "(N/A)"}{nl}";
            Output += $"Reading file...";

            var outputBuffer = new StringBuilder();
            using (var hash = new SHA256Managed())
            {
                if (useMemoryStream)
                {
                    using (var fs = new MemoryStream(File.ReadAllBytes(fileInfo.FullName)))
                    {
                        hash.ComputeHash(fs);
                    }
                }
                else
                {
                    using (var fs = fileInfo.OpenRead())
                    {
                        var bufferSizeToUse = bufferSize ?? 4096 * 8;
                        if (debugOutput)
                        {
                            outputBuffer.AppendLine($"Using chunks of size {bufferSizeToUse}");
                        }
                        var buffer = new byte[bufferSizeToUse];
                        int count;

                        while ((count = fs.Read(buffer, 0, buffer.Length)) != 0)
                        {
                            if (debugOutput)
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

                if (debugOutput)
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

            return (tempFile, Output);

        }

        [Theory]
        //[InlineData(true, true, null)]
        //[InlineData(true, true, 100)]
        //[InlineData(true, false, 4096)]
        [InlineData(false, true, null)]
        public async Task HashFileHotPath_HashEqualsFxHash(bool useMemoryStream, bool debugOutput, int? bufferSize)
        {
            //Arrange
            try
            {
                var (filePath, expectedOutput) = HashFile(useMemoryStream, debugOutput, bufferSize);

                //Act
                var fileInputElement = Browser.FindElement(By.TagName("input"));
                fileInputElement.SendKeys(filePath);
                var gobutton = Browser.FindElement(By.Id(useMemoryStream ? "full-ram-button" : "chunked-button"));
                gobutton.Click();

                if (!debugOutput)
                {
                    // DebugOutput is true by default, clicking is sets it to false
                    var useDebugCheckBox = Browser.FindElement(By.Id("use-debug-output-check"));
                    useDebugCheckBox.Click();
                }

                //useDebugOutput
                new WebDriverWait(Browser, TimeSpan.FromSeconds(30)).Until(
                    driver => driver.FindElement(By.Id("debug-output")).Text.Contains("--DONE"));
                await Task.Delay(1000);

                var expectedOutputList = expectedOutput.Split(Environment.NewLine);
                var actualList = Browser.FindElement(By.Id("debug-output")).Text.Split(Environment.NewLine);
                var lineCount = 0;

                //Assert
                for (int i = 0; i < expectedOutputList.Length; i++)
                {
                    var lineInd = $"Line {lineCount.ToString().PadLeft(2)}:";
                    var expected = expectedOutputList[i];
                    var actual = actualList.Length > i ? actualList[i] : $"index out of bounds (length={actualList.Length})";

                    Assert.Equal($"{lineInd}:{expected}", $"{lineInd}:{actual}");
                    lineCount++;
                }
            }
            finally
            {
                Disposables?.ForEach(d => d?.Invoke());
            }
        }
    }
}
