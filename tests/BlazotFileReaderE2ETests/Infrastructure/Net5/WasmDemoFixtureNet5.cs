namespace Tewr.Blazor.FileReader.E2ETests.Net5
{
    public class WasmDemoFixtureNet5 : E2EAppFixture
    {
        public override int WebServerPort => 5234;

        public override string ProjectPathFromSrc => @"Demo\Blazor.FileReader.Wasm.Demo";
    }
}
