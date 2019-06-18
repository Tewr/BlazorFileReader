// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using System;
using System.Linq;
using Xunit;
using Xunit.Abstractions;
using System.Threading.Tasks;
using OpenQA.Selenium.Interactions;
using Blazor.FileReader.E2ETestsShared.Infrastructure;
using Blazor.FileReader.WasmE2ETests;
using BlazorContextMenu.Blazor.FileReader.WasmTestApp.Server;

namespace BlazorContextMenu.E2ETests.Tests
{
    public class Blazor.FileReader.WasmTestAppIndexTests : TestAppIndexTests<Startup, BlazorE2EFixture>
    {

        public Blazor.FileReader.WasmTestAppIndexTests(BlazorE2EFixture fixture) 
            : base(fixture)
        {
        }

    }
}
