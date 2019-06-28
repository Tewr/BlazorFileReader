using Blazor.FileReader.WasmE2ETests;
using BlazorFileReader.Blazor.FileReader.WasmTestApp.Server;
using Blazor.FileReader.E2ETestsShared.Infrastructure;
using OpenQA.Selenium;
using OpenQA.Selenium.Interactions;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace BlazorFileReader.E2ETests.Tests
{
    public class Blazor.FileReader.WasmTestAppTodoListTests : TestAppTodoListTests<Startup, BlazorE2EFixture> //, IDisposable
    {
        public Blazor.FileReader.WasmTestAppTodoListTests(BlazorE2EFixture fixture)
            : base(fixture)
        {
        }
    }
}
