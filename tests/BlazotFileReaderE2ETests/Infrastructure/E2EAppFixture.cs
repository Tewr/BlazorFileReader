using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using System;
using System.Diagnostics;
using System.IO;

namespace Tewr.Blazor.FileReader.E2ETests
{
    public abstract class E2EAppFixture : IDisposable
    {
        public Uri RootUri { get; }

        private Process serverProcess;
        public IWebDriver Browser { get; }

        public abstract int WebServerPort { get; }

        public abstract string ProjectPathFromSrc { get; }

        public E2EAppFixture()
        {
            this.RootUri = new Uri($"http://localhost:{WebServerPort}/");
            this.serverProcess = new Process()
            {
                StartInfo = new ProcessStartInfo
                {
                    WorkingDirectory = new DirectoryInfo($@"..\..\..\..\..\src\{ProjectPathFromSrc}").FullName,
                    FileName = "dotnet",
                    Arguments = $"run --urls={this.RootUri}",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    CreateNoWindow = true
                }
            };
            this.serverProcess.Start();
            while (!serverProcess.StandardOutput.EndOfStream)
            {
                string line = serverProcess.StandardOutput.ReadLine();
                if (line.Contains("Application started. Press Ctrl+C to shut down"))
                {
                    break;
                }
            }

            var options = new ChromeOptions();
            options.AddArgument("headless");

            this.Browser = new ChromeDriver(options);
            this.Browser.Navigate().GoToUrl(this.RootUri);
            // wait for application to load
            new WebDriverWait(this.Browser, TimeSpan.FromSeconds(30))
                .Until(WebDriver => WebDriver.FindElement(By.XPath("//a[@href='https://github.com/tewr/BlazorFileReader']")));
        }


        public void Dispose()
        {
            this.Browser.Close();
            this.Browser.Dispose();
            this.serverProcess.Kill();
        }
    }
}
