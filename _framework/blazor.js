/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MonoPlatform_1 = __webpack_require__(7);
exports.platform = MonoPlatform_1.monoPlatform;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var InternalRegisteredFunction_1 = __webpack_require__(8);
var registeredFunctions = {};
function registerFunction(identifier, implementation) {
    if (InternalRegisteredFunction_1.internalRegisteredFunctions.hasOwnProperty(identifier)) {
        throw new Error("The function identifier '" + identifier + "' is reserved and cannot be registered.");
    }
    if (registeredFunctions.hasOwnProperty(identifier)) {
        throw new Error("A function with the identifier '" + identifier + "' has already been registered.");
    }
    registeredFunctions[identifier] = implementation;
}
exports.registerFunction = registerFunction;
function getRegisteredFunction(identifier) {
    // By prioritising the internal ones, we ensure you can't override them
    var result = InternalRegisteredFunction_1.internalRegisteredFunctions[identifier] || registeredFunctions[identifier];
    if (result) {
        return result;
    }
    else {
        throw new Error("Could not find registered function with name '" + identifier + "'.");
    }
}
exports.getRegisteredFunction = getRegisteredFunction;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getAssemblyNameFromUrl(url) {
    var lastSegment = url.substring(url.lastIndexOf('/') + 1);
    var queryStringStartPos = lastSegment.indexOf('?');
    var filename = queryStringStartPos < 0 ? lastSegment : lastSegment.substring(0, queryStringStartPos);
    return filename.replace(/\.dll$/, '');
}
exports.getAssemblyNameFromUrl = getAssemblyNameFromUrl;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function applyCaptureIdToElement(element, referenceCaptureId) {
    element.setAttribute(getCaptureIdAttributeName(referenceCaptureId), '');
}
exports.applyCaptureIdToElement = applyCaptureIdToElement;
function getElementByCaptureId(referenceCaptureId) {
    var selector = "[" + getCaptureIdAttributeName(referenceCaptureId) + "]";
    return document.querySelector(selector);
}
exports.getElementByCaptureId = getElementByCaptureId;
function getCaptureIdAttributeName(referenceCaptureId) {
    return "_bl_" + referenceCaptureId;
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
var RenderBatch_1 = __webpack_require__(10);
var BrowserRenderer_1 = __webpack_require__(11);
var browserRenderers = {};
function attachRootComponentToElement(browserRendererId, elementSelector, componentId) {
    var elementSelectorJs = Environment_1.platform.toJavaScriptString(elementSelector);
    var element = document.querySelector(elementSelectorJs);
    if (!element) {
        throw new Error("Could not find any element matching selector '" + elementSelectorJs + "'.");
    }
    var browserRenderer = browserRenderers[browserRendererId];
    if (!browserRenderer) {
        browserRenderer = browserRenderers[browserRendererId] = new BrowserRenderer_1.BrowserRenderer(browserRendererId);
    }
    clearElement(element);
    browserRenderer.attachRootComponentToElement(componentId, element);
}
exports.attachRootComponentToElement = attachRootComponentToElement;
function renderBatch(browserRendererId, batch) {
    var browserRenderer = browserRenderers[browserRendererId];
    if (!browserRenderer) {
        throw new Error("There is no browser renderer with ID " + browserRendererId + ".");
    }
    var updatedComponents = RenderBatch_1.renderBatch.updatedComponents(batch);
    var updatedComponentsLength = RenderBatch_1.arrayRange.count(updatedComponents);
    var updatedComponentsArray = RenderBatch_1.arrayRange.array(updatedComponents);
    var referenceFramesStruct = RenderBatch_1.renderBatch.referenceFrames(batch);
    var referenceFrames = RenderBatch_1.arrayRange.array(referenceFramesStruct);
    for (var i = 0; i < updatedComponentsLength; i++) {
        var diff = Environment_1.platform.getArrayEntryPtr(updatedComponentsArray, i, RenderBatch_1.renderTreeDiffStructLength);
        var componentId = RenderBatch_1.renderTreeDiff.componentId(diff);
        var editsArraySegment = RenderBatch_1.renderTreeDiff.edits(diff);
        var edits = RenderBatch_1.arraySegment.array(editsArraySegment);
        var editsOffset = RenderBatch_1.arraySegment.offset(editsArraySegment);
        var editsLength = RenderBatch_1.arraySegment.count(editsArraySegment);
        browserRenderer.updateComponent(componentId, edits, editsOffset, editsLength, referenceFrames);
    }
    var disposedComponentIds = RenderBatch_1.renderBatch.disposedComponentIds(batch);
    var disposedComponentIdsLength = RenderBatch_1.arrayRange.count(disposedComponentIds);
    var disposedComponentIdsArray = RenderBatch_1.arrayRange.array(disposedComponentIds);
    for (var i = 0; i < disposedComponentIdsLength; i++) {
        var componentIdPtr = Environment_1.platform.getArrayEntryPtr(disposedComponentIdsArray, i, 4);
        var componentId = Environment_1.platform.readInt32Field(componentIdPtr);
        browserRenderer.disposeComponent(componentId);
    }
    var disposedEventHandlerIds = RenderBatch_1.renderBatch.disposedEventHandlerIds(batch);
    var disposedEventHandlerIdsLength = RenderBatch_1.arrayRange.count(disposedEventHandlerIds);
    var disposedEventHandlerIdsArray = RenderBatch_1.arrayRange.array(disposedEventHandlerIds);
    for (var i = 0; i < disposedEventHandlerIdsLength; i++) {
        var eventHandlerIdPtr = Environment_1.platform.getArrayEntryPtr(disposedEventHandlerIdsArray, i, 4);
        var eventHandlerId = Environment_1.platform.readInt32Field(eventHandlerIdPtr);
        browserRenderer.disposeEventHandler(eventHandlerId);
    }
}
exports.renderBatch = renderBatch;
function clearElement(element) {
    var childNode;
    while (childNode = element.firstChild) {
        element.removeChild(childNode);
    }
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RegisteredFunction_1 = __webpack_require__(1);
var Environment_1 = __webpack_require__(0);
var registeredFunctionPrefix = 'Microsoft.AspNetCore.Blazor.Browser.Services.BrowserUriHelper';
var notifyLocationChangedMethod;
var hasRegisteredEventListeners = false;
RegisteredFunction_1.registerFunction(registeredFunctionPrefix + ".getLocationHref", function () { return Environment_1.platform.toDotNetString(location.href); });
RegisteredFunction_1.registerFunction(registeredFunctionPrefix + ".getBaseURI", function () { return document.baseURI ? Environment_1.platform.toDotNetString(document.baseURI) : null; });
RegisteredFunction_1.registerFunction(registeredFunctionPrefix + ".enableNavigationInterception", function () {
    if (hasRegisteredEventListeners) {
        return;
    }
    hasRegisteredEventListeners = true;
    document.addEventListener('click', function (event) {
        // Intercept clicks on all <a> elements where the href is within the <base href> URI space
        var anchorTarget = findClosestAncestor(event.target, 'A');
        if (anchorTarget) {
            var href = anchorTarget.getAttribute('href');
            var absoluteHref = toAbsoluteUri(href);
            if (isWithinBaseUriSpace(absoluteHref)) {
                event.preventDefault();
                performInternalNavigation(absoluteHref);
            }
        }
    });
    window.addEventListener('popstate', handleInternalNavigation);
});
RegisteredFunction_1.registerFunction(registeredFunctionPrefix + ".navigateTo", function (uriDotNetString) {
    navigateTo(Environment_1.platform.toJavaScriptString(uriDotNetString));
});
function navigateTo(uri) {
    var absoluteUri = toAbsoluteUri(uri);
    if (isWithinBaseUriSpace(absoluteUri)) {
        performInternalNavigation(absoluteUri);
    }
    else {
        location.href = uri;
    }
}
exports.navigateTo = navigateTo;
function performInternalNavigation(absoluteInternalHref) {
    history.pushState(null, /* ignored title */ '', absoluteInternalHref);
    handleInternalNavigation();
}
function handleInternalNavigation() {
    if (!notifyLocationChangedMethod) {
        notifyLocationChangedMethod = Environment_1.platform.findMethod('Microsoft.AspNetCore.Blazor.Browser', 'Microsoft.AspNetCore.Blazor.Browser.Services', 'BrowserUriHelper', 'NotifyLocationChanged');
    }
    Environment_1.platform.callMethod(notifyLocationChangedMethod, null, [
        Environment_1.platform.toDotNetString(location.href)
    ]);
}
var testAnchor;
function toAbsoluteUri(relativeUri) {
    testAnchor = testAnchor || document.createElement('a');
    testAnchor.href = relativeUri;
    return testAnchor.href;
}
function findClosestAncestor(element, tagName) {
    return !element
        ? null
        : element.tagName === tagName
            ? element
            : findClosestAncestor(element.parentElement, tagName);
}
function isWithinBaseUriSpace(href) {
    var baseUriWithTrailingSlash = toBaseUriWithTrailingSlash(document.baseURI); // TODO: Might baseURI really be null?
    return href.startsWith(baseUriWithTrailingSlash);
}
function toBaseUriWithTrailingSlash(baseUri) {
    return baseUri.substr(0, baseUri.lastIndexOf('/') + 1);
}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
var DotNet_1 = __webpack_require__(2);
__webpack_require__(4);
__webpack_require__(17);
__webpack_require__(5);
__webpack_require__(18);
function boot() {
    return __awaiter(this, void 0, void 0, function () {
        var allScriptElems, thisScriptElem, isLinkerEnabled, entryPointDll, entryPointMethod, entryPointAssemblyName, referenceAssembliesCommaSeparated, referenceAssemblies, loadAssemblyUrls, ex_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allScriptElems = document.getElementsByTagName('script');
                    thisScriptElem = (document.currentScript || allScriptElems[allScriptElems.length - 1]);
                    isLinkerEnabled = thisScriptElem.getAttribute('linker-enabled') === 'true';
                    entryPointDll = getRequiredBootScriptAttribute(thisScriptElem, 'main');
                    entryPointMethod = getRequiredBootScriptAttribute(thisScriptElem, 'entrypoint');
                    entryPointAssemblyName = DotNet_1.getAssemblyNameFromUrl(entryPointDll);
                    referenceAssembliesCommaSeparated = thisScriptElem.getAttribute('references') || '';
                    referenceAssemblies = referenceAssembliesCommaSeparated
                        .split(',')
                        .map(function (s) { return s.trim(); })
                        .filter(function (s) { return !!s; });
                    if (!isLinkerEnabled) {
                        console.info('Blazor is running in dev mode without IL stripping. To make the bundle size significantly smaller, publish the application or see https://go.microsoft.com/fwlink/?linkid=870414');
                    }
                    loadAssemblyUrls = [entryPointDll]
                        .concat(referenceAssemblies)
                        .map(function (filename) { return "_framework/_bin/" + filename; });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Environment_1.platform.start(loadAssemblyUrls)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    ex_1 = _a.sent();
                    throw new Error("Failed to start platform. Reason: " + ex_1);
                case 4:
                    // Start up the application
                    Environment_1.platform.callEntryPoint(entryPointAssemblyName, entryPointMethod, []);
                    return [2 /*return*/];
            }
        });
    });
}
function getRequiredBootScriptAttribute(elem, attributeName) {
    var result = elem.getAttribute(attributeName);
    if (!result) {
        throw new Error("Missing \"" + attributeName + "\" attribute on Blazor script tag.");
    }
    return result;
}
boot();


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DotNet_1 = __webpack_require__(2);
var RegisteredFunction_1 = __webpack_require__(1);
var assemblyHandleCache = {};
var typeHandleCache = {};
var methodHandleCache = {};
var assembly_load;
var find_class;
var find_method;
var invoke_method;
var mono_string_get_utf8;
var mono_string;
exports.monoPlatform = {
    start: function start(loadAssemblyUrls) {
        return new Promise(function (resolve, reject) {
            // mono.js assumes the existence of this
            window['Browser'] = {
                init: function () { },
                asyncLoad: asyncLoad
            };
            // Emscripten works by expecting the module config to be a global
            window['Module'] = createEmscriptenModuleInstance(loadAssemblyUrls, resolve, reject);
            addScriptTagsToDocument();
        });
    },
    findMethod: findMethod,
    callEntryPoint: function callEntryPoint(assemblyName, entrypointMethod, args) {
        // Parse the entrypointMethod, which is of the form MyApp.MyNamespace.MyTypeName::MyMethodName
        // Note that we don't support specifying a method overload, so it has to be unique
        var entrypointSegments = entrypointMethod.split('::');
        if (entrypointSegments.length != 2) {
            throw new Error('Malformed entry point method name; could not resolve class name and method name.');
        }
        var typeFullName = entrypointSegments[0];
        var methodName = entrypointSegments[1];
        var lastDot = typeFullName.lastIndexOf('.');
        var namespace = lastDot > -1 ? typeFullName.substring(0, lastDot) : '';
        var typeShortName = lastDot > -1 ? typeFullName.substring(lastDot + 1) : typeFullName;
        var entryPointMethodHandle = exports.monoPlatform.findMethod(assemblyName, namespace, typeShortName, methodName);
        exports.monoPlatform.callMethod(entryPointMethodHandle, null, args);
    },
    callMethod: function callMethod(method, target, args) {
        if (args.length > 4) {
            // Hopefully this restriction can be eased soon, but for now make it clear what's going on
            throw new Error("Currently, MonoPlatform supports passing a maximum of 4 arguments from JS to .NET. You tried to pass " + args.length + ".");
        }
        var stack = Module.stackSave();
        try {
            var argsBuffer = Module.stackAlloc(args.length);
            var exceptionFlagManagedInt = Module.stackAlloc(4);
            for (var i = 0; i < args.length; ++i) {
                Module.setValue(argsBuffer + i * 4, args[i], 'i32');
            }
            Module.setValue(exceptionFlagManagedInt, 0, 'i32');
            var res = invoke_method(method, target, argsBuffer, exceptionFlagManagedInt);
            if (Module.getValue(exceptionFlagManagedInt, 'i32') !== 0) {
                // If the exception flag is set, the returned value is exception.ToString()
                throw new Error(exports.monoPlatform.toJavaScriptString(res));
            }
            return res;
        }
        finally {
            Module.stackRestore(stack);
        }
    },
    toJavaScriptString: function toJavaScriptString(managedString) {
        // Comments from original Mono sample:
        //FIXME this is wastefull, we could remove the temp malloc by going the UTF16 route
        //FIXME this is unsafe, cuz raw objects could be GC'd.
        var utf8 = mono_string_get_utf8(managedString);
        var res = Module.UTF8ToString(utf8);
        Module._free(utf8);
        return res;
    },
    toDotNetString: function toDotNetString(jsString) {
        return mono_string(jsString);
    },
    toUint8Array: function toUint8Array(array) {
        var dataPtr = getArrayDataPointer(array);
        var length = Module.getValue(dataPtr, 'i32');
        return new Uint8Array(Module.HEAPU8.buffer, dataPtr + 4, length);
    },
    getArrayLength: function getArrayLength(array) {
        return Module.getValue(getArrayDataPointer(array), 'i32');
    },
    getArrayEntryPtr: function getArrayEntryPtr(array, index, itemSize) {
        // First byte is array length, followed by entries
        var address = getArrayDataPointer(array) + 4 + index * itemSize;
        return address;
    },
    getObjectFieldsBaseAddress: function getObjectFieldsBaseAddress(referenceTypedObject) {
        // The first two int32 values are internal Mono data
        return (referenceTypedObject + 8);
    },
    readInt32Field: function readHeapInt32(baseAddress, fieldOffset) {
        return Module.getValue(baseAddress + (fieldOffset || 0), 'i32');
    },
    readFloatField: function readHeapFloat(baseAddress, fieldOffset) {
        return Module.getValue(baseAddress + (fieldOffset || 0), 'float');
    },
    readObjectField: function readHeapObject(baseAddress, fieldOffset) {
        return Module.getValue(baseAddress + (fieldOffset || 0), 'i32');
    },
    readStringField: function readHeapObject(baseAddress, fieldOffset) {
        var fieldValue = Module.getValue(baseAddress + (fieldOffset || 0), 'i32');
        return fieldValue === 0 ? null : exports.monoPlatform.toJavaScriptString(fieldValue);
    },
    readStructField: function readStructField(baseAddress, fieldOffset) {
        return (baseAddress + (fieldOffset || 0));
    },
};
// Bypass normal type checking to add this extra function. It's only intended to be called from
// the JS code in Mono's driver.c. It's never intended to be called from TypeScript.
exports.monoPlatform.monoGetRegisteredFunction = RegisteredFunction_1.getRegisteredFunction;
function findAssembly(assemblyName) {
    var assemblyHandle = assemblyHandleCache[assemblyName];
    if (!assemblyHandle) {
        assemblyHandle = assembly_load(assemblyName);
        if (!assemblyHandle) {
            throw new Error("Could not find assembly \"" + assemblyName + "\"");
        }
        assemblyHandleCache[assemblyName] = assemblyHandle;
    }
    return assemblyHandle;
}
function findType(assemblyName, namespace, className) {
    var fullyQualifiedTypeName = "[" + assemblyName + "]" + namespace + "." + className;
    var typeHandle = typeHandleCache[fullyQualifiedTypeName];
    if (!typeHandle) {
        typeHandle = find_class(findAssembly(assemblyName), namespace, className);
        if (!typeHandle) {
            throw new Error("Could not find type \"" + className + "\" in namespace \"" + namespace + "\" in assembly \"" + assemblyName + "\"");
        }
        typeHandleCache[fullyQualifiedTypeName] = typeHandle;
    }
    return typeHandle;
}
function findMethod(assemblyName, namespace, className, methodName) {
    var fullyQualifiedMethodName = "[" + assemblyName + "]" + namespace + "." + className + "::" + methodName;
    var methodHandle = methodHandleCache[fullyQualifiedMethodName];
    if (!methodHandle) {
        methodHandle = find_method(findType(assemblyName, namespace, className), methodName, -1);
        if (!methodHandle) {
            throw new Error("Could not find method \"" + methodName + "\" on type \"" + namespace + "." + className + "\"");
        }
        methodHandleCache[fullyQualifiedMethodName] = methodHandle;
    }
    return methodHandle;
}
function addScriptTagsToDocument() {
    // Load either the wasm or asm.js version of the Mono runtime
    var browserSupportsNativeWebAssembly = typeof WebAssembly !== 'undefined' && WebAssembly.validate;
    var monoRuntimeUrlBase = '_framework/' + (browserSupportsNativeWebAssembly ? 'wasm' : 'asmjs');
    var monoRuntimeScriptUrl = monoRuntimeUrlBase + "/mono.js";
    if (!browserSupportsNativeWebAssembly) {
        // In the asmjs case, the initial memory structure is in a separate file we need to download
        var meminitXHR = Module['memoryInitializerRequest'] = new XMLHttpRequest();
        meminitXHR.open('GET', monoRuntimeUrlBase + "/mono.js.mem");
        meminitXHR.responseType = 'arraybuffer';
        meminitXHR.send(null);
    }
    document.write("<script defer src=\"" + monoRuntimeScriptUrl + "\"></script>");
}
function createEmscriptenModuleInstance(loadAssemblyUrls, onReady, onError) {
    var module = {};
    var wasmBinaryFile = '_framework/wasm/mono.wasm';
    var asmjsCodeFile = '_framework/asmjs/mono.asm.js';
    module.print = function (line) { return console.log("WASM: " + line); };
    module.printErr = function (line) { return console.error("WASM: " + line); };
    module.preRun = [];
    module.postRun = [];
    module.preloadPlugins = [];
    module.locateFile = function (fileName) {
        switch (fileName) {
            case 'mono.wasm': return wasmBinaryFile;
            case 'mono.asm.js': return asmjsCodeFile;
            default: return fileName;
        }
    };
    module.preRun.push(function () {
        // By now, emscripten should be initialised enough that we can capture these methods for later use
        assembly_load = Module.cwrap('mono_wasm_assembly_load', 'number', ['string']);
        find_class = Module.cwrap('mono_wasm_assembly_find_class', 'number', ['number', 'string', 'string']);
        find_method = Module.cwrap('mono_wasm_assembly_find_method', 'number', ['number', 'string', 'number']);
        invoke_method = Module.cwrap('mono_wasm_invoke_method', 'number', ['number', 'number', 'number']);
        mono_string_get_utf8 = Module.cwrap('mono_wasm_string_get_utf8', 'number', ['number']);
        mono_string = Module.cwrap('mono_wasm_string_from_js', 'number', ['string']);
        Module.FS_createPath('/', 'appBinDir', true, true);
        loadAssemblyUrls.forEach(function (url) {
            return FS.createPreloadedFile('appBinDir', DotNet_1.getAssemblyNameFromUrl(url) + ".dll", url, true, false, undefined, onError);
        });
    });
    module.postRun.push(function () {
        var load_runtime = Module.cwrap('mono_wasm_load_runtime', null, ['string']);
        load_runtime('appBinDir');
        onReady();
    });
    return module;
}
function asyncLoad(url, onload, onerror) {
    var xhr = new XMLHttpRequest;
    xhr.open('GET', url, /* async: */ true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function xhr_onload() {
        if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
            var asm = new Uint8Array(xhr.response);
            onload(asm);
        }
        else {
            onerror(xhr);
        }
    };
    xhr.onerror = onerror;
    xhr.send(null);
}
function getArrayDataPointer(array) {
    return array + 12; // First byte from here is length, then following bytes are entries
}


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var InvokeWithJsonMarshalling_1 = __webpack_require__(9);
var Renderer_1 = __webpack_require__(4);
/**
 * The definitive list of internal functions invokable from .NET code.
 * These function names are treated as 'reserved' and cannot be passed to registerFunction.
 */
