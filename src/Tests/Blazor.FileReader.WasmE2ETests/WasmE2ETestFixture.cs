using Blazor.FileReader.E2ETestsShared.Infrastructure;
using Blazor.FileReader.WasmTestApp.Server;

namespace Blazor.FileReader.WasmE2ETests
{
    public class WasmE2ETestFixture : EndToEndFixture<Startup>
    {
        
        protected override string PathBase => "..\\..\\..\\..\\..\\Tests\\E2ETestApplications\\Blazor.FileReader.WasmTestApp.Server";
    }
}
