namespace Tewr.Blazor.FileReader.E2ETests.Net5
{
    public class ServersideDemoFixtureNet5 : E2EAppFixture
    {
        public override int WebServerPort => 5235;

        public override string ProjectPathFromSrc => @"Demo\Blazor.FileReader.Serverside.Demo";
    }
}