exports.internalRegisteredFunctions = {
    attachRootComponentToElement: Renderer_1.attachRootComponentToElement,
    invokeWithJsonMarshalling: InvokeWithJsonMarshalling_1.invokeWithJsonMarshalling,
    renderBatch: Renderer_1.renderBatch,
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
var RegisteredFunction_1 = __webpack_require__(1);
var ElementReferenceCapture_1 = __webpack_require__(3);
var elementRefKey = '_blazorElementRef'; // Keep in sync with ElementRef.cs
function invokeWithJsonMarshalling(identifier) {
    var argsJson = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        argsJson[_i - 1] = arguments[_i];
    }
    var identifierJsString = Environment_1.platform.toJavaScriptString(identifier);
    var funcInstance = RegisteredFunction_1.getRegisteredFunction(identifierJsString);
    var args = argsJson.map(function (json) { return JSON.parse(Environment_1.platform.toJavaScriptString(json), jsonReviver); });
    var result = funcInstance.apply(null, args);
    if (result !== null && result !== undefined) {
        var resultJson = JSON.stringify(result);
        return Environment_1.platform.toDotNetString(resultJson);
    }
    else {
        return null;
    }
}
exports.invokeWithJsonMarshalling = invokeWithJsonMarshalling;
function jsonReviver(key, value) {
    if (value && typeof value === 'object' && value.hasOwnProperty(elementRefKey) && typeof value[elementRefKey] === 'number') {
        return ElementReferenceCapture_1.getElementByCaptureId(value[elementRefKey]);
    }
    return value;
}


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
// Keep in sync with the structs in .NET code
exports.renderBatch = {
    updatedComponents: function (obj) { return Environment_1.platform.readStructField(obj, 0); },
    referenceFrames: function (obj) { return Environment_1.platform.readStructField(obj, arrayRangeStructLength); },
    disposedComponentIds: function (obj) { return Environment_1.platform.readStructField(obj, arrayRangeStructLength + arrayRangeStructLength); },
    disposedEventHandlerIds: function (obj) { return Environment_1.platform.readStructField(obj, arrayRangeStructLength + arrayRangeStructLength + arrayRangeStructLength); },
};
var arrayRangeStructLength = 8;
exports.arrayRange = {
    array: function (obj) { return Environment_1.platform.readObjectField(obj, 0); },
    count: function (obj) { return Environment_1.platform.readInt32Field(obj, 4); },
};
var arraySegmentStructLength = 12;
exports.arraySegment = {
    array: function (obj) { return Environment_1.platform.readObjectField(obj, 0); },
    offset: function (obj) { return Environment_1.platform.readInt32Field(obj, 4); },
    count: function (obj) { return Environment_1.platform.readInt32Field(obj, 8); },
};
exports.renderTreeDiffStructLength = 4 + arraySegmentStructLength;
exports.renderTreeDiff = {
    componentId: function (obj) { return Environment_1.platform.readInt32Field(obj, 0); },
    edits: function (obj) { return Environment_1.platform.readStructField(obj, 4); },
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RenderTreeEdit_1 = __webpack_require__(12);
var RenderTreeFrame_1 = __webpack_require__(13);
var Environment_1 = __webpack_require__(0);
var EventDelegator_1 = __webpack_require__(14);
var LogicalElements_1 = __webpack_require__(16);
var ElementReferenceCapture_1 = __webpack_require__(3);
var selectValuePropname = '_blazorSelectValue';
var raiseEventMethod;
var renderComponentMethod;
var BrowserRenderer = /** @class */ (function () {
    function BrowserRenderer(browserRendererId) {
        var _this = this;
        this.browserRendererId = browserRendererId;
        this.childComponentLocations = {};
        this.eventDelegator = new EventDelegator_1.EventDelegator(function (event, componentId, eventHandlerId, eventArgs) {
            raiseEvent(event, _this.browserRendererId, componentId, eventHandlerId, eventArgs);
        });
    }
    BrowserRenderer.prototype.attachRootComponentToElement = function (componentId, element) {
        this.attachComponentToElement(componentId, LogicalElements_1.toLogicalElement(element));
    };
    BrowserRenderer.prototype.updateComponent = function (componentId, edits, editsOffset, editsLength, referenceFrames) {
        var element = this.childComponentLocations[componentId];
        if (!element) {
            throw new Error("No element is currently associated with component " + componentId);
        }
        this.applyEdits(componentId, element, 0, edits, editsOffset, editsLength, referenceFrames);
    };
    BrowserRenderer.prototype.disposeComponent = function (componentId) {
        delete this.childComponentLocations[componentId];
    };
    BrowserRenderer.prototype.disposeEventHandler = function (eventHandlerId) {
        this.eventDelegator.removeListener(eventHandlerId);
    };
    BrowserRenderer.prototype.attachComponentToElement = function (componentId, element) {
        this.childComponentLocations[componentId] = element;
    };
    BrowserRenderer.prototype.applyEdits = function (componentId, parent, childIndex, edits, editsOffset, editsLength, referenceFrames) {
        var currentDepth = 0;
        var childIndexAtCurrentDepth = childIndex;
        var maxEditIndexExcl = editsOffset + editsLength;
        for (var editIndex = editsOffset; editIndex < maxEditIndexExcl; editIndex++) {
            var edit = RenderTreeEdit_1.getRenderTreeEditPtr(edits, editIndex);
            var editType = RenderTreeEdit_1.renderTreeEdit.type(edit);
            switch (editType) {
                case RenderTreeEdit_1.EditType.prependFrame: {
                    var frameIndex = RenderTreeEdit_1.renderTreeEdit.newTreeIndex(edit);
                    var frame = RenderTreeFrame_1.getTreeFramePtr(referenceFrames, frameIndex);
                    var siblingIndex = RenderTreeEdit_1.renderTreeEdit.siblingIndex(edit);
                    this.insertFrame(componentId, parent, childIndexAtCurrentDepth + siblingIndex, referenceFrames, frame, frameIndex);
                    break;
                }
                case RenderTreeEdit_1.EditType.removeFrame: {
                    var siblingIndex = RenderTreeEdit_1.renderTreeEdit.siblingIndex(edit);
                    LogicalElements_1.removeLogicalChild(parent, childIndexAtCurrentDepth + siblingIndex);
                    break;
                }
                case RenderTreeEdit_1.EditType.setAttribute: {
                    var frameIndex = RenderTreeEdit_1.renderTreeEdit.newTreeIndex(edit);
                    var frame = RenderTreeFrame_1.getTreeFramePtr(referenceFrames, frameIndex);
                    var siblingIndex = RenderTreeEdit_1.renderTreeEdit.siblingIndex(edit);
                    var element = LogicalElements_1.getLogicalChild(parent, childIndexAtCurrentDepth + siblingIndex);
                    if (element instanceof HTMLElement) {
                        this.applyAttribute(componentId, element, frame);
                    }
                    else {
                        throw new Error("Cannot set attribute on non-element child");
                    }
                    break;
                }
                case RenderTreeEdit_1.EditType.removeAttribute: {
                    // Note that we don't have to dispose the info we track about event handlers here, because the
                    // disposed event handler IDs are delivered separately (in the 'disposedEventHandlerIds' array)
                    var siblingIndex = RenderTreeEdit_1.renderTreeEdit.siblingIndex(edit);
                    var element = LogicalElements_1.getLogicalChild(parent, childIndexAtCurrentDepth + siblingIndex);
                    if (element instanceof HTMLElement) {
                        var attributeName = RenderTreeEdit_1.renderTreeEdit.removedAttributeName(edit);
                        // First try to remove any special property we use for this attribute
                        if (!this.tryApplySpecialProperty(element, attributeName, null)) {
                            // If that's not applicable, it's a regular DOM attribute so remove that
                            element.removeAttribute(attributeName);
                        }
                    }
                    else {
                        throw new Error("Cannot remove attribute from non-element child");
                    }
                    break;
                }
                case RenderTreeEdit_1.EditType.updateText: {
                    var frameIndex = RenderTreeEdit_1.renderTreeEdit.newTreeIndex(edit);
                    var frame = RenderTreeFrame_1.getTreeFramePtr(referenceFrames, frameIndex);
                    var siblingIndex = RenderTreeEdit_1.renderTreeEdit.siblingIndex(edit);
                    var textNode = LogicalElements_1.getLogicalChild(parent, childIndexAtCurrentDepth + siblingIndex);
                    if (textNode instanceof Text) {
                        textNode.textContent = RenderTreeFrame_1.renderTreeFrame.textContent(frame);
                    }
                    else {
                        throw new Error("Cannot set text content on non-text child");
                    }
                    break;
                }
                case RenderTreeEdit_1.EditType.stepIn: {
                    var siblingIndex = RenderTreeEdit_1.renderTreeEdit.siblingIndex(edit);
                    parent = LogicalElements_1.getLogicalChild(parent, childIndexAtCurrentDepth + siblingIndex);
                    currentDepth++;
                    childIndexAtCurrentDepth = 0;
                    break;
                }
                case RenderTreeEdit_1.EditType.stepOut: {
                    parent = LogicalElements_1.getLogicalParent(parent);
                    currentDepth--;
                    childIndexAtCurrentDepth = currentDepth === 0 ? childIndex : 0; // The childIndex is only ever nonzero at zero depth
                    break;
                }
                default: {
                    var unknownType = editType; // Compile-time verification that the switch was exhaustive
                    throw new Error("Unknown edit type: " + unknownType);
                }
            }
        }
    };
    BrowserRenderer.prototype.insertFrame = function (componentId, parent, childIndex, frames, frame, frameIndex) {
        var frameType = RenderTreeFrame_1.renderTreeFrame.frameType(frame);
        switch (frameType) {
            case RenderTreeFrame_1.FrameType.element:
                this.insertElement(componentId, parent, childIndex, frames, frame, frameIndex);
                return 1;
            case RenderTreeFrame_1.FrameType.text:
                this.insertText(parent, childIndex, frame);
                return 1;
            case RenderTreeFrame_1.FrameType.attribute:
                throw new Error('Attribute frames should only be present as leading children of element frames.');
            case RenderTreeFrame_1.FrameType.component:
                this.insertComponent(parent, childIndex, frame);
                return 1;
            case RenderTreeFrame_1.FrameType.region:
                return this.insertFrameRange(componentId, parent, childIndex, frames, frameIndex + 1, frameIndex + RenderTreeFrame_1.renderTreeFrame.subtreeLength(frame));
            case RenderTreeFrame_1.FrameType.elementReferenceCapture:
                if (parent instanceof Element) {
                    ElementReferenceCapture_1.applyCaptureIdToElement(parent, RenderTreeFrame_1.renderTreeFrame.elementReferenceCaptureId(frame));
                    return 0; // A "capture" is a child in the diff, but has no node in the DOM
                }
                else {
                    throw new Error('Reference capture frames can only be children of element frames.');
                }
            default:
                var unknownType = frameType; // Compile-time verification that the switch was exhaustive
                throw new Error("Unknown frame type: " + unknownType);
        }
    };
    BrowserRenderer.prototype.insertElement = function (componentId, parent, childIndex, frames, frame, frameIndex) {
        var tagName = RenderTreeFrame_1.renderTreeFrame.elementName(frame);
        var newDomElementRaw = tagName === 'svg' || LogicalElements_1.isSvgElement(parent) ?
            document.createElementNS('http://www.w3.org/2000/svg', tagName) :
            document.createElement(tagName);
        var newElement = LogicalElements_1.toLogicalElement(newDomElementRaw);
        LogicalElements_1.insertLogicalChild(newDomElementRaw, parent, childIndex);
        // Apply attributes
        var descendantsEndIndexExcl = frameIndex + RenderTreeFrame_1.renderTreeFrame.subtreeLength(frame);
        for (var descendantIndex = frameIndex + 1; descendantIndex < descendantsEndIndexExcl; descendantIndex++) {
            var descendantFrame = RenderTreeFrame_1.getTreeFramePtr(frames, descendantIndex);
            if (RenderTreeFrame_1.renderTreeFrame.frameType(descendantFrame) === RenderTreeFrame_1.FrameType.attribute) {
                this.applyAttribute(componentId, newDomElementRaw, descendantFrame);
            }
            else {
                // As soon as we see a non-attribute child, all the subsequent child frames are
                // not attributes, so bail out and insert the remnants recursively
                this.insertFrameRange(componentId, newElement, 0, frames, descendantIndex, descendantsEndIndexExcl);
                break;
            }
        }
    };
    BrowserRenderer.prototype.insertComponent = function (parent, childIndex, frame) {
        var containerElement = LogicalElements_1.createAndInsertLogicalContainer(parent, childIndex);
        // All we have to do is associate the child component ID with its location. We don't actually
        // do any rendering here, because the diff for the child will appear later in the render batch.
        var childComponentId = RenderTreeFrame_1.renderTreeFrame.componentId(frame);
        this.attachComponentToElement(childComponentId, containerElement);
    };
    BrowserRenderer.prototype.insertText = function (parent, childIndex, textFrame) {
        var textContent = RenderTreeFrame_1.renderTreeFrame.textContent(textFrame);
        var newTextNode = document.createTextNode(textContent);
        LogicalElements_1.insertLogicalChild(newTextNode, parent, childIndex);
    };
    BrowserRenderer.prototype.applyAttribute = function (componentId, toDomElement, attributeFrame) {
        var attributeName = RenderTreeFrame_1.renderTreeFrame.attributeName(attributeFrame);
        var browserRendererId = this.browserRendererId;
        var eventHandlerId = RenderTreeFrame_1.renderTreeFrame.attributeEventHandlerId(attributeFrame);
        if (eventHandlerId) {
            var firstTwoChars = attributeName.substring(0, 2);
            var eventName = attributeName.substring(2);
            if (firstTwoChars !== 'on' || !eventName) {
                throw new Error("Attribute has nonzero event handler ID, but attribute name '" + attributeName + "' does not start with 'on'.");
            }
            this.eventDelegator.setListener(toDomElement, eventName, componentId, eventHandlerId);
            return;
        }
        // First see if we have special handling for this attribute
        if (!this.tryApplySpecialProperty(toDomElement, attributeName, attributeFrame)) {
            // If not, treat it as a regular string-valued attribute
            toDomElement.setAttribute(attributeName, RenderTreeFrame_1.renderTreeFrame.attributeValue(attributeFrame));
        }
    };
    BrowserRenderer.prototype.tryApplySpecialProperty = function (element, attributeName, attributeFrame) {
        switch (attributeName) {
            case 'value':
                return this.tryApplyValueProperty(element, attributeFrame);
            case 'checked':
                return this.tryApplyCheckedProperty(element, attributeFrame);
            default:
                return false;
        }
    };
    BrowserRenderer.prototype.tryApplyValueProperty = function (element, attributeFrame) {
        // Certain elements have built-in behaviour for their 'value' property
        switch (element.tagName) {
            case 'INPUT':
            case 'SELECT':
            case 'TEXTAREA': {
                var value = attributeFrame ? RenderTreeFrame_1.renderTreeFrame.attributeValue(attributeFrame) : null;
                element.value = value;
                if (element.tagName === 'SELECT') {
                    // <select> is special, in that anything we write to .value will be lost if there
                    // isn't yet a matching <option>. To maintain the expected behavior no matter the
                    // element insertion/update order, preserve the desired value separately so
                    // we can recover it when inserting any matching <option>.
                    element[selectValuePropname] = value;
                }
                return true;
            }
            case 'OPTION': {
                var value = attributeFrame ? RenderTreeFrame_1.renderTreeFrame.attributeValue(attributeFrame) : null;
                if (value) {
                    element.setAttribute('value', value);
                }
                else {
                    element.removeAttribute('value');
                }
                // See above for why we have this special handling for <select>/<option>
                var parentElement = element.parentElement;
                if (parentElement && (selectValuePropname in parentElement) && parentElement[selectValuePropname] === value) {
                    this.tryApplyValueProperty(parentElement, attributeFrame);
                    delete parentElement[selectValuePropname];
                }
                return true;
            }
            default:
                return false;
        }
    };
    BrowserRenderer.prototype.tryApplyCheckedProperty = function (element, attributeFrame) {
        // Certain elements have built-in behaviour for their 'checked' property
        if (element.tagName === 'INPUT') {
            var value = attributeFrame ? RenderTreeFrame_1.renderTreeFrame.attributeValue(attributeFrame) : null;
            element.checked = value !== null;
            return true;
        }
        else {
            return false;
        }
    };
    BrowserRenderer.prototype.insertFrameRange = function (componentId, parent, childIndex, frames, startIndex, endIndexExcl) {
        var origChildIndex = childIndex;
        for (var index = startIndex; index < endIndexExcl; index++) {
            var frame = RenderTreeFrame_1.getTreeFramePtr(frames, index);
            var numChildrenInserted = this.insertFrame(componentId, parent, childIndex, frames, frame, index);
            childIndex += numChildrenInserted;
            // Skip over any descendants, since they are already dealt with recursively
            index += countDescendantFrames(frame);
        }
        return (childIndex - origChildIndex); // Total number of children inserted
    };
    return BrowserRenderer;
}());
exports.BrowserRenderer = BrowserRenderer;
function countDescendantFrames(frame) {
    switch (RenderTreeFrame_1.renderTreeFrame.frameType(frame)) {
        // The following frame types have a subtree length. Other frames may use that memory slot
        // to mean something else, so we must not read it. We should consider having nominal subtypes
        // of RenderTreeFramePointer that prevent access to non-applicable fields.
        case RenderTreeFrame_1.FrameType.component:
        case RenderTreeFrame_1.FrameType.element:
        case RenderTreeFrame_1.FrameType.region:
            return RenderTreeFrame_1.renderTreeFrame.subtreeLength(frame) - 1;
        default:
            return 0;
    }
}
function raiseEvent(event, browserRendererId, componentId, eventHandlerId, eventArgs) {
    event.preventDefault();
    if (!raiseEventMethod) {
        raiseEventMethod = Environment_1.platform.findMethod('Microsoft.AspNetCore.Blazor.Browser', 'Microsoft.AspNetCore.Blazor.Browser.Rendering', 'BrowserRendererEventDispatcher', 'DispatchEvent');
    }
    var eventDescriptor = {
        browserRendererId: browserRendererId,
        componentId: componentId,
        eventHandlerId: eventHandlerId,
        eventArgsType: eventArgs.type
    };
    Environment_1.platform.callMethod(raiseEventMethod, null, [
        Environment_1.platform.toDotNetString(JSON.stringify(eventDescriptor)),
        Environment_1.platform.toDotNetString(JSON.stringify(eventArgs.data))
    ]);
}


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
var renderTreeEditStructLength = 16;
function getRenderTreeEditPtr(renderTreeEdits, index) {
    return Environment_1.platform.getArrayEntryPtr(renderTreeEdits, index, renderTreeEditStructLength);
}
exports.getRenderTreeEditPtr = getRenderTreeEditPtr;
exports.renderTreeEdit = {
    // The properties and memory layout must be kept in sync with the .NET equivalent in RenderTreeEdit.cs
    type: function (edit) { return Environment_1.platform.readInt32Field(edit, 0); },
    siblingIndex: function (edit) { return Environment_1.platform.readInt32Field(edit, 4); },
    newTreeIndex: function (edit) { return Environment_1.platform.readInt32Field(edit, 8); },
    removedAttributeName: function (edit) { return Environment_1.platform.readStringField(edit, 12); },
};
var EditType;
(function (EditType) {
    EditType[EditType["prependFrame"] = 1] = "prependFrame";
    EditType[EditType["removeFrame"] = 2] = "removeFrame";
    EditType[EditType["setAttribute"] = 3] = "setAttribute";
    EditType[EditType["removeAttribute"] = 4] = "removeAttribute";
    EditType[EditType["updateText"] = 5] = "updateText";
    EditType[EditType["stepIn"] = 6] = "stepIn";
    EditType[EditType["stepOut"] = 7] = "stepOut";
})(EditType = exports.EditType || (exports.EditType = {}));


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
var renderTreeFrameStructLength = 28;
// To minimise GC pressure, instead of instantiating a JS object to represent each tree frame,
// we work in terms of pointers to the structs on the .NET heap, and use static functions that
// know how to read property values from those structs.
function getTreeFramePtr(renderTreeEntries, index) {
    return Environment_1.platform.getArrayEntryPtr(renderTreeEntries, index, renderTreeFrameStructLength);
}
exports.getTreeFramePtr = getTreeFramePtr;
exports.renderTreeFrame = {
    // The properties and memory layout must be kept in sync with the .NET equivalent in RenderTreeFrame.cs
    frameType: function (frame) { return Environment_1.platform.readInt32Field(frame, 4); },
    subtreeLength: function (frame) { return Environment_1.platform.readInt32Field(frame, 8); },
    elementReferenceCaptureId: function (frame) { return Environment_1.platform.readInt32Field(frame, 8); },
    componentId: function (frame) { return Environment_1.platform.readInt32Field(frame, 12); },
    elementName: function (frame) { return Environment_1.platform.readStringField(frame, 16); },
    textContent: function (frame) { return Environment_1.platform.readStringField(frame, 16); },
    attributeName: function (frame) { return Environment_1.platform.readStringField(frame, 16); },
    attributeValue: function (frame) { return Environment_1.platform.readStringField(frame, 24); },
    attributeEventHandlerId: function (frame) { return Environment_1.platform.readInt32Field(frame, 8); },
};
var FrameType;
(function (FrameType) {
    // The values must be kept in sync with the .NET equivalent in RenderTreeFrameType.cs
    FrameType[FrameType["element"] = 1] = "element";
    FrameType[FrameType["text"] = 2] = "text";
    FrameType[FrameType["attribute"] = 3] = "attribute";
    FrameType[FrameType["component"] = 4] = "component";
    FrameType[FrameType["region"] = 5] = "region";
    FrameType[FrameType["elementReferenceCapture"] = 6] = "elementReferenceCapture";
})(FrameType = exports.FrameType || (exports.FrameType = {}));


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventForDotNet_1 = __webpack_require__(15);
var nonBubblingEvents = toLookup([
    'abort', 'blur', 'change', 'error', 'focus', 'load', 'loadend', 'loadstart', 'mouseenter', 'mouseleave',
    'progress', 'reset', 'scroll', 'submit', 'unload', 'DOMNodeInsertedIntoDocument', 'DOMNodeRemovedFromDocument'
]);
// Responsible for adding/removing the eventInfo on an expando property on DOM elements, and
// calling an EventInfoStore that deals with registering/unregistering the underlying delegated
// event listeners as required (and also maps actual events back to the given callback).
var EventDelegator = /** @class */ (function () {
    function EventDelegator(onEvent) {
        this.onEvent = onEvent;
        var eventDelegatorId = ++EventDelegator.nextEventDelegatorId;
        this.eventsCollectionKey = "_blazorEvents_" + eventDelegatorId;
        this.eventInfoStore = new EventInfoStore(this.onGlobalEvent.bind(this));
    }
    EventDelegator.prototype.setListener = function (element, eventName, componentId, eventHandlerId) {
        // Ensure we have a place to store event info for this element
        var infoForElement = element[this.eventsCollectionKey];
        if (!infoForElement) {
            infoForElement = element[this.eventsCollectionKey] = {};
        }
        if (infoForElement.hasOwnProperty(eventName)) {
            // We can cheaply update the info on the existing object and don't need any other housekeeping
            var oldInfo = infoForElement[eventName];
            this.eventInfoStore.update(oldInfo.eventHandlerId, eventHandlerId);
        }
        else {
            // Go through the whole flow which might involve registering a new global handler
            var newInfo = { element: element, eventName: eventName, componentId: componentId, eventHandlerId: eventHandlerId };
            this.eventInfoStore.add(newInfo);
            infoForElement[eventName] = newInfo;
        }
    };
    EventDelegator.prototype.removeListener = function (eventHandlerId) {
        // This method gets called whenever the .NET-side code reports that a certain event handler
        // has been disposed. However we will already have disposed the info about that handler if
        // the eventHandlerId for the (element,eventName) pair was replaced during diff application.
        var info = this.eventInfoStore.remove(eventHandlerId);
        if (info) {
            // Looks like this event handler wasn't already disposed
            // Remove the associated data from the DOM element
            var element = info.element;
            if (element.hasOwnProperty(this.eventsCollectionKey)) {
                var elementEventInfos = element[this.eventsCollectionKey];
                delete elementEventInfos[info.eventName];
                if (Object.getOwnPropertyNames(elementEventInfos).length === 0) {
                    delete element[this.eventsCollectionKey];
                }
            }
        }
    };
    EventDelegator.prototype.onGlobalEvent = function (evt) {
        if (!(evt.target instanceof Element)) {
            return;
        }
        // Scan up the element hierarchy, looking for any matching registered event handlers
        var candidateElement = evt.target;
        var eventArgs = null; // Populate lazily
        var eventIsNonBubbling = nonBubblingEvents.hasOwnProperty(evt.type);
        while (candidateElement) {
            if (candidateElement.hasOwnProperty(this.eventsCollectionKey)) {
                var handlerInfos = candidateElement[this.eventsCollectionKey];
                if (handlerInfos.hasOwnProperty(evt.type)) {
                    // We are going to raise an event for this element, so prepare info needed by the .NET code
                    if (!eventArgs) {
                        eventArgs = EventForDotNet_1.EventForDotNet.fromDOMEvent(evt);
                    }
                    var handlerInfo = handlerInfos[evt.type];
                    this.onEvent(evt, handlerInfo.componentId, handlerInfo.eventHandlerId, eventArgs);
                }
            }
            candidateElement = eventIsNonBubbling ? null : candidateElement.parentElement;
        }
    };
    EventDelegator.nextEventDelegatorId = 0;
    return EventDelegator;
}());
exports.EventDelegator = EventDelegator;
// Responsible for adding and removing the global listener when the number of listeners
// for a given event name changes between zero and nonzero
var EventInfoStore = /** @class */ (function () {
    function EventInfoStore(globalListener) {
        this.globalListener = globalListener;
        this.infosByEventHandlerId = {};
        this.countByEventName = {};
    }
    EventInfoStore.prototype.add = function (info) {
        if (this.infosByEventHandlerId[info.eventHandlerId]) {
            // Should never happen, but we want to know if it does
            throw new Error("Event " + info.eventHandlerId + " is already tracked");
        }
        this.infosByEventHandlerId[info.eventHandlerId] = info;
        var eventName = info.eventName;
        if (this.countByEventName.hasOwnProperty(eventName)) {
            this.countByEventName[eventName]++;
        }
        else {
            this.countByEventName[eventName] = 1;
            // To make delegation work with non-bubbling events, register a 'capture' listener.
            // We preserve the non-bubbling behavior by only dispatching such events to the targeted element.
            var useCapture = nonBubblingEvents.hasOwnProperty(eventName);
            document.addEventListener(eventName, this.globalListener, useCapture);
        }
    };
    EventInfoStore.prototype.update = function (oldEventHandlerId, newEventHandlerId) {
        if (this.infosByEventHandlerId.hasOwnProperty(newEventHandlerId)) {
            // Should never happen, but we want to know if it does
            throw new Error("Event " + newEventHandlerId + " is already tracked");
        }
        // Since we're just updating the event handler ID, there's no need to update the global counts
        var info = this.infosByEventHandlerId[oldEventHandlerId];
        delete this.infosByEventHandlerId[oldEventHandlerId];
        info.eventHandlerId = newEventHandlerId;
        this.infosByEventHandlerId[newEventHandlerId] = info;
    };
    EventInfoStore.prototype.remove = function (eventHandlerId) {
        var info = this.infosByEventHandlerId[eventHandlerId];
        if (info) {
            delete this.infosByEventHandlerId[eventHandlerId];
            var eventName = info.eventName;
            if (--this.countByEventName[eventName] === 0) {
                delete this.countByEventName[eventName];
                document.removeEventListener(eventName, this.globalListener);
            }
        }
        return info;
    };
    return EventInfoStore;
}());
function toLookup(items) {
    var result = {};
    items.forEach(function (value) { result[value] = true; });
    return result;
}


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var EventForDotNet = /** @class */ (function () {
    function EventForDotNet(type, data) {
        this.type = type;
        this.data = data;
    }
    EventForDotNet.fromDOMEvent = function (event) {
        var element = event.target;
        switch (event.type) {
            case 'change': {
                var targetIsCheckbox = isCheckbox(element);
                var newValue = targetIsCheckbox ? !!element['checked'] : element['value'];
                return new EventForDotNet('change', { type: event.type, value: newValue });
            }
            case 'copy':
            case 'cut':
            case 'paste':
                return new EventForDotNet('clipboard', { type: event.type });
            case 'drag':
            case 'dragend':
            case 'dragenter':
            case 'dragleave':
            case 'dragover':
            case 'dragstart':
            case 'drop':
                return new EventForDotNet('drag', parseDragEvent(event));
            case 'focus':
            case 'blur':
            case 'focusin':
            case 'focusout':
                return new EventForDotNet('focus', { type: event.type });
            case 'keydown':
            case 'keyup':
            case 'keypress':
                return new EventForDotNet('keyboard', parseKeyboardEvent(event));
            case 'contextmenu':
            case 'click':
            case 'mouseover':
            case 'mouseout':
            case 'mousemove':
            case 'mousedown':
            case 'mouseup':
            case 'dblclick':
                return new EventForDotNet('mouse', parseMouseEvent(event));
            case 'loadstart':
            case 'timeout':
            case 'abort':
            case 'load':
            case 'loadend':
            case 'error':
            case 'progress':
                return new EventForDotNet('progress', parseProgressEvent(event));
            case 'touchcancel':
            case 'touchend':
            case 'touchmove':
            case 'touchenter':
            case 'touchleave':
            case 'touchstart':
                return new EventForDotNet('touch', parseTouchEvent(event));
            case 'gotpointercapture':
            case 'lostpointercapture':
            case 'pointercancel':
            case 'pointerdown':
            case 'pointerenter':
            case 'pointerleave':
            case 'pointermove':
            case 'pointerout':
            case 'pointerover':
            case 'pointerup':
                return new EventForDotNet('pointer', parsePointerEvent(event));
            case 'wheel':
            case 'mousewheel':
                return new EventForDotNet('wheel', parseWheelEvent(event));
            default:
                return new EventForDotNet('unknown', { type: event.type });
        }
    };
    return EventForDotNet;
}());
exports.EventForDotNet = EventForDotNet;
function parseDragEvent(event) {
    return {
        type: event.type,
        detail: event.detail,
        dataTransfer: event.dataTransfer,
        screenX: event.screenX,
        screenY: event.screenY,
        clientX: event.clientX,
        clientY: event.clientY,
        button: event.button,
        buttons: event.buttons,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        metaKey: event.metaKey
    };
}
function parseWheelEvent(event) {
    return __assign({}, parseMouseEvent(event), { deltaX: event.deltaX, deltaY: event.deltaY, deltaZ: event.deltaZ, deltaMode: event.deltaMode });
}
function parseProgressEvent(event) {
    return {
        type: event.type,
        lengthComputable: event.lengthComputable,
        loaded: event.loaded,
        total: event.total
    };
}
function parseTouchEvent(event) {
    function parseTouch(touchList) {
        var touches = [];
        for (var i = 0; i < touchList.length; i++) {
            var touch = touchList[i];
            touches.push({
                identifier: touch.identifier,
                clientX: touch.clientX,
                clientY: touch.clientY,
                screenX: touch.screenX,
                screenY: touch.screenY,
                pageX: touch.pageX,
                pageY: touch.pageY
            });
        }
        return touches;
    }
    return {
        type: event.type,
        detail: event.detail,
        touches: parseTouch(event.touches),
        targetTouches: parseTouch(event.targetTouches),
        changedTouches: parseTouch(event.changedTouches),
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        metaKey: event.metaKey
    };
}
function parseKeyboardEvent(event) {
    return {
        type: event.type,
        key: event.key,
        code: event.code,
        location: event.location,
        repeat: event.repeat,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        metaKey: event.metaKey
    };
}
function parsePointerEvent(event) {
    return __assign({}, parseMouseEvent(event), { pointerId: event.pointerId, width: event.width, height: event.height, pressure: event.pressure, tiltX: event.tiltX, tiltY: event.tiltY, pointerType: event.pointerType, isPrimary: event.isPrimary });
}
function parseMouseEvent(event) {
    return {
        type: event.type,
        detail: event.detail,
        screenX: event.screenX,
        screenY: event.screenY,
        clientX: event.clientX,
        clientY: event.clientY,
        button: event.button,
        buttons: event.buttons,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        metaKey: event.metaKey
    };
}
function isCheckbox(element) {
    return element && element.tagName === 'INPUT' && element.getAttribute('type') === 'checkbox';
}


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
  A LogicalElement plays the same role as an Element instance from the point of view of the
  API consumer. Inserting and removing logical elements updates the browser DOM just the same.

  The difference is that, unlike regular DOM mutation APIs, the LogicalElement APIs don't use
  the underlying DOM structure as the data storage for the element hierarchy. Instead, the
  LogicalElement APIs take care of tracking hierarchical relationships separately. The point
  of this is to permit a logical tree structure in which parent/child relationships don't
  have to be materialized in terms of DOM element parent/child relationships. And the reason
  why we want that is so that hierarchies of Blazor components can be tracked even when those
  components' render output need not be a single literal DOM element.

  Consumers of the API don't need to know about the implementation, but how it's done is:
  - Each LogicalElement is materialized in the DOM as either:
    - A Node instance, for actual Node instances inserted using 'insertLogicalChild' or
      for Element instances promoted to LogicalElement via 'toLogicalElement'
    - A Comment instance, for 'logical container' instances inserted using 'createAndInsertLogicalContainer'
  - Then, on that instance (i.e., the Node or Comment), we store an array of 'logical children'
    instances, e.g.,
      [firstChild, secondChild, thirdChild, ...]
    ... plus we store a reference to the 'logical parent' (if any)
  - The 'logical children' array means we can look up in O(1):
    - The number of logical children (not currently implemented because not required, but trivial)
    - The logical child at any given index
  - Whenever a logical child is added or removed, we update the parent's array of logical children
*/
Object.defineProperty(exports, "__esModule", { value: true });
var logicalChildrenPropname = createSymbolOrFallback('_blazorLogicalChildren');
var logicalParentPropname = createSymbolOrFallback('_blazorLogicalParent');
function toLogicalElement(element) {
    if (element.childNodes.length > 0) {
        throw new Error('New logical elements must start empty');
    }
    element[logicalChildrenPropname] = [];
    return element;
}
exports.toLogicalElement = toLogicalElement;
function createAndInsertLogicalContainer(parent, childIndex) {
    var containerElement = document.createComment('!');
    insertLogicalChild(containerElement, parent, childIndex);
    return containerElement;
}
exports.createAndInsertLogicalContainer = createAndInsertLogicalContainer;
function insertLogicalChild(child, parent, childIndex) {
    var childAsLogicalElement = child;
    if (child instanceof Comment) {
        var existingGrandchildren = getLogicalChildrenArray(childAsLogicalElement);
        if (existingGrandchildren && getLogicalChildrenArray(childAsLogicalElement).length > 0) {
            // There's nothing to stop us implementing support for this scenario, and it's not difficult
            // (after inserting 'child' itself, also iterate through its logical children and physically
            // put them as following-siblings in the DOM). However there's no scenario that requires it
            // presently, so if we did implement it there'd be no good way to have tests for it.
            throw new Error('Not implemented: inserting non-empty logical container');
        }
    }
    if (getLogicalParent(childAsLogicalElement)) {
        // Likewise, we could easily support this scenario too (in this 'if' block, just splice
        // out 'child' from the logical children array of its previous logical parent by using
        // Array.prototype.indexOf to determine its previous sibling index).
        // But again, since there's not currently any scenario that would use it, we would not
        // have any test coverage for such an implementation.
        throw new Error('Not implemented: moving existing logical children');
    }
    var newSiblings = getLogicalChildrenArray(parent);
    if (childIndex < newSiblings.length) {
        // Insert
        var nextSibling = newSiblings[childIndex];
        nextSibling.parentNode.insertBefore(child, nextSibling);
        newSiblings.splice(childIndex, 0, childAsLogicalElement);
    }
    else {
        // Append
        appendDomNode(child, parent);
        newSiblings.push(childAsLogicalElement);
    }
    childAsLogicalElement[logicalParentPropname] = parent;
    if (!(logicalChildrenPropname in childAsLogicalElement)) {
        childAsLogicalElement[logicalChildrenPropname] = [];
    }
}
exports.insertLogicalChild = insertLogicalChild;
function removeLogicalChild(parent, childIndex) {
    var childrenArray = getLogicalChildrenArray(parent);
    var childToRemove = childrenArray.splice(childIndex, 1)[0];
    // If it's a logical container, also remove its descendants
    if (childToRemove instanceof Comment) {
        var grandchildrenArray = getLogicalChildrenArray(childToRemove);
        while (grandchildrenArray.length > 0) {
            removeLogicalChild(childToRemove, 0);
        }
    }
    // Finally, remove the node itself
    var domNodeToRemove = childToRemove;
    domNodeToRemove.parentNode.removeChild(domNodeToRemove);
}
exports.removeLogicalChild = removeLogicalChild;
function getLogicalParent(element) {
    return element[logicalParentPropname] || null;
}
exports.getLogicalParent = getLogicalParent;
function getLogicalChild(parent, childIndex) {
    return getLogicalChildrenArray(parent)[childIndex];
}
exports.getLogicalChild = getLogicalChild;
function isSvgElement(element) {
    return getClosestDomElement(element).namespaceURI === 'http://www.w3.org/2000/svg';
}
exports.isSvgElement = isSvgElement;
function getLogicalChildrenArray(element) {
    return element[logicalChildrenPropname];
}
function getLogicalNextSibling(element) {
    var siblings = getLogicalChildrenArray(getLogicalParent(element));
    var siblingIndex = Array.prototype.indexOf.call(siblings, element);
    return siblings[siblingIndex + 1] || null;
}
function getClosestDomElement(logicalElement) {
    if (logicalElement instanceof Element) {
        return logicalElement;
    }
    else if (logicalElement instanceof Comment) {
        return logicalElement.parentNode;
    }
    else {
        throw new Error('Not a valid logical element');
    }
}
function appendDomNode(child, parent) {
    // This function only puts 'child' into the DOM in the right place relative to 'parent'
    // It does not update the logical children array of anything
    if (parent instanceof Element) {
        parent.appendChild(child);
    }
    else if (parent instanceof Comment) {
        var parentLogicalNextSibling = getLogicalNextSibling(parent);
        if (parentLogicalNextSibling) {
            // Since the parent has a logical next-sibling, its appended child goes right before that
            parentLogicalNextSibling.parentNode.insertBefore(child, parentLogicalNextSibling);
        }
        else {
            // Since the parent has no logical next-sibling, keep recursing upwards until we find
            // a logical ancestor that does have a next-sibling or is a physical element.
            appendDomNode(child, getLogicalParent(parent));
        }
    }
    else {
        // Should never happen
        throw new Error("Cannot append node because the parent is not a valid logical element. Parent: " + parent);
    }
}
function createSymbolOrFallback(fallback) {
    return typeof Symbol === 'function' ? Symbol() : fallback;
}
;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var RegisteredFunction_1 = __webpack_require__(1);
var Environment_1 = __webpack_require__(0);
var httpClientAssembly = 'Microsoft.AspNetCore.Blazor.Browser';
var httpClientNamespace = httpClientAssembly + ".Http";
var httpClientTypeName = 'BrowserHttpMessageHandler';
var httpClientFullTypeName = httpClientNamespace + "." + httpClientTypeName;
var receiveResponseMethod;
var allocateArrayMethod;
RegisteredFunction_1.registerFunction(httpClientFullTypeName + ".Send", function (id, body, jsonFetchArgs) {
    sendAsync(id, body, jsonFetchArgs);
});
function sendAsync(id, body, jsonFetchArgs) {
    return __awaiter(this, void 0, void 0, function () {
        var response, responseData, fetchOptions, requestInit, ex_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fetchOptions = JSON.parse(Environment_1.platform.toJavaScriptString(jsonFetchArgs));
                    requestInit = Object.assign(fetchOptions.requestInit, fetchOptions.requestInitOverrides);
                    if (body) {
                        requestInit.body = Environment_1.platform.toUint8Array(body);
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(fetchOptions.requestUri, requestInit)];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.arrayBuffer()];
                case 3:
                    responseData = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    ex_1 = _a.sent();
                    dispatchErrorResponse(id, ex_1.toString());
                    return [2 /*return*/];
                case 5:
                    dispatchSuccessResponse(id, response, responseData);
                    return [2 /*return*/];
            }
        });
    });
}
function dispatchSuccessResponse(id, response, responseData) {
    var responseDescriptor = {
        statusCode: response.status,
        statusText: response.statusText,
        headers: []
    };
    response.headers.forEach(function (value, name) {
        responseDescriptor.headers.push([name, value]);
    });
    if (!allocateArrayMethod) {
        allocateArrayMethod = Environment_1.platform.findMethod(httpClientAssembly, httpClientNamespace, httpClientTypeName, 'AllocateArray');
    }
    // allocate a managed byte[] of the right size
    var dotNetArray = Environment_1.platform.callMethod(allocateArrayMethod, null, [Environment_1.platform.toDotNetString(responseData.byteLength.toString())]);
    // get an Uint8Array view of it
    var array = Environment_1.platform.toUint8Array(dotNetArray);
    // copy the responseData to our managed byte[]
    array.set(new Uint8Array(responseData));
    dispatchResponse(id, Environment_1.platform.toDotNetString(JSON.stringify(responseDescriptor)), dotNetArray, 
    /* errorMessage */ null);
}
function dispatchErrorResponse(id, errorMessage) {
    dispatchResponse(id, 
    /* responseDescriptor */ null, 
    /* responseText */ null, Environment_1.platform.toDotNetString(errorMessage));
}
function dispatchResponse(id, responseDescriptor, responseData, errorMessage) {
    if (!receiveResponseMethod) {
        receiveResponseMethod = Environment_1.platform.findMethod(httpClientAssembly, httpClientNamespace, httpClientTypeName, 'ReceiveResponse');
    }
    Environment_1.platform.callMethod(receiveResponseMethod, null, [
        Environment_1.platform.toDotNetString(id.toString()),
        responseDescriptor,
        responseData,
        errorMessage,
    ]);
}


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
var RegisteredFunction_1 = __webpack_require__(1);
var UriHelper_1 = __webpack_require__(5);
if (typeof window !== 'undefined') {
    // When the library is loaded in a browser via a <script> element, make the
    // following APIs available in global scope for invocation from JS
    window['Blazor'] = {
        platform: Environment_1.platform,
        registerFunction: RegisteredFunction_1.registerFunction,
        navigateTo: UriHelper_1.navigateTo,
    };
}


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZTQ5ODI2YTQyODBjNTFiZGMxM2QiLCJ3ZWJwYWNrOi8vLy4vc3JjL0Vudmlyb25tZW50LnRzIiwid2VicGFjazovLy8uL3NyYy9JbnRlcm9wL1JlZ2lzdGVyZWRGdW5jdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUGxhdGZvcm0vRG90TmV0LnRzIiwid2VicGFjazovLy8uL3NyYy9SZW5kZXJpbmcvRWxlbWVudFJlZmVyZW5jZUNhcHR1cmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JlbmRlcmluZy9SZW5kZXJlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvU2VydmljZXMvVXJpSGVscGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9Cb290LnRzIiwid2VicGFjazovLy8uL3NyYy9QbGF0Zm9ybS9Nb25vL01vbm9QbGF0Zm9ybS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvSW50ZXJvcC9JbnRlcm5hbFJlZ2lzdGVyZWRGdW5jdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvSW50ZXJvcC9JbnZva2VXaXRoSnNvbk1hcnNoYWxsaW5nLnRzIiwid2VicGFjazovLy8uL3NyYy9SZW5kZXJpbmcvUmVuZGVyQmF0Y2gudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JlbmRlcmluZy9Ccm93c2VyUmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JlbmRlcmluZy9SZW5kZXJUcmVlRWRpdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUmVuZGVyaW5nL1JlbmRlclRyZWVGcmFtZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUmVuZGVyaW5nL0V2ZW50RGVsZWdhdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9SZW5kZXJpbmcvRXZlbnRGb3JEb3ROZXQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JlbmRlcmluZy9Mb2dpY2FsRWxlbWVudHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1NlcnZpY2VzL0h0dHAudHMiLCJ3ZWJwYWNrOi8v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QVUsRUFBRSxZQUFvQjtJQUM3RCxnQkFBZ0IsQ0FDZCxFQUFFO0lBQ0Ysd0JBQXdCLENBQUMsSUFBSTtJQUM3QixrQkFBa0IsQ0FBQyxJQUFJLEVBQ3ZCLHNCQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUN0QyxDQUFDO0FBQ0osQ0FBQztBQUVELDBCQUEwQixFQUFVLEVBQUUsa0JBQXdDLEVBQUUsWUFBc0MsRUFBRSxZQUFrQztJQUN4SixFQUFFLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQztRQUMzQixxQkFBcUIsR0FBRyxzQkFBUSxDQUFDLFVBQVUsQ0FDekMsa0JBQWtCLEVBQ2xCLG1CQUFtQixFQUNuQixrQkFBa0IsRUFDbEIsaUJBQWlCLENBQ2xCLENBQUM7SUFDSixDQUFDO0lBRUQsc0JBQVEsQ0FBQyxVQUFVLENBQUMscUJBQXFCLEVBQUUsSUFBSSxFQUFFO1FBQy9DLHNCQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN0QyxrQkFBa0I7UUFDbEIsWUFBWTtRQUNaLFlBQVk7S0FDYixDQUFDLENBQUM7QUFDTCxDQUFDOzs7Ozs7Ozs7O0FDakdELDJDQUF3QztBQUN4QyxrREFBZ0U7QUFDaEUseUNBQWtEO0FBRWxELEVBQUUsQ0FBQyxDQUFDLE9BQU8sTUFBTSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDbEMsMkVBQTJFO0lBQzNFLGtFQUFrRTtJQUNsRSxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUc7UUFDakIsUUFBUTtRQUNSLGdCQUFnQjtRQUNoQixVQUFVO0tBQ1gsQ0FBQztBQUNKLENBQUMiLCJmaWxlIjoiYmxhem9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZTQ5ODI2YTQyODBjNTFiZGMxM2QiLCIvLyBFeHBvc2UgYW4gZXhwb3J0IGNhbGxlZCAncGxhdGZvcm0nIG9mIHRoZSBpbnRlcmZhY2UgdHlwZSAnUGxhdGZvcm0nLFxyXG4vLyBzbyB0aGF0IGNvbnN1bWVycyBjYW4gYmUgYWdub3N0aWMgYWJvdXQgd2hpY2ggaW1wbGVtZW50YXRpb24gdGhleSB1c2UuXHJcbi8vIEJhc2ljIGFsdGVybmF0aXZlIHRvIGhhdmluZyBhbiBhY3R1YWwgREkgY29udGFpbmVyLlxyXG5pbXBvcnQgeyBQbGF0Zm9ybSB9IGZyb20gJy4vUGxhdGZvcm0vUGxhdGZvcm0nO1xyXG5pbXBvcnQgeyBtb25vUGxhdGZvcm0gfSBmcm9tICcuL1BsYXRmb3JtL01vbm8vTW9ub1BsYXRmb3JtJztcclxuZXhwb3J0IGNvbnN0IHBsYXRmb3JtOiBQbGF0Zm9ybSA9IG1vbm9QbGF0Zm9ybTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0Vudmlyb25tZW50LnRzIiwiaW1wb3J0IHsgaW50ZXJuYWxSZWdpc3RlcmVkRnVuY3Rpb25zIH0gZnJvbSAnLi9JbnRlcm5hbFJlZ2lzdGVyZWRGdW5jdGlvbic7XHJcblxyXG5jb25zdCByZWdpc3RlcmVkRnVuY3Rpb25zOiB7IFtpZGVudGlmaWVyOiBzdHJpbmddOiBGdW5jdGlvbiB8IHVuZGVmaW5lZCB9ID0ge307XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJGdW5jdGlvbihpZGVudGlmaWVyOiBzdHJpbmcsIGltcGxlbWVudGF0aW9uOiBGdW5jdGlvbikge1xyXG4gIGlmIChpbnRlcm5hbFJlZ2lzdGVyZWRGdW5jdGlvbnMuaGFzT3duUHJvcGVydHkoaWRlbnRpZmllcikpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgVGhlIGZ1bmN0aW9uIGlkZW50aWZpZXIgJyR7aWRlbnRpZmllcn0nIGlzIHJlc2VydmVkIGFuZCBjYW5ub3QgYmUgcmVnaXN0ZXJlZC5gKTtcclxuICB9XHJcblxyXG4gIGlmIChyZWdpc3RlcmVkRnVuY3Rpb25zLmhhc093blByb3BlcnR5KGlkZW50aWZpZXIpKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEEgZnVuY3Rpb24gd2l0aCB0aGUgaWRlbnRpZmllciAnJHtpZGVudGlmaWVyfScgaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkLmApO1xyXG4gIH1cclxuXHJcbiAgcmVnaXN0ZXJlZEZ1bmN0aW9uc1tpZGVudGlmaWVyXSA9IGltcGxlbWVudGF0aW9uO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVnaXN0ZXJlZEZ1bmN0aW9uKGlkZW50aWZpZXI6IHN0cmluZyk6IEZ1bmN0aW9uIHtcclxuICAvLyBCeSBwcmlvcml0aXNpbmcgdGhlIGludGVybmFsIG9uZXMsIHdlIGVuc3VyZSB5b3UgY2FuJ3Qgb3ZlcnJpZGUgdGhlbVxyXG4gIGNvbnN0IHJlc3VsdCA9IGludGVybmFsUmVnaXN0ZXJlZEZ1bmN0aW9uc1tpZGVudGlmaWVyXSB8fCByZWdpc3RlcmVkRnVuY3Rpb25zW2lkZW50aWZpZXJdO1xyXG4gIGlmIChyZXN1bHQpIHtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgcmVnaXN0ZXJlZCBmdW5jdGlvbiB3aXRoIG5hbWUgJyR7aWRlbnRpZmllcn0nLmApO1xyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvSW50ZXJvcC9SZWdpc3RlcmVkRnVuY3Rpb24udHMiLCJleHBvcnQgZnVuY3Rpb24gZ2V0QXNzZW1ibHlOYW1lRnJvbVVybCh1cmw6IHN0cmluZykge1xyXG4gIGNvbnN0IGxhc3RTZWdtZW50ID0gdXJsLnN1YnN0cmluZyh1cmwubGFzdEluZGV4T2YoJy8nKSArIDEpO1xyXG4gIGNvbnN0IHF1ZXJ5U3RyaW5nU3RhcnRQb3MgPSBsYXN0U2VnbWVudC5pbmRleE9mKCc/Jyk7XHJcbiAgY29uc3QgZmlsZW5hbWUgPSBxdWVyeVN0cmluZ1N0YXJ0UG9zIDwgMCA/IGxhc3RTZWdtZW50IDogbGFzdFNlZ21lbnQuc3Vic3RyaW5nKDAsIHF1ZXJ5U3RyaW5nU3RhcnRQb3MpO1xyXG4gIHJldHVybiBmaWxlbmFtZS5yZXBsYWNlKC9cXC5kbGwkLywgJycpO1xyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9QbGF0Zm9ybS9Eb3ROZXQudHMiLCJleHBvcnQgZnVuY3Rpb24gYXBwbHlDYXB0dXJlSWRUb0VsZW1lbnQoZWxlbWVudDogRWxlbWVudCwgcmVmZXJlbmNlQ2FwdHVyZUlkOiBudW1iZXIpIHtcclxuICBlbGVtZW50LnNldEF0dHJpYnV0ZShnZXRDYXB0dXJlSWRBdHRyaWJ1dGVOYW1lKHJlZmVyZW5jZUNhcHR1cmVJZCksICcnKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEVsZW1lbnRCeUNhcHR1cmVJZChyZWZlcmVuY2VDYXB0dXJlSWQ6IG51bWJlcikge1xyXG4gIGNvbnN0IHNlbGVjdG9yID0gYFske2dldENhcHR1cmVJZEF0dHJpYnV0ZU5hbWUocmVmZXJlbmNlQ2FwdHVyZUlkKX1dYDtcclxuICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENhcHR1cmVJZEF0dHJpYnV0ZU5hbWUocmVmZXJlbmNlQ2FwdHVyZUlkOiBudW1iZXIpIHtcclxuICByZXR1cm4gYF9ibF8ke3JlZmVyZW5jZUNhcHR1cmVJZH1gO1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1JlbmRlcmluZy9FbGVtZW50UmVmZXJlbmNlQ2FwdHVyZS50cyIsImltcG9ydCB7IFN5c3RlbV9PYmplY3QsIFN5c3RlbV9TdHJpbmcsIFN5c3RlbV9BcnJheSwgTWV0aG9kSGFuZGxlLCBQb2ludGVyIH0gZnJvbSAnLi4vUGxhdGZvcm0vUGxhdGZvcm0nO1xyXG5pbXBvcnQgeyBwbGF0Zm9ybSB9IGZyb20gJy4uL0Vudmlyb25tZW50JztcclxuaW1wb3J0IHsgcmVuZGVyQmF0Y2ggYXMgcmVuZGVyQmF0Y2hTdHJ1Y3QsIGFycmF5UmFuZ2UsIGFycmF5U2VnbWVudCwgcmVuZGVyVHJlZURpZmZTdHJ1Y3RMZW5ndGgsIHJlbmRlclRyZWVEaWZmLCBSZW5kZXJCYXRjaFBvaW50ZXIsIFJlbmRlclRyZWVEaWZmUG9pbnRlciB9IGZyb20gJy4vUmVuZGVyQmF0Y2gnO1xyXG5pbXBvcnQgeyBCcm93c2VyUmVuZGVyZXIgfSBmcm9tICcuL0Jyb3dzZXJSZW5kZXJlcic7XHJcblxyXG50eXBlIEJyb3dzZXJSZW5kZXJlclJlZ2lzdHJ5ID0geyBbYnJvd3NlclJlbmRlcmVySWQ6IG51bWJlcl06IEJyb3dzZXJSZW5kZXJlciB9O1xyXG5jb25zdCBicm93c2VyUmVuZGVyZXJzOiBCcm93c2VyUmVuZGVyZXJSZWdpc3RyeSA9IHt9O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGF0dGFjaFJvb3RDb21wb25lbnRUb0VsZW1lbnQoYnJvd3NlclJlbmRlcmVySWQ6IG51bWJlciwgZWxlbWVudFNlbGVjdG9yOiBTeXN0ZW1fU3RyaW5nLCBjb21wb25lbnRJZDogbnVtYmVyKSB7XHJcbiAgY29uc3QgZWxlbWVudFNlbGVjdG9ySnMgPSBwbGF0Zm9ybS50b0phdmFTY3JpcHRTdHJpbmcoZWxlbWVudFNlbGVjdG9yKTtcclxuICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbGVtZW50U2VsZWN0b3JKcyk7XHJcbiAgaWYgKCFlbGVtZW50KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGFueSBlbGVtZW50IG1hdGNoaW5nIHNlbGVjdG9yICcke2VsZW1lbnRTZWxlY3RvckpzfScuYCk7XHJcbiAgfVxyXG5cclxuICBsZXQgYnJvd3NlclJlbmRlcmVyID0gYnJvd3NlclJlbmRlcmVyc1ticm93c2VyUmVuZGVyZXJJZF07XHJcbiAgaWYgKCFicm93c2VyUmVuZGVyZXIpIHtcclxuICAgIGJyb3dzZXJSZW5kZXJlciA9IGJyb3dzZXJSZW5kZXJlcnNbYnJvd3NlclJlbmRlcmVySWRdID0gbmV3IEJyb3dzZXJSZW5kZXJlcihicm93c2VyUmVuZGVyZXJJZCk7XHJcbiAgfVxyXG4gIGNsZWFyRWxlbWVudChlbGVtZW50KTtcclxuICBicm93c2VyUmVuZGVyZXIuYXR0YWNoUm9vdENvbXBvbmVudFRvRWxlbWVudChjb21wb25lbnRJZCwgZWxlbWVudCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJCYXRjaChicm93c2VyUmVuZGVyZXJJZDogbnVtYmVyLCBiYXRjaDogUmVuZGVyQmF0Y2hQb2ludGVyKSB7XHJcbiAgY29uc3QgYnJvd3NlclJlbmRlcmVyID0gYnJvd3NlclJlbmRlcmVyc1ticm93c2VyUmVuZGVyZXJJZF07XHJcbiAgaWYgKCFicm93c2VyUmVuZGVyZXIpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgVGhlcmUgaXMgbm8gYnJvd3NlciByZW5kZXJlciB3aXRoIElEICR7YnJvd3NlclJlbmRlcmVySWR9LmApO1xyXG4gIH1cclxuICBcclxuICBjb25zdCB1cGRhdGVkQ29tcG9uZW50cyA9IHJlbmRlckJhdGNoU3RydWN0LnVwZGF0ZWRDb21wb25lbnRzKGJhdGNoKTtcclxuICBjb25zdCB1cGRhdGVkQ29tcG9uZW50c0xlbmd0aCA9IGFycmF5UmFuZ2UuY291bnQodXBkYXRlZENvbXBvbmVudHMpO1xyXG4gIGNvbnN0IHVwZGF0ZWRDb21wb25lbnRzQXJyYXkgPSBhcnJheVJhbmdlLmFycmF5KHVwZGF0ZWRDb21wb25lbnRzKTtcclxuICBjb25zdCByZWZlcmVuY2VGcmFtZXNTdHJ1Y3QgPSByZW5kZXJCYXRjaFN0cnVjdC5yZWZlcmVuY2VGcmFtZXMoYmF0Y2gpO1xyXG4gIGNvbnN0IHJlZmVyZW5jZUZyYW1lcyA9IGFycmF5UmFuZ2UuYXJyYXkocmVmZXJlbmNlRnJhbWVzU3RydWN0KTtcclxuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB1cGRhdGVkQ29tcG9uZW50c0xlbmd0aDsgaSsrKSB7XHJcbiAgICBjb25zdCBkaWZmID0gcGxhdGZvcm0uZ2V0QXJyYXlFbnRyeVB0cih1cGRhdGVkQ29tcG9uZW50c0FycmF5LCBpLCByZW5kZXJUcmVlRGlmZlN0cnVjdExlbmd0aCk7XHJcbiAgICBjb25zdCBjb21wb25lbnRJZCA9IHJlbmRlclRyZWVEaWZmLmNvbXBvbmVudElkKGRpZmYpO1xyXG5cclxuICAgIGNvbnN0IGVkaXRzQXJyYXlTZWdtZW50ID0gcmVuZGVyVHJlZURpZmYuZWRpdHMoZGlmZik7XHJcbiAgICBjb25zdCBlZGl0cyA9IGFycmF5U2VnbWVudC5hcnJheShlZGl0c0FycmF5U2VnbWVudCk7XHJcbiAgICBjb25zdCBlZGl0c09mZnNldCA9IGFycmF5U2VnbWVudC5vZmZzZXQoZWRpdHNBcnJheVNlZ21lbnQpO1xyXG4gICAgY29uc3QgZWRpdHNMZW5ndGggPSBhcnJheVNlZ21lbnQuY291bnQoZWRpdHNBcnJheVNlZ21lbnQpO1xyXG5cclxuICAgIGJyb3dzZXJSZW5kZXJlci51cGRhdGVDb21wb25lbnQoY29tcG9uZW50SWQsIGVkaXRzLCBlZGl0c09mZnNldCwgZWRpdHNMZW5ndGgsIHJlZmVyZW5jZUZyYW1lcyk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBkaXNwb3NlZENvbXBvbmVudElkcyA9IHJlbmRlckJhdGNoU3RydWN0LmRpc3Bvc2VkQ29tcG9uZW50SWRzKGJhdGNoKTtcclxuICBjb25zdCBkaXNwb3NlZENvbXBvbmVudElkc0xlbmd0aCA9IGFycmF5UmFuZ2UuY291bnQoZGlzcG9zZWRDb21wb25lbnRJZHMpO1xyXG4gIGNvbnN0IGRpc3Bvc2VkQ29tcG9uZW50SWRzQXJyYXkgPSBhcnJheVJhbmdlLmFycmF5KGRpc3Bvc2VkQ29tcG9uZW50SWRzKTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGRpc3Bvc2VkQ29tcG9uZW50SWRzTGVuZ3RoOyBpKyspIHtcclxuICAgIGNvbnN0IGNvbXBvbmVudElkUHRyID0gcGxhdGZvcm0uZ2V0QXJyYXlFbnRyeVB0cihkaXNwb3NlZENvbXBvbmVudElkc0FycmF5LCBpLCA0KTtcclxuICAgIGNvbnN0IGNvbXBvbmVudElkID0gcGxhdGZvcm0ucmVhZEludDMyRmllbGQoY29tcG9uZW50SWRQdHIpO1xyXG4gICAgYnJvd3NlclJlbmRlcmVyLmRpc3Bvc2VDb21wb25lbnQoY29tcG9uZW50SWQpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZGlzcG9zZWRFdmVudEhhbmRsZXJJZHMgPSByZW5kZXJCYXRjaFN0cnVjdC5kaXNwb3NlZEV2ZW50SGFuZGxlcklkcyhiYXRjaCk7XHJcbiAgY29uc3QgZGlzcG9zZWRFdmVudEhhbmRsZXJJZHNMZW5ndGggPSBhcnJheVJhbmdlLmNvdW50KGRpc3Bvc2VkRXZlbnRIYW5kbGVySWRzKTtcclxuICBjb25zdCBkaXNwb3NlZEV2ZW50SGFuZGxlcklkc0FycmF5ID0gYXJyYXlSYW5nZS5hcnJheShkaXNwb3NlZEV2ZW50SGFuZGxlcklkcyk7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaXNwb3NlZEV2ZW50SGFuZGxlcklkc0xlbmd0aDsgaSsrKSB7XHJcbiAgICBjb25zdCBldmVudEhhbmRsZXJJZFB0ciA9IHBsYXRmb3JtLmdldEFycmF5RW50cnlQdHIoZGlzcG9zZWRFdmVudEhhbmRsZXJJZHNBcnJheSwgaSwgNCk7XHJcbiAgICBjb25zdCBldmVudEhhbmRsZXJJZCA9IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKGV2ZW50SGFuZGxlcklkUHRyKTtcclxuICAgIGJyb3dzZXJSZW5kZXJlci5kaXNwb3NlRXZlbnRIYW5kbGVyKGV2ZW50SGFuZGxlcklkKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsZWFyRWxlbWVudChlbGVtZW50OiBFbGVtZW50KSB7XHJcbiAgbGV0IGNoaWxkTm9kZTogTm9kZSB8IG51bGw7XHJcbiAgd2hpbGUgKGNoaWxkTm9kZSA9IGVsZW1lbnQuZmlyc3RDaGlsZCkge1xyXG4gICAgZWxlbWVudC5yZW1vdmVDaGlsZChjaGlsZE5vZGUpO1xyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUmVuZGVyaW5nL1JlbmRlcmVyLnRzIiwiaW1wb3J0IHsgcmVnaXN0ZXJGdW5jdGlvbiB9IGZyb20gJy4uL0ludGVyb3AvUmVnaXN0ZXJlZEZ1bmN0aW9uJztcclxuaW1wb3J0IHsgcGxhdGZvcm0gfSBmcm9tICcuLi9FbnZpcm9ubWVudCc7XHJcbmltcG9ydCB7IE1ldGhvZEhhbmRsZSwgU3lzdGVtX1N0cmluZyB9IGZyb20gJy4uL1BsYXRmb3JtL1BsYXRmb3JtJztcclxuY29uc3QgcmVnaXN0ZXJlZEZ1bmN0aW9uUHJlZml4ID0gJ01pY3Jvc29mdC5Bc3BOZXRDb3JlLkJsYXpvci5Ccm93c2VyLlNlcnZpY2VzLkJyb3dzZXJVcmlIZWxwZXInO1xyXG5sZXQgbm90aWZ5TG9jYXRpb25DaGFuZ2VkTWV0aG9kOiBNZXRob2RIYW5kbGU7XHJcbmxldCBoYXNSZWdpc3RlcmVkRXZlbnRMaXN0ZW5lcnMgPSBmYWxzZTtcclxuXHJcbnJlZ2lzdGVyRnVuY3Rpb24oYCR7cmVnaXN0ZXJlZEZ1bmN0aW9uUHJlZml4fS5nZXRMb2NhdGlvbkhyZWZgLFxyXG4gICgpID0+IHBsYXRmb3JtLnRvRG90TmV0U3RyaW5nKGxvY2F0aW9uLmhyZWYpKTtcclxuXHJcbnJlZ2lzdGVyRnVuY3Rpb24oYCR7cmVnaXN0ZXJlZEZ1bmN0aW9uUHJlZml4fS5nZXRCYXNlVVJJYCxcclxuICAoKSA9PiBkb2N1bWVudC5iYXNlVVJJID8gcGxhdGZvcm0udG9Eb3ROZXRTdHJpbmcoZG9jdW1lbnQuYmFzZVVSSSkgOiBudWxsKTtcclxuXHJcbnJlZ2lzdGVyRnVuY3Rpb24oYCR7cmVnaXN0ZXJlZEZ1bmN0aW9uUHJlZml4fS5lbmFibGVOYXZpZ2F0aW9uSW50ZXJjZXB0aW9uYCwgKCkgPT4ge1xyXG4gIGlmIChoYXNSZWdpc3RlcmVkRXZlbnRMaXN0ZW5lcnMpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgaGFzUmVnaXN0ZXJlZEV2ZW50TGlzdGVuZXJzID0gdHJ1ZTtcclxuXHJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICAvLyBJbnRlcmNlcHQgY2xpY2tzIG9uIGFsbCA8YT4gZWxlbWVudHMgd2hlcmUgdGhlIGhyZWYgaXMgd2l0aGluIHRoZSA8YmFzZSBocmVmPiBVUkkgc3BhY2VcclxuICAgIGNvbnN0IGFuY2hvclRhcmdldCA9IGZpbmRDbG9zZXN0QW5jZXN0b3IoZXZlbnQudGFyZ2V0IGFzIEVsZW1lbnQgfCBudWxsLCAnQScpO1xyXG4gICAgaWYgKGFuY2hvclRhcmdldCkge1xyXG4gICAgICBjb25zdCBocmVmID0gYW5jaG9yVGFyZ2V0LmdldEF0dHJpYnV0ZSgnaHJlZicpO1xyXG4gICAgICBjb25zdCBhYnNvbHV0ZUhyZWYgPSB0b0Fic29sdXRlVXJpKGhyZWYpO1xyXG4gICAgICBpZiAoaXNXaXRoaW5CYXNlVXJpU3BhY2UoYWJzb2x1dGVIcmVmKSkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgcGVyZm9ybUludGVybmFsTmF2aWdhdGlvbihhYnNvbHV0ZUhyZWYpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGhhbmRsZUludGVybmFsTmF2aWdhdGlvbik7XHJcbn0pO1xyXG5cclxucmVnaXN0ZXJGdW5jdGlvbihgJHtyZWdpc3RlcmVkRnVuY3Rpb25QcmVmaXh9Lm5hdmlnYXRlVG9gLCAodXJpRG90TmV0U3RyaW5nOiBTeXN0ZW1fU3RyaW5nKSA9PiB7XHJcbiAgbmF2aWdhdGVUbyhwbGF0Zm9ybS50b0phdmFTY3JpcHRTdHJpbmcodXJpRG90TmV0U3RyaW5nKSk7XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG5hdmlnYXRlVG8odXJpOiBzdHJpbmcpIHtcclxuICBjb25zdCBhYnNvbHV0ZVVyaSA9IHRvQWJzb2x1dGVVcmkodXJpKTtcclxuICBpZiAoaXNXaXRoaW5CYXNlVXJpU3BhY2UoYWJzb2x1dGVVcmkpKSB7XHJcbiAgICBwZXJmb3JtSW50ZXJuYWxOYXZpZ2F0aW9uKGFic29sdXRlVXJpKTtcclxuICB9IGVsc2Uge1xyXG4gICAgbG9jYXRpb24uaHJlZiA9IHVyaTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBlcmZvcm1JbnRlcm5hbE5hdmlnYXRpb24oYWJzb2x1dGVJbnRlcm5hbEhyZWY6IHN0cmluZykge1xyXG4gIGhpc3RvcnkucHVzaFN0YXRlKG51bGwsIC8qIGlnbm9yZWQgdGl0bGUgKi8gJycsIGFic29sdXRlSW50ZXJuYWxIcmVmKTtcclxuICBoYW5kbGVJbnRlcm5hbE5hdmlnYXRpb24oKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlSW50ZXJuYWxOYXZpZ2F0aW9uKCkge1xyXG4gIGlmICghbm90aWZ5TG9jYXRpb25DaGFuZ2VkTWV0aG9kKSB7XHJcbiAgICBub3RpZnlMb2NhdGlvbkNoYW5nZWRNZXRob2QgPSBwbGF0Zm9ybS5maW5kTWV0aG9kKFxyXG4gICAgICAnTWljcm9zb2Z0LkFzcE5ldENvcmUuQmxhem9yLkJyb3dzZXInLFxyXG4gICAgICAnTWljcm9zb2Z0LkFzcE5ldENvcmUuQmxhem9yLkJyb3dzZXIuU2VydmljZXMnLFxyXG4gICAgICAnQnJvd3NlclVyaUhlbHBlcicsXHJcbiAgICAgICdOb3RpZnlMb2NhdGlvbkNoYW5nZWQnXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcGxhdGZvcm0uY2FsbE1ldGhvZChub3RpZnlMb2NhdGlvbkNoYW5nZWRNZXRob2QsIG51bGwsIFtcclxuICAgIHBsYXRmb3JtLnRvRG90TmV0U3RyaW5nKGxvY2F0aW9uLmhyZWYpXHJcbiAgXSk7XHJcbn1cclxuXHJcbmxldCB0ZXN0QW5jaG9yOiBIVE1MQW5jaG9yRWxlbWVudDtcclxuZnVuY3Rpb24gdG9BYnNvbHV0ZVVyaShyZWxhdGl2ZVVyaTogc3RyaW5nKSB7XHJcbiAgdGVzdEFuY2hvciA9IHRlc3RBbmNob3IgfHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gIHRlc3RBbmNob3IuaHJlZiA9IHJlbGF0aXZlVXJpO1xyXG4gIHJldHVybiB0ZXN0QW5jaG9yLmhyZWY7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbmRDbG9zZXN0QW5jZXN0b3IoZWxlbWVudDogRWxlbWVudCB8IG51bGwsIHRhZ05hbWU6IHN0cmluZykge1xyXG4gIHJldHVybiAhZWxlbWVudFxyXG4gICAgPyBudWxsXHJcbiAgICA6IGVsZW1lbnQudGFnTmFtZSA9PT0gdGFnTmFtZVxyXG4gICAgICA/IGVsZW1lbnRcclxuICAgICAgOiBmaW5kQ2xvc2VzdEFuY2VzdG9yKGVsZW1lbnQucGFyZW50RWxlbWVudCwgdGFnTmFtZSlcclxufVxyXG5cclxuZnVuY3Rpb24gaXNXaXRoaW5CYXNlVXJpU3BhY2UoaHJlZjogc3RyaW5nKSB7XHJcbiAgY29uc3QgYmFzZVVyaVdpdGhUcmFpbGluZ1NsYXNoID0gdG9CYXNlVXJpV2l0aFRyYWlsaW5nU2xhc2goZG9jdW1lbnQuYmFzZVVSSSEpOyAvLyBUT0RPOiBNaWdodCBiYXNlVVJJIHJlYWxseSBiZSBudWxsP1xyXG4gIHJldHVybiBocmVmLnN0YXJ0c1dpdGgoYmFzZVVyaVdpdGhUcmFpbGluZ1NsYXNoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdG9CYXNlVXJpV2l0aFRyYWlsaW5nU2xhc2goYmFzZVVyaTogc3RyaW5nKSB7XHJcbiAgcmV0dXJuIGJhc2VVcmkuc3Vic3RyKDAsIGJhc2VVcmkubGFzdEluZGV4T2YoJy8nKSArIDEpO1xyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9TZXJ2aWNlcy9VcmlIZWxwZXIudHMiLCJpbXBvcnQgeyBwbGF0Zm9ybSB9IGZyb20gJy4vRW52aXJvbm1lbnQnO1xyXG5pbXBvcnQgeyBnZXRBc3NlbWJseU5hbWVGcm9tVXJsIH0gZnJvbSAnLi9QbGF0Zm9ybS9Eb3ROZXQnO1xyXG5pbXBvcnQgJy4vUmVuZGVyaW5nL1JlbmRlcmVyJztcclxuaW1wb3J0ICcuL1NlcnZpY2VzL0h0dHAnO1xyXG5pbXBvcnQgJy4vU2VydmljZXMvVXJpSGVscGVyJztcclxuaW1wb3J0ICcuL0dsb2JhbEV4cG9ydHMnO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gYm9vdCgpIHtcclxuICAvLyBSZWFkIHN0YXJ0dXAgY29uZmlnIGZyb20gdGhlIDxzY3JpcHQ+IGVsZW1lbnQgdGhhdCdzIGltcG9ydGluZyB0aGlzIGZpbGVcclxuICBjb25zdCBhbGxTY3JpcHRFbGVtcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKTtcclxuICBjb25zdCB0aGlzU2NyaXB0RWxlbSA9IChkb2N1bWVudC5jdXJyZW50U2NyaXB0IHx8IGFsbFNjcmlwdEVsZW1zW2FsbFNjcmlwdEVsZW1zLmxlbmd0aCAtIDFdKSBhcyBIVE1MU2NyaXB0RWxlbWVudDtcclxuICBjb25zdCBpc0xpbmtlckVuYWJsZWQgPSB0aGlzU2NyaXB0RWxlbS5nZXRBdHRyaWJ1dGUoJ2xpbmtlci1lbmFibGVkJykgPT09ICd0cnVlJztcclxuICBjb25zdCBlbnRyeVBvaW50RGxsID0gZ2V0UmVxdWlyZWRCb290U2NyaXB0QXR0cmlidXRlKHRoaXNTY3JpcHRFbGVtLCAnbWFpbicpO1xyXG4gIGNvbnN0IGVudHJ5UG9pbnRNZXRob2QgPSBnZXRSZXF1aXJlZEJvb3RTY3JpcHRBdHRyaWJ1dGUodGhpc1NjcmlwdEVsZW0sICdlbnRyeXBvaW50Jyk7XHJcbiAgY29uc3QgZW50cnlQb2ludEFzc2VtYmx5TmFtZSA9IGdldEFzc2VtYmx5TmFtZUZyb21VcmwoZW50cnlQb2ludERsbCk7XHJcbiAgY29uc3QgcmVmZXJlbmNlQXNzZW1ibGllc0NvbW1hU2VwYXJhdGVkID0gdGhpc1NjcmlwdEVsZW0uZ2V0QXR0cmlidXRlKCdyZWZlcmVuY2VzJykgfHwgJyc7XHJcbiAgY29uc3QgcmVmZXJlbmNlQXNzZW1ibGllcyA9IHJlZmVyZW5jZUFzc2VtYmxpZXNDb21tYVNlcGFyYXRlZFxyXG4gICAgLnNwbGl0KCcsJylcclxuICAgIC5tYXAocyA9PiBzLnRyaW0oKSlcclxuICAgIC5maWx0ZXIocyA9PiAhIXMpO1xyXG5cclxuICBpZiAoIWlzTGlua2VyRW5hYmxlZCkge1xyXG4gICAgY29uc29sZS5pbmZvKCdCbGF6b3IgaXMgcnVubmluZyBpbiBkZXYgbW9kZSB3aXRob3V0IElMIHN0cmlwcGluZy4gVG8gbWFrZSB0aGUgYnVuZGxlIHNpemUgc2lnbmlmaWNhbnRseSBzbWFsbGVyLCBwdWJsaXNoIHRoZSBhcHBsaWNhdGlvbiBvciBzZWUgaHR0cHM6Ly9nby5taWNyb3NvZnQuY29tL2Z3bGluay8/bGlua2lkPTg3MDQxNCcpO1xyXG4gIH1cclxuXHJcbiAgLy8gRGV0ZXJtaW5lIHRoZSBVUkxzIG9mIHRoZSBhc3NlbWJsaWVzIHdlIHdhbnQgdG8gbG9hZFxyXG4gIGNvbnN0IGxvYWRBc3NlbWJseVVybHMgPSBbZW50cnlQb2ludERsbF1cclxuICAgIC5jb25jYXQocmVmZXJlbmNlQXNzZW1ibGllcylcclxuICAgIC5tYXAoZmlsZW5hbWUgPT4gYF9mcmFtZXdvcmsvX2Jpbi8ke2ZpbGVuYW1lfWApO1xyXG5cclxuICB0cnkge1xyXG4gICAgYXdhaXQgcGxhdGZvcm0uc3RhcnQobG9hZEFzc2VtYmx5VXJscyk7XHJcbiAgfSBjYXRjaCAoZXgpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIHN0YXJ0IHBsYXRmb3JtLiBSZWFzb246ICR7ZXh9YCk7XHJcbiAgfVxyXG5cclxuICAvLyBTdGFydCB1cCB0aGUgYXBwbGljYXRpb25cclxuICBwbGF0Zm9ybS5jYWxsRW50cnlQb2ludChlbnRyeVBvaW50QXNzZW1ibHlOYW1lLCBlbnRyeVBvaW50TWV0aG9kLCBbXSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFJlcXVpcmVkQm9vdFNjcmlwdEF0dHJpYnV0ZShlbGVtOiBIVE1MU2NyaXB0RWxlbWVudCwgYXR0cmlidXRlTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICBjb25zdCByZXN1bHQgPSBlbGVtLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcclxuICBpZiAoIXJlc3VsdCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIFwiJHthdHRyaWJ1dGVOYW1lfVwiIGF0dHJpYnV0ZSBvbiBCbGF6b3Igc2NyaXB0IHRhZy5gKTtcclxuICB9XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuYm9vdCgpO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvQm9vdC50cyIsImltcG9ydCB7IE1ldGhvZEhhbmRsZSwgU3lzdGVtX09iamVjdCwgU3lzdGVtX1N0cmluZywgU3lzdGVtX0FycmF5LCBQb2ludGVyLCBQbGF0Zm9ybSB9IGZyb20gJy4uL1BsYXRmb3JtJztcclxuaW1wb3J0IHsgZ2V0QXNzZW1ibHlOYW1lRnJvbVVybCB9IGZyb20gJy4uL0RvdE5ldCc7XHJcbmltcG9ydCB7IGdldFJlZ2lzdGVyZWRGdW5jdGlvbiB9IGZyb20gJy4uLy4uL0ludGVyb3AvUmVnaXN0ZXJlZEZ1bmN0aW9uJztcclxuXHJcbmNvbnN0IGFzc2VtYmx5SGFuZGxlQ2FjaGU6IHsgW2Fzc2VtYmx5TmFtZTogc3RyaW5nXTogbnVtYmVyIH0gPSB7fTtcclxuY29uc3QgdHlwZUhhbmRsZUNhY2hlOiB7IFtmdWxseVF1YWxpZmllZFR5cGVOYW1lOiBzdHJpbmddOiBudW1iZXIgfSA9IHt9O1xyXG5jb25zdCBtZXRob2RIYW5kbGVDYWNoZTogeyBbZnVsbHlRdWFsaWZpZWRNZXRob2ROYW1lOiBzdHJpbmddOiBNZXRob2RIYW5kbGUgfSA9IHt9O1xyXG5cclxubGV0IGFzc2VtYmx5X2xvYWQ6IChhc3NlbWJseU5hbWU6IHN0cmluZykgPT4gbnVtYmVyO1xyXG5sZXQgZmluZF9jbGFzczogKGFzc2VtYmx5SGFuZGxlOiBudW1iZXIsIG5hbWVzcGFjZTogc3RyaW5nLCBjbGFzc05hbWU6IHN0cmluZykgPT4gbnVtYmVyO1xyXG5sZXQgZmluZF9tZXRob2Q6ICh0eXBlSGFuZGxlOiBudW1iZXIsIG1ldGhvZE5hbWU6IHN0cmluZywgdW5rbm93bkFyZzogbnVtYmVyKSA9PiBNZXRob2RIYW5kbGU7XHJcbmxldCBpbnZva2VfbWV0aG9kOiAobWV0aG9kOiBNZXRob2RIYW5kbGUsIHRhcmdldDogU3lzdGVtX09iamVjdCwgYXJnc0FycmF5UHRyOiBudW1iZXIsIGV4Y2VwdGlvbkZsYWdJbnRQdHI6IG51bWJlcikgPT4gU3lzdGVtX09iamVjdDtcclxubGV0IG1vbm9fc3RyaW5nX2dldF91dGY4OiAobWFuYWdlZFN0cmluZzogU3lzdGVtX1N0cmluZykgPT4gTW9uby5VdGY4UHRyO1xyXG5sZXQgbW9ub19zdHJpbmc6IChqc1N0cmluZzogc3RyaW5nKSA9PiBTeXN0ZW1fU3RyaW5nO1xyXG5cclxuZXhwb3J0IGNvbnN0IG1vbm9QbGF0Zm9ybTogUGxhdGZvcm0gPSB7XHJcbiAgc3RhcnQ6IGZ1bmN0aW9uIHN0YXJ0KGxvYWRBc3NlbWJseVVybHM6IHN0cmluZ1tdKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAvLyBtb25vLmpzIGFzc3VtZXMgdGhlIGV4aXN0ZW5jZSBvZiB0aGlzXHJcbiAgICAgIHdpbmRvd1snQnJvd3NlciddID0ge1xyXG4gICAgICAgIGluaXQ6ICgpID0+IHsgfSxcclxuICAgICAgICBhc3luY0xvYWQ6IGFzeW5jTG9hZFxyXG4gICAgICB9O1xyXG4gICAgICAvLyBFbXNjcmlwdGVuIHdvcmtzIGJ5IGV4cGVjdGluZyB0aGUgbW9kdWxlIGNvbmZpZyB0byBiZSBhIGdsb2JhbFxyXG4gICAgICB3aW5kb3dbJ01vZHVsZSddID0gY3JlYXRlRW1zY3JpcHRlbk1vZHVsZUluc3RhbmNlKGxvYWRBc3NlbWJseVVybHMsIHJlc29sdmUsIHJlamVjdCk7XHJcblxyXG4gICAgICBhZGRTY3JpcHRUYWdzVG9Eb2N1bWVudCgpO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuXHJcbiAgZmluZE1ldGhvZDogZmluZE1ldGhvZCxcclxuXHJcbiAgY2FsbEVudHJ5UG9pbnQ6IGZ1bmN0aW9uIGNhbGxFbnRyeVBvaW50KGFzc2VtYmx5TmFtZTogc3RyaW5nLCBlbnRyeXBvaW50TWV0aG9kOiBzdHJpbmcsIGFyZ3M6IFN5c3RlbV9PYmplY3RbXSk6IHZvaWQge1xyXG4gICAgLy8gUGFyc2UgdGhlIGVudHJ5cG9pbnRNZXRob2QsIHdoaWNoIGlzIG9mIHRoZSBmb3JtIE15QXBwLk15TmFtZXNwYWNlLk15VHlwZU5hbWU6Ok15TWV0aG9kTmFtZVxyXG4gICAgLy8gTm90ZSB0aGF0IHdlIGRvbid0IHN1cHBvcnQgc3BlY2lmeWluZyBhIG1ldGhvZCBvdmVybG9hZCwgc28gaXQgaGFzIHRvIGJlIHVuaXF1ZVxyXG4gICAgY29uc3QgZW50cnlwb2ludFNlZ21lbnRzID0gZW50cnlwb2ludE1ldGhvZC5zcGxpdCgnOjonKTtcclxuICAgIGlmIChlbnRyeXBvaW50U2VnbWVudHMubGVuZ3RoICE9IDIpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNYWxmb3JtZWQgZW50cnkgcG9pbnQgbWV0aG9kIG5hbWU7IGNvdWxkIG5vdCByZXNvbHZlIGNsYXNzIG5hbWUgYW5kIG1ldGhvZCBuYW1lLicpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdHlwZUZ1bGxOYW1lID0gZW50cnlwb2ludFNlZ21lbnRzWzBdO1xyXG4gICAgY29uc3QgbWV0aG9kTmFtZSA9IGVudHJ5cG9pbnRTZWdtZW50c1sxXTtcclxuICAgIGNvbnN0IGxhc3REb3QgPSB0eXBlRnVsbE5hbWUubGFzdEluZGV4T2YoJy4nKTtcclxuICAgIGNvbnN0IG5hbWVzcGFjZSA9IGxhc3REb3QgPiAtMSA/IHR5cGVGdWxsTmFtZS5zdWJzdHJpbmcoMCwgbGFzdERvdCkgOiAnJztcclxuICAgIGNvbnN0IHR5cGVTaG9ydE5hbWUgPSBsYXN0RG90ID4gLTEgPyB0eXBlRnVsbE5hbWUuc3Vic3RyaW5nKGxhc3REb3QgKyAxKSA6IHR5cGVGdWxsTmFtZTtcclxuXHJcbiAgICBjb25zdCBlbnRyeVBvaW50TWV0aG9kSGFuZGxlID0gbW9ub1BsYXRmb3JtLmZpbmRNZXRob2QoYXNzZW1ibHlOYW1lLCBuYW1lc3BhY2UsIHR5cGVTaG9ydE5hbWUsIG1ldGhvZE5hbWUpO1xyXG4gICAgbW9ub1BsYXRmb3JtLmNhbGxNZXRob2QoZW50cnlQb2ludE1ldGhvZEhhbmRsZSwgbnVsbCwgYXJncyk7XHJcbiAgfSxcclxuXHJcbiAgY2FsbE1ldGhvZDogZnVuY3Rpb24gY2FsbE1ldGhvZChtZXRob2Q6IE1ldGhvZEhhbmRsZSwgdGFyZ2V0OiBTeXN0ZW1fT2JqZWN0LCBhcmdzOiBTeXN0ZW1fT2JqZWN0W10pOiBTeXN0ZW1fT2JqZWN0IHtcclxuICAgIGlmIChhcmdzLmxlbmd0aCA+IDQpIHtcclxuICAgICAgLy8gSG9wZWZ1bGx5IHRoaXMgcmVzdHJpY3Rpb24gY2FuIGJlIGVhc2VkIHNvb24sIGJ1dCBmb3Igbm93IG1ha2UgaXQgY2xlYXIgd2hhdCdzIGdvaW5nIG9uXHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ3VycmVudGx5LCBNb25vUGxhdGZvcm0gc3VwcG9ydHMgcGFzc2luZyBhIG1heGltdW0gb2YgNCBhcmd1bWVudHMgZnJvbSBKUyB0byAuTkVULiBZb3UgdHJpZWQgdG8gcGFzcyAke2FyZ3MubGVuZ3RofS5gKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzdGFjayA9IE1vZHVsZS5zdGFja1NhdmUoKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBhcmdzQnVmZmVyID0gTW9kdWxlLnN0YWNrQWxsb2MoYXJncy5sZW5ndGgpO1xyXG4gICAgICBjb25zdCBleGNlcHRpb25GbGFnTWFuYWdlZEludCA9IE1vZHVsZS5zdGFja0FsbG9jKDQpO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICBNb2R1bGUuc2V0VmFsdWUoYXJnc0J1ZmZlciArIGkgKiA0LCBhcmdzW2ldLCAnaTMyJyk7XHJcbiAgICAgIH1cclxuICAgICAgTW9kdWxlLnNldFZhbHVlKGV4Y2VwdGlvbkZsYWdNYW5hZ2VkSW50LCAwLCAnaTMyJyk7XHJcblxyXG4gICAgICBjb25zdCByZXMgPSBpbnZva2VfbWV0aG9kKG1ldGhvZCwgdGFyZ2V0LCBhcmdzQnVmZmVyLCBleGNlcHRpb25GbGFnTWFuYWdlZEludCk7XHJcblxyXG4gICAgICBpZiAoTW9kdWxlLmdldFZhbHVlKGV4Y2VwdGlvbkZsYWdNYW5hZ2VkSW50LCAnaTMyJykgIT09IDApIHtcclxuICAgICAgICAvLyBJZiB0aGUgZXhjZXB0aW9uIGZsYWcgaXMgc2V0LCB0aGUgcmV0dXJuZWQgdmFsdWUgaXMgZXhjZXB0aW9uLlRvU3RyaW5nKClcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobW9ub1BsYXRmb3JtLnRvSmF2YVNjcmlwdFN0cmluZyg8U3lzdGVtX1N0cmluZz5yZXMpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlcztcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIE1vZHVsZS5zdGFja1Jlc3RvcmUoc3RhY2spO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHRvSmF2YVNjcmlwdFN0cmluZzogZnVuY3Rpb24gdG9KYXZhU2NyaXB0U3RyaW5nKG1hbmFnZWRTdHJpbmc6IFN5c3RlbV9TdHJpbmcpIHtcclxuICAgIC8vIENvbW1lbnRzIGZyb20gb3JpZ2luYWwgTW9ubyBzYW1wbGU6XHJcbiAgICAvL0ZJWE1FIHRoaXMgaXMgd2FzdGVmdWxsLCB3ZSBjb3VsZCByZW1vdmUgdGhlIHRlbXAgbWFsbG9jIGJ5IGdvaW5nIHRoZSBVVEYxNiByb3V0ZVxyXG4gICAgLy9GSVhNRSB0aGlzIGlzIHVuc2FmZSwgY3V6IHJhdyBvYmplY3RzIGNvdWxkIGJlIEdDJ2QuXHJcblxyXG4gICAgY29uc3QgdXRmOCA9IG1vbm9fc3RyaW5nX2dldF91dGY4KG1hbmFnZWRTdHJpbmcpO1xyXG4gICAgY29uc3QgcmVzID0gTW9kdWxlLlVURjhUb1N0cmluZyh1dGY4KTtcclxuICAgIE1vZHVsZS5fZnJlZSh1dGY4IGFzIGFueSk7XHJcbiAgICByZXR1cm4gcmVzO1xyXG4gIH0sXHJcblxyXG4gIHRvRG90TmV0U3RyaW5nOiBmdW5jdGlvbiB0b0RvdE5ldFN0cmluZyhqc1N0cmluZzogc3RyaW5nKTogU3lzdGVtX1N0cmluZyB7XHJcbiAgICByZXR1cm4gbW9ub19zdHJpbmcoanNTdHJpbmcpO1xyXG4gIH0sXHJcblxyXG4gIHRvVWludDhBcnJheTogZnVuY3Rpb24gdG9VaW50OEFycmF5KGFycmF5OiBTeXN0ZW1fQXJyYXk8YW55Pik6IFVpbnQ4QXJyYXkge1xyXG4gICAgY29uc3QgZGF0YVB0ciA9IGdldEFycmF5RGF0YVBvaW50ZXIoYXJyYXkpO1xyXG4gICAgY29uc3QgbGVuZ3RoID0gTW9kdWxlLmdldFZhbHVlKGRhdGFQdHIsICdpMzInKTtcclxuICAgIHJldHVybiBuZXcgVWludDhBcnJheShNb2R1bGUuSEVBUFU4LmJ1ZmZlciwgZGF0YVB0ciArIDQsIGxlbmd0aCk7XHJcbiAgfSxcclxuXHJcbiAgZ2V0QXJyYXlMZW5ndGg6IGZ1bmN0aW9uIGdldEFycmF5TGVuZ3RoKGFycmF5OiBTeXN0ZW1fQXJyYXk8YW55Pik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gTW9kdWxlLmdldFZhbHVlKGdldEFycmF5RGF0YVBvaW50ZXIoYXJyYXkpLCAnaTMyJyk7XHJcbiAgfSxcclxuXHJcbiAgZ2V0QXJyYXlFbnRyeVB0cjogZnVuY3Rpb24gZ2V0QXJyYXlFbnRyeVB0cjxUUHRyIGV4dGVuZHMgUG9pbnRlcj4oYXJyYXk6IFN5c3RlbV9BcnJheTxUUHRyPiwgaW5kZXg6IG51bWJlciwgaXRlbVNpemU6IG51bWJlcik6IFRQdHIge1xyXG4gICAgLy8gRmlyc3QgYnl0ZSBpcyBhcnJheSBsZW5ndGgsIGZvbGxvd2VkIGJ5IGVudHJpZXNcclxuICAgIGNvbnN0IGFkZHJlc3MgPSBnZXRBcnJheURhdGFQb2ludGVyKGFycmF5KSArIDQgKyBpbmRleCAqIGl0ZW1TaXplO1xyXG4gICAgcmV0dXJuIGFkZHJlc3MgYXMgYW55IGFzIFRQdHI7XHJcbiAgfSxcclxuXHJcbiAgZ2V0T2JqZWN0RmllbGRzQmFzZUFkZHJlc3M6IGZ1bmN0aW9uIGdldE9iamVjdEZpZWxkc0Jhc2VBZGRyZXNzKHJlZmVyZW5jZVR5cGVkT2JqZWN0OiBTeXN0ZW1fT2JqZWN0KTogUG9pbnRlciB7XHJcbiAgICAvLyBUaGUgZmlyc3QgdHdvIGludDMyIHZhbHVlcyBhcmUgaW50ZXJuYWwgTW9ubyBkYXRhXHJcbiAgICByZXR1cm4gKHJlZmVyZW5jZVR5cGVkT2JqZWN0IGFzIGFueSBhcyBudW1iZXIgKyA4KSBhcyBhbnkgYXMgUG9pbnRlcjtcclxuICB9LFxyXG5cclxuICByZWFkSW50MzJGaWVsZDogZnVuY3Rpb24gcmVhZEhlYXBJbnQzMihiYXNlQWRkcmVzczogUG9pbnRlciwgZmllbGRPZmZzZXQ/OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIE1vZHVsZS5nZXRWYWx1ZSgoYmFzZUFkZHJlc3MgYXMgYW55IGFzIG51bWJlcikgKyAoZmllbGRPZmZzZXQgfHwgMCksICdpMzInKTtcclxuICB9LFxyXG5cclxuICByZWFkRmxvYXRGaWVsZDogZnVuY3Rpb24gcmVhZEhlYXBGbG9hdChiYXNlQWRkcmVzczogUG9pbnRlciwgZmllbGRPZmZzZXQ/OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIE1vZHVsZS5nZXRWYWx1ZSgoYmFzZUFkZHJlc3MgYXMgYW55IGFzIG51bWJlcikgKyAoZmllbGRPZmZzZXQgfHwgMCksICdmbG9hdCcpO1xyXG4gIH0sXHJcblxyXG4gIHJlYWRPYmplY3RGaWVsZDogZnVuY3Rpb24gcmVhZEhlYXBPYmplY3Q8VCBleHRlbmRzIFN5c3RlbV9PYmplY3Q+KGJhc2VBZGRyZXNzOiBQb2ludGVyLCBmaWVsZE9mZnNldD86IG51bWJlcik6IFQge1xyXG4gICAgcmV0dXJuIE1vZHVsZS5nZXRWYWx1ZSgoYmFzZUFkZHJlc3MgYXMgYW55IGFzIG51bWJlcikgKyAoZmllbGRPZmZzZXQgfHwgMCksICdpMzInKSBhcyBhbnkgYXMgVDtcclxuICB9LFxyXG5cclxuICByZWFkU3RyaW5nRmllbGQ6IGZ1bmN0aW9uIHJlYWRIZWFwT2JqZWN0KGJhc2VBZGRyZXNzOiBQb2ludGVyLCBmaWVsZE9mZnNldD86IG51bWJlcik6IHN0cmluZyB8IG51bGwge1xyXG4gICAgY29uc3QgZmllbGRWYWx1ZSA9IE1vZHVsZS5nZXRWYWx1ZSgoYmFzZUFkZHJlc3MgYXMgYW55IGFzIG51bWJlcikgKyAoZmllbGRPZmZzZXQgfHwgMCksICdpMzInKTtcclxuICAgIHJldHVybiBmaWVsZFZhbHVlID09PSAwID8gbnVsbCA6IG1vbm9QbGF0Zm9ybS50b0phdmFTY3JpcHRTdHJpbmcoZmllbGRWYWx1ZSBhcyBhbnkgYXMgU3lzdGVtX1N0cmluZyk7XHJcbiAgfSxcclxuXHJcbiAgcmVhZFN0cnVjdEZpZWxkOiBmdW5jdGlvbiByZWFkU3RydWN0RmllbGQ8VCBleHRlbmRzIFBvaW50ZXI+KGJhc2VBZGRyZXNzOiBQb2ludGVyLCBmaWVsZE9mZnNldD86IG51bWJlcik6IFQge1xyXG4gICAgcmV0dXJuICgoYmFzZUFkZHJlc3MgYXMgYW55IGFzIG51bWJlcikgKyAoZmllbGRPZmZzZXQgfHwgMCkpIGFzIGFueSBhcyBUO1xyXG4gIH0sXHJcbn07XHJcblxyXG4vLyBCeXBhc3Mgbm9ybWFsIHR5cGUgY2hlY2tpbmcgdG8gYWRkIHRoaXMgZXh0cmEgZnVuY3Rpb24uIEl0J3Mgb25seSBpbnRlbmRlZCB0byBiZSBjYWxsZWQgZnJvbVxyXG4vLyB0aGUgSlMgY29kZSBpbiBNb25vJ3MgZHJpdmVyLmMuIEl0J3MgbmV2ZXIgaW50ZW5kZWQgdG8gYmUgY2FsbGVkIGZyb20gVHlwZVNjcmlwdC5cclxuKG1vbm9QbGF0Zm9ybSBhcyBhbnkpLm1vbm9HZXRSZWdpc3RlcmVkRnVuY3Rpb24gPSBnZXRSZWdpc3RlcmVkRnVuY3Rpb247XHJcblxyXG5mdW5jdGlvbiBmaW5kQXNzZW1ibHkoYXNzZW1ibHlOYW1lOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gIGxldCBhc3NlbWJseUhhbmRsZSA9IGFzc2VtYmx5SGFuZGxlQ2FjaGVbYXNzZW1ibHlOYW1lXTtcclxuICBpZiAoIWFzc2VtYmx5SGFuZGxlKSB7XHJcbiAgICBhc3NlbWJseUhhbmRsZSA9IGFzc2VtYmx5X2xvYWQoYXNzZW1ibHlOYW1lKTtcclxuICAgIGlmICghYXNzZW1ibHlIYW5kbGUpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBhc3NlbWJseSBcIiR7YXNzZW1ibHlOYW1lfVwiYCk7XHJcbiAgICB9XHJcbiAgICBhc3NlbWJseUhhbmRsZUNhY2hlW2Fzc2VtYmx5TmFtZV0gPSBhc3NlbWJseUhhbmRsZTtcclxuICB9XHJcbiAgcmV0dXJuIGFzc2VtYmx5SGFuZGxlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaW5kVHlwZShhc3NlbWJseU5hbWU6IHN0cmluZywgbmFtZXNwYWNlOiBzdHJpbmcsIGNsYXNzTmFtZTogc3RyaW5nKTogbnVtYmVyIHtcclxuICBjb25zdCBmdWxseVF1YWxpZmllZFR5cGVOYW1lID0gYFske2Fzc2VtYmx5TmFtZX1dJHtuYW1lc3BhY2V9LiR7Y2xhc3NOYW1lfWA7XHJcbiAgbGV0IHR5cGVIYW5kbGUgPSB0eXBlSGFuZGxlQ2FjaGVbZnVsbHlRdWFsaWZpZWRUeXBlTmFtZV07XHJcbiAgaWYgKCF0eXBlSGFuZGxlKSB7XHJcbiAgICB0eXBlSGFuZGxlID0gZmluZF9jbGFzcyhmaW5kQXNzZW1ibHkoYXNzZW1ibHlOYW1lKSwgbmFtZXNwYWNlLCBjbGFzc05hbWUpO1xyXG4gICAgaWYgKCF0eXBlSGFuZGxlKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgdHlwZSBcIiR7Y2xhc3NOYW1lfVwiIGluIG5hbWVzcGFjZSBcIiR7bmFtZXNwYWNlfVwiIGluIGFzc2VtYmx5IFwiJHthc3NlbWJseU5hbWV9XCJgKTtcclxuICAgIH1cclxuICAgIHR5cGVIYW5kbGVDYWNoZVtmdWxseVF1YWxpZmllZFR5cGVOYW1lXSA9IHR5cGVIYW5kbGU7XHJcbiAgfVxyXG4gIHJldHVybiB0eXBlSGFuZGxlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaW5kTWV0aG9kKGFzc2VtYmx5TmFtZTogc3RyaW5nLCBuYW1lc3BhY2U6IHN0cmluZywgY2xhc3NOYW1lOiBzdHJpbmcsIG1ldGhvZE5hbWU6IHN0cmluZyk6IE1ldGhvZEhhbmRsZSB7XHJcbiAgY29uc3QgZnVsbHlRdWFsaWZpZWRNZXRob2ROYW1lID0gYFske2Fzc2VtYmx5TmFtZX1dJHtuYW1lc3BhY2V9LiR7Y2xhc3NOYW1lfTo6JHttZXRob2ROYW1lfWA7XHJcbiAgbGV0IG1ldGhvZEhhbmRsZSA9IG1ldGhvZEhhbmRsZUNhY2hlW2Z1bGx5UXVhbGlmaWVkTWV0aG9kTmFtZV07XHJcbiAgaWYgKCFtZXRob2RIYW5kbGUpIHtcclxuICAgIG1ldGhvZEhhbmRsZSA9IGZpbmRfbWV0aG9kKGZpbmRUeXBlKGFzc2VtYmx5TmFtZSwgbmFtZXNwYWNlLCBjbGFzc05hbWUpLCBtZXRob2ROYW1lLCAtMSk7XHJcbiAgICBpZiAoIW1ldGhvZEhhbmRsZSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIG1ldGhvZCBcIiR7bWV0aG9kTmFtZX1cIiBvbiB0eXBlIFwiJHtuYW1lc3BhY2V9LiR7Y2xhc3NOYW1lfVwiYCk7XHJcbiAgICB9XHJcbiAgICBtZXRob2RIYW5kbGVDYWNoZVtmdWxseVF1YWxpZmllZE1ldGhvZE5hbWVdID0gbWV0aG9kSGFuZGxlO1xyXG4gIH1cclxuICByZXR1cm4gbWV0aG9kSGFuZGxlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRTY3JpcHRUYWdzVG9Eb2N1bWVudCgpIHtcclxuICAvLyBMb2FkIGVpdGhlciB0aGUgd2FzbSBvciBhc20uanMgdmVyc2lvbiBvZiB0aGUgTW9ubyBydW50aW1lXHJcbiAgY29uc3QgYnJvd3NlclN1cHBvcnRzTmF0aXZlV2ViQXNzZW1ibHkgPSB0eXBlb2YgV2ViQXNzZW1ibHkgIT09ICd1bmRlZmluZWQnICYmIFdlYkFzc2VtYmx5LnZhbGlkYXRlO1xyXG4gIGNvbnN0IG1vbm9SdW50aW1lVXJsQmFzZSA9ICdfZnJhbWV3b3JrLycgKyAoYnJvd3NlclN1cHBvcnRzTmF0aXZlV2ViQXNzZW1ibHkgPyAnd2FzbScgOiAnYXNtanMnKTtcclxuICBjb25zdCBtb25vUnVudGltZVNjcmlwdFVybCA9IGAke21vbm9SdW50aW1lVXJsQmFzZX0vbW9uby5qc2A7XHJcblxyXG4gIGlmICghYnJvd3NlclN1cHBvcnRzTmF0aXZlV2ViQXNzZW1ibHkpIHtcclxuICAgIC8vIEluIHRoZSBhc21qcyBjYXNlLCB0aGUgaW5pdGlhbCBtZW1vcnkgc3RydWN0dXJlIGlzIGluIGEgc2VwYXJhdGUgZmlsZSB3ZSBuZWVkIHRvIGRvd25sb2FkXHJcbiAgICBjb25zdCBtZW1pbml0WEhSID0gTW9kdWxlWydtZW1vcnlJbml0aWFsaXplclJlcXVlc3QnXSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgbWVtaW5pdFhIUi5vcGVuKCdHRVQnLCBgJHttb25vUnVudGltZVVybEJhc2V9L21vbm8uanMubWVtYCk7XHJcbiAgICBtZW1pbml0WEhSLnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcic7XHJcbiAgICBtZW1pbml0WEhSLnNlbmQobnVsbCk7XHJcbiAgfVxyXG5cclxuICBkb2N1bWVudC53cml0ZShgPHNjcmlwdCBkZWZlciBzcmM9XCIke21vbm9SdW50aW1lU2NyaXB0VXJsfVwiPjwvc2NyaXB0PmApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVFbXNjcmlwdGVuTW9kdWxlSW5zdGFuY2UobG9hZEFzc2VtYmx5VXJsczogc3RyaW5nW10sIG9uUmVhZHk6ICgpID0+IHZvaWQsIG9uRXJyb3I6IChyZWFzb24/OiBhbnkpID0+IHZvaWQpIHtcclxuICBjb25zdCBtb2R1bGUgPSB7fSBhcyB0eXBlb2YgTW9kdWxlO1xyXG4gIGNvbnN0IHdhc21CaW5hcnlGaWxlID0gJ19mcmFtZXdvcmsvd2FzbS9tb25vLndhc20nO1xyXG4gIGNvbnN0IGFzbWpzQ29kZUZpbGUgPSAnX2ZyYW1ld29yay9hc21qcy9tb25vLmFzbS5qcyc7XHJcblxyXG4gIG1vZHVsZS5wcmludCA9IGxpbmUgPT4gY29uc29sZS5sb2coYFdBU006ICR7bGluZX1gKTtcclxuICBtb2R1bGUucHJpbnRFcnIgPSBsaW5lID0+IGNvbnNvbGUuZXJyb3IoYFdBU006ICR7bGluZX1gKTtcclxuICBtb2R1bGUucHJlUnVuID0gW107XHJcbiAgbW9kdWxlLnBvc3RSdW4gPSBbXTtcclxuICBtb2R1bGUucHJlbG9hZFBsdWdpbnMgPSBbXTtcclxuXHJcbiAgbW9kdWxlLmxvY2F0ZUZpbGUgPSBmaWxlTmFtZSA9PiB7XHJcbiAgICBzd2l0Y2ggKGZpbGVOYW1lKSB7XHJcbiAgICAgIGNhc2UgJ21vbm8ud2FzbSc6IHJldHVybiB3YXNtQmluYXJ5RmlsZTtcclxuICAgICAgY2FzZSAnbW9uby5hc20uanMnOiByZXR1cm4gYXNtanNDb2RlRmlsZTtcclxuICAgICAgZGVmYXVsdDogcmV0dXJuIGZpbGVOYW1lO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIG1vZHVsZS5wcmVSdW4ucHVzaCgoKSA9PiB7XHJcbiAgICAvLyBCeSBub3csIGVtc2NyaXB0ZW4gc2hvdWxkIGJlIGluaXRpYWxpc2VkIGVub3VnaCB0aGF0IHdlIGNhbiBjYXB0dXJlIHRoZXNlIG1ldGhvZHMgZm9yIGxhdGVyIHVzZVxyXG4gICAgYXNzZW1ibHlfbG9hZCA9IE1vZHVsZS5jd3JhcCgnbW9ub193YXNtX2Fzc2VtYmx5X2xvYWQnLCAnbnVtYmVyJywgWydzdHJpbmcnXSk7XHJcbiAgICBmaW5kX2NsYXNzID0gTW9kdWxlLmN3cmFwKCdtb25vX3dhc21fYXNzZW1ibHlfZmluZF9jbGFzcycsICdudW1iZXInLCBbJ251bWJlcicsICdzdHJpbmcnLCAnc3RyaW5nJ10pO1xyXG4gICAgZmluZF9tZXRob2QgPSBNb2R1bGUuY3dyYXAoJ21vbm9fd2FzbV9hc3NlbWJseV9maW5kX21ldGhvZCcsICdudW1iZXInLCBbJ251bWJlcicsICdzdHJpbmcnLCAnbnVtYmVyJ10pO1xyXG4gICAgaW52b2tlX21ldGhvZCA9IE1vZHVsZS5jd3JhcCgnbW9ub193YXNtX2ludm9rZV9tZXRob2QnLCAnbnVtYmVyJywgWydudW1iZXInLCAnbnVtYmVyJywgJ251bWJlciddKTtcclxuICAgIG1vbm9fc3RyaW5nX2dldF91dGY4ID0gTW9kdWxlLmN3cmFwKCdtb25vX3dhc21fc3RyaW5nX2dldF91dGY4JywgJ251bWJlcicsIFsnbnVtYmVyJ10pO1xyXG4gICAgbW9ub19zdHJpbmcgPSBNb2R1bGUuY3dyYXAoJ21vbm9fd2FzbV9zdHJpbmdfZnJvbV9qcycsICdudW1iZXInLCBbJ3N0cmluZyddKTtcclxuXHJcbiAgICBNb2R1bGUuRlNfY3JlYXRlUGF0aCgnLycsICdhcHBCaW5EaXInLCB0cnVlLCB0cnVlKTtcclxuICAgIGxvYWRBc3NlbWJseVVybHMuZm9yRWFjaCh1cmwgPT5cclxuICAgICAgRlMuY3JlYXRlUHJlbG9hZGVkRmlsZSgnYXBwQmluRGlyJywgYCR7Z2V0QXNzZW1ibHlOYW1lRnJvbVVybCh1cmwpfS5kbGxgLCB1cmwsIHRydWUsIGZhbHNlLCB1bmRlZmluZWQsIG9uRXJyb3IpKTtcclxuICB9KTtcclxuXHJcbiAgbW9kdWxlLnBvc3RSdW4ucHVzaCgoKSA9PiB7XHJcbiAgICBjb25zdCBsb2FkX3J1bnRpbWUgPSBNb2R1bGUuY3dyYXAoJ21vbm9fd2FzbV9sb2FkX3J1bnRpbWUnLCBudWxsLCBbJ3N0cmluZyddKTtcclxuICAgIGxvYWRfcnVudGltZSgnYXBwQmluRGlyJyk7XHJcbiAgICBvblJlYWR5KCk7XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBtb2R1bGU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFzeW5jTG9hZCh1cmwsIG9ubG9hZCwgb25lcnJvcikge1xyXG4gIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3Q7XHJcbiAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgLyogYXN5bmM6ICovIHRydWUpO1xyXG4gIHhoci5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xyXG4gIHhoci5vbmxvYWQgPSBmdW5jdGlvbiB4aHJfb25sb2FkKCkge1xyXG4gICAgaWYgKHhoci5zdGF0dXMgPT0gMjAwIHx8IHhoci5zdGF0dXMgPT0gMCAmJiB4aHIucmVzcG9uc2UpIHtcclxuICAgICAgdmFyIGFzbSA9IG5ldyBVaW50OEFycmF5KHhoci5yZXNwb25zZSk7XHJcbiAgICAgIG9ubG9hZChhc20pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgb25lcnJvcih4aHIpO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgeGhyLm9uZXJyb3IgPSBvbmVycm9yO1xyXG4gIHhoci5zZW5kKG51bGwpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBcnJheURhdGFQb2ludGVyPFQ+KGFycmF5OiBTeXN0ZW1fQXJyYXk8VD4pOiBudW1iZXIge1xyXG4gIHJldHVybiA8bnVtYmVyPjxhbnk+YXJyYXkgKyAxMjsgLy8gRmlyc3QgYnl0ZSBmcm9tIGhlcmUgaXMgbGVuZ3RoLCB0aGVuIGZvbGxvd2luZyBieXRlcyBhcmUgZW50cmllc1xyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9QbGF0Zm9ybS9Nb25vL01vbm9QbGF0Zm9ybS50cyIsImltcG9ydCB7IGludm9rZVdpdGhKc29uTWFyc2hhbGxpbmcgfSBmcm9tICcuL0ludm9rZVdpdGhKc29uTWFyc2hhbGxpbmcnO1xyXG5pbXBvcnQgeyBhdHRhY2hSb290Q29tcG9uZW50VG9FbGVtZW50LCByZW5kZXJCYXRjaCB9IGZyb20gJy4uL1JlbmRlcmluZy9SZW5kZXJlcic7XHJcblxyXG4vKipcclxuICogVGhlIGRlZmluaXRpdmUgbGlzdCBvZiBpbnRlcm5hbCBmdW5jdGlvbnMgaW52b2thYmxlIGZyb20gLk5FVCBjb2RlLlxyXG4gKiBUaGVzZSBmdW5jdGlvbiBuYW1lcyBhcmUgdHJlYXRlZCBhcyAncmVzZXJ2ZWQnIGFuZCBjYW5ub3QgYmUgcGFzc2VkIHRvIHJlZ2lzdGVyRnVuY3Rpb24uXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgaW50ZXJuYWxSZWdpc3RlcmVkRnVuY3Rpb25zID0ge1xyXG4gIGF0dGFjaFJvb3RDb21wb25lbnRUb0VsZW1lbnQsXHJcbiAgaW52b2tlV2l0aEpzb25NYXJzaGFsbGluZyxcclxuICByZW5kZXJCYXRjaCxcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0ludGVyb3AvSW50ZXJuYWxSZWdpc3RlcmVkRnVuY3Rpb24udHMiLCJpbXBvcnQgeyBwbGF0Zm9ybSB9IGZyb20gJy4uL0Vudmlyb25tZW50JztcclxuaW1wb3J0IHsgU3lzdGVtX1N0cmluZyB9IGZyb20gJy4uL1BsYXRmb3JtL1BsYXRmb3JtJztcclxuaW1wb3J0IHsgZ2V0UmVnaXN0ZXJlZEZ1bmN0aW9uIH0gZnJvbSAnLi9SZWdpc3RlcmVkRnVuY3Rpb24nO1xyXG5pbXBvcnQgeyBnZXRFbGVtZW50QnlDYXB0dXJlSWQgfSBmcm9tICcuLi9SZW5kZXJpbmcvRWxlbWVudFJlZmVyZW5jZUNhcHR1cmUnO1xyXG5cclxuY29uc3QgZWxlbWVudFJlZktleSA9ICdfYmxhem9yRWxlbWVudFJlZic7IC8vIEtlZXAgaW4gc3luYyB3aXRoIEVsZW1lbnRSZWYuY3NcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbnZva2VXaXRoSnNvbk1hcnNoYWxsaW5nKGlkZW50aWZpZXI6IFN5c3RlbV9TdHJpbmcsIC4uLmFyZ3NKc29uOiBTeXN0ZW1fU3RyaW5nW10pIHtcclxuICBjb25zdCBpZGVudGlmaWVySnNTdHJpbmcgPSBwbGF0Zm9ybS50b0phdmFTY3JpcHRTdHJpbmcoaWRlbnRpZmllcik7XHJcbiAgY29uc3QgZnVuY0luc3RhbmNlID0gZ2V0UmVnaXN0ZXJlZEZ1bmN0aW9uKGlkZW50aWZpZXJKc1N0cmluZyk7XHJcbiAgY29uc3QgYXJncyA9IGFyZ3NKc29uLm1hcChqc29uID0+IEpTT04ucGFyc2UocGxhdGZvcm0udG9KYXZhU2NyaXB0U3RyaW5nKGpzb24pLCBqc29uUmV2aXZlcikpO1xyXG4gIGNvbnN0IHJlc3VsdCA9IGZ1bmNJbnN0YW5jZS5hcHBseShudWxsLCBhcmdzKTtcclxuICBpZiAocmVzdWx0ICE9PSBudWxsICYmIHJlc3VsdCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICBjb25zdCByZXN1bHRKc29uID0gSlNPTi5zdHJpbmdpZnkocmVzdWx0KTtcclxuICAgIHJldHVybiBwbGF0Zm9ybS50b0RvdE5ldFN0cmluZyhyZXN1bHRKc29uKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBqc29uUmV2aXZlcihrZXk6IHN0cmluZywgdmFsdWU6IGFueSk6IGFueSB7XHJcbiAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUuaGFzT3duUHJvcGVydHkoZWxlbWVudFJlZktleSkgJiYgdHlwZW9mIHZhbHVlW2VsZW1lbnRSZWZLZXldID09PSAnbnVtYmVyJykge1xyXG4gICAgcmV0dXJuIGdldEVsZW1lbnRCeUNhcHR1cmVJZCh2YWx1ZVtlbGVtZW50UmVmS2V5XSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdmFsdWU7XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvSW50ZXJvcC9JbnZva2VXaXRoSnNvbk1hcnNoYWxsaW5nLnRzIiwiaW1wb3J0IHsgUG9pbnRlciwgU3lzdGVtX0FycmF5IH0gZnJvbSAnLi4vUGxhdGZvcm0vUGxhdGZvcm0nO1xyXG5pbXBvcnQgeyBwbGF0Zm9ybSB9IGZyb20gJy4uL0Vudmlyb25tZW50JztcclxuaW1wb3J0IHsgUmVuZGVyVHJlZUZyYW1lUG9pbnRlciB9IGZyb20gJy4vUmVuZGVyVHJlZUZyYW1lJztcclxuaW1wb3J0IHsgUmVuZGVyVHJlZUVkaXRQb2ludGVyIH0gZnJvbSAnLi9SZW5kZXJUcmVlRWRpdCc7XHJcblxyXG4vLyBLZWVwIGluIHN5bmMgd2l0aCB0aGUgc3RydWN0cyBpbiAuTkVUIGNvZGVcclxuXHJcbmV4cG9ydCBjb25zdCByZW5kZXJCYXRjaCA9IHtcclxuICB1cGRhdGVkQ29tcG9uZW50czogKG9iajogUmVuZGVyQmF0Y2hQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkU3RydWN0RmllbGQ8QXJyYXlSYW5nZVBvaW50ZXI8UmVuZGVyVHJlZURpZmZQb2ludGVyPj4ob2JqLCAwKSxcclxuICByZWZlcmVuY2VGcmFtZXM6IChvYmo6IFJlbmRlckJhdGNoUG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZFN0cnVjdEZpZWxkPEFycmF5UmFuZ2VQb2ludGVyPFJlbmRlclRyZWVGcmFtZVBvaW50ZXI+PihvYmosIGFycmF5UmFuZ2VTdHJ1Y3RMZW5ndGgpLFxyXG4gIGRpc3Bvc2VkQ29tcG9uZW50SWRzOiAob2JqOiBSZW5kZXJCYXRjaFBvaW50ZXIpID0+IHBsYXRmb3JtLnJlYWRTdHJ1Y3RGaWVsZDxBcnJheVJhbmdlUG9pbnRlcjxudW1iZXI+PihvYmosIGFycmF5UmFuZ2VTdHJ1Y3RMZW5ndGggKyBhcnJheVJhbmdlU3RydWN0TGVuZ3RoKSxcclxuICBkaXNwb3NlZEV2ZW50SGFuZGxlcklkczogKG9iajogUmVuZGVyQmF0Y2hQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkU3RydWN0RmllbGQ8QXJyYXlSYW5nZVBvaW50ZXI8bnVtYmVyPj4ob2JqLCBhcnJheVJhbmdlU3RydWN0TGVuZ3RoICsgYXJyYXlSYW5nZVN0cnVjdExlbmd0aCArIGFycmF5UmFuZ2VTdHJ1Y3RMZW5ndGgpLFxyXG59O1xyXG5cclxuY29uc3QgYXJyYXlSYW5nZVN0cnVjdExlbmd0aCA9IDg7XHJcbmV4cG9ydCBjb25zdCBhcnJheVJhbmdlID0ge1xyXG4gIGFycmF5OiA8VD4ob2JqOiBBcnJheVJhbmdlUG9pbnRlcjxUPikgPT4gcGxhdGZvcm0ucmVhZE9iamVjdEZpZWxkPFN5c3RlbV9BcnJheTxUPj4ob2JqLCAwKSxcclxuICBjb3VudDogPFQ+KG9iajogQXJyYXlSYW5nZVBvaW50ZXI8VD4pID0+IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKG9iaiwgNCksXHJcbn07XHJcblxyXG5jb25zdCBhcnJheVNlZ21lbnRTdHJ1Y3RMZW5ndGggPSAxMjtcclxuZXhwb3J0IGNvbnN0IGFycmF5U2VnbWVudCA9IHtcclxuICBhcnJheTogPFQ+KG9iajogQXJyYXlTZWdtZW50UG9pbnRlcjxUPikgPT4gcGxhdGZvcm0ucmVhZE9iamVjdEZpZWxkPFN5c3RlbV9BcnJheTxUPj4ob2JqLCAwKSxcclxuICBvZmZzZXQ6IDxUPihvYmo6IEFycmF5U2VnbWVudFBvaW50ZXI8VD4pID0+IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKG9iaiwgNCksXHJcbiAgY291bnQ6IDxUPihvYmo6IEFycmF5U2VnbWVudFBvaW50ZXI8VD4pID0+IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKG9iaiwgOCksXHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgcmVuZGVyVHJlZURpZmZTdHJ1Y3RMZW5ndGggPSA0ICsgYXJyYXlTZWdtZW50U3RydWN0TGVuZ3RoO1xyXG5leHBvcnQgY29uc3QgcmVuZGVyVHJlZURpZmYgPSB7XHJcbiAgY29tcG9uZW50SWQ6IChvYmo6IFJlbmRlclRyZWVEaWZmUG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZEludDMyRmllbGQob2JqLCAwKSxcclxuICBlZGl0czogKG9iajogUmVuZGVyVHJlZURpZmZQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkU3RydWN0RmllbGQ8QXJyYXlTZWdtZW50UG9pbnRlcjxSZW5kZXJUcmVlRWRpdFBvaW50ZXI+PihvYmosIDQpLCAgXHJcbn07XHJcblxyXG4vLyBOb21pbmFsIHR5cGVzIHRvIGVuc3VyZSBvbmx5IHZhbGlkIHBvaW50ZXJzIGFyZSBwYXNzZWQgdG8gdGhlIGZ1bmN0aW9ucyBhYm92ZS5cclxuLy8gQXQgcnVudGltZSB0aGUgdmFsdWVzIGFyZSBqdXN0IG51bWJlcnMuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmVuZGVyQmF0Y2hQb2ludGVyIGV4dGVuZHMgUG9pbnRlciB7IFJlbmRlckJhdGNoUG9pbnRlcl9fRE9fTk9UX0lNUExFTUVOVDogYW55IH1cclxuZXhwb3J0IGludGVyZmFjZSBBcnJheVJhbmdlUG9pbnRlcjxUPiBleHRlbmRzIFBvaW50ZXIgeyBBcnJheVJhbmdlUG9pbnRlcl9fRE9fTk9UX0lNUExFTUVOVDogYW55IH1cclxuZXhwb3J0IGludGVyZmFjZSBBcnJheVNlZ21lbnRQb2ludGVyPFQ+IGV4dGVuZHMgUG9pbnRlciB7IEFycmF5U2VnbWVudFBvaW50ZXJfX0RPX05PVF9JTVBMRU1FTlQ6IGFueSB9XHJcbmV4cG9ydCBpbnRlcmZhY2UgUmVuZGVyVHJlZURpZmZQb2ludGVyIGV4dGVuZHMgUG9pbnRlciB7IFJlbmRlclRyZWVEaWZmUG9pbnRlcl9fRE9fTk9UX0lNUExFTUVOVDogYW55IH1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1JlbmRlcmluZy9SZW5kZXJCYXRjaC50cyIsImltcG9ydCB7IFN5c3RlbV9BcnJheSwgTWV0aG9kSGFuZGxlIH0gZnJvbSAnLi4vUGxhdGZvcm0vUGxhdGZvcm0nO1xyXG5pbXBvcnQgeyBnZXRSZW5kZXJUcmVlRWRpdFB0ciwgcmVuZGVyVHJlZUVkaXQsIFJlbmRlclRyZWVFZGl0UG9pbnRlciwgRWRpdFR5cGUgfSBmcm9tICcuL1JlbmRlclRyZWVFZGl0JztcclxuaW1wb3J0IHsgZ2V0VHJlZUZyYW1lUHRyLCByZW5kZXJUcmVlRnJhbWUsIEZyYW1lVHlwZSwgUmVuZGVyVHJlZUZyYW1lUG9pbnRlciB9IGZyb20gJy4vUmVuZGVyVHJlZUZyYW1lJztcclxuaW1wb3J0IHsgcGxhdGZvcm0gfSBmcm9tICcuLi9FbnZpcm9ubWVudCc7XHJcbmltcG9ydCB7IEV2ZW50RGVsZWdhdG9yIH0gZnJvbSAnLi9FdmVudERlbGVnYXRvcic7XHJcbmltcG9ydCB7IEV2ZW50Rm9yRG90TmV0LCBVSUV2ZW50QXJncyB9IGZyb20gJy4vRXZlbnRGb3JEb3ROZXQnO1xyXG5pbXBvcnQgeyBMb2dpY2FsRWxlbWVudCwgdG9Mb2dpY2FsRWxlbWVudCwgaW5zZXJ0TG9naWNhbENoaWxkLCByZW1vdmVMb2dpY2FsQ2hpbGQsIGdldExvZ2ljYWxQYXJlbnQsIGdldExvZ2ljYWxDaGlsZCwgY3JlYXRlQW5kSW5zZXJ0TG9naWNhbENvbnRhaW5lciwgaXNTdmdFbGVtZW50IH0gZnJvbSAnLi9Mb2dpY2FsRWxlbWVudHMnO1xyXG5pbXBvcnQgeyBhcHBseUNhcHR1cmVJZFRvRWxlbWVudCB9IGZyb20gJy4vRWxlbWVudFJlZmVyZW5jZUNhcHR1cmUnO1xyXG5jb25zdCBzZWxlY3RWYWx1ZVByb3BuYW1lID0gJ19ibGF6b3JTZWxlY3RWYWx1ZSc7XHJcbmxldCByYWlzZUV2ZW50TWV0aG9kOiBNZXRob2RIYW5kbGU7XHJcbmxldCByZW5kZXJDb21wb25lbnRNZXRob2Q6IE1ldGhvZEhhbmRsZTtcclxuXHJcbmV4cG9ydCBjbGFzcyBCcm93c2VyUmVuZGVyZXIge1xyXG4gIHByaXZhdGUgZXZlbnREZWxlZ2F0b3I6IEV2ZW50RGVsZWdhdG9yO1xyXG4gIHByaXZhdGUgY2hpbGRDb21wb25lbnRMb2NhdGlvbnM6IHsgW2NvbXBvbmVudElkOiBudW1iZXJdOiBMb2dpY2FsRWxlbWVudCB9ID0ge307XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYnJvd3NlclJlbmRlcmVySWQ6IG51bWJlcikge1xyXG4gICAgdGhpcy5ldmVudERlbGVnYXRvciA9IG5ldyBFdmVudERlbGVnYXRvcigoZXZlbnQsIGNvbXBvbmVudElkLCBldmVudEhhbmRsZXJJZCwgZXZlbnRBcmdzKSA9PiB7XHJcbiAgICAgIHJhaXNlRXZlbnQoZXZlbnQsIHRoaXMuYnJvd3NlclJlbmRlcmVySWQsIGNvbXBvbmVudElkLCBldmVudEhhbmRsZXJJZCwgZXZlbnRBcmdzKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGF0dGFjaFJvb3RDb21wb25lbnRUb0VsZW1lbnQoY29tcG9uZW50SWQ6IG51bWJlciwgZWxlbWVudDogRWxlbWVudCkge1xyXG4gICAgdGhpcy5hdHRhY2hDb21wb25lbnRUb0VsZW1lbnQoY29tcG9uZW50SWQsIHRvTG9naWNhbEVsZW1lbnQoZWxlbWVudCkpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHVwZGF0ZUNvbXBvbmVudChjb21wb25lbnRJZDogbnVtYmVyLCBlZGl0czogU3lzdGVtX0FycmF5PFJlbmRlclRyZWVFZGl0UG9pbnRlcj4sIGVkaXRzT2Zmc2V0OiBudW1iZXIsIGVkaXRzTGVuZ3RoOiBudW1iZXIsIHJlZmVyZW5jZUZyYW1lczogU3lzdGVtX0FycmF5PFJlbmRlclRyZWVGcmFtZVBvaW50ZXI+KSB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5jaGlsZENvbXBvbmVudExvY2F0aW9uc1tjb21wb25lbnRJZF07XHJcbiAgICBpZiAoIWVsZW1lbnQpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBlbGVtZW50IGlzIGN1cnJlbnRseSBhc3NvY2lhdGVkIHdpdGggY29tcG9uZW50ICR7Y29tcG9uZW50SWR9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5hcHBseUVkaXRzKGNvbXBvbmVudElkLCBlbGVtZW50LCAwLCBlZGl0cywgZWRpdHNPZmZzZXQsIGVkaXRzTGVuZ3RoLCByZWZlcmVuY2VGcmFtZXMpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRpc3Bvc2VDb21wb25lbnQoY29tcG9uZW50SWQ6IG51bWJlcikge1xyXG4gICAgZGVsZXRlIHRoaXMuY2hpbGRDb21wb25lbnRMb2NhdGlvbnNbY29tcG9uZW50SWRdO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRpc3Bvc2VFdmVudEhhbmRsZXIoZXZlbnRIYW5kbGVySWQ6IG51bWJlcikge1xyXG4gICAgdGhpcy5ldmVudERlbGVnYXRvci5yZW1vdmVMaXN0ZW5lcihldmVudEhhbmRsZXJJZCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGF0dGFjaENvbXBvbmVudFRvRWxlbWVudChjb21wb25lbnRJZDogbnVtYmVyLCBlbGVtZW50OiBMb2dpY2FsRWxlbWVudCkge1xyXG4gICAgdGhpcy5jaGlsZENvbXBvbmVudExvY2F0aW9uc1tjb21wb25lbnRJZF0gPSBlbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhcHBseUVkaXRzKGNvbXBvbmVudElkOiBudW1iZXIsIHBhcmVudDogTG9naWNhbEVsZW1lbnQsIGNoaWxkSW5kZXg6IG51bWJlciwgZWRpdHM6IFN5c3RlbV9BcnJheTxSZW5kZXJUcmVlRWRpdFBvaW50ZXI+LCBlZGl0c09mZnNldDogbnVtYmVyLCBlZGl0c0xlbmd0aDogbnVtYmVyLCByZWZlcmVuY2VGcmFtZXM6IFN5c3RlbV9BcnJheTxSZW5kZXJUcmVlRnJhbWVQb2ludGVyPikge1xyXG4gICAgbGV0IGN1cnJlbnREZXB0aCA9IDA7XHJcbiAgICBsZXQgY2hpbGRJbmRleEF0Q3VycmVudERlcHRoID0gY2hpbGRJbmRleDtcclxuICAgIGNvbnN0IG1heEVkaXRJbmRleEV4Y2wgPSBlZGl0c09mZnNldCArIGVkaXRzTGVuZ3RoO1xyXG4gICAgZm9yIChsZXQgZWRpdEluZGV4ID0gZWRpdHNPZmZzZXQ7IGVkaXRJbmRleCA8IG1heEVkaXRJbmRleEV4Y2w7IGVkaXRJbmRleCsrKSB7XHJcbiAgICAgIGNvbnN0IGVkaXQgPSBnZXRSZW5kZXJUcmVlRWRpdFB0cihlZGl0cywgZWRpdEluZGV4KTtcclxuICAgICAgY29uc3QgZWRpdFR5cGUgPSByZW5kZXJUcmVlRWRpdC50eXBlKGVkaXQpO1xyXG4gICAgICBzd2l0Y2ggKGVkaXRUeXBlKSB7XHJcbiAgICAgICAgY2FzZSBFZGl0VHlwZS5wcmVwZW5kRnJhbWU6IHtcclxuICAgICAgICAgIGNvbnN0IGZyYW1lSW5kZXggPSByZW5kZXJUcmVlRWRpdC5uZXdUcmVlSW5kZXgoZWRpdCk7XHJcbiAgICAgICAgICBjb25zdCBmcmFtZSA9IGdldFRyZWVGcmFtZVB0cihyZWZlcmVuY2VGcmFtZXMsIGZyYW1lSW5kZXgpO1xyXG4gICAgICAgICAgY29uc3Qgc2libGluZ0luZGV4ID0gcmVuZGVyVHJlZUVkaXQuc2libGluZ0luZGV4KGVkaXQpO1xyXG4gICAgICAgICAgdGhpcy5pbnNlcnRGcmFtZShjb21wb25lbnRJZCwgcGFyZW50LCBjaGlsZEluZGV4QXRDdXJyZW50RGVwdGggKyBzaWJsaW5nSW5kZXgsIHJlZmVyZW5jZUZyYW1lcywgZnJhbWUsIGZyYW1lSW5kZXgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgRWRpdFR5cGUucmVtb3ZlRnJhbWU6IHtcclxuICAgICAgICAgIGNvbnN0IHNpYmxpbmdJbmRleCA9IHJlbmRlclRyZWVFZGl0LnNpYmxpbmdJbmRleChlZGl0KTtcclxuICAgICAgICAgIHJlbW92ZUxvZ2ljYWxDaGlsZChwYXJlbnQsIGNoaWxkSW5kZXhBdEN1cnJlbnREZXB0aCArIHNpYmxpbmdJbmRleCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBFZGl0VHlwZS5zZXRBdHRyaWJ1dGU6IHtcclxuICAgICAgICAgIGNvbnN0IGZyYW1lSW5kZXggPSByZW5kZXJUcmVlRWRpdC5uZXdUcmVlSW5kZXgoZWRpdCk7XHJcbiAgICAgICAgICBjb25zdCBmcmFtZSA9IGdldFRyZWVGcmFtZVB0cihyZWZlcmVuY2VGcmFtZXMsIGZyYW1lSW5kZXgpO1xyXG4gICAgICAgICAgY29uc3Qgc2libGluZ0luZGV4ID0gcmVuZGVyVHJlZUVkaXQuc2libGluZ0luZGV4KGVkaXQpO1xyXG4gICAgICAgICAgY29uc3QgZWxlbWVudCA9IGdldExvZ2ljYWxDaGlsZChwYXJlbnQsIGNoaWxkSW5kZXhBdEN1cnJlbnREZXB0aCArIHNpYmxpbmdJbmRleCk7XHJcbiAgICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwbHlBdHRyaWJ1dGUoY29tcG9uZW50SWQsIGVsZW1lbnQsIGZyYW1lKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHNldCBhdHRyaWJ1dGUgb24gbm9uLWVsZW1lbnQgY2hpbGRgKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIEVkaXRUeXBlLnJlbW92ZUF0dHJpYnV0ZToge1xyXG4gICAgICAgICAgLy8gTm90ZSB0aGF0IHdlIGRvbid0IGhhdmUgdG8gZGlzcG9zZSB0aGUgaW5mbyB3ZSB0cmFjayBhYm91dCBldmVudCBoYW5kbGVycyBoZXJlLCBiZWNhdXNlIHRoZVxyXG4gICAgICAgICAgLy8gZGlzcG9zZWQgZXZlbnQgaGFuZGxlciBJRHMgYXJlIGRlbGl2ZXJlZCBzZXBhcmF0ZWx5IChpbiB0aGUgJ2Rpc3Bvc2VkRXZlbnRIYW5kbGVySWRzJyBhcnJheSlcclxuICAgICAgICAgIGNvbnN0IHNpYmxpbmdJbmRleCA9IHJlbmRlclRyZWVFZGl0LnNpYmxpbmdJbmRleChlZGl0KTtcclxuICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBnZXRMb2dpY2FsQ2hpbGQocGFyZW50LCBjaGlsZEluZGV4QXRDdXJyZW50RGVwdGggKyBzaWJsaW5nSW5kZXgpO1xyXG4gICAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgICBjb25zdCBhdHRyaWJ1dGVOYW1lID0gcmVuZGVyVHJlZUVkaXQucmVtb3ZlZEF0dHJpYnV0ZU5hbWUoZWRpdCkhO1xyXG4gICAgICAgICAgICAvLyBGaXJzdCB0cnkgdG8gcmVtb3ZlIGFueSBzcGVjaWFsIHByb3BlcnR5IHdlIHVzZSBmb3IgdGhpcyBhdHRyaWJ1dGVcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnRyeUFwcGx5U3BlY2lhbFByb3BlcnR5KGVsZW1lbnQsIGF0dHJpYnV0ZU5hbWUsIG51bGwpKSB7XHJcbiAgICAgICAgICAgICAgLy8gSWYgdGhhdCdzIG5vdCBhcHBsaWNhYmxlLCBpdCdzIGEgcmVndWxhciBET00gYXR0cmlidXRlIHNvIHJlbW92ZSB0aGF0XHJcbiAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHJlbW92ZSBhdHRyaWJ1dGUgZnJvbSBub24tZWxlbWVudCBjaGlsZGApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgRWRpdFR5cGUudXBkYXRlVGV4dDoge1xyXG4gICAgICAgICAgY29uc3QgZnJhbWVJbmRleCA9IHJlbmRlclRyZWVFZGl0Lm5ld1RyZWVJbmRleChlZGl0KTtcclxuICAgICAgICAgIGNvbnN0IGZyYW1lID0gZ2V0VHJlZUZyYW1lUHRyKHJlZmVyZW5jZUZyYW1lcywgZnJhbWVJbmRleCk7XHJcbiAgICAgICAgICBjb25zdCBzaWJsaW5nSW5kZXggPSByZW5kZXJUcmVlRWRpdC5zaWJsaW5nSW5kZXgoZWRpdCk7XHJcbiAgICAgICAgICBjb25zdCB0ZXh0Tm9kZSA9IGdldExvZ2ljYWxDaGlsZChwYXJlbnQsIGNoaWxkSW5kZXhBdEN1cnJlbnREZXB0aCArIHNpYmxpbmdJbmRleCk7XHJcbiAgICAgICAgICBpZiAodGV4dE5vZGUgaW5zdGFuY2VvZiBUZXh0KSB7XHJcbiAgICAgICAgICAgIHRleHROb2RlLnRleHRDb250ZW50ID0gcmVuZGVyVHJlZUZyYW1lLnRleHRDb250ZW50KGZyYW1lKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHNldCB0ZXh0IGNvbnRlbnQgb24gbm9uLXRleHQgY2hpbGRgKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIEVkaXRUeXBlLnN0ZXBJbjoge1xyXG4gICAgICAgICAgY29uc3Qgc2libGluZ0luZGV4ID0gcmVuZGVyVHJlZUVkaXQuc2libGluZ0luZGV4KGVkaXQpO1xyXG4gICAgICAgICAgcGFyZW50ID0gZ2V0TG9naWNhbENoaWxkKHBhcmVudCwgY2hpbGRJbmRleEF0Q3VycmVudERlcHRoICsgc2libGluZ0luZGV4KTtcclxuICAgICAgICAgIGN1cnJlbnREZXB0aCsrO1xyXG4gICAgICAgICAgY2hpbGRJbmRleEF0Q3VycmVudERlcHRoID0gMDtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIEVkaXRUeXBlLnN0ZXBPdXQ6IHtcclxuICAgICAgICAgIHBhcmVudCA9IGdldExvZ2ljYWxQYXJlbnQocGFyZW50KSE7XHJcbiAgICAgICAgICBjdXJyZW50RGVwdGgtLTtcclxuICAgICAgICAgIGNoaWxkSW5kZXhBdEN1cnJlbnREZXB0aCA9IGN1cnJlbnREZXB0aCA9PT0gMCA/IGNoaWxkSW5kZXggOiAwOyAvLyBUaGUgY2hpbGRJbmRleCBpcyBvbmx5IGV2ZXIgbm9uemVybyBhdCB6ZXJvIGRlcHRoXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgY29uc3QgdW5rbm93blR5cGU6IG5ldmVyID0gZWRpdFR5cGU7IC8vIENvbXBpbGUtdGltZSB2ZXJpZmljYXRpb24gdGhhdCB0aGUgc3dpdGNoIHdhcyBleGhhdXN0aXZlXHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gZWRpdCB0eXBlOiAke3Vua25vd25UeXBlfWApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbnNlcnRGcmFtZShjb21wb25lbnRJZDogbnVtYmVyLCBwYXJlbnQ6IExvZ2ljYWxFbGVtZW50LCBjaGlsZEluZGV4OiBudW1iZXIsIGZyYW1lczogU3lzdGVtX0FycmF5PFJlbmRlclRyZWVGcmFtZVBvaW50ZXI+LCBmcmFtZTogUmVuZGVyVHJlZUZyYW1lUG9pbnRlciwgZnJhbWVJbmRleDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IGZyYW1lVHlwZSA9IHJlbmRlclRyZWVGcmFtZS5mcmFtZVR5cGUoZnJhbWUpO1xyXG4gICAgc3dpdGNoIChmcmFtZVR5cGUpIHtcclxuICAgICAgY2FzZSBGcmFtZVR5cGUuZWxlbWVudDpcclxuICAgICAgICB0aGlzLmluc2VydEVsZW1lbnQoY29tcG9uZW50SWQsIHBhcmVudCwgY2hpbGRJbmRleCwgZnJhbWVzLCBmcmFtZSwgZnJhbWVJbmRleCk7XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgIGNhc2UgRnJhbWVUeXBlLnRleHQ6XHJcbiAgICAgICAgdGhpcy5pbnNlcnRUZXh0KHBhcmVudCwgY2hpbGRJbmRleCwgZnJhbWUpO1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgICBjYXNlIEZyYW1lVHlwZS5hdHRyaWJ1dGU6XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdHRyaWJ1dGUgZnJhbWVzIHNob3VsZCBvbmx5IGJlIHByZXNlbnQgYXMgbGVhZGluZyBjaGlsZHJlbiBvZiBlbGVtZW50IGZyYW1lcy4nKTtcclxuICAgICAgY2FzZSBGcmFtZVR5cGUuY29tcG9uZW50OlxyXG4gICAgICAgIHRoaXMuaW5zZXJ0Q29tcG9uZW50KHBhcmVudCwgY2hpbGRJbmRleCwgZnJhbWUpO1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgICBjYXNlIEZyYW1lVHlwZS5yZWdpb246XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zZXJ0RnJhbWVSYW5nZShjb21wb25lbnRJZCwgcGFyZW50LCBjaGlsZEluZGV4LCBmcmFtZXMsIGZyYW1lSW5kZXggKyAxLCBmcmFtZUluZGV4ICsgcmVuZGVyVHJlZUZyYW1lLnN1YnRyZWVMZW5ndGgoZnJhbWUpKTtcclxuICAgICAgY2FzZSBGcmFtZVR5cGUuZWxlbWVudFJlZmVyZW5jZUNhcHR1cmU6XHJcbiAgICAgICAgaWYgKHBhcmVudCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcclxuICAgICAgICAgIGFwcGx5Q2FwdHVyZUlkVG9FbGVtZW50KHBhcmVudCwgcmVuZGVyVHJlZUZyYW1lLmVsZW1lbnRSZWZlcmVuY2VDYXB0dXJlSWQoZnJhbWUpKTtcclxuICAgICAgICAgIHJldHVybiAwOyAvLyBBIFwiY2FwdHVyZVwiIGlzIGEgY2hpbGQgaW4gdGhlIGRpZmYsIGJ1dCBoYXMgbm8gbm9kZSBpbiB0aGUgRE9NXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUmVmZXJlbmNlIGNhcHR1cmUgZnJhbWVzIGNhbiBvbmx5IGJlIGNoaWxkcmVuIG9mIGVsZW1lbnQgZnJhbWVzLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBjb25zdCB1bmtub3duVHlwZTogbmV2ZXIgPSBmcmFtZVR5cGU7IC8vIENvbXBpbGUtdGltZSB2ZXJpZmljYXRpb24gdGhhdCB0aGUgc3dpdGNoIHdhcyBleGhhdXN0aXZlXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGZyYW1lIHR5cGU6ICR7dW5rbm93blR5cGV9YCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluc2VydEVsZW1lbnQoY29tcG9uZW50SWQ6IG51bWJlciwgcGFyZW50OiBMb2dpY2FsRWxlbWVudCwgY2hpbGRJbmRleDogbnVtYmVyLCBmcmFtZXM6IFN5c3RlbV9BcnJheTxSZW5kZXJUcmVlRnJhbWVQb2ludGVyPiwgZnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIsIGZyYW1lSW5kZXg6IG51bWJlcikge1xyXG4gICAgY29uc3QgdGFnTmFtZSA9IHJlbmRlclRyZWVGcmFtZS5lbGVtZW50TmFtZShmcmFtZSkhO1xyXG4gICAgY29uc3QgbmV3RG9tRWxlbWVudFJhdyA9IHRhZ05hbWUgPT09ICdzdmcnIHx8IGlzU3ZnRWxlbWVudChwYXJlbnQpID9cclxuICAgICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsIHRhZ05hbWUpIDpcclxuICAgICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKTtcclxuICAgIGNvbnN0IG5ld0VsZW1lbnQgPSB0b0xvZ2ljYWxFbGVtZW50KG5ld0RvbUVsZW1lbnRSYXcpO1xyXG4gICAgaW5zZXJ0TG9naWNhbENoaWxkKG5ld0RvbUVsZW1lbnRSYXcsIHBhcmVudCwgY2hpbGRJbmRleCk7XHJcblxyXG4gICAgLy8gQXBwbHkgYXR0cmlidXRlc1xyXG4gICAgY29uc3QgZGVzY2VuZGFudHNFbmRJbmRleEV4Y2wgPSBmcmFtZUluZGV4ICsgcmVuZGVyVHJlZUZyYW1lLnN1YnRyZWVMZW5ndGgoZnJhbWUpO1xyXG4gICAgZm9yIChsZXQgZGVzY2VuZGFudEluZGV4ID0gZnJhbWVJbmRleCArIDE7IGRlc2NlbmRhbnRJbmRleCA8IGRlc2NlbmRhbnRzRW5kSW5kZXhFeGNsOyBkZXNjZW5kYW50SW5kZXgrKykge1xyXG4gICAgICBjb25zdCBkZXNjZW5kYW50RnJhbWUgPSBnZXRUcmVlRnJhbWVQdHIoZnJhbWVzLCBkZXNjZW5kYW50SW5kZXgpO1xyXG4gICAgICBpZiAocmVuZGVyVHJlZUZyYW1lLmZyYW1lVHlwZShkZXNjZW5kYW50RnJhbWUpID09PSBGcmFtZVR5cGUuYXR0cmlidXRlKSB7XHJcbiAgICAgICAgdGhpcy5hcHBseUF0dHJpYnV0ZShjb21wb25lbnRJZCwgbmV3RG9tRWxlbWVudFJhdywgZGVzY2VuZGFudEZyYW1lKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBBcyBzb29uIGFzIHdlIHNlZSBhIG5vbi1hdHRyaWJ1dGUgY2hpbGQsIGFsbCB0aGUgc3Vic2VxdWVudCBjaGlsZCBmcmFtZXMgYXJlXHJcbiAgICAgICAgLy8gbm90IGF0dHJpYnV0ZXMsIHNvIGJhaWwgb3V0IGFuZCBpbnNlcnQgdGhlIHJlbW5hbnRzIHJlY3Vyc2l2ZWx5XHJcbiAgICAgICAgdGhpcy5pbnNlcnRGcmFtZVJhbmdlKGNvbXBvbmVudElkLCBuZXdFbGVtZW50LCAwLCBmcmFtZXMsIGRlc2NlbmRhbnRJbmRleCwgZGVzY2VuZGFudHNFbmRJbmRleEV4Y2wpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluc2VydENvbXBvbmVudChwYXJlbnQ6IExvZ2ljYWxFbGVtZW50LCBjaGlsZEluZGV4OiBudW1iZXIsIGZyYW1lOiBSZW5kZXJUcmVlRnJhbWVQb2ludGVyKSB7XHJcbiAgICBjb25zdCBjb250YWluZXJFbGVtZW50ID0gY3JlYXRlQW5kSW5zZXJ0TG9naWNhbENvbnRhaW5lcihwYXJlbnQsIGNoaWxkSW5kZXgpO1xyXG5cclxuICAgIC8vIEFsbCB3ZSBoYXZlIHRvIGRvIGlzIGFzc29jaWF0ZSB0aGUgY2hpbGQgY29tcG9uZW50IElEIHdpdGggaXRzIGxvY2F0aW9uLiBXZSBkb24ndCBhY3R1YWxseVxyXG4gICAgLy8gZG8gYW55IHJlbmRlcmluZyBoZXJlLCBiZWNhdXNlIHRoZSBkaWZmIGZvciB0aGUgY2hpbGQgd2lsbCBhcHBlYXIgbGF0ZXIgaW4gdGhlIHJlbmRlciBiYXRjaC5cclxuICAgIGNvbnN0IGNoaWxkQ29tcG9uZW50SWQgPSByZW5kZXJUcmVlRnJhbWUuY29tcG9uZW50SWQoZnJhbWUpO1xyXG4gICAgdGhpcy5hdHRhY2hDb21wb25lbnRUb0VsZW1lbnQoY2hpbGRDb21wb25lbnRJZCwgY29udGFpbmVyRWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluc2VydFRleHQocGFyZW50OiBMb2dpY2FsRWxlbWVudCwgY2hpbGRJbmRleDogbnVtYmVyLCB0ZXh0RnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIpIHtcclxuICAgIGNvbnN0IHRleHRDb250ZW50ID0gcmVuZGVyVHJlZUZyYW1lLnRleHRDb250ZW50KHRleHRGcmFtZSkhO1xyXG4gICAgY29uc3QgbmV3VGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0Q29udGVudCk7XHJcbiAgICBpbnNlcnRMb2dpY2FsQ2hpbGQobmV3VGV4dE5vZGUsIHBhcmVudCwgY2hpbGRJbmRleCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFwcGx5QXR0cmlidXRlKGNvbXBvbmVudElkOiBudW1iZXIsIHRvRG9tRWxlbWVudDogRWxlbWVudCwgYXR0cmlidXRlRnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIpIHtcclxuICAgIGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSByZW5kZXJUcmVlRnJhbWUuYXR0cmlidXRlTmFtZShhdHRyaWJ1dGVGcmFtZSkhO1xyXG4gICAgY29uc3QgYnJvd3NlclJlbmRlcmVySWQgPSB0aGlzLmJyb3dzZXJSZW5kZXJlcklkO1xyXG4gICAgY29uc3QgZXZlbnRIYW5kbGVySWQgPSByZW5kZXJUcmVlRnJhbWUuYXR0cmlidXRlRXZlbnRIYW5kbGVySWQoYXR0cmlidXRlRnJhbWUpO1xyXG5cclxuICAgIGlmIChldmVudEhhbmRsZXJJZCkge1xyXG4gICAgICBjb25zdCBmaXJzdFR3b0NoYXJzID0gYXR0cmlidXRlTmFtZS5zdWJzdHJpbmcoMCwgMik7XHJcbiAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGF0dHJpYnV0ZU5hbWUuc3Vic3RyaW5nKDIpO1xyXG4gICAgICBpZiAoZmlyc3RUd29DaGFycyAhPT0gJ29uJyB8fCAhZXZlbnROYW1lKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBdHRyaWJ1dGUgaGFzIG5vbnplcm8gZXZlbnQgaGFuZGxlciBJRCwgYnV0IGF0dHJpYnV0ZSBuYW1lICcke2F0dHJpYnV0ZU5hbWV9JyBkb2VzIG5vdCBzdGFydCB3aXRoICdvbicuYCk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5ldmVudERlbGVnYXRvci5zZXRMaXN0ZW5lcih0b0RvbUVsZW1lbnQsIGV2ZW50TmFtZSwgY29tcG9uZW50SWQsIGV2ZW50SGFuZGxlcklkKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEZpcnN0IHNlZSBpZiB3ZSBoYXZlIHNwZWNpYWwgaGFuZGxpbmcgZm9yIHRoaXMgYXR0cmlidXRlXHJcbiAgICBpZiAoIXRoaXMudHJ5QXBwbHlTcGVjaWFsUHJvcGVydHkodG9Eb21FbGVtZW50LCBhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVGcmFtZSkpIHtcclxuICAgICAgLy8gSWYgbm90LCB0cmVhdCBpdCBhcyBhIHJlZ3VsYXIgc3RyaW5nLXZhbHVlZCBhdHRyaWJ1dGVcclxuICAgICAgdG9Eb21FbGVtZW50LnNldEF0dHJpYnV0ZShcclxuICAgICAgICBhdHRyaWJ1dGVOYW1lLFxyXG4gICAgICAgIHJlbmRlclRyZWVGcmFtZS5hdHRyaWJ1dGVWYWx1ZShhdHRyaWJ1dGVGcmFtZSkhXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRyeUFwcGx5U3BlY2lhbFByb3BlcnR5KGVsZW1lbnQ6IEVsZW1lbnQsIGF0dHJpYnV0ZU5hbWU6IHN0cmluZywgYXR0cmlidXRlRnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIgfCBudWxsKSB7XHJcbiAgICBzd2l0Y2ggKGF0dHJpYnV0ZU5hbWUpIHtcclxuICAgICAgY2FzZSAndmFsdWUnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLnRyeUFwcGx5VmFsdWVQcm9wZXJ0eShlbGVtZW50LCBhdHRyaWJ1dGVGcmFtZSk7XHJcbiAgICAgIGNhc2UgJ2NoZWNrZWQnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLnRyeUFwcGx5Q2hlY2tlZFByb3BlcnR5KGVsZW1lbnQsIGF0dHJpYnV0ZUZyYW1lKTtcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRyeUFwcGx5VmFsdWVQcm9wZXJ0eShlbGVtZW50OiBFbGVtZW50LCBhdHRyaWJ1dGVGcmFtZTogUmVuZGVyVHJlZUZyYW1lUG9pbnRlciB8IG51bGwpIHtcclxuICAgIC8vIENlcnRhaW4gZWxlbWVudHMgaGF2ZSBidWlsdC1pbiBiZWhhdmlvdXIgZm9yIHRoZWlyICd2YWx1ZScgcHJvcGVydHlcclxuICAgIHN3aXRjaCAoZWxlbWVudC50YWdOYW1lKSB7XHJcbiAgICAgIGNhc2UgJ0lOUFVUJzpcclxuICAgICAgY2FzZSAnU0VMRUNUJzpcclxuICAgICAgY2FzZSAnVEVYVEFSRUEnOiB7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBhdHRyaWJ1dGVGcmFtZSA/IHJlbmRlclRyZWVGcmFtZS5hdHRyaWJ1dGVWYWx1ZShhdHRyaWJ1dGVGcmFtZSkgOiBudWxsO1xyXG4gICAgICAgIChlbGVtZW50IGFzIGFueSkudmFsdWUgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKGVsZW1lbnQudGFnTmFtZSA9PT0gJ1NFTEVDVCcpIHtcclxuICAgICAgICAgIC8vIDxzZWxlY3Q+IGlzIHNwZWNpYWwsIGluIHRoYXQgYW55dGhpbmcgd2Ugd3JpdGUgdG8gLnZhbHVlIHdpbGwgYmUgbG9zdCBpZiB0aGVyZVxyXG4gICAgICAgICAgLy8gaXNuJ3QgeWV0IGEgbWF0Y2hpbmcgPG9wdGlvbj4uIFRvIG1haW50YWluIHRoZSBleHBlY3RlZCBiZWhhdmlvciBubyBtYXR0ZXIgdGhlXHJcbiAgICAgICAgICAvLyBlbGVtZW50IGluc2VydGlvbi91cGRhdGUgb3JkZXIsIHByZXNlcnZlIHRoZSBkZXNpcmVkIHZhbHVlIHNlcGFyYXRlbHkgc29cclxuICAgICAgICAgIC8vIHdlIGNhbiByZWNvdmVyIGl0IHdoZW4gaW5zZXJ0aW5nIGFueSBtYXRjaGluZyA8b3B0aW9uPi5cclxuICAgICAgICAgIGVsZW1lbnRbc2VsZWN0VmFsdWVQcm9wbmFtZV0gPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgY2FzZSAnT1BUSU9OJzoge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gYXR0cmlidXRlRnJhbWUgPyByZW5kZXJUcmVlRnJhbWUuYXR0cmlidXRlVmFsdWUoYXR0cmlidXRlRnJhbWUpIDogbnVsbDtcclxuICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsIHZhbHVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ3ZhbHVlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFNlZSBhYm92ZSBmb3Igd2h5IHdlIGhhdmUgdGhpcyBzcGVjaWFsIGhhbmRsaW5nIGZvciA8c2VsZWN0Pi88b3B0aW9uPlxyXG4gICAgICAgIGNvbnN0IHBhcmVudEVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgaWYgKHBhcmVudEVsZW1lbnQgJiYgKHNlbGVjdFZhbHVlUHJvcG5hbWUgaW4gcGFyZW50RWxlbWVudCkgJiYgcGFyZW50RWxlbWVudFtzZWxlY3RWYWx1ZVByb3BuYW1lXSA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgIHRoaXMudHJ5QXBwbHlWYWx1ZVByb3BlcnR5KHBhcmVudEVsZW1lbnQsIGF0dHJpYnV0ZUZyYW1lKTtcclxuICAgICAgICAgIGRlbGV0ZSBwYXJlbnRFbGVtZW50W3NlbGVjdFZhbHVlUHJvcG5hbWVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgdHJ5QXBwbHlDaGVja2VkUHJvcGVydHkoZWxlbWVudDogRWxlbWVudCwgYXR0cmlidXRlRnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIgfCBudWxsKSB7XHJcbiAgICAvLyBDZXJ0YWluIGVsZW1lbnRzIGhhdmUgYnVpbHQtaW4gYmVoYXZpb3VyIGZvciB0aGVpciAnY2hlY2tlZCcgcHJvcGVydHlcclxuICAgIGlmIChlbGVtZW50LnRhZ05hbWUgPT09ICdJTlBVVCcpIHtcclxuICAgICAgY29uc3QgdmFsdWUgPSBhdHRyaWJ1dGVGcmFtZSA/IHJlbmRlclRyZWVGcmFtZS5hdHRyaWJ1dGVWYWx1ZShhdHRyaWJ1dGVGcmFtZSkgOiBudWxsO1xyXG4gICAgICAoZWxlbWVudCBhcyBhbnkpLmNoZWNrZWQgPSB2YWx1ZSAhPT0gbnVsbDtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluc2VydEZyYW1lUmFuZ2UoY29tcG9uZW50SWQ6IG51bWJlciwgcGFyZW50OiBMb2dpY2FsRWxlbWVudCwgY2hpbGRJbmRleDogbnVtYmVyLCBmcmFtZXM6IFN5c3RlbV9BcnJheTxSZW5kZXJUcmVlRnJhbWVQb2ludGVyPiwgc3RhcnRJbmRleDogbnVtYmVyLCBlbmRJbmRleEV4Y2w6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICBjb25zdCBvcmlnQ2hpbGRJbmRleCA9IGNoaWxkSW5kZXg7XHJcbiAgICBmb3IgKGxldCBpbmRleCA9IHN0YXJ0SW5kZXg7IGluZGV4IDwgZW5kSW5kZXhFeGNsOyBpbmRleCsrKSB7XHJcbiAgICAgIGNvbnN0IGZyYW1lID0gZ2V0VHJlZUZyYW1lUHRyKGZyYW1lcywgaW5kZXgpO1xyXG4gICAgICBjb25zdCBudW1DaGlsZHJlbkluc2VydGVkID0gdGhpcy5pbnNlcnRGcmFtZShjb21wb25lbnRJZCwgcGFyZW50LCBjaGlsZEluZGV4LCBmcmFtZXMsIGZyYW1lLCBpbmRleCk7XHJcbiAgICAgIGNoaWxkSW5kZXggKz0gbnVtQ2hpbGRyZW5JbnNlcnRlZDtcclxuXHJcbiAgICAgIC8vIFNraXAgb3ZlciBhbnkgZGVzY2VuZGFudHMsIHNpbmNlIHRoZXkgYXJlIGFscmVhZHkgZGVhbHQgd2l0aCByZWN1cnNpdmVseVxyXG4gICAgICBpbmRleCArPSBjb3VudERlc2NlbmRhbnRGcmFtZXMoZnJhbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAoY2hpbGRJbmRleCAtIG9yaWdDaGlsZEluZGV4KTsgLy8gVG90YWwgbnVtYmVyIG9mIGNoaWxkcmVuIGluc2VydGVkXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjb3VudERlc2NlbmRhbnRGcmFtZXMoZnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIpOiBudW1iZXIge1xyXG4gIHN3aXRjaCAocmVuZGVyVHJlZUZyYW1lLmZyYW1lVHlwZShmcmFtZSkpIHtcclxuICAgIC8vIFRoZSBmb2xsb3dpbmcgZnJhbWUgdHlwZXMgaGF2ZSBhIHN1YnRyZWUgbGVuZ3RoLiBPdGhlciBmcmFtZXMgbWF5IHVzZSB0aGF0IG1lbW9yeSBzbG90XHJcbiAgICAvLyB0byBtZWFuIHNvbWV0aGluZyBlbHNlLCBzbyB3ZSBtdXN0IG5vdCByZWFkIGl0LiBXZSBzaG91bGQgY29uc2lkZXIgaGF2aW5nIG5vbWluYWwgc3VidHlwZXNcclxuICAgIC8vIG9mIFJlbmRlclRyZWVGcmFtZVBvaW50ZXIgdGhhdCBwcmV2ZW50IGFjY2VzcyB0byBub24tYXBwbGljYWJsZSBmaWVsZHMuXHJcbiAgICBjYXNlIEZyYW1lVHlwZS5jb21wb25lbnQ6XHJcbiAgICBjYXNlIEZyYW1lVHlwZS5lbGVtZW50OlxyXG4gICAgY2FzZSBGcmFtZVR5cGUucmVnaW9uOlxyXG4gICAgICByZXR1cm4gcmVuZGVyVHJlZUZyYW1lLnN1YnRyZWVMZW5ndGgoZnJhbWUpIC0gMTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiAwO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmFpc2VFdmVudChldmVudDogRXZlbnQsIGJyb3dzZXJSZW5kZXJlcklkOiBudW1iZXIsIGNvbXBvbmVudElkOiBudW1iZXIsIGV2ZW50SGFuZGxlcklkOiBudW1iZXIsIGV2ZW50QXJnczogRXZlbnRGb3JEb3ROZXQ8VUlFdmVudEFyZ3M+KSB7XHJcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgaWYgKCFyYWlzZUV2ZW50TWV0aG9kKSB7XHJcbiAgICByYWlzZUV2ZW50TWV0aG9kID0gcGxhdGZvcm0uZmluZE1ldGhvZChcclxuICAgICAgJ01pY3Jvc29mdC5Bc3BOZXRDb3JlLkJsYXpvci5Ccm93c2VyJywgJ01pY3Jvc29mdC5Bc3BOZXRDb3JlLkJsYXpvci5Ccm93c2VyLlJlbmRlcmluZycsICdCcm93c2VyUmVuZGVyZXJFdmVudERpc3BhdGNoZXInLCAnRGlzcGF0Y2hFdmVudCdcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBldmVudERlc2NyaXB0b3IgPSB7XHJcbiAgICBicm93c2VyUmVuZGVyZXJJZCxcclxuICAgIGNvbXBvbmVudElkLFxyXG4gICAgZXZlbnRIYW5kbGVySWQsXHJcbiAgICBldmVudEFyZ3NUeXBlOiBldmVudEFyZ3MudHlwZVxyXG4gIH07XHJcblxyXG4gIHBsYXRmb3JtLmNhbGxNZXRob2QocmFpc2VFdmVudE1ldGhvZCwgbnVsbCwgW1xyXG4gICAgcGxhdGZvcm0udG9Eb3ROZXRTdHJpbmcoSlNPTi5zdHJpbmdpZnkoZXZlbnREZXNjcmlwdG9yKSksXHJcbiAgICBwbGF0Zm9ybS50b0RvdE5ldFN0cmluZyhKU09OLnN0cmluZ2lmeShldmVudEFyZ3MuZGF0YSkpXHJcbiAgXSk7XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1JlbmRlcmluZy9Ccm93c2VyUmVuZGVyZXIudHMiLCJpbXBvcnQgeyBTeXN0ZW1fQXJyYXksIFBvaW50ZXIgfSBmcm9tICcuLi9QbGF0Zm9ybS9QbGF0Zm9ybSc7XHJcbmltcG9ydCB7IHBsYXRmb3JtIH0gZnJvbSAnLi4vRW52aXJvbm1lbnQnO1xyXG5jb25zdCByZW5kZXJUcmVlRWRpdFN0cnVjdExlbmd0aCA9IDE2O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlbmRlclRyZWVFZGl0UHRyKHJlbmRlclRyZWVFZGl0czogU3lzdGVtX0FycmF5PFJlbmRlclRyZWVFZGl0UG9pbnRlcj4sIGluZGV4OiBudW1iZXIpIHtcclxuICByZXR1cm4gcGxhdGZvcm0uZ2V0QXJyYXlFbnRyeVB0cihyZW5kZXJUcmVlRWRpdHMsIGluZGV4LCByZW5kZXJUcmVlRWRpdFN0cnVjdExlbmd0aCk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCByZW5kZXJUcmVlRWRpdCA9IHtcclxuICAvLyBUaGUgcHJvcGVydGllcyBhbmQgbWVtb3J5IGxheW91dCBtdXN0IGJlIGtlcHQgaW4gc3luYyB3aXRoIHRoZSAuTkVUIGVxdWl2YWxlbnQgaW4gUmVuZGVyVHJlZUVkaXQuY3NcclxuICB0eXBlOiAoZWRpdDogUmVuZGVyVHJlZUVkaXRQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkSW50MzJGaWVsZChlZGl0LCAwKSBhcyBFZGl0VHlwZSxcclxuICBzaWJsaW5nSW5kZXg6IChlZGl0OiBSZW5kZXJUcmVlRWRpdFBvaW50ZXIpID0+IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKGVkaXQsIDQpLFxyXG4gIG5ld1RyZWVJbmRleDogKGVkaXQ6IFJlbmRlclRyZWVFZGl0UG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZEludDMyRmllbGQoZWRpdCwgOCksXHJcbiAgcmVtb3ZlZEF0dHJpYnV0ZU5hbWU6IChlZGl0OiBSZW5kZXJUcmVlRWRpdFBvaW50ZXIpID0+IHBsYXRmb3JtLnJlYWRTdHJpbmdGaWVsZChlZGl0LCAxMiksXHJcbn07XHJcblxyXG5leHBvcnQgZW51bSBFZGl0VHlwZSB7XHJcbiAgcHJlcGVuZEZyYW1lID0gMSxcclxuICByZW1vdmVGcmFtZSA9IDIsXHJcbiAgc2V0QXR0cmlidXRlID0gMyxcclxuICByZW1vdmVBdHRyaWJ1dGUgPSA0LFxyXG4gIHVwZGF0ZVRleHQgPSA1LFxyXG4gIHN0ZXBJbiA9IDYsXHJcbiAgc3RlcE91dCA9IDcsXHJcbn1cclxuXHJcbi8vIE5vbWluYWwgdHlwZSB0byBlbnN1cmUgb25seSB2YWxpZCBwb2ludGVycyBhcmUgcGFzc2VkIHRvIHRoZSByZW5kZXJUcmVlRWRpdCBmdW5jdGlvbnMuXHJcbi8vIEF0IHJ1bnRpbWUgdGhlIHZhbHVlcyBhcmUganVzdCBudW1iZXJzLlxyXG5leHBvcnQgaW50ZXJmYWNlIFJlbmRlclRyZWVFZGl0UG9pbnRlciBleHRlbmRzIFBvaW50ZXIgeyBSZW5kZXJUcmVlRWRpdFBvaW50ZXJfX0RPX05PVF9JTVBMRU1FTlQ6IGFueSB9XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9SZW5kZXJpbmcvUmVuZGVyVHJlZUVkaXQudHMiLCJpbXBvcnQgeyBTeXN0ZW1fU3RyaW5nLCBTeXN0ZW1fQXJyYXksIFBvaW50ZXIgfSBmcm9tICcuLi9QbGF0Zm9ybS9QbGF0Zm9ybSc7XHJcbmltcG9ydCB7IHBsYXRmb3JtIH0gZnJvbSAnLi4vRW52aXJvbm1lbnQnO1xyXG5jb25zdCByZW5kZXJUcmVlRnJhbWVTdHJ1Y3RMZW5ndGggPSAyODtcclxuXHJcbi8vIFRvIG1pbmltaXNlIEdDIHByZXNzdXJlLCBpbnN0ZWFkIG9mIGluc3RhbnRpYXRpbmcgYSBKUyBvYmplY3QgdG8gcmVwcmVzZW50IGVhY2ggdHJlZSBmcmFtZSxcclxuLy8gd2Ugd29yayBpbiB0ZXJtcyBvZiBwb2ludGVycyB0byB0aGUgc3RydWN0cyBvbiB0aGUgLk5FVCBoZWFwLCBhbmQgdXNlIHN0YXRpYyBmdW5jdGlvbnMgdGhhdFxyXG4vLyBrbm93IGhvdyB0byByZWFkIHByb3BlcnR5IHZhbHVlcyBmcm9tIHRob3NlIHN0cnVjdHMuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VHJlZUZyYW1lUHRyKHJlbmRlclRyZWVFbnRyaWVzOiBTeXN0ZW1fQXJyYXk8UmVuZGVyVHJlZUZyYW1lUG9pbnRlcj4sIGluZGV4OiBudW1iZXIpIHtcclxuICByZXR1cm4gcGxhdGZvcm0uZ2V0QXJyYXlFbnRyeVB0cihyZW5kZXJUcmVlRW50cmllcywgaW5kZXgsIHJlbmRlclRyZWVGcmFtZVN0cnVjdExlbmd0aCk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCByZW5kZXJUcmVlRnJhbWUgPSB7XHJcbiAgLy8gVGhlIHByb3BlcnRpZXMgYW5kIG1lbW9yeSBsYXlvdXQgbXVzdCBiZSBrZXB0IGluIHN5bmMgd2l0aCB0aGUgLk5FVCBlcXVpdmFsZW50IGluIFJlbmRlclRyZWVGcmFtZS5jc1xyXG4gIGZyYW1lVHlwZTogKGZyYW1lOiBSZW5kZXJUcmVlRnJhbWVQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkSW50MzJGaWVsZChmcmFtZSwgNCkgYXMgRnJhbWVUeXBlLFxyXG4gIHN1YnRyZWVMZW5ndGg6IChmcmFtZTogUmVuZGVyVHJlZUZyYW1lUG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZEludDMyRmllbGQoZnJhbWUsIDgpIGFzIEZyYW1lVHlwZSxcclxuICBlbGVtZW50UmVmZXJlbmNlQ2FwdHVyZUlkOiAoZnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIpID0+IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKGZyYW1lLCA4KSxcclxuICBjb21wb25lbnRJZDogKGZyYW1lOiBSZW5kZXJUcmVlRnJhbWVQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkSW50MzJGaWVsZChmcmFtZSwgMTIpLFxyXG4gIGVsZW1lbnROYW1lOiAoZnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIpID0+IHBsYXRmb3JtLnJlYWRTdHJpbmdGaWVsZChmcmFtZSwgMTYpLFxyXG4gIHRleHRDb250ZW50OiAoZnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIpID0+IHBsYXRmb3JtLnJlYWRTdHJpbmdGaWVsZChmcmFtZSwgMTYpLFxyXG4gIGF0dHJpYnV0ZU5hbWU6IChmcmFtZTogUmVuZGVyVHJlZUZyYW1lUG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZFN0cmluZ0ZpZWxkKGZyYW1lLCAxNiksXHJcbiAgYXR0cmlidXRlVmFsdWU6IChmcmFtZTogUmVuZGVyVHJlZUZyYW1lUG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZFN0cmluZ0ZpZWxkKGZyYW1lLCAyNCksXHJcbiAgYXR0cmlidXRlRXZlbnRIYW5kbGVySWQ6IChmcmFtZTogUmVuZGVyVHJlZUZyYW1lUG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZEludDMyRmllbGQoZnJhbWUsIDgpLFxyXG59O1xyXG5cclxuZXhwb3J0IGVudW0gRnJhbWVUeXBlIHtcclxuICAvLyBUaGUgdmFsdWVzIG11c3QgYmUga2VwdCBpbiBzeW5jIHdpdGggdGhlIC5ORVQgZXF1aXZhbGVudCBpbiBSZW5kZXJUcmVlRnJhbWVUeXBlLmNzXHJcbiAgZWxlbWVudCA9IDEsXHJcbiAgdGV4dCA9IDIsXHJcbiAgYXR0cmlidXRlID0gMyxcclxuICBjb21wb25lbnQgPSA0LFxyXG4gIHJlZ2lvbiA9IDUsXHJcbiAgZWxlbWVudFJlZmVyZW5jZUNhcHR1cmUgPSA2LFxyXG59XHJcblxyXG4vLyBOb21pbmFsIHR5cGUgdG8gZW5zdXJlIG9ubHkgdmFsaWQgcG9pbnRlcnMgYXJlIHBhc3NlZCB0byB0aGUgcmVuZGVyVHJlZUZyYW1lIGZ1bmN0aW9ucy5cclxuLy8gQXQgcnVudGltZSB0aGUgdmFsdWVzIGFyZSBqdXN0IG51bWJlcnMuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmVuZGVyVHJlZUZyYW1lUG9pbnRlciBleHRlbmRzIFBvaW50ZXIgeyBSZW5kZXJUcmVlRnJhbWVQb2ludGVyX19ET19OT1RfSU1QTEVNRU5UOiBhbnkgfVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUmVuZGVyaW5nL1JlbmRlclRyZWVGcmFtZS50cyIsImltcG9ydCB7IEV2ZW50Rm9yRG90TmV0LCBVSUV2ZW50QXJncyB9IGZyb20gJy4vRXZlbnRGb3JEb3ROZXQnO1xyXG5cclxuY29uc3Qgbm9uQnViYmxpbmdFdmVudHMgPSB0b0xvb2t1cChbXHJcbiAgJ2Fib3J0JywgJ2JsdXInLCAnY2hhbmdlJywgJ2Vycm9yJywgJ2ZvY3VzJywgJ2xvYWQnLCAnbG9hZGVuZCcsICdsb2Fkc3RhcnQnLCAnbW91c2VlbnRlcicsICdtb3VzZWxlYXZlJyxcclxuICAncHJvZ3Jlc3MnLCAncmVzZXQnLCAnc2Nyb2xsJywgJ3N1Ym1pdCcsICd1bmxvYWQnLCAnRE9NTm9kZUluc2VydGVkSW50b0RvY3VtZW50JywgJ0RPTU5vZGVSZW1vdmVkRnJvbURvY3VtZW50J1xyXG5dKTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgT25FdmVudENhbGxiYWNrIHtcclxuICAoZXZlbnQ6IEV2ZW50LCBjb21wb25lbnRJZDogbnVtYmVyLCBldmVudEhhbmRsZXJJZDogbnVtYmVyLCBldmVudEFyZ3M6IEV2ZW50Rm9yRG90TmV0PFVJRXZlbnRBcmdzPik6IHZvaWQ7XHJcbn1cclxuXHJcbi8vIFJlc3BvbnNpYmxlIGZvciBhZGRpbmcvcmVtb3ZpbmcgdGhlIGV2ZW50SW5mbyBvbiBhbiBleHBhbmRvIHByb3BlcnR5IG9uIERPTSBlbGVtZW50cywgYW5kXHJcbi8vIGNhbGxpbmcgYW4gRXZlbnRJbmZvU3RvcmUgdGhhdCBkZWFscyB3aXRoIHJlZ2lzdGVyaW5nL3VucmVnaXN0ZXJpbmcgdGhlIHVuZGVybHlpbmcgZGVsZWdhdGVkXHJcbi8vIGV2ZW50IGxpc3RlbmVycyBhcyByZXF1aXJlZCAoYW5kIGFsc28gbWFwcyBhY3R1YWwgZXZlbnRzIGJhY2sgdG8gdGhlIGdpdmVuIGNhbGxiYWNrKS5cclxuZXhwb3J0IGNsYXNzIEV2ZW50RGVsZWdhdG9yIHtcclxuICBwcml2YXRlIHN0YXRpYyBuZXh0RXZlbnREZWxlZ2F0b3JJZCA9IDA7XHJcbiAgcHJpdmF0ZSBldmVudHNDb2xsZWN0aW9uS2V5OiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBldmVudEluZm9TdG9yZTogRXZlbnRJbmZvU3RvcmU7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgb25FdmVudDogT25FdmVudENhbGxiYWNrKSB7XHJcbiAgICBjb25zdCBldmVudERlbGVnYXRvcklkID0gKytFdmVudERlbGVnYXRvci5uZXh0RXZlbnREZWxlZ2F0b3JJZDtcclxuICAgIHRoaXMuZXZlbnRzQ29sbGVjdGlvbktleSA9IGBfYmxhem9yRXZlbnRzXyR7ZXZlbnREZWxlZ2F0b3JJZH1gO1xyXG4gICAgdGhpcy5ldmVudEluZm9TdG9yZSA9IG5ldyBFdmVudEluZm9TdG9yZSh0aGlzLm9uR2xvYmFsRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2V0TGlzdGVuZXIoZWxlbWVudDogRWxlbWVudCwgZXZlbnROYW1lOiBzdHJpbmcsIGNvbXBvbmVudElkOiBudW1iZXIsIGV2ZW50SGFuZGxlcklkOiBudW1iZXIpIHtcclxuICAgIC8vIEVuc3VyZSB3ZSBoYXZlIGEgcGxhY2UgdG8gc3RvcmUgZXZlbnQgaW5mbyBmb3IgdGhpcyBlbGVtZW50XHJcbiAgICBsZXQgaW5mb0ZvckVsZW1lbnQ6IEV2ZW50SGFuZGxlckluZm9zRm9yRWxlbWVudCA9IGVsZW1lbnRbdGhpcy5ldmVudHNDb2xsZWN0aW9uS2V5XTtcclxuICAgIGlmICghaW5mb0ZvckVsZW1lbnQpIHtcclxuICAgICAgaW5mb0ZvckVsZW1lbnQgPSBlbGVtZW50W3RoaXMuZXZlbnRzQ29sbGVjdGlvbktleV0gPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaW5mb0ZvckVsZW1lbnQuaGFzT3duUHJvcGVydHkoZXZlbnROYW1lKSkge1xyXG4gICAgICAvLyBXZSBjYW4gY2hlYXBseSB1cGRhdGUgdGhlIGluZm8gb24gdGhlIGV4aXN0aW5nIG9iamVjdCBhbmQgZG9uJ3QgbmVlZCBhbnkgb3RoZXIgaG91c2VrZWVwaW5nXHJcbiAgICAgIGNvbnN0IG9sZEluZm8gPSBpbmZvRm9yRWxlbWVudFtldmVudE5hbWVdO1xyXG4gICAgICB0aGlzLmV2ZW50SW5mb1N0b3JlLnVwZGF0ZShvbGRJbmZvLmV2ZW50SGFuZGxlcklkLCBldmVudEhhbmRsZXJJZCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBHbyB0aHJvdWdoIHRoZSB3aG9sZSBmbG93IHdoaWNoIG1pZ2h0IGludm9sdmUgcmVnaXN0ZXJpbmcgYSBuZXcgZ2xvYmFsIGhhbmRsZXJcclxuICAgICAgY29uc3QgbmV3SW5mbyA9IHsgZWxlbWVudCwgZXZlbnROYW1lLCBjb21wb25lbnRJZCwgZXZlbnRIYW5kbGVySWQgfTtcclxuICAgICAgdGhpcy5ldmVudEluZm9TdG9yZS5hZGQobmV3SW5mbyk7XHJcbiAgICAgIGluZm9Gb3JFbGVtZW50W2V2ZW50TmFtZV0gPSBuZXdJbmZvO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlbW92ZUxpc3RlbmVyKGV2ZW50SGFuZGxlcklkOiBudW1iZXIpIHtcclxuICAgIC8vIFRoaXMgbWV0aG9kIGdldHMgY2FsbGVkIHdoZW5ldmVyIHRoZSAuTkVULXNpZGUgY29kZSByZXBvcnRzIHRoYXQgYSBjZXJ0YWluIGV2ZW50IGhhbmRsZXJcclxuICAgIC8vIGhhcyBiZWVuIGRpc3Bvc2VkLiBIb3dldmVyIHdlIHdpbGwgYWxyZWFkeSBoYXZlIGRpc3Bvc2VkIHRoZSBpbmZvIGFib3V0IHRoYXQgaGFuZGxlciBpZlxyXG4gICAgLy8gdGhlIGV2ZW50SGFuZGxlcklkIGZvciB0aGUgKGVsZW1lbnQsZXZlbnROYW1lKSBwYWlyIHdhcyByZXBsYWNlZCBkdXJpbmcgZGlmZiBhcHBsaWNhdGlvbi5cclxuICAgIGNvbnN0IGluZm8gPSB0aGlzLmV2ZW50SW5mb1N0b3JlLnJlbW92ZShldmVudEhhbmRsZXJJZCk7XHJcbiAgICBpZiAoaW5mbykge1xyXG4gICAgICAvLyBMb29rcyBsaWtlIHRoaXMgZXZlbnQgaGFuZGxlciB3YXNuJ3QgYWxyZWFkeSBkaXNwb3NlZFxyXG4gICAgICAvLyBSZW1vdmUgdGhlIGFzc29jaWF0ZWQgZGF0YSBmcm9tIHRoZSBET00gZWxlbWVudFxyXG4gICAgICBjb25zdCBlbGVtZW50ID0gaW5mby5lbGVtZW50O1xyXG4gICAgICBpZiAoZWxlbWVudC5oYXNPd25Qcm9wZXJ0eSh0aGlzLmV2ZW50c0NvbGxlY3Rpb25LZXkpKSB7XHJcbiAgICAgICAgY29uc3QgZWxlbWVudEV2ZW50SW5mb3M6IEV2ZW50SGFuZGxlckluZm9zRm9yRWxlbWVudCA9IGVsZW1lbnRbdGhpcy5ldmVudHNDb2xsZWN0aW9uS2V5XTtcclxuICAgICAgICBkZWxldGUgZWxlbWVudEV2ZW50SW5mb3NbaW5mby5ldmVudE5hbWVdO1xyXG4gICAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhlbGVtZW50RXZlbnRJbmZvcykubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICBkZWxldGUgZWxlbWVudFt0aGlzLmV2ZW50c0NvbGxlY3Rpb25LZXldO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvbkdsb2JhbEV2ZW50KGV2dDogRXZlbnQpIHtcclxuICAgIGlmICghKGV2dC50YXJnZXQgaW5zdGFuY2VvZiBFbGVtZW50KSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2NhbiB1cCB0aGUgZWxlbWVudCBoaWVyYXJjaHksIGxvb2tpbmcgZm9yIGFueSBtYXRjaGluZyByZWdpc3RlcmVkIGV2ZW50IGhhbmRsZXJzXHJcbiAgICBsZXQgY2FuZGlkYXRlRWxlbWVudCA9IGV2dC50YXJnZXQgYXMgRWxlbWVudCB8IG51bGw7XHJcbiAgICBsZXQgZXZlbnRBcmdzOiBFdmVudEZvckRvdE5ldDxVSUV2ZW50QXJncz4gfCBudWxsID0gbnVsbDsgLy8gUG9wdWxhdGUgbGF6aWx5XHJcbiAgICBjb25zdCBldmVudElzTm9uQnViYmxpbmcgPSBub25CdWJibGluZ0V2ZW50cy5oYXNPd25Qcm9wZXJ0eShldnQudHlwZSk7XHJcbiAgICB3aGlsZSAoY2FuZGlkYXRlRWxlbWVudCkge1xyXG4gICAgICBpZiAoY2FuZGlkYXRlRWxlbWVudC5oYXNPd25Qcm9wZXJ0eSh0aGlzLmV2ZW50c0NvbGxlY3Rpb25LZXkpKSB7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlckluZm9zID0gY2FuZGlkYXRlRWxlbWVudFt0aGlzLmV2ZW50c0NvbGxlY3Rpb25LZXldO1xyXG4gICAgICAgIGlmIChoYW5kbGVySW5mb3MuaGFzT3duUHJvcGVydHkoZXZ0LnR5cGUpKSB7XHJcbiAgICAgICAgICAvLyBXZSBhcmUgZ29pbmcgdG8gcmFpc2UgYW4gZXZlbnQgZm9yIHRoaXMgZWxlbWVudCwgc28gcHJlcGFyZSBpbmZvIG5lZWRlZCBieSB0aGUgLk5FVCBjb2RlXHJcbiAgICAgICAgICBpZiAoIWV2ZW50QXJncykge1xyXG4gICAgICAgICAgICBldmVudEFyZ3MgPSBFdmVudEZvckRvdE5ldC5mcm9tRE9NRXZlbnQoZXZ0KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBjb25zdCBoYW5kbGVySW5mbyA9IGhhbmRsZXJJbmZvc1tldnQudHlwZV07XHJcbiAgICAgICAgICB0aGlzLm9uRXZlbnQoZXZ0LCBoYW5kbGVySW5mby5jb21wb25lbnRJZCwgaGFuZGxlckluZm8uZXZlbnRIYW5kbGVySWQsIGV2ZW50QXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjYW5kaWRhdGVFbGVtZW50ID0gZXZlbnRJc05vbkJ1YmJsaW5nID8gbnVsbCA6IGNhbmRpZGF0ZUVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8vIFJlc3BvbnNpYmxlIGZvciBhZGRpbmcgYW5kIHJlbW92aW5nIHRoZSBnbG9iYWwgbGlzdGVuZXIgd2hlbiB0aGUgbnVtYmVyIG9mIGxpc3RlbmVyc1xyXG4vLyBmb3IgYSBnaXZlbiBldmVudCBuYW1lIGNoYW5nZXMgYmV0d2VlbiB6ZXJvIGFuZCBub256ZXJvXHJcbmNsYXNzIEV2ZW50SW5mb1N0b3JlIHtcclxuICBwcml2YXRlIGluZm9zQnlFdmVudEhhbmRsZXJJZDogeyBbZXZlbnRIYW5kbGVySWQ6IG51bWJlcl06IEV2ZW50SGFuZGxlckluZm8gfSA9IHt9O1xyXG4gIHByaXZhdGUgY291bnRCeUV2ZW50TmFtZTogeyBbZXZlbnROYW1lOiBzdHJpbmddOiBudW1iZXIgfSA9IHt9O1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGdsb2JhbExpc3RlbmVyOiBFdmVudExpc3RlbmVyKSB7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYWRkKGluZm86IEV2ZW50SGFuZGxlckluZm8pIHtcclxuICAgIGlmICh0aGlzLmluZm9zQnlFdmVudEhhbmRsZXJJZFtpbmZvLmV2ZW50SGFuZGxlcklkXSkge1xyXG4gICAgICAvLyBTaG91bGQgbmV2ZXIgaGFwcGVuLCBidXQgd2Ugd2FudCB0byBrbm93IGlmIGl0IGRvZXNcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFdmVudCAke2luZm8uZXZlbnRIYW5kbGVySWR9IGlzIGFscmVhZHkgdHJhY2tlZGApO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5mb3NCeUV2ZW50SGFuZGxlcklkW2luZm8uZXZlbnRIYW5kbGVySWRdID0gaW5mbztcclxuXHJcbiAgICBjb25zdCBldmVudE5hbWUgPSBpbmZvLmV2ZW50TmFtZTtcclxuICAgIGlmICh0aGlzLmNvdW50QnlFdmVudE5hbWUuaGFzT3duUHJvcGVydHkoZXZlbnROYW1lKSkge1xyXG4gICAgICB0aGlzLmNvdW50QnlFdmVudE5hbWVbZXZlbnROYW1lXSsrO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jb3VudEJ5RXZlbnROYW1lW2V2ZW50TmFtZV0gPSAxO1xyXG5cclxuICAgICAgLy8gVG8gbWFrZSBkZWxlZ2F0aW9uIHdvcmsgd2l0aCBub24tYnViYmxpbmcgZXZlbnRzLCByZWdpc3RlciBhICdjYXB0dXJlJyBsaXN0ZW5lci5cclxuICAgICAgLy8gV2UgcHJlc2VydmUgdGhlIG5vbi1idWJibGluZyBiZWhhdmlvciBieSBvbmx5IGRpc3BhdGNoaW5nIHN1Y2ggZXZlbnRzIHRvIHRoZSB0YXJnZXRlZCBlbGVtZW50LlxyXG4gICAgICBjb25zdCB1c2VDYXB0dXJlID0gbm9uQnViYmxpbmdFdmVudHMuaGFzT3duUHJvcGVydHkoZXZlbnROYW1lKTtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHRoaXMuZ2xvYmFsTGlzdGVuZXIsIHVzZUNhcHR1cmUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHVwZGF0ZShvbGRFdmVudEhhbmRsZXJJZDogbnVtYmVyLCBuZXdFdmVudEhhbmRsZXJJZDogbnVtYmVyKSB7XHJcbiAgICBpZiAodGhpcy5pbmZvc0J5RXZlbnRIYW5kbGVySWQuaGFzT3duUHJvcGVydHkobmV3RXZlbnRIYW5kbGVySWQpKSB7XHJcbiAgICAgIC8vIFNob3VsZCBuZXZlciBoYXBwZW4sIGJ1dCB3ZSB3YW50IHRvIGtub3cgaWYgaXQgZG9lc1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEV2ZW50ICR7bmV3RXZlbnRIYW5kbGVySWR9IGlzIGFscmVhZHkgdHJhY2tlZGApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFNpbmNlIHdlJ3JlIGp1c3QgdXBkYXRpbmcgdGhlIGV2ZW50IGhhbmRsZXIgSUQsIHRoZXJlJ3Mgbm8gbmVlZCB0byB1cGRhdGUgdGhlIGdsb2JhbCBjb3VudHNcclxuICAgIGNvbnN0IGluZm8gPSB0aGlzLmluZm9zQnlFdmVudEhhbmRsZXJJZFtvbGRFdmVudEhhbmRsZXJJZF07XHJcbiAgICBkZWxldGUgdGhpcy5pbmZvc0J5RXZlbnRIYW5kbGVySWRbb2xkRXZlbnRIYW5kbGVySWRdO1xyXG4gICAgaW5mby5ldmVudEhhbmRsZXJJZCA9IG5ld0V2ZW50SGFuZGxlcklkO1xyXG4gICAgdGhpcy5pbmZvc0J5RXZlbnRIYW5kbGVySWRbbmV3RXZlbnRIYW5kbGVySWRdID0gaW5mbztcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZW1vdmUoZXZlbnRIYW5kbGVySWQ6IG51bWJlcik6IEV2ZW50SGFuZGxlckluZm8ge1xyXG4gICAgY29uc3QgaW5mbyA9IHRoaXMuaW5mb3NCeUV2ZW50SGFuZGxlcklkW2V2ZW50SGFuZGxlcklkXTtcclxuICAgIGlmIChpbmZvKSB7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLmluZm9zQnlFdmVudEhhbmRsZXJJZFtldmVudEhhbmRsZXJJZF07XHJcblxyXG4gICAgICBjb25zdCBldmVudE5hbWUgPSBpbmZvLmV2ZW50TmFtZTtcclxuICAgICAgaWYgKC0tdGhpcy5jb3VudEJ5RXZlbnROYW1lW2V2ZW50TmFtZV0gPT09IDApIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5jb3VudEJ5RXZlbnROYW1lW2V2ZW50TmFtZV07XHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHRoaXMuZ2xvYmFsTGlzdGVuZXIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGluZm87XHJcbiAgfVxyXG59XHJcblxyXG5pbnRlcmZhY2UgRXZlbnRIYW5kbGVySW5mb3NGb3JFbGVtZW50IHtcclxuICAvLyBBbHRob3VnaCB3ZSAqY291bGQqIHRyYWNrIG11bHRpcGxlIGV2ZW50IGhhbmRsZXJzIHBlciAoZWxlbWVudCwgZXZlbnROYW1lKSBwYWlyXHJcbiAgLy8gKHNpbmNlIHRoZXkgaGF2ZSBkaXN0aW5jdCBldmVudEhhbmRsZXJJZCB2YWx1ZXMpLCB0aGVyZSdzIG5vIHBvaW50IGRvaW5nIHNvIGJlY2F1c2VcclxuICAvLyBvdXIgcHJvZ3JhbW1pbmcgbW9kZWwgaXMgdGhhdCB5b3UgZGVjbGFyZSBldmVudCBoYW5kbGVycyBhcyBhdHRyaWJ1dGVzLiBBbiBlbGVtZW50XHJcbiAgLy8gY2FuIG9ubHkgaGF2ZSBvbmUgYXR0cmlidXRlIHdpdGggYSBnaXZlbiBuYW1lLCBoZW5jZSBvbmx5IG9uZSBldmVudCBoYW5kbGVyIHdpdGhcclxuICAvLyB0aGF0IG5hbWUgYXQgYW55IG9uZSB0aW1lLlxyXG4gIC8vIFNvIHRvIGtlZXAgdGhpbmdzIHNpbXBsZSwgb25seSB0cmFjayBvbmUgRXZlbnRIYW5kbGVySW5mbyBwZXIgKGVsZW1lbnQsIGV2ZW50TmFtZSlcclxuICBbZXZlbnROYW1lOiBzdHJpbmddOiBFdmVudEhhbmRsZXJJbmZvXHJcbn1cclxuXHJcbmludGVyZmFjZSBFdmVudEhhbmRsZXJJbmZvIHtcclxuICBlbGVtZW50OiBFbGVtZW50O1xyXG4gIGV2ZW50TmFtZTogc3RyaW5nO1xyXG4gIGNvbXBvbmVudElkOiBudW1iZXI7XHJcbiAgZXZlbnRIYW5kbGVySWQ6IG51bWJlcjtcclxufVxyXG5cclxuZnVuY3Rpb24gdG9Mb29rdXAoaXRlbXM6IHN0cmluZ1tdKTogeyBba2V5OiBzdHJpbmddOiBib29sZWFuIH0ge1xyXG4gIGNvbnN0IHJlc3VsdCA9IHt9O1xyXG4gIGl0ZW1zLmZvckVhY2godmFsdWUgPT4geyByZXN1bHRbdmFsdWVdID0gdHJ1ZTsgfSk7XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUmVuZGVyaW5nL0V2ZW50RGVsZWdhdG9yLnRzIiwiZXhwb3J0IGNsYXNzIEV2ZW50Rm9yRG90TmV0PFREYXRhIGV4dGVuZHMgVUlFdmVudEFyZ3M+IHtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgdHlwZTogRXZlbnRBcmdzVHlwZSwgcHVibGljIHJlYWRvbmx5IGRhdGE6IFREYXRhKSB7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZnJvbURPTUV2ZW50KGV2ZW50OiBFdmVudCk6IEV2ZW50Rm9yRG90TmV0PFVJRXZlbnRBcmdzPiB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gZXZlbnQudGFyZ2V0IGFzIEVsZW1lbnQ7XHJcbiAgICBzd2l0Y2ggKGV2ZW50LnR5cGUpIHtcclxuXHJcbiAgICAgIGNhc2UgJ2NoYW5nZSc6IHtcclxuICAgICAgICBjb25zdCB0YXJnZXRJc0NoZWNrYm94ID0gaXNDaGVja2JveChlbGVtZW50KTtcclxuICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IHRhcmdldElzQ2hlY2tib3ggPyAhIWVsZW1lbnRbJ2NoZWNrZWQnXSA6IGVsZW1lbnRbJ3ZhbHVlJ107XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFdmVudEZvckRvdE5ldDxVSUNoYW5nZUV2ZW50QXJncz4oJ2NoYW5nZScsIHsgdHlwZTogZXZlbnQudHlwZSwgdmFsdWU6IG5ld1ZhbHVlIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjYXNlICdjb3B5JzpcclxuICAgICAgY2FzZSAnY3V0JzpcclxuICAgICAgY2FzZSAncGFzdGUnOlxyXG4gICAgICAgIHJldHVybiBuZXcgRXZlbnRGb3JEb3ROZXQ8VUlDbGlwYm9hcmRFdmVudEFyZ3M+KCdjbGlwYm9hcmQnLCB7IHR5cGU6IGV2ZW50LnR5cGUgfSk7XHJcblxyXG4gICAgICBjYXNlICdkcmFnJzpcclxuICAgICAgY2FzZSAnZHJhZ2VuZCc6XHJcbiAgICAgIGNhc2UgJ2RyYWdlbnRlcic6XHJcbiAgICAgIGNhc2UgJ2RyYWdsZWF2ZSc6XHJcbiAgICAgIGNhc2UgJ2RyYWdvdmVyJzpcclxuICAgICAgY2FzZSAnZHJhZ3N0YXJ0JzpcclxuICAgICAgY2FzZSAnZHJvcCc6XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFdmVudEZvckRvdE5ldDxVSURyYWdFdmVudEFyZ3M+KCdkcmFnJywgcGFyc2VEcmFnRXZlbnQoZXZlbnQpKTtcclxuXHJcbiAgICAgIGNhc2UgJ2ZvY3VzJzpcclxuICAgICAgY2FzZSAnYmx1cic6XHJcbiAgICAgIGNhc2UgJ2ZvY3VzaW4nOlxyXG4gICAgICBjYXNlICdmb2N1c291dCc6XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFdmVudEZvckRvdE5ldDxVSUZvY3VzRXZlbnRBcmdzPignZm9jdXMnLCB7IHR5cGU6IGV2ZW50LnR5cGUgfSk7XHJcblxyXG4gICAgICBjYXNlICdrZXlkb3duJzpcclxuICAgICAgY2FzZSAna2V5dXAnOlxyXG4gICAgICBjYXNlICdrZXlwcmVzcyc6XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFdmVudEZvckRvdE5ldDxVSUtleWJvYXJkRXZlbnRBcmdzPigna2V5Ym9hcmQnLCBwYXJzZUtleWJvYXJkRXZlbnQoPEtleWJvYXJkRXZlbnQ+ZXZlbnQpKTtcclxuXHJcbiAgICAgIGNhc2UgJ2NvbnRleHRtZW51JzpcclxuICAgICAgY2FzZSAnY2xpY2snOlxyXG4gICAgICBjYXNlICdtb3VzZW92ZXInOlxyXG4gICAgICBjYXNlICdtb3VzZW91dCc6XHJcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XHJcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XHJcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxyXG4gICAgICBjYXNlICdkYmxjbGljayc6XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFdmVudEZvckRvdE5ldDxVSU1vdXNlRXZlbnRBcmdzPignbW91c2UnLCBwYXJzZU1vdXNlRXZlbnQoPE1vdXNlRXZlbnQ+ZXZlbnQpKTtcclxuXHJcbiAgICAgIGNhc2UgJ2xvYWRzdGFydCc6XHJcbiAgICAgIGNhc2UgJ3RpbWVvdXQnOlxyXG4gICAgICBjYXNlICdhYm9ydCc6XHJcbiAgICAgIGNhc2UgJ2xvYWQnOlxyXG4gICAgICBjYXNlICdsb2FkZW5kJzpcclxuICAgICAgY2FzZSAnZXJyb3InOlxyXG4gICAgICBjYXNlICdwcm9ncmVzcyc6XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFdmVudEZvckRvdE5ldDxVSVByb2dyZXNzRXZlbnRBcmdzPigncHJvZ3Jlc3MnLCBwYXJzZVByb2dyZXNzRXZlbnQoPFByb2dyZXNzRXZlbnQ+ZXZlbnQpKTtcclxuXHJcbiAgICAgIGNhc2UgJ3RvdWNoY2FuY2VsJzpcclxuICAgICAgY2FzZSAndG91Y2hlbmQnOlxyXG4gICAgICBjYXNlICd0b3VjaG1vdmUnOlxyXG4gICAgICBjYXNlICd0b3VjaGVudGVyJzpcclxuICAgICAgY2FzZSAndG91Y2hsZWF2ZSc6XHJcbiAgICAgIGNhc2UgJ3RvdWNoc3RhcnQnOlxyXG4gICAgICAgIHJldHVybiBuZXcgRXZlbnRGb3JEb3ROZXQ8VUlUb3VjaEV2ZW50QXJncz4oJ3RvdWNoJywgcGFyc2VUb3VjaEV2ZW50KDxUb3VjaEV2ZW50PmV2ZW50KSk7XHJcblxyXG4gICAgICBjYXNlICdnb3Rwb2ludGVyY2FwdHVyZSc6XHJcbiAgICAgIGNhc2UgJ2xvc3Rwb2ludGVyY2FwdHVyZSc6XHJcbiAgICAgIGNhc2UgJ3BvaW50ZXJjYW5jZWwnOlxyXG4gICAgICBjYXNlICdwb2ludGVyZG93bic6XHJcbiAgICAgIGNhc2UgJ3BvaW50ZXJlbnRlcic6XHJcbiAgICAgIGNhc2UgJ3BvaW50ZXJsZWF2ZSc6XHJcbiAgICAgIGNhc2UgJ3BvaW50ZXJtb3ZlJzpcclxuICAgICAgY2FzZSAncG9pbnRlcm91dCc6XHJcbiAgICAgIGNhc2UgJ3BvaW50ZXJvdmVyJzpcclxuICAgICAgY2FzZSAncG9pbnRlcnVwJzpcclxuICAgICAgICByZXR1cm4gbmV3IEV2ZW50Rm9yRG90TmV0PFVJUG9pbnRlckV2ZW50QXJncz4oJ3BvaW50ZXInLCBwYXJzZVBvaW50ZXJFdmVudCg8UG9pbnRlckV2ZW50PmV2ZW50KSk7XHJcblxyXG4gICAgICBjYXNlICd3aGVlbCc6XHJcbiAgICAgIGNhc2UgJ21vdXNld2hlZWwnOlxyXG4gICAgICAgIHJldHVybiBuZXcgRXZlbnRGb3JEb3ROZXQ8VUlXaGVlbEV2ZW50QXJncz4oJ3doZWVsJywgcGFyc2VXaGVlbEV2ZW50KDxXaGVlbEV2ZW50PmV2ZW50KSk7XHJcblxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHJldHVybiBuZXcgRXZlbnRGb3JEb3ROZXQ8VUlFdmVudEFyZ3M+KCd1bmtub3duJywgeyB0eXBlOiBldmVudC50eXBlIH0pO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VEcmFnRXZlbnQoZXZlbnQ6IGFueSkge1xyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBldmVudC50eXBlLFxyXG4gICAgZGV0YWlsOiBldmVudC5kZXRhaWwsXHJcbiAgICBkYXRhVHJhbnNmZXI6IGV2ZW50LmRhdGFUcmFuc2ZlcixcclxuICAgIHNjcmVlblg6IGV2ZW50LnNjcmVlblgsXHJcbiAgICBzY3JlZW5ZOiBldmVudC5zY3JlZW5ZLFxyXG4gICAgY2xpZW50WDogZXZlbnQuY2xpZW50WCxcclxuICAgIGNsaWVudFk6IGV2ZW50LmNsaWVudFksXHJcbiAgICBidXR0b246IGV2ZW50LmJ1dHRvbixcclxuICAgIGJ1dHRvbnM6IGV2ZW50LmJ1dHRvbnMsXHJcbiAgICBjdHJsS2V5OiBldmVudC5jdHJsS2V5LFxyXG4gICAgc2hpZnRLZXk6IGV2ZW50LnNoaWZ0S2V5LFxyXG4gICAgYWx0S2V5OiBldmVudC5hbHRLZXksXHJcbiAgICBtZXRhS2V5OiBldmVudC5tZXRhS2V5XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZVdoZWVsRXZlbnQoZXZlbnQ6IFdoZWVsRXZlbnQpIHtcclxuICByZXR1cm4ge1xyXG4gICAgLi4ucGFyc2VNb3VzZUV2ZW50KGV2ZW50KSxcclxuICAgIGRlbHRhWDogZXZlbnQuZGVsdGFYLFxyXG4gICAgZGVsdGFZOiBldmVudC5kZWx0YVksXHJcbiAgICBkZWx0YVo6IGV2ZW50LmRlbHRhWixcclxuICAgIGRlbHRhTW9kZTogZXZlbnQuZGVsdGFNb2RlXHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VQcm9ncmVzc0V2ZW50KGV2ZW50OiBQcm9ncmVzc0V2ZW50KSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHR5cGU6IGV2ZW50LnR5cGUsXHJcbiAgICBsZW5ndGhDb21wdXRhYmxlOiBldmVudC5sZW5ndGhDb21wdXRhYmxlLFxyXG4gICAgbG9hZGVkOiBldmVudC5sb2FkZWQsXHJcbiAgICB0b3RhbDogZXZlbnQudG90YWxcclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZVRvdWNoRXZlbnQoZXZlbnQ6IFRvdWNoRXZlbnQpIHtcclxuXHJcbiAgZnVuY3Rpb24gcGFyc2VUb3VjaCh0b3VjaExpc3Q6IFRvdWNoTGlzdCkge1xyXG4gICAgY29uc3QgdG91Y2hlczogVUlUb3VjaFBvaW50W10gPSBbXTtcclxuICAgIFxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3VjaExpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgdG91Y2ggPSB0b3VjaExpc3RbaV07XHJcbiAgICAgIHRvdWNoZXMucHVzaCh7XHJcbiAgICAgICAgaWRlbnRpZmllcjogdG91Y2guaWRlbnRpZmllcixcclxuICAgICAgICBjbGllbnRYOiB0b3VjaC5jbGllbnRYLFxyXG4gICAgICAgIGNsaWVudFk6IHRvdWNoLmNsaWVudFksXHJcbiAgICAgICAgc2NyZWVuWDogdG91Y2guc2NyZWVuWCxcclxuICAgICAgICBzY3JlZW5ZOiB0b3VjaC5zY3JlZW5ZLFxyXG4gICAgICAgIHBhZ2VYOiB0b3VjaC5wYWdlWCxcclxuICAgICAgICBwYWdlWTogdG91Y2gucGFnZVlcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG91Y2hlcztcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBldmVudC50eXBlLFxyXG4gICAgZGV0YWlsOiBldmVudC5kZXRhaWwsXHJcbiAgICB0b3VjaGVzOiBwYXJzZVRvdWNoKGV2ZW50LnRvdWNoZXMpLFxyXG4gICAgdGFyZ2V0VG91Y2hlczogcGFyc2VUb3VjaChldmVudC50YXJnZXRUb3VjaGVzKSxcclxuICAgIGNoYW5nZWRUb3VjaGVzOiBwYXJzZVRvdWNoKGV2ZW50LmNoYW5nZWRUb3VjaGVzKSxcclxuICAgIGN0cmxLZXk6IGV2ZW50LmN0cmxLZXksXHJcbiAgICBzaGlmdEtleTogZXZlbnQuc2hpZnRLZXksXHJcbiAgICBhbHRLZXk6IGV2ZW50LmFsdEtleSxcclxuICAgIG1ldGFLZXk6IGV2ZW50Lm1ldGFLZXlcclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUtleWJvYXJkRXZlbnQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcclxuICByZXR1cm4ge1xyXG4gICAgdHlwZTogZXZlbnQudHlwZSxcclxuICAgIGtleTogZXZlbnQua2V5LFxyXG4gICAgY29kZTogZXZlbnQuY29kZSxcclxuICAgIGxvY2F0aW9uOiBldmVudC5sb2NhdGlvbixcclxuICAgIHJlcGVhdDogZXZlbnQucmVwZWF0LFxyXG4gICAgY3RybEtleTogZXZlbnQuY3RybEtleSxcclxuICAgIHNoaWZ0S2V5OiBldmVudC5zaGlmdEtleSxcclxuICAgIGFsdEtleTogZXZlbnQuYWx0S2V5LFxyXG4gICAgbWV0YUtleTogZXZlbnQubWV0YUtleVxyXG4gIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlUG9pbnRlckV2ZW50KGV2ZW50OiBQb2ludGVyRXZlbnQpIHtcclxuICByZXR1cm4ge1xyXG4gICAgLi4ucGFyc2VNb3VzZUV2ZW50KGV2ZW50KSxcclxuICAgIHBvaW50ZXJJZDogZXZlbnQucG9pbnRlcklkLFxyXG4gICAgd2lkdGg6IGV2ZW50LndpZHRoLFxyXG4gICAgaGVpZ2h0OiBldmVudC5oZWlnaHQsXHJcbiAgICBwcmVzc3VyZTogZXZlbnQucHJlc3N1cmUsXHJcbiAgICB0aWx0WDogZXZlbnQudGlsdFgsXHJcbiAgICB0aWx0WTogZXZlbnQudGlsdFksXHJcbiAgICBwb2ludGVyVHlwZTogZXZlbnQucG9pbnRlclR5cGUsXHJcbiAgICBpc1ByaW1hcnk6IGV2ZW50LmlzUHJpbWFyeVxyXG4gIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlTW91c2VFdmVudChldmVudDogTW91c2VFdmVudCkge1xyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBldmVudC50eXBlLFxyXG4gICAgZGV0YWlsOiBldmVudC5kZXRhaWwsXHJcbiAgICBzY3JlZW5YOiBldmVudC5zY3JlZW5YLFxyXG4gICAgc2NyZWVuWTogZXZlbnQuc2NyZWVuWSxcclxuICAgIGNsaWVudFg6IGV2ZW50LmNsaWVudFgsXHJcbiAgICBjbGllbnRZOiBldmVudC5jbGllbnRZLFxyXG4gICAgYnV0dG9uOiBldmVudC5idXR0b24sXHJcbiAgICBidXR0b25zOiBldmVudC5idXR0b25zLFxyXG4gICAgY3RybEtleTogZXZlbnQuY3RybEtleSxcclxuICAgIHNoaWZ0S2V5OiBldmVudC5zaGlmdEtleSxcclxuICAgIGFsdEtleTogZXZlbnQuYWx0S2V5LFxyXG4gICAgbWV0YUtleTogZXZlbnQubWV0YUtleVxyXG4gIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzQ2hlY2tib3goZWxlbWVudDogRWxlbWVudCB8IG51bGwpIHtcclxuICByZXR1cm4gZWxlbWVudCAmJiBlbGVtZW50LnRhZ05hbWUgPT09ICdJTlBVVCcgJiYgZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ2NoZWNrYm94JztcclxufVxyXG5cclxuLy8gVGhlIGZvbGxvd2luZyBpbnRlcmZhY2VzIG11c3QgYmUga2VwdCBpbiBzeW5jIHdpdGggdGhlIFVJRXZlbnRBcmdzIEMjIGNsYXNzZXNcclxuXHJcbnR5cGUgRXZlbnRBcmdzVHlwZSA9ICdjaGFuZ2UnIHwgJ2NsaXBib2FyZCcgfCAnZHJhZycgfCAnZXJyb3InIHwgJ2ZvY3VzJyB8ICdrZXlib2FyZCcgfCAnbW91c2UnIHwgJ3BvaW50ZXInIHwgJ3Byb2dyZXNzJyB8ICd0b3VjaCcgfCAndW5rbm93bicgfCAnd2hlZWwnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBVSUV2ZW50QXJncyB7XHJcbiAgdHlwZTogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgVUlDaGFuZ2VFdmVudEFyZ3MgZXh0ZW5kcyBVSUV2ZW50QXJncyB7XHJcbiAgdmFsdWU6IHN0cmluZyB8IGJvb2xlYW47XHJcbn1cclxuXHJcbmludGVyZmFjZSBVSUNsaXBib2FyZEV2ZW50QXJncyBleHRlbmRzIFVJRXZlbnRBcmdzIHtcclxufVxyXG5cclxuaW50ZXJmYWNlIFVJRHJhZ0V2ZW50QXJncyBleHRlbmRzIFVJRXZlbnRBcmdzIHtcclxuICBkZXRhaWw6IG51bWJlcjtcclxuICBkYXRhVHJhbnNmZXI6IFVJRGF0YVRyYW5zZmVyO1xyXG4gIHNjcmVlblg6IG51bWJlcjtcclxuICBzY3JlZW5ZOiBudW1iZXI7XHJcbiAgY2xpZW50WDogbnVtYmVyO1xyXG4gIGNsaWVudFk6IG51bWJlcjtcclxuICBidXR0b246IG51bWJlcjtcclxuICBidXR0b25zOiBudW1iZXI7XHJcbiAgY3RybEtleTogYm9vbGVhbjtcclxuICBzaGlmdEtleTogYm9vbGVhbjtcclxuICBhbHRLZXk6IGJvb2xlYW47XHJcbiAgbWV0YUtleTogYm9vbGVhbjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFVJRGF0YVRyYW5zZmVyIHtcclxuICBkcm9wRWZmZWN0OiBzdHJpbmc7XHJcbiAgZWZmZWN0QWxsb3dlZDogc3RyaW5nO1xyXG4gIGZpbGVzOiBzdHJpbmdbXTtcclxuICBpdGVtczogVUlEYXRhVHJhbnNmZXJJdGVtW107XHJcbiAgdHlwZXM6IHN0cmluZ1tdO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgVUlEYXRhVHJhbnNmZXJJdGVtIHtcclxuICBraW5kOiBzdHJpbmc7XHJcbiAgdHlwZTogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgVUlFcnJvckV2ZW50QXJncyBleHRlbmRzIFVJUHJvZ3Jlc3NFdmVudEFyZ3Mge1xyXG59XHJcblxyXG5pbnRlcmZhY2UgVUlGb2N1c0V2ZW50QXJncyBleHRlbmRzIFVJRXZlbnRBcmdzIHtcclxufVxyXG5cclxuaW50ZXJmYWNlIFVJS2V5Ym9hcmRFdmVudEFyZ3MgZXh0ZW5kcyBVSUV2ZW50QXJncyB7XHJcbiAga2V5OiBzdHJpbmc7XHJcbiAgY29kZTogc3RyaW5nO1xyXG4gIGxvY2F0aW9uOiBudW1iZXI7XHJcbiAgcmVwZWF0OiBib29sZWFuO1xyXG4gIGN0cmxLZXk6IGJvb2xlYW47XHJcbiAgc2hpZnRLZXk6IGJvb2xlYW47XHJcbiAgYWx0S2V5OiBib29sZWFuO1xyXG4gIG1ldGFLZXk6IGJvb2xlYW47XHJcbn1cclxuXHJcbmludGVyZmFjZSBVSU1vdXNlRXZlbnRBcmdzIGV4dGVuZHMgVUlFdmVudEFyZ3Mge1xyXG4gIGRldGFpbDogbnVtYmVyO1xyXG4gIHNjcmVlblg6IG51bWJlcjtcclxuICBzY3JlZW5ZOiBudW1iZXI7XHJcbiAgY2xpZW50WDogbnVtYmVyO1xyXG4gIGNsaWVudFk6IG51bWJlcjtcclxuICBidXR0b246IG51bWJlcjtcclxuICBidXR0b25zOiBudW1iZXI7XHJcbiAgY3RybEtleTogYm9vbGVhbjtcclxuICBzaGlmdEtleTogYm9vbGVhbjtcclxuICBhbHRLZXk6IGJvb2xlYW47XHJcbiAgbWV0YUtleTogYm9vbGVhbjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFVJUG9pbnRlckV2ZW50QXJncyBleHRlbmRzIFVJTW91c2VFdmVudEFyZ3Mge1xyXG4gIHBvaW50ZXJJZDogbnVtYmVyO1xyXG4gIHdpZHRoOiBudW1iZXI7XHJcbiAgaGVpZ2h0OiBudW1iZXI7XHJcbiAgcHJlc3N1cmU6IG51bWJlcjtcclxuICB0aWx0WDogbnVtYmVyO1xyXG4gIHRpbHRZOiBudW1iZXI7XHJcbiAgcG9pbnRlclR5cGU6IHN0cmluZztcclxuICBpc1ByaW1hcnk6IGJvb2xlYW47XHJcbn1cclxuXHJcbmludGVyZmFjZSBVSVByb2dyZXNzRXZlbnRBcmdzIGV4dGVuZHMgVUlFdmVudEFyZ3Mge1xyXG4gIGxlbmd0aENvbXB1dGFibGU6IGJvb2xlYW47XHJcbiAgbG9hZGVkOiBudW1iZXI7XHJcbiAgdG90YWw6IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFVJVG91Y2hFdmVudEFyZ3MgZXh0ZW5kcyBVSUV2ZW50QXJncyB7XHJcbiAgZGV0YWlsOiBudW1iZXI7XHJcbiAgdG91Y2hlczogVUlUb3VjaFBvaW50W107XHJcbiAgdGFyZ2V0VG91Y2hlczogVUlUb3VjaFBvaW50W107XHJcbiAgY2hhbmdlZFRvdWNoZXM6IFVJVG91Y2hQb2ludFtdO1xyXG4gIGN0cmxLZXk6IGJvb2xlYW47XHJcbiAgc2hpZnRLZXk6IGJvb2xlYW47XHJcbiAgYWx0S2V5OiBib29sZWFuO1xyXG4gIG1ldGFLZXk6IGJvb2xlYW47XHJcbn1cclxuXHJcbmludGVyZmFjZSBVSVRvdWNoUG9pbnQge1xyXG4gIGlkZW50aWZpZXI6IG51bWJlcjtcclxuICBzY3JlZW5YOiBudW1iZXI7XHJcbiAgc2NyZWVuWTogbnVtYmVyO1xyXG4gIGNsaWVudFg6IG51bWJlcjtcclxuICBjbGllbnRZOiBudW1iZXI7XHJcbiAgcGFnZVg6IG51bWJlcjtcclxuICBwYWdlWTogbnVtYmVyO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgVUlXaGVlbEV2ZW50QXJncyBleHRlbmRzIFVJTW91c2VFdmVudEFyZ3Mge1xyXG4gIGRlbHRhWDogbnVtYmVyO1xyXG4gIGRlbHRhWTogbnVtYmVyO1xyXG4gIGRlbHRhWjogbnVtYmVyO1xyXG4gIGRlbHRhTW9kZTogbnVtYmVyO1xyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9SZW5kZXJpbmcvRXZlbnRGb3JEb3ROZXQudHMiLCIvKlxyXG4gIEEgTG9naWNhbEVsZW1lbnQgcGxheXMgdGhlIHNhbWUgcm9sZSBhcyBhbiBFbGVtZW50IGluc3RhbmNlIGZyb20gdGhlIHBvaW50IG9mIHZpZXcgb2YgdGhlXHJcbiAgQVBJIGNvbnN1bWVyLiBJbnNlcnRpbmcgYW5kIHJlbW92aW5nIGxvZ2ljYWwgZWxlbWVudHMgdXBkYXRlcyB0aGUgYnJvd3NlciBET00ganVzdCB0aGUgc2FtZS5cclxuXHJcbiAgVGhlIGRpZmZlcmVuY2UgaXMgdGhhdCwgdW5saWtlIHJlZ3VsYXIgRE9NIG11dGF0aW9uIEFQSXMsIHRoZSBMb2dpY2FsRWxlbWVudCBBUElzIGRvbid0IHVzZVxyXG4gIHRoZSB1bmRlcmx5aW5nIERPTSBzdHJ1Y3R1cmUgYXMgdGhlIGRhdGEgc3RvcmFnZSBmb3IgdGhlIGVsZW1lbnQgaGllcmFyY2h5LiBJbnN0ZWFkLCB0aGVcclxuICBMb2dpY2FsRWxlbWVudCBBUElzIHRha2UgY2FyZSBvZiB0cmFja2luZyBoaWVyYXJjaGljYWwgcmVsYXRpb25zaGlwcyBzZXBhcmF0ZWx5LiBUaGUgcG9pbnRcclxuICBvZiB0aGlzIGlzIHRvIHBlcm1pdCBhIGxvZ2ljYWwgdHJlZSBzdHJ1Y3R1cmUgaW4gd2hpY2ggcGFyZW50L2NoaWxkIHJlbGF0aW9uc2hpcHMgZG9uJ3RcclxuICBoYXZlIHRvIGJlIG1hdGVyaWFsaXplZCBpbiB0ZXJtcyBvZiBET00gZWxlbWVudCBwYXJlbnQvY2hpbGQgcmVsYXRpb25zaGlwcy4gQW5kIHRoZSByZWFzb25cclxuICB3aHkgd2Ugd2FudCB0aGF0IGlzIHNvIHRoYXQgaGllcmFyY2hpZXMgb2YgQmxhem9yIGNvbXBvbmVudHMgY2FuIGJlIHRyYWNrZWQgZXZlbiB3aGVuIHRob3NlXHJcbiAgY29tcG9uZW50cycgcmVuZGVyIG91dHB1dCBuZWVkIG5vdCBiZSBhIHNpbmdsZSBsaXRlcmFsIERPTSBlbGVtZW50LlxyXG5cclxuICBDb25zdW1lcnMgb2YgdGhlIEFQSSBkb24ndCBuZWVkIHRvIGtub3cgYWJvdXQgdGhlIGltcGxlbWVudGF0aW9uLCBidXQgaG93IGl0J3MgZG9uZSBpczpcclxuICAtIEVhY2ggTG9naWNhbEVsZW1lbnQgaXMgbWF0ZXJpYWxpemVkIGluIHRoZSBET00gYXMgZWl0aGVyOlxyXG4gICAgLSBBIE5vZGUgaW5zdGFuY2UsIGZvciBhY3R1YWwgTm9kZSBpbnN0YW5jZXMgaW5zZXJ0ZWQgdXNpbmcgJ2luc2VydExvZ2ljYWxDaGlsZCcgb3JcclxuICAgICAgZm9yIEVsZW1lbnQgaW5zdGFuY2VzIHByb21vdGVkIHRvIExvZ2ljYWxFbGVtZW50IHZpYSAndG9Mb2dpY2FsRWxlbWVudCdcclxuICAgIC0gQSBDb21tZW50IGluc3RhbmNlLCBmb3IgJ2xvZ2ljYWwgY29udGFpbmVyJyBpbnN0YW5jZXMgaW5zZXJ0ZWQgdXNpbmcgJ2NyZWF0ZUFuZEluc2VydExvZ2ljYWxDb250YWluZXInXHJcbiAgLSBUaGVuLCBvbiB0aGF0IGluc3RhbmNlIChpLmUuLCB0aGUgTm9kZSBvciBDb21tZW50KSwgd2Ugc3RvcmUgYW4gYXJyYXkgb2YgJ2xvZ2ljYWwgY2hpbGRyZW4nXHJcbiAgICBpbnN0YW5jZXMsIGUuZy4sXHJcbiAgICAgIFtmaXJzdENoaWxkLCBzZWNvbmRDaGlsZCwgdGhpcmRDaGlsZCwgLi4uXVxyXG4gICAgLi4uIHBsdXMgd2Ugc3RvcmUgYSByZWZlcmVuY2UgdG8gdGhlICdsb2dpY2FsIHBhcmVudCcgKGlmIGFueSlcclxuICAtIFRoZSAnbG9naWNhbCBjaGlsZHJlbicgYXJyYXkgbWVhbnMgd2UgY2FuIGxvb2sgdXAgaW4gTygxKTpcclxuICAgIC0gVGhlIG51bWJlciBvZiBsb2dpY2FsIGNoaWxkcmVuIChub3QgY3VycmVudGx5IGltcGxlbWVudGVkIGJlY2F1c2Ugbm90IHJlcXVpcmVkLCBidXQgdHJpdmlhbClcclxuICAgIC0gVGhlIGxvZ2ljYWwgY2hpbGQgYXQgYW55IGdpdmVuIGluZGV4XHJcbiAgLSBXaGVuZXZlciBhIGxvZ2ljYWwgY2hpbGQgaXMgYWRkZWQgb3IgcmVtb3ZlZCwgd2UgdXBkYXRlIHRoZSBwYXJlbnQncyBhcnJheSBvZiBsb2dpY2FsIGNoaWxkcmVuXHJcbiovXHJcblxyXG5jb25zdCBsb2dpY2FsQ2hpbGRyZW5Qcm9wbmFtZSA9IGNyZWF0ZVN5bWJvbE9yRmFsbGJhY2soJ19ibGF6b3JMb2dpY2FsQ2hpbGRyZW4nKTtcclxuY29uc3QgbG9naWNhbFBhcmVudFByb3BuYW1lID0gY3JlYXRlU3ltYm9sT3JGYWxsYmFjaygnX2JsYXpvckxvZ2ljYWxQYXJlbnQnKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0b0xvZ2ljYWxFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQpIHtcclxuICBpZiAoZWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignTmV3IGxvZ2ljYWwgZWxlbWVudHMgbXVzdCBzdGFydCBlbXB0eScpO1xyXG4gIH1cclxuXHJcbiAgZWxlbWVudFtsb2dpY2FsQ2hpbGRyZW5Qcm9wbmFtZV0gPSBbXTtcclxuICByZXR1cm4gZWxlbWVudCBhcyBhbnkgYXMgTG9naWNhbEVsZW1lbnQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBbmRJbnNlcnRMb2dpY2FsQ29udGFpbmVyKHBhcmVudDogTG9naWNhbEVsZW1lbnQsIGNoaWxkSW5kZXg6IG51bWJlcik6IExvZ2ljYWxFbGVtZW50IHtcclxuICBjb25zdCBjb250YWluZXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgnIScpO1xyXG4gIGluc2VydExvZ2ljYWxDaGlsZChjb250YWluZXJFbGVtZW50LCBwYXJlbnQsIGNoaWxkSW5kZXgpO1xyXG4gIHJldHVybiBjb250YWluZXJFbGVtZW50IGFzIGFueSBhcyBMb2dpY2FsRWxlbWVudDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGluc2VydExvZ2ljYWxDaGlsZChjaGlsZDogTm9kZSwgcGFyZW50OiBMb2dpY2FsRWxlbWVudCwgY2hpbGRJbmRleDogbnVtYmVyKSB7XHJcbiAgY29uc3QgY2hpbGRBc0xvZ2ljYWxFbGVtZW50ID0gY2hpbGQgYXMgYW55IGFzIExvZ2ljYWxFbGVtZW50O1xyXG4gIGlmIChjaGlsZCBpbnN0YW5jZW9mIENvbW1lbnQpIHtcclxuICAgIGNvbnN0IGV4aXN0aW5nR3JhbmRjaGlsZHJlbiA9IGdldExvZ2ljYWxDaGlsZHJlbkFycmF5KGNoaWxkQXNMb2dpY2FsRWxlbWVudCk7XHJcbiAgICBpZiAoZXhpc3RpbmdHcmFuZGNoaWxkcmVuICYmIGdldExvZ2ljYWxDaGlsZHJlbkFycmF5KGNoaWxkQXNMb2dpY2FsRWxlbWVudCkubGVuZ3RoID4gMCkge1xyXG4gICAgICAvLyBUaGVyZSdzIG5vdGhpbmcgdG8gc3RvcCB1cyBpbXBsZW1lbnRpbmcgc3VwcG9ydCBmb3IgdGhpcyBzY2VuYXJpbywgYW5kIGl0J3Mgbm90IGRpZmZpY3VsdFxyXG4gICAgICAvLyAoYWZ0ZXIgaW5zZXJ0aW5nICdjaGlsZCcgaXRzZWxmLCBhbHNvIGl0ZXJhdGUgdGhyb3VnaCBpdHMgbG9naWNhbCBjaGlsZHJlbiBhbmQgcGh5c2ljYWxseVxyXG4gICAgICAvLyBwdXQgdGhlbSBhcyBmb2xsb3dpbmctc2libGluZ3MgaW4gdGhlIERPTSkuIEhvd2V2ZXIgdGhlcmUncyBubyBzY2VuYXJpbyB0aGF0IHJlcXVpcmVzIGl0XHJcbiAgICAgIC8vIHByZXNlbnRseSwgc28gaWYgd2UgZGlkIGltcGxlbWVudCBpdCB0aGVyZSdkIGJlIG5vIGdvb2Qgd2F5IHRvIGhhdmUgdGVzdHMgZm9yIGl0LlxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZDogaW5zZXJ0aW5nIG5vbi1lbXB0eSBsb2dpY2FsIGNvbnRhaW5lcicpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKGdldExvZ2ljYWxQYXJlbnQoY2hpbGRBc0xvZ2ljYWxFbGVtZW50KSkge1xyXG4gICAgLy8gTGlrZXdpc2UsIHdlIGNvdWxkIGVhc2lseSBzdXBwb3J0IHRoaXMgc2NlbmFyaW8gdG9vIChpbiB0aGlzICdpZicgYmxvY2ssIGp1c3Qgc3BsaWNlXHJcbiAgICAvLyBvdXQgJ2NoaWxkJyBmcm9tIHRoZSBsb2dpY2FsIGNoaWxkcmVuIGFycmF5IG9mIGl0cyBwcmV2aW91cyBsb2dpY2FsIHBhcmVudCBieSB1c2luZ1xyXG4gICAgLy8gQXJyYXkucHJvdG90eXBlLmluZGV4T2YgdG8gZGV0ZXJtaW5lIGl0cyBwcmV2aW91cyBzaWJsaW5nIGluZGV4KS5cclxuICAgIC8vIEJ1dCBhZ2Fpbiwgc2luY2UgdGhlcmUncyBub3QgY3VycmVudGx5IGFueSBzY2VuYXJpbyB0aGF0IHdvdWxkIHVzZSBpdCwgd2Ugd291bGQgbm90XHJcbiAgICAvLyBoYXZlIGFueSB0ZXN0IGNvdmVyYWdlIGZvciBzdWNoIGFuIGltcGxlbWVudGF0aW9uLlxyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQ6IG1vdmluZyBleGlzdGluZyBsb2dpY2FsIGNoaWxkcmVuJyk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBuZXdTaWJsaW5ncyA9IGdldExvZ2ljYWxDaGlsZHJlbkFycmF5KHBhcmVudCk7XHJcbiAgaWYgKGNoaWxkSW5kZXggPCBuZXdTaWJsaW5ncy5sZW5ndGgpIHtcclxuICAgIC8vIEluc2VydFxyXG4gICAgY29uc3QgbmV4dFNpYmxpbmcgPSBuZXdTaWJsaW5nc1tjaGlsZEluZGV4XSBhcyBhbnkgYXMgTm9kZTtcclxuICAgIG5leHRTaWJsaW5nLnBhcmVudE5vZGUhLmluc2VydEJlZm9yZShjaGlsZCwgbmV4dFNpYmxpbmcpO1xyXG4gICAgbmV3U2libGluZ3Muc3BsaWNlKGNoaWxkSW5kZXgsIDAsIGNoaWxkQXNMb2dpY2FsRWxlbWVudCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIEFwcGVuZFxyXG4gICAgYXBwZW5kRG9tTm9kZShjaGlsZCwgcGFyZW50KTtcclxuICAgIG5ld1NpYmxpbmdzLnB1c2goY2hpbGRBc0xvZ2ljYWxFbGVtZW50KTtcclxuICB9XHJcblxyXG4gIGNoaWxkQXNMb2dpY2FsRWxlbWVudFtsb2dpY2FsUGFyZW50UHJvcG5hbWVdID0gcGFyZW50O1xyXG4gIGlmICghKGxvZ2ljYWxDaGlsZHJlblByb3BuYW1lIGluIGNoaWxkQXNMb2dpY2FsRWxlbWVudCkpIHtcclxuICAgIGNoaWxkQXNMb2dpY2FsRWxlbWVudFtsb2dpY2FsQ2hpbGRyZW5Qcm9wbmFtZV0gPSBbXTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVMb2dpY2FsQ2hpbGQocGFyZW50OiBMb2dpY2FsRWxlbWVudCwgY2hpbGRJbmRleDogbnVtYmVyKSB7XHJcbiAgY29uc3QgY2hpbGRyZW5BcnJheSA9IGdldExvZ2ljYWxDaGlsZHJlbkFycmF5KHBhcmVudCk7XHJcbiAgY29uc3QgY2hpbGRUb1JlbW92ZSA9IGNoaWxkcmVuQXJyYXkuc3BsaWNlKGNoaWxkSW5kZXgsIDEpWzBdO1xyXG5cclxuICAvLyBJZiBpdCdzIGEgbG9naWNhbCBjb250YWluZXIsIGFsc28gcmVtb3ZlIGl0cyBkZXNjZW5kYW50c1xyXG4gIGlmIChjaGlsZFRvUmVtb3ZlIGluc3RhbmNlb2YgQ29tbWVudCkge1xyXG4gICAgY29uc3QgZ3JhbmRjaGlsZHJlbkFycmF5ID0gZ2V0TG9naWNhbENoaWxkcmVuQXJyYXkoY2hpbGRUb1JlbW92ZSk7XHJcbiAgICB3aGlsZSAoZ3JhbmRjaGlsZHJlbkFycmF5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgcmVtb3ZlTG9naWNhbENoaWxkKGNoaWxkVG9SZW1vdmUsIDApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gRmluYWxseSwgcmVtb3ZlIHRoZSBub2RlIGl0c2VsZlxyXG4gIGNvbnN0IGRvbU5vZGVUb1JlbW92ZSA9IGNoaWxkVG9SZW1vdmUgYXMgYW55IGFzIE5vZGU7XHJcbiAgZG9tTm9kZVRvUmVtb3ZlLnBhcmVudE5vZGUhLnJlbW92ZUNoaWxkKGRvbU5vZGVUb1JlbW92ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRMb2dpY2FsUGFyZW50KGVsZW1lbnQ6IExvZ2ljYWxFbGVtZW50KTogTG9naWNhbEVsZW1lbnQgfCBudWxsIHtcclxuICByZXR1cm4gKGVsZW1lbnRbbG9naWNhbFBhcmVudFByb3BuYW1lXSBhcyBMb2dpY2FsRWxlbWVudCkgfHwgbnVsbDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldExvZ2ljYWxDaGlsZChwYXJlbnQ6IExvZ2ljYWxFbGVtZW50LCBjaGlsZEluZGV4OiBudW1iZXIpOiBMb2dpY2FsRWxlbWVudCB7XHJcbiAgcmV0dXJuIGdldExvZ2ljYWxDaGlsZHJlbkFycmF5KHBhcmVudClbY2hpbGRJbmRleF07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1N2Z0VsZW1lbnQoZWxlbWVudDogTG9naWNhbEVsZW1lbnQpIHtcclxuICByZXR1cm4gZ2V0Q2xvc2VzdERvbUVsZW1lbnQoZWxlbWVudCkubmFtZXNwYWNlVVJJID09PSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRMb2dpY2FsQ2hpbGRyZW5BcnJheShlbGVtZW50OiBMb2dpY2FsRWxlbWVudCkge1xyXG4gIHJldHVybiBlbGVtZW50W2xvZ2ljYWxDaGlsZHJlblByb3BuYW1lXSBhcyBMb2dpY2FsRWxlbWVudFtdO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRMb2dpY2FsTmV4dFNpYmxpbmcoZWxlbWVudDogTG9naWNhbEVsZW1lbnQpOiBMb2dpY2FsRWxlbWVudCB8IG51bGwge1xyXG4gIGNvbnN0IHNpYmxpbmdzID0gZ2V0TG9naWNhbENoaWxkcmVuQXJyYXkoZ2V0TG9naWNhbFBhcmVudChlbGVtZW50KSEpO1xyXG4gIGNvbnN0IHNpYmxpbmdJbmRleCA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoc2libGluZ3MsIGVsZW1lbnQpO1xyXG4gIHJldHVybiBzaWJsaW5nc1tzaWJsaW5nSW5kZXggKyAxXSB8fCBudWxsO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDbG9zZXN0RG9tRWxlbWVudChsb2dpY2FsRWxlbWVudDogTG9naWNhbEVsZW1lbnQpIHtcclxuICBpZiAobG9naWNhbEVsZW1lbnQgaW5zdGFuY2VvZiBFbGVtZW50KSB7XHJcbiAgICByZXR1cm4gbG9naWNhbEVsZW1lbnQ7XHJcbiAgfSBlbHNlIGlmIChsb2dpY2FsRWxlbWVudCBpbnN0YW5jZW9mIENvbW1lbnQpIHtcclxuICAgIHJldHVybiBsb2dpY2FsRWxlbWVudC5wYXJlbnROb2RlISBhcyBFbGVtZW50O1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBhIHZhbGlkIGxvZ2ljYWwgZWxlbWVudCcpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gYXBwZW5kRG9tTm9kZShjaGlsZDogTm9kZSwgcGFyZW50OiBMb2dpY2FsRWxlbWVudCkge1xyXG4gIC8vIFRoaXMgZnVuY3Rpb24gb25seSBwdXRzICdjaGlsZCcgaW50byB0aGUgRE9NIGluIHRoZSByaWdodCBwbGFjZSByZWxhdGl2ZSB0byAncGFyZW50J1xyXG4gIC8vIEl0IGRvZXMgbm90IHVwZGF0ZSB0aGUgbG9naWNhbCBjaGlsZHJlbiBhcnJheSBvZiBhbnl0aGluZ1xyXG4gIGlmIChwYXJlbnQgaW5zdGFuY2VvZiBFbGVtZW50KSB7XHJcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xyXG4gIH0gZWxzZSBpZiAocGFyZW50IGluc3RhbmNlb2YgQ29tbWVudCkge1xyXG4gICAgY29uc3QgcGFyZW50TG9naWNhbE5leHRTaWJsaW5nID0gZ2V0TG9naWNhbE5leHRTaWJsaW5nKHBhcmVudCkgYXMgYW55IGFzIE5vZGU7XHJcbiAgICBpZiAocGFyZW50TG9naWNhbE5leHRTaWJsaW5nKSB7XHJcbiAgICAgIC8vIFNpbmNlIHRoZSBwYXJlbnQgaGFzIGEgbG9naWNhbCBuZXh0LXNpYmxpbmcsIGl0cyBhcHBlbmRlZCBjaGlsZCBnb2VzIHJpZ2h0IGJlZm9yZSB0aGF0XHJcbiAgICAgIHBhcmVudExvZ2ljYWxOZXh0U2libGluZy5wYXJlbnROb2RlIS5pbnNlcnRCZWZvcmUoY2hpbGQsIHBhcmVudExvZ2ljYWxOZXh0U2libGluZyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBTaW5jZSB0aGUgcGFyZW50IGhhcyBubyBsb2dpY2FsIG5leHQtc2libGluZywga2VlcCByZWN1cnNpbmcgdXB3YXJkcyB1bnRpbCB3ZSBmaW5kXHJcbiAgICAgIC8vIGEgbG9naWNhbCBhbmNlc3RvciB0aGF0IGRvZXMgaGF2ZSBhIG5leHQtc2libGluZyBvciBpcyBhIHBoeXNpY2FsIGVsZW1lbnQuXHJcbiAgICAgIGFwcGVuZERvbU5vZGUoY2hpbGQsIGdldExvZ2ljYWxQYXJlbnQocGFyZW50KSEpO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBTaG91bGQgbmV2ZXIgaGFwcGVuXHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBhcHBlbmQgbm9kZSBiZWNhdXNlIHRoZSBwYXJlbnQgaXMgbm90IGEgdmFsaWQgbG9naWNhbCBlbGVtZW50LiBQYXJlbnQ6ICR7cGFyZW50fWApO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlU3ltYm9sT3JGYWxsYmFjayhmYWxsYmFjazogc3RyaW5nKTogc3ltYm9sIHwgc3RyaW5nIHtcclxuICByZXR1cm4gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyA/IFN5bWJvbCgpIDogZmFsbGJhY2s7XHJcbn1cclxuXHJcbi8vIE5vbWluYWwgdHlwZSB0byByZXByZXNlbnQgYSBsb2dpY2FsIGVsZW1lbnQgd2l0aG91dCBuZWVkaW5nIHRvIGFsbG9jYXRlIGFueSBvYmplY3QgZm9yIGluc3RhbmNlc1xyXG5leHBvcnQgaW50ZXJmYWNlIExvZ2ljYWxFbGVtZW50IHsgTG9naWNhbEVsZW1lbnRfX0RPX05PVF9JTVBMRU1FTlQ6IGFueSB9O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUmVuZGVyaW5nL0xvZ2ljYWxFbGVtZW50cy50cyIsImltcG9ydCB7IHJlZ2lzdGVyRnVuY3Rpb24gfSBmcm9tICcuLi9JbnRlcm9wL1JlZ2lzdGVyZWRGdW5jdGlvbic7XHJcbmltcG9ydCB7IHBsYXRmb3JtIH0gZnJvbSAnLi4vRW52aXJvbm1lbnQnO1xyXG5pbXBvcnQgeyBNZXRob2RIYW5kbGUsIFN5c3RlbV9TdHJpbmcsIFN5c3RlbV9BcnJheSB9IGZyb20gJy4uL1BsYXRmb3JtL1BsYXRmb3JtJztcclxuY29uc3QgaHR0cENsaWVudEFzc2VtYmx5ID0gJ01pY3Jvc29mdC5Bc3BOZXRDb3JlLkJsYXpvci5Ccm93c2VyJztcclxuY29uc3QgaHR0cENsaWVudE5hbWVzcGFjZSA9IGAke2h0dHBDbGllbnRBc3NlbWJseX0uSHR0cGA7XHJcbmNvbnN0IGh0dHBDbGllbnRUeXBlTmFtZSA9ICdCcm93c2VySHR0cE1lc3NhZ2VIYW5kbGVyJztcclxuY29uc3QgaHR0cENsaWVudEZ1bGxUeXBlTmFtZSA9IGAke2h0dHBDbGllbnROYW1lc3BhY2V9LiR7aHR0cENsaWVudFR5cGVOYW1lfWA7XHJcbmxldCByZWNlaXZlUmVzcG9uc2VNZXRob2Q6IE1ldGhvZEhhbmRsZTtcclxubGV0IGFsbG9jYXRlQXJyYXlNZXRob2Q6IE1ldGhvZEhhbmRsZTtcclxuXHJcbnJlZ2lzdGVyRnVuY3Rpb24oYCR7aHR0cENsaWVudEZ1bGxUeXBlTmFtZX0uU2VuZGAsIChpZDogbnVtYmVyLCBib2R5OiBTeXN0ZW1fQXJyYXk8YW55PiwganNvbkZldGNoQXJnczogU3lzdGVtX1N0cmluZykgPT4ge1xyXG4gIHNlbmRBc3luYyhpZCwgYm9keSwganNvbkZldGNoQXJncyk7XHJcbn0pO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gc2VuZEFzeW5jKGlkOiBudW1iZXIsIGJvZHk6IFN5c3RlbV9BcnJheTxhbnk+LCBqc29uRmV0Y2hBcmdzOiBTeXN0ZW1fU3RyaW5nKSB7XHJcbiAgbGV0IHJlc3BvbnNlOiBSZXNwb25zZTtcclxuICBsZXQgcmVzcG9uc2VEYXRhOiBBcnJheUJ1ZmZlcjtcclxuXHJcbiAgY29uc3QgZmV0Y2hPcHRpb25zOiBGZXRjaE9wdGlvbnMgPSBKU09OLnBhcnNlKHBsYXRmb3JtLnRvSmF2YVNjcmlwdFN0cmluZyhqc29uRmV0Y2hBcmdzKSk7XHJcbiAgY29uc3QgcmVxdWVzdEluaXQ6IFJlcXVlc3RJbml0ID0gT2JqZWN0LmFzc2lnbihmZXRjaE9wdGlvbnMucmVxdWVzdEluaXQsIGZldGNoT3B0aW9ucy5yZXF1ZXN0SW5pdE92ZXJyaWRlcyk7XHJcblxyXG4gIGlmIChib2R5KSB7XHJcbiAgICByZXF1ZXN0SW5pdC5ib2R5ID0gcGxhdGZvcm0udG9VaW50OEFycmF5KGJvZHkpO1xyXG4gIH1cclxuXHJcbiAgdHJ5IHtcclxuICAgIHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goZmV0Y2hPcHRpb25zLnJlcXVlc3RVcmksIHJlcXVlc3RJbml0KTtcclxuICAgIHJlc3BvbnNlRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmFycmF5QnVmZmVyKCk7XHJcbiAgfSBjYXRjaCAoZXgpIHtcclxuICAgIGRpc3BhdGNoRXJyb3JSZXNwb25zZShpZCwgZXgudG9TdHJpbmcoKSk7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBkaXNwYXRjaFN1Y2Nlc3NSZXNwb25zZShpZCwgcmVzcG9uc2UsIHJlc3BvbnNlRGF0YSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpc3BhdGNoU3VjY2Vzc1Jlc3BvbnNlKGlkOiBudW1iZXIsIHJlc3BvbnNlOiBSZXNwb25zZSwgcmVzcG9uc2VEYXRhOiBBcnJheUJ1ZmZlcikge1xyXG4gIGNvbnN0IHJlc3BvbnNlRGVzY3JpcHRvcjogUmVzcG9uc2VEZXNjcmlwdG9yID0ge1xyXG4gICAgc3RhdHVzQ29kZTogcmVzcG9uc2Uuc3RhdHVzLFxyXG4gICAgc3RhdHVzVGV4dDogcmVzcG9uc2Uuc3RhdHVzVGV4dCxcclxuICAgIGhlYWRlcnM6IFtdXHJcbiAgfTtcclxuICByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHZhbHVlLCBuYW1lKSA9PiB7XHJcbiAgICByZXNwb25zZURlc2NyaXB0b3IuaGVhZGVycy5wdXNoKFtuYW1lLCB2YWx1ZV0pO1xyXG4gIH0pO1xyXG5cclxuICBpZiAoIWFsbG9jYXRlQXJyYXlNZXRob2QpIHtcclxuICAgIGFsbG9jYXRlQXJyYXlNZXRob2QgPSBwbGF0Zm9ybS5maW5kTWV0aG9kKFxyXG4gICAgICBodHRwQ2xpZW50QXNzZW1ibHksXHJcbiAgICAgIGh0dHBDbGllbnROYW1lc3BhY2UsXHJcbiAgICAgIGh0dHBDbGllbnRUeXBlTmFtZSxcclxuICAgICAgJ0FsbG9jYXRlQXJyYXknXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLy8gYWxsb2NhdGUgYSBtYW5hZ2VkIGJ5dGVbXSBvZiB0aGUgcmlnaHQgc2l6ZVxyXG4gIGNvbnN0IGRvdE5ldEFycmF5ID0gcGxhdGZvcm0uY2FsbE1ldGhvZChhbGxvY2F0ZUFycmF5TWV0aG9kLCBudWxsLCBbcGxhdGZvcm0udG9Eb3ROZXRTdHJpbmcocmVzcG9uc2VEYXRhLmJ5dGVMZW5ndGgudG9TdHJpbmcoKSldKSBhcyBTeXN0ZW1fQXJyYXk8YW55PjtcclxuXHJcbiAgLy8gZ2V0IGFuIFVpbnQ4QXJyYXkgdmlldyBvZiBpdFxyXG4gIGNvbnN0IGFycmF5ID0gcGxhdGZvcm0udG9VaW50OEFycmF5KGRvdE5ldEFycmF5KTtcclxuXHJcbiAgLy8gY29weSB0aGUgcmVzcG9uc2VEYXRhIHRvIG91ciBtYW5hZ2VkIGJ5dGVbXVxyXG4gIGFycmF5LnNldChuZXcgVWludDhBcnJheShyZXNwb25zZURhdGEpKTtcclxuXHJcbiAgZGlzcGF0Y2hSZXNwb25zZShcclxuICAgIGlkLFxyXG4gICAgcGxhdGZvcm0udG9Eb3ROZXRTdHJpbmcoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2VEZXNjcmlwdG9yKSksXHJcbiAgICBkb3ROZXRBcnJheSxcclxuICAgIC8qIGVycm9yTWVzc2FnZSAqLyBudWxsXHJcbiAgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGlzcGF0Y2hFcnJvclJlc3BvbnNlKGlkOiBudW1iZXIsIGVycm9yTWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgZGlzcGF0Y2hSZXNwb25zZShcclxuICAgIGlkLFxyXG4gICAgLyogcmVzcG9uc2VEZXNjcmlwdG9yICovIG51bGwsXHJcbiAgICAvKiByZXNwb25zZVRleHQgKi8gbnVsbCxcclxuICAgIHBsYXRmb3JtLnRvRG90TmV0U3RyaW5nKGVycm9yTWVzc2FnZSlcclxuICApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkaXNwYXRjaFJlc3BvbnNlKGlkOiBudW1iZXIsIHJlc3BvbnNlRGVzY3JpcHRvcjogU3lzdGVtX1N0cmluZyB8IG51bGwsIHJlc3BvbnNlRGF0YTogU3lzdGVtX0FycmF5PGFueT4gfCBudWxsLCBlcnJvck1lc3NhZ2U6IFN5c3RlbV9TdHJpbmcgfCBudWxsKSB7XHJcbiAgaWYgKCFyZWNlaXZlUmVzcG9uc2VNZXRob2QpIHtcclxuICAgIHJlY2VpdmVSZXNwb25zZU1ldGhvZCA9IHBsYXRmb3JtLmZpbmRNZXRob2QoXHJcbiAgICAgIGh0dHBDbGllbnRBc3NlbWJseSxcclxuICAgICAgaHR0cENsaWVudE5hbWVzcGFjZSxcclxuICAgICAgaHR0cENsaWVudFR5cGVOYW1lLFxyXG4gICAgICAnUmVjZWl2ZVJlc3BvbnNlJ1xyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHBsYXRmb3JtLmNhbGxNZXRob2QocmVjZWl2ZVJlc3BvbnNlTWV0aG9kLCBudWxsLCBbXHJcbiAgICBwbGF0Zm9ybS50b0RvdE5ldFN0cmluZyhpZC50b1N0cmluZygpKSxcclxuICAgIHJlc3BvbnNlRGVzY3JpcHRvcixcclxuICAgIHJlc3BvbnNlRGF0YSxcclxuICAgIGVycm9yTWVzc2FnZSxcclxuICBdKTtcclxufVxyXG5cclxuLy8gS2VlcCB0aGVzZSBpbiBzeW5jIHdpdGggdGhlIC5ORVQgZXF1aXZhbGVudCBpbiBCcm93c2VySHR0cE1lc3NhZ2VIYW5kbGVyLmNzXHJcbmludGVyZmFjZSBGZXRjaE9wdGlvbnMge1xyXG4gIHJlcXVlc3RVcmk6IHN0cmluZztcclxuICByZXF1ZXN0SW5pdDogUmVxdWVzdEluaXQ7XHJcbiAgcmVxdWVzdEluaXRPdmVycmlkZXM6IFJlcXVlc3RJbml0O1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUmVzcG9uc2VEZXNjcmlwdG9yIHtcclxuICAvLyBXZSBkb24ndCBoYXZlIEJvZHlUZXh0IGluIGhlcmUgYmVjYXVzZSBpZiB3ZSBkaWQsIHRoZW4gaW4gdGhlIEpTT04tcmVzcG9uc2UgY2FzZSAod2hpY2hcclxuICAvLyBpcyB0aGUgbW9zdCBjb21tb24gY2FzZSksIHdlJ2QgYmUgZG91YmxlLWVuY29kaW5nIGl0LCBzaW5jZSB0aGUgZW50aXJlIFJlc3BvbnNlRGVzY3JpcHRvclxyXG4gIC8vIGFsc28gZ2V0cyBKU09OIGVuY29kZWQuIEl0IHdvdWxkIHdvcmsgYnV0IGlzIHR3aWNlIHRoZSBhbW91bnQgb2Ygc3RyaW5nIHByb2Nlc3NpbmcuXHJcbiAgc3RhdHVzQ29kZTogbnVtYmVyO1xyXG4gIHN0YXR1c1RleHQ6IHN0cmluZztcclxuICBoZWFkZXJzOiBzdHJpbmdbXVtdO1xyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9TZXJ2aWNlcy9IdHRwLnRzIiwiaW1wb3J0IHsgcGxhdGZvcm0gfSBmcm9tICcuL0Vudmlyb25tZW50J1xyXG5pbXBvcnQgeyByZWdpc3RlckZ1bmN0aW9uIH0gZnJvbSAnLi9JbnRlcm9wL1JlZ2lzdGVyZWRGdW5jdGlvbic7XHJcbmltcG9ydCB7IG5hdmlnYXRlVG8gfSBmcm9tICcuL1NlcnZpY2VzL1VyaUhlbHBlcic7XHJcblxyXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAvLyBXaGVuIHRoZSBsaWJyYXJ5IGlzIGxvYWRlZCBpbiBhIGJyb3dzZXIgdmlhIGEgPHNjcmlwdD4gZWxlbWVudCwgbWFrZSB0aGVcclxuICAvLyBmb2xsb3dpbmcgQVBJcyBhdmFpbGFibGUgaW4gZ2xvYmFsIHNjb3BlIGZvciBpbnZvY2F0aW9uIGZyb20gSlNcclxuICB3aW5kb3dbJ0JsYXpvciddID0ge1xyXG4gICAgcGxhdGZvcm0sXHJcbiAgICByZWdpc3RlckZ1bmN0aW9uLFxyXG4gICAgbmF2aWdhdGVUbyxcclxuICB9O1xyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9HbG9iYWxFeHBvcnRzLnRzIl0sInNvdXJjZVJvb3QiOiIifQ==