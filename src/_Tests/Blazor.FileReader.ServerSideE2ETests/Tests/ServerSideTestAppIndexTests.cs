using Blazor.FileReader.ServerSideTestApp;
using Blazor.FileReader.Tests.Common;

namespace Blazor.FileReader.ServerSideE2ETests.Tests
{
    public class ServerSideDragnDropTests : DragNDropTests<Startup, ServerSideTestAppE2EFixture>
    {

        public ServerSideDragnDropTests(ServerSideTestAppE2EFixture fixture) 
            : base(fixture)
        {
        }

    }
}
