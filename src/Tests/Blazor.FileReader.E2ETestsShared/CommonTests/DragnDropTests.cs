using Blazor.FileReader.E2ETestsShared.Infrastructure;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.Extensions;
using OpenQA.Selenium.Support.UI;
using System;
using System.Collections.Generic;
using System.IO;
using Xunit;

namespace Blazor.FileReader.Tests.Common
{
    public abstract class DragNDropTests<TStartup, TFixture> : TestBase<TStartup, TFixture>
        where TFixture : EndToEndFixture<TStartup>
        where TStartup : class
    {
        public List<Action> Disposables { get; private set; } = new List<Action>();

        public DragNDropTests(TFixture fixture)
            : base(fixture)
        {
            GoToPage();
            WaitUntilLoaded();
        }

        protected void GoToPage()
        {
            Navigate("/CommonDragnDrop");
        }

        [Fact]
        public void DragNDropHotPath_ReadsFile()
        {
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

            IWebElement input = driver.ExecuteJavaScript<IWebElement>(JS_DROP_FILE, target, offsetX, offsetY);
            input.SendKeys(filePath.FullName);
            wait.Until(ExpectedConditions.StalenessOf(input));
        }
    }
}
