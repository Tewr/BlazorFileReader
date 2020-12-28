using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using System;
using System.IO;
using Tewr.Blazor.FileReader.E2ETests.Blazor3;
using Tewr.Blazor.FileReader.E2ETests.Net5;
using Xunit;

namespace Tewr.Blazor.FileReader.E2ETests
{
    public abstract class DragNDropTests<TFixture> : E2ETestsBase<TFixture>
        where TFixture : E2EAppFixture
    {
        [Fact]
        public void DragNDropHotPath_ReadsFile()
        {
            Navigate("/E2ETestDragnDrop");
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

        public DragNDropTests(TFixture fixture) : base(fixture)
        { }

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

    [Collection(nameof(WasmDemoFixtureNet5))]
    public class DragNDropTests_WasmDemoNet5UnitTests : DragNDropTests<WasmDemoFixtureNet5>
    {
        public DragNDropTests_WasmDemoNet5UnitTests(WasmDemoFixtureNet5 e2EAppFixture) : base(e2EAppFixture)
        { }
    }

    [Collection(nameof(ServersideDemoFixtureNet5))]
    public class DragNDropTests_ServersideDemoFixtureNet5 : DragNDropTests<ServersideDemoFixtureNet5>
    {
        public DragNDropTests_ServersideDemoFixtureNet5(ServersideDemoFixtureNet5 e2EAppFixture) : base(e2EAppFixture)
        { }
    }

    [Collection(nameof(ServersideDemoFixtureBlazor3))]
    public class DragNDropTests_ServersideDemoFixtureBlazor3 : DragNDropTests<ServersideDemoFixtureBlazor3>
    {
        public DragNDropTests_ServersideDemoFixtureBlazor3(ServersideDemoFixtureBlazor3 e2EAppFixture) : base(e2EAppFixture)
        { }
    }

    [Collection(nameof(WasmDemoFixtureBlazor3))]
    public class DragNDropTests_WasmDemoFixtureBlazor3 : DragNDropTests<WasmDemoFixtureBlazor3>
    {
        public DragNDropTests_WasmDemoFixtureBlazor3(WasmDemoFixtureBlazor3 e2EAppFixture) : base(e2EAppFixture)
        { }
    }
}
