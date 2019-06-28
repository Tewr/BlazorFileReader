using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using System;
using System.Linq;
using Xunit;
using Xunit.Abstractions;
using System.Threading.Tasks;
using OpenQA.Selenium.Interactions;
using Blazor.FileReader.E2ETestsShared.Infrastructure;
using BlazorFileReader.E2ETests.Tests;
using BlazorFileReader.Blazor.FileReader.ServerSideTestApp;

namespace Blazor.FileReader.ServerSideE2ETests.Tests
{
    public class Blazor.FileReader.ServerSideTestAppIndexTests : TestAppIndexTests<Startup, RazorComponentsE2EFixture>
    {

        public Blazor.FileReader.ServerSideTestAppIndexTests(RazorComponentsE2EFixture fixture) 
            : base(fixture)
        {
        }

    }
}
