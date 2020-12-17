using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using Tewr.Blazor.FileReader.E2ETests.Blazor3;
using Tewr.Blazor.FileReader.E2ETests.Net5;
using Xunit;

namespace Tewr.Blazor.FileReader.E2ETests
{
    public abstract class E2ETestsCommonForAllPlatforms<TFixture> : IClassFixture<TFixture>
        where TFixture : E2EAppFixture
    {

        public E2ETestsCommonForAllPlatforms(TFixture e2EAppFixture)
        {
            Fixture = e2EAppFixture;
        }

        public List<Action> Disposables { get; private set; } = new List<Action>();

        public E2EAppFixture Fixture { get; }

        private IWebDriver _browser;
        public IWebDriver Browser => _browser ??= Fixture.Browser;

        public void Navigate(string relativeUrl, bool noReload = false)
        {
            var absoluteUrl = new Uri(Fixture.RootUri, relativeUrl);

            if (noReload)
            {
                var existingUrl = Browser.Url;
                if (string.Equals(existingUrl, absoluteUrl.AbsoluteUri, StringComparison.Ordinal))
                {
                    return;
                }
            }

            Browser.Navigate().GoToUrl(absoluteUrl);
            var webdriverWait = new WebDriverWait(this.Browser, TimeSpan.FromSeconds(30));
            webdriverWait.Until(WebDriver => WebDriver.FindElement(By.XPath("//a[@href='https://github.com/tewr/BlazorFileReader']")));
        }
    }

    public abstract class HashTest<TFixture> : E2ETestsCommonForAllPlatforms<TFixture> where TFixture : E2EAppFixture
    {
        public HashTest(TFixture fixture):base(fixture)
        {
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
        public void HashFileHotPath_NoMs_HashEqualsFxHash()
        {
            HashFileHotPath(false, null);
        }

        [Fact]
        public void HashFileHotPath_Ms_HashEqualsFxHash()
        {
            HashFileHotPath(true, null);
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

    }

    #region Platform launchers

    public class HashTest_WasmDemoNet5UnitTests : HashTest<WasmDemoFixtureNet5> 
    {
        public HashTest_WasmDemoNet5UnitTests(WasmDemoFixtureNet5 e2EAppFixture):base(e2EAppFixture)
        {
        }
    }

    public class HashTest_ServersideDemoFixtureNet5 : HashTest<ServersideDemoFixtureNet5>
    {
        public HashTest_ServersideDemoFixtureNet5(ServersideDemoFixtureNet5 e2EAppFixture) : base(e2EAppFixture)
        {
        }
    }

    public class HashTest_ServersideDemoFixtureBlazor3 : HashTest<ServersideDemoFixtureBlazor3>
    {
        public HashTest_ServersideDemoFixtureBlazor3(ServersideDemoFixtureBlazor3 e2EAppFixture) : base(e2EAppFixture)
        {
        }
    }

    public class HashTest_WasmDemoFixtureBlazor3 : HashTest<WasmDemoFixtureBlazor3>
    {
        public HashTest_WasmDemoFixtureBlazor3(WasmDemoFixtureBlazor3 e2EAppFixture) : base(e2EAppFixture)
        {
        }
    }

    #endregion

    public abstract class DragNDropTests<TFixture> : E2ETestsCommonForAllPlatforms<TFixture>
        where TFixture : E2EAppFixture
    {
        public DragNDropTests(TFixture fixture) : base(fixture)
        {
        }

        [Fact]
        public void DragNDropHotPath_ReadsFile()
        {
            Navigate("/E2ECommonTestDragnDrop");
            try
            {
                var dropZone = Browser.FindElement(By.Id("drop-zone"));
                var tempFile = Path.GetTempFileName();
                var expectedOutput = $@"IFileInfo.Name: {Path.GetFileName(tempFile)}
Read 11 bytes. 11 / 11
--DONE";
                File.WriteAllText(tempFile, "Hello world");
                Disposables.Add(() => File.Delete(tempFile));
                DropFile(Browser, new FileInfo(tempFile), dropZone, 0, 0);
                var gobutton = Browser.FindElement(By.Id("read-file"));
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
                var finalOutput = Browser.FindElement(By.Id("debug-output")).Text;
                Assert.Equal(expectedOutput, Browser.FindElement(By.Id("debug-output")).Text);
            }
            finally
            {
                Disposables?.ForEach(d => d?.Invoke());
            }
        }

        public static void DropFile(IWebDriver driver, FileInfo filePath, IWebElement target, int offsetX, int offsetY)
        {
            if (!filePath.Exists)
                throw new WebDriverException("File not found: " + filePath.FullName);


            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));

            String JS_DROP_FILE =
                "var target = arguments[0]," +
                "    offsetX = arguments[1]," +
                "    offsetY = arguments[2]," +
                "    document = target.ownerDocument || document," +
                "    window = document.defaultView || window;" +
                "" +
                "var input = document.createElement('INPUT');" +
                "input.type = 'file';" +
                "input.style.display = 'none';" +
                "input.onchange = function () {" +
                "  var rect = target.getBoundingClientRect()," +
                "      x = rect.left + (offsetX || (rect.width >> 1))," +
                "      y = rect.top + (offsetY || (rect.height >> 1))," +
                "      dataTransfer = { files: this.files };" +
                "" +
                "  ['dragenter', 'dragover', 'drop'].forEach(function (name) {" +
                "    var evt = document.createEvent('MouseEvent');" +
                "    evt.initMouseEvent(name, !0, !0, window, 0, 0, 0, x, y, !1, !1, !1, !1, 0, null);" +
                "    evt.dataTransfer = dataTransfer;" +
                "    target.dispatchEvent(evt);" +
                "  });" +
                "" +
                "  setTimeout(function () { document.body.removeChild(input); }, 25);" +
                "};" +
                "document.body.appendChild(input);" +
                "return input;";


            IWebElement input = (IWebElement)((IJavaScriptExecutor)driver).ExecuteScript(JS_DROP_FILE, target, offsetX, offsetY);
            input.SendKeys(filePath.FullName);
            wait.Until(ExpectedConditions.StalenessOf(input));
        }
    }

}
