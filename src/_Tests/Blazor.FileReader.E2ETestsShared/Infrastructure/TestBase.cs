﻿using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using System;
using System.Threading;
using Xunit;
using OpenQA.Selenium.Interactions;
using OpenQA.Selenium.Interactions.Internal;
using Xunit.Abstractions;
using System.Linq;
using System.Threading.Tasks;

namespace Blazor.FileReader.E2ETestsShared.Infrastructure
{
    public abstract class TestBase<TStartup, TFixture> : IClassFixture<TFixture>
        where TFixture : EndToEndFixture<TStartup> 
        where TStartup : class
    {
        private readonly TFixture _fixture;

        private static readonly AsyncLocal<IWebDriver> _browser = new AsyncLocal<IWebDriver>();

        public static IWebDriver Browser => _browser.Value;

        public TestBase(TFixture fixture)
        {
            _fixture = fixture;
            _browser.Value = fixture.Browser;
        }

        protected void WaitUntilLoaded()
        {
            Browser.Manage().Window.Maximize();
            new WebDriverWait(Browser, TimeSpan.FromSeconds(30)).Until(
                driver => driver.FindElement(By.TagName("app")).Text != "Loading...");
            Task.Delay(1000).Wait();
        }

        protected void MouseOverElement(string elementId)
        {
            var element = Browser.FindElement(By.Id(elementId));
            var action = new Actions(Browser);
            action.MoveToElement(element).Perform();
        }

        public void Navigate(string relativeUrl, bool noReload = false)
        {
            var absoluteUrl = new Uri(_fixture.RootUri, relativeUrl);

            if (noReload)
            {
                var existingUrl = Browser.Url;
                if (string.Equals(existingUrl, absoluteUrl.AbsoluteUri, StringComparison.Ordinal))
                {
                    return;
                }
            }

            Browser.Navigate().GoToUrl(absoluteUrl);
        }
    }
}
