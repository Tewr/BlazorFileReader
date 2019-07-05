using Blazor.FileReader.E2ETestsShared.Infrastructure;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Xunit;

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

            if (debugOutput)
            {
                var fileInfo = new FileInfo(tempFile);
                Output += $"IFileInfo.Name: {fileInfo.Name}{nl}";
                Output += $"IFileInfo.Size: {fileInfo.Length}{nl}";
                Output += $"IFileInfo.Type: {nl}";
                Output += $"IFileInfo.LastModifiedDate: {fileInfo.LastWriteTime.ToUniversalTime().ToString(CultureInfo.InvariantCulture) ?? "(N/A)"}{nl}";
                Output += $"Reading file...";
            }

            var outputBuffer = new StringBuilder();
            using (var hash = new SHA256Managed())
            {
                if (useMemoryStream)
                {
                    using (var fs = new MemoryStream(File.ReadAllBytes(tempFile)))
                    {
                        hash.ComputeHash(fs);
                    }
                }
                else
                {
                    using (var fs = File.OpenRead(tempFile))
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
                    Output += $"Done hashing file {Path.GetFileName(tempFile)}.{nl}";
                }

                Output += sb.ToString();
                if (outputBuffer.Length > 0)
                {
                    Output += $"{nl}{nl}Debug output:{nl}";
                    Output += outputBuffer.ToString();
                }
            }

            Output += $"{nl}--DONE";
            return (tempFile, Output);
        }


        [Fact]
        public void HashFileHotPath_Ms_HashEqualsFxHash()
        {
            HashFileHotPath(true, null);
        }

        private void HashFileHotPath(bool useMemoryStream,int? bufferSize)
        {
            //Arrange
            try
            {
                var (filePath, expectedOutput) = HashFile(useMemoryStream, true, bufferSize);

                //Act
                var fileInputElement = Browser.FindElement(By.Id("file-input"));
                fileInputElement.SendKeys(filePath);
                
                if (bufferSize.HasValue)
                {
                    var bufferSizeElement = Browser.FindElement(By.Id("buffer-size"));
                    bufferSizeElement.SendKeys(bufferSize.Value.ToString());
                }
                
                var gobutton = Browser.FindElement(By.Id(useMemoryStream ? "full-ram-button" : "chunked-button"));
                gobutton.Click();
                try
                {
                    new WebDriverWait(Browser, TimeSpan.FromSeconds(5)).Until(
                    driver => driver.FindElement(By.Id("debug-output")).Text.Contains("--DONE"));
                }
                catch (OpenQA.Selenium.WebDriverTimeoutException)
                {
                    Assert.Equal(expectedOutput, Browser.FindElement(By.Id("debug-output")).Text);
                }

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
