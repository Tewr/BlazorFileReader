using Blazor.FileReader.E2ETestsShared.Infrastructure;
using Blazor.FileReader.ServerSideTestApp;

namespace Blazor.FileReader.ServerSideE2ETests
{
    public class ServerSideTestAppE2EFixture : EndToEndFixture<Startup>
    {
        protected override string PathBase => "..\\..\\..\\..\\..\\Tests\\E2ETestApplications\\Blazor.FileReader.ServerSideTestApp\\";
    }
}
