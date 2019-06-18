using BlazorContextMenu.Blazor.FileReader.WasmTestApp.Server;
using Blazor.FileReader.E2ETestsShared.Infrastructure;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Blazor.FileReader.WasmE2ETests
{
    public class BlazorE2EFixture : EndToEndFixture<Startup>
    {
        protected override string PathBase => "..\\..\\..\\..\\..\\E2ETestApplications\\Blazor.FileReader.WasmTestApp\\BlazorContextMenu.Blazor.FileReader.WasmTestApp.Server\\";
    }
}
