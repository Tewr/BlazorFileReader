namespace Tewr.Blazor.FileReader.E2ETests.Blazor3
{
    public class WasmDemoFixtureBlazor3 : E2EAppFixture
    {
        public override int WebServerPort => 3234;

        public override string ProjectPathFromSrc => @"Demo\Blazor3\Blazor.FileReader.Wasm.Demo";
    }
}
