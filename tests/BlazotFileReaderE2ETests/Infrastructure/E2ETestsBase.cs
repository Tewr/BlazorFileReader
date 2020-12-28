using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using System;
using System.Collections.Generic;
using Xunit;

namespace Tewr.Blazor.FileReader.E2ETests
{
    public abstract class E2ETestsBase<TFixture> : IClassFixture<TFixture>
        where TFixture : E2EAppFixture
    {

        public E2ETestsBase(TFixture e2EAppFixture)
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

}
