using BlazorFileReader.Blazor.FileReader.ServerSideTestApp;
using Blazor.FileReader.E2ETestsShared.Infrastructure;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Blazor.FileReader.ServerSideE2ETests
{
    public class RazorComponentsE2EFixture : EndToEndFixture<Startup>
    {
        protected override string PathBase => "..\\..\\..\\..\\..\\E2ETestApplications\\Blazor.FileReader.ServerSideTestApp\\BlazorFileReader.Blazor.FileReader.ServerSideTestApp\\";
    }
}
