using Blazor.FileReader.ServerSideTestApp;
using Blazor.FileReader.Tests.Common;

namespace Blazor.FileReader.ServerSideE2ETests.Tests
{
    public class ServerSideTestAppIndexTests : TestSha256<Startup, ServerSideTestAppE2EFixture>
    {

        public ServerSideTestAppIndexTests(ServerSideTestAppE2EFixture fixture) 
            : base(fixture)
        {
        }

    }
}
