using BlazorFileReader.E2ETests.Tests;
using BlazorFileReader.Blazor.FileReader.ServerSideTestApp;
using Blazor.FileReader.E2ETestsShared.Infrastructure;
using OpenQA.Selenium;
using OpenQA.Selenium.Interactions;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Blazor.FileReader.ServerSideE2ETests.Tests
{
    public class Blazor.FileReader.ServerSideTestAppTodoListTests : TestAppTodoListTests<Startup, RazorComponentsE2EFixture> //, IDisposable
    {
        public Blazor.FileReader.ServerSideTestAppTodoListTests(RazorComponentsE2EFixture fixture)
            : base(fixture)
        {
        }
    }
}
