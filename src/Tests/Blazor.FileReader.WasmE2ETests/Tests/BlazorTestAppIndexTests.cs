// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

using Blazor.FileReader.Tests.Common;
using Blazor.FileReader.WasmE2ETests;
using Blazor.FileReader.WasmTestApp.Server;

namespace BlazorFileReader.E2ETests.Tests
{
    public class WasmTestAppIndexTests : TestSha256<Startup, WasmE2ETestFixture>
    {

        public WasmTestAppIndexTests(WasmE2ETestFixture fixture) 
            : base(fixture)
        {
        }

    }
}
