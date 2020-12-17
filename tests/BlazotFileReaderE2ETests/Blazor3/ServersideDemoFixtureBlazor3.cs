namespace Tewr.Blazor.FileReader.E2ETests.Blazor3
{
    public class ServersideDemoFixtureBlazor3 : E2EAppFixture
    {
        public override int WebServerPort => 3235;

        public override string ProjectPathFromSrc => @"Demo\Blazor3\Blazor.FileReader.Serverside.Demo";
    }
}
