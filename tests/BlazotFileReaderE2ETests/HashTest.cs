using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using System;
using System.Globalization;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using Tewr.Blazor.FileReader.E2ETests.Blazor3;
using Tewr.Blazor.FileReader.E2ETests.Net5;
using Xunit;

namespace Tewr.Blazor.FileReader.E2ETests
{
    public abstract class HashTest<TFixture> : E2ETestsBase<TFixture> where TFixture : E2EAppFixture
    {
        [Fact]
        public void HashFileHotPath_NoMs_HashEqualsFxHash()
        {
            HashFileHotPath(false, null);
        }

        [Fact]
        public void HashFileHotPath_Ms_HashEqualsFxHash()
        {
            HashFileHotPath(true, null);
        }

        public HashTest(TFixture fixture) : base(fixture)
        {
        }

        private void HashFileHotPath(bool useMemoryStream, int? bufferSize)
        {
            //Arrange
            Navigate("/E2ETestHash");
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

                // Act 2
                fileInputElement.SendKeys(filePath);
                gobutton = Browser.FindElement(By.Id(useMemoryStream ? "full-ram-offset-button" : "chunked-offset-button"));
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

                actualList = Browser.FindElement(By.Id("debug-output")).Text.Split(Environment.NewLine);
                lineCount = 0;
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



    }

    #region Platform launchers

    public class HashTest_WasmDemoNet5UnitTests : HashTest<WasmDemoFixtureNet5>
    {
        public HashTest_WasmDemoNet5UnitTests(WasmDemoFixtureNet5 e2EAppFixture) : base(e2EAppFixture)
        { }
    }

    public class HashTest_ServersideDemoFixtureNet5 : HashTest<ServersideDemoFixtureNet5>
    {
        public HashTest_ServersideDemoFixtureNet5(ServersideDemoFixtureNet5 e2EAppFixture) : base(e2EAppFixture)
        { }
    }

    public class HashTest_ServersideDemoFixtureBlazor3 : HashTest<ServersideDemoFixtureBlazor3>
    {
        public HashTest_ServersideDemoFixtureBlazor3(ServersideDemoFixtureBlazor3 e2EAppFixture) : base(e2EAppFixture)
        { }
    }

    public class HashTest_WasmDemoFixtureBlazor3 : HashTest<WasmDemoFixtureBlazor3>
    {
        public HashTest_WasmDemoFixtureBlazor3(WasmDemoFixtureBlazor3 e2EAppFixture) : base(e2EAppFixture)
        { }
    }

    #endregion

}
