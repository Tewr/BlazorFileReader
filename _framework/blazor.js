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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MonoPlatform_1 = __webpack_require__(8);
exports.platform = MonoPlatform_1.monoPlatform;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var InternalRegisteredFunction_1 = __webpack_require__(9);
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
var Environment_1 = __webpack_require__(0);
function invokeDotNetMethod(methodOptions) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return invokeDotNetMethodCore.apply(void 0, [methodOptions, null].concat(args));
}
exports.invokeDotNetMethod = invokeDotNetMethod;
var registrations = {};
var findDotNetMethodHandle;
function getFindDotNetMethodHandle() {
    if (findDotNetMethodHandle === undefined) {
        findDotNetMethodHandle = Environment_1.platform.findMethod('Microsoft.AspNetCore.Blazor.Browser', 'Microsoft.AspNetCore.Blazor.Browser.Interop', 'InvokeDotNetFromJavaScript', 'FindDotNetMethod');
    }
    return findDotNetMethodHandle;
}
function resolveRegistration(methodOptions) {
    var findDotNetMethodHandle = getFindDotNetMethodHandle();
    var assemblyEntry = registrations[methodOptions.type.assembly];
    var typeEntry = assemblyEntry && assemblyEntry[methodOptions.type.name];
    var registration = typeEntry && typeEntry[methodOptions.method.name];
    if (registration !== undefined) {
        return registration;
    }
    else {
        var serializedOptions = Environment_1.platform.toDotNetString(JSON.stringify(methodOptions));
        var result = Environment_1.platform.callMethod(findDotNetMethodHandle, null, [serializedOptions]);
        var registration_1 = Environment_1.platform.toJavaScriptString(result);
        if (assemblyEntry === undefined) {
            var assembly = {};
            var type = {};
            registrations[methodOptions.type.assembly] = assembly;
            assembly[methodOptions.type.name] = type;
            type[methodOptions.method.name] = registration_1;
        }
        else if (typeEntry === undefined) {
            var type = {};
            assemblyEntry[methodOptions.type.name] = type;
            type[methodOptions.method.name] = registration_1;
        }
        else {
            typeEntry[methodOptions.method.name] = registration_1;
        }
        return registration_1;
    }
}
var invokeDotNetMethodHandle;
function getInvokeDotNetMethodHandle() {
    if (invokeDotNetMethodHandle === undefined) {
        invokeDotNetMethodHandle = Environment_1.platform.findMethod('Microsoft.AspNetCore.Blazor.Browser', 'Microsoft.AspNetCore.Blazor.Browser.Interop', 'InvokeDotNetFromJavaScript', 'InvokeDotNetMethod');
    }
    return invokeDotNetMethodHandle;
}
function invokeDotNetMethodCore(methodOptions, callbackId) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var invokeDotNetMethodHandle = getInvokeDotNetMethodHandle();
    var registration = resolveRegistration(methodOptions);
    var packedArgs = packArguments(args);
    var serializedCallback = callbackId != null ? Environment_1.platform.toDotNetString(callbackId) : null;
    var serializedArgs = Environment_1.platform.toDotNetString(JSON.stringify(packedArgs));
    var serializedRegistration = Environment_1.platform.toDotNetString(registration);
    var serializedResult = Environment_1.platform.callMethod(invokeDotNetMethodHandle, null, [serializedRegistration, serializedCallback, serializedArgs]);
    var result = JSON.parse(Environment_1.platform.toJavaScriptString(serializedResult));
    if (result.succeeded) {
        return result.result;
    }
    else {
        throw new Error(result.message);
    }
}
// We don't have to worry about overflows here. Number.MAX_SAFE_INTEGER in JS is 2^53-1
var globalId = 0;
function invokeDotNetMethodAsync(methodOptions) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var callbackId = (globalId++).toString();
    var result = new Promise(function (resolve, reject) {
        TrackedReference.track(callbackId, function (invocationResult) {
            // We got invoked, so we unregister ourselves.
            TrackedReference.untrack(callbackId);
            if (invocationResult.succeeded) {
                resolve(invocationResult.result);
            }
            else {
                reject(new Error(invocationResult.message));
            }
        });
    });
    invokeDotNetMethodCore.apply(void 0, [methodOptions, callbackId].concat(args));
    return result;
}
exports.invokeDotNetMethodAsync = invokeDotNetMethodAsync;
function invokePromiseCallback(id, invocationResult) {
    var callback = TrackedReference.get(id);
    callback.call(null, invocationResult);
}
exports.invokePromiseCallback = invokePromiseCallback;
function packArguments(args) {
    var result = {};
    if (args.length == 0) {
        return result;
    }
    if (args.length > 7) {
        for (var i = 0; i < 7; i++) {
            result["argument" + [i + 1]] = args[i];
        }
        result['argument8'] = packArguments(args.slice(7));
    }
    else {
        for (var i = 0; i < args.length; i++) {
            result["argument" + [i + 1]] = args[i];
        }
    }
    return result;
}
var TrackedReference = /** @class */ (function () {
    function TrackedReference() {
    }
    TrackedReference.track = function (id, trackedObject) {
        var refs = TrackedReference.references;
        if (refs[id] !== undefined) {
            throw new Error("An element with id '" + id + "' is already being tracked.");
        }
        refs[id] = trackedObject;
    };
    TrackedReference.untrack = function (id) {
        var refs = TrackedReference.references;
        var result = refs[id];
        if (result === undefined) {
            throw new Error("An element with id '" + id + "' is not being being tracked.");
        }
        refs[id] = undefined;
    };
    TrackedReference.get = function (id) {
        var refs = TrackedReference.references;
        var result = refs[id];
        if (result === undefined) {
            throw new Error("An element with id '" + id + "' is not being being tracked.");
        }
        return result;
    };
    TrackedReference.references = {};
    return TrackedReference;
}());


/***/ }),
/* 3 */
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
/* 4 */
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
var RenderBatch_1 = __webpack_require__(11);
var BrowserRenderer_1 = __webpack_require__(12);
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
/* 6 */
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
        // We must explicitly check if it has an 'href' attribute, because if it doesn't, the result might be null or an empty string depending on the browser
        var anchorTarget = findClosestAncestor(event.target, 'A');
        var hrefAttributeName = 'href';
        if (anchorTarget && anchorTarget.hasAttribute(hrefAttributeName)) {
            var href = anchorTarget.getAttribute(hrefAttributeName);
            var absoluteHref = toAbsoluteUri(href);
            // Don't stop ctrl/meta-click (etc) from opening links in new tabs/windows
            if (isWithinBaseUriSpace(absoluteHref) && !eventHasSpecialKey(event)) {
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
function eventHasSpecialKey(event) {
    return event.ctrlKey || event.shiftKey || event.altKey || event.metaKey;
}


/***/ }),
/* 7 */
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
var DotNet_1 = __webpack_require__(3);
__webpack_require__(5);
__webpack_require__(18);
__webpack_require__(6);
__webpack_require__(19);
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DotNet_1 = __webpack_require__(3);
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var InvokeJavaScriptFunctionWithJsonMarshalling_1 = __webpack_require__(10);
var InvokeDotNetMethodWithJsonMarshalling_1 = __webpack_require__(2);
var Renderer_1 = __webpack_require__(5);
/**
 * The definitive list of internal functions invokable from .NET code.
 * These function names are treated as 'reserved' and cannot be passed to registerFunction.
 */
exports.internalRegisteredFunctions = {
    attachRootComponentToElement: Renderer_1.attachRootComponentToElement,
    invokeWithJsonMarshalling: InvokeJavaScriptFunctionWithJsonMarshalling_1.invokeWithJsonMarshalling,
    invokeWithJsonMarshallingAsync: InvokeJavaScriptFunctionWithJsonMarshalling_1.invokeWithJsonMarshallingAsync,
    invokePromiseCallback: InvokeDotNetMethodWithJsonMarshalling_1.invokePromiseCallback,
    renderBatch: Renderer_1.renderBatch,
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
var RegisteredFunction_1 = __webpack_require__(1);
var InvokeDotNetMethodWithJsonMarshalling_1 = __webpack_require__(2);
var ElementReferenceCapture_1 = __webpack_require__(4);
var elementRefKey = '_blazorElementRef'; // Keep in sync with ElementRef.cs
function invokeWithJsonMarshalling(identifier) {
    var argsJson = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        argsJson[_i - 1] = arguments[_i];
    }
    var result;
    var identifierJsString = Environment_1.platform.toJavaScriptString(identifier);
    var args = argsJson.map(function (json) { return JSON.parse(Environment_1.platform.toJavaScriptString(json), jsonReviver); });
    try {
        result = { succeeded: true, result: invokeWithJsonMarshallingCore.apply(void 0, [identifierJsString].concat(args)) };
    }
    catch (e) {
        result = { succeeded: false, message: e instanceof Error ? e.message + "\n" + e.stack : (e ? e.toString() : null) };
    }
    var resultJson = JSON.stringify(result);
    return Environment_1.platform.toDotNetString(resultJson);
}
exports.invokeWithJsonMarshalling = invokeWithJsonMarshalling;
function invokeWithJsonMarshallingCore(identifier) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var funcInstance = RegisteredFunction_1.getRegisteredFunction(identifier);
    var result = funcInstance.apply(null, args);
    if (result !== null && result !== undefined) {
        return result;
    }
    else {
        return null;
    }
}
var invokeDotNetCallback = {
    type: {
        assembly: 'Microsoft.AspNetCore.Blazor.Browser',
        name: 'Microsoft.AspNetCore.Blazor.Browser.Interop.TaskCallback'
    },
    method: {
        name: 'InvokeTaskCallback'
    }
};
function invokeWithJsonMarshallingAsync(identifier, callbackId) {
    var argsJson = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        argsJson[_i - 2] = arguments[_i];
    }
    var result = invokeWithJsonMarshallingCore.apply(void 0, [identifier].concat(argsJson));
    result
        .then(function (res) { return InvokeDotNetMethodWithJsonMarshalling_1.invokeDotNetMethod(invokeDotNetCallback, callbackId, JSON.stringify({ succeeded: true, result: res })); })
        .catch(function (reason) { return InvokeDotNetMethodWithJsonMarshalling_1.invokeDotNetMethod(invokeDotNetCallback, callbackId, JSON.stringify({ succeeded: false, message: (reason && reason.message) || (reason && reason.toString && reason.toString()) })); });
    return null;
}
exports.invokeWithJsonMarshallingAsync = invokeWithJsonMarshallingAsync;
function jsonReviver(key, value) {
    if (value && typeof value === 'object' && value.hasOwnProperty(elementRefKey) && typeof value[elementRefKey] === 'number') {
        return ElementReferenceCapture_1.getElementByCaptureId(value[elementRefKey]);
    }
    return value;
}


/***/ }),
/* 11 */
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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RenderTreeEdit_1 = __webpack_require__(13);
var RenderTreeFrame_1 = __webpack_require__(14);
var Environment_1 = __webpack_require__(0);
var EventDelegator_1 = __webpack_require__(15);
var LogicalElements_1 = __webpack_require__(17);
var ElementReferenceCapture_1 = __webpack_require__(4);
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
/* 13 */
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
/* 14 */
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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventForDotNet_1 = __webpack_require__(16);
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
/* 16 */
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
            case 'error':
                return new EventForDotNet('error', parseErrorEvent(event));
            case 'loadstart':
            case 'timeout':
            case 'abort':
            case 'load':
            case 'loadend':
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
function parseErrorEvent(event) {
    return {
        type: event.type,
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
    };
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
/* 17 */
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
/* 18 */
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
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
var RegisteredFunction_1 = __webpack_require__(1);
var UriHelper_1 = __webpack_require__(6);
var InvokeDotNetMethodWithJsonMarshalling_1 = __webpack_require__(2);
if (typeof window !== 'undefined') {
    // When the library is loaded in a browser via a <script> element, make the
    // following APIs available in global scope for invocation from JS
    window['Blazor'] = {
        platform: Environment_1.platform,
        registerFunction: RegisteredFunction_1.registerFunction,
        navigateTo: UriHelper_1.navigateTo,
        invokeDotNetMethod: InvokeDotNetMethodWithJsonMarshalling_1.invokeDotNetMethod,
        invokeDotNetMethodAsync: InvokeDotNetMethodWithJsonMarshalling_1.invokeDotNetMethodAsync
    };
}


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYmVhZTk2YzcwNjg2YjFhMjhhZGMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0Vudmlyb25tZW50LnRzIiwid2VicGFjazovLy8uL3NyYy9JbnRlcm9wL1JlZ2lzdGVyZWRGdW5jdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvSW50ZXJvcC9JbnZva2VEb3ROZXRNZXRob2RXaXRoSnNvbk1hcnNoYWxsaW5nLnRzIiwid2VicGFjazovLy8uL3NyYy9QbGF0Zm9ybS9Eb3ROZXQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JlbmRlcmluZy9FbGVtZW50UmVmZXJlbmNlQ2FwdHVyZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUmVuZGVyaW5nL1JlbmRlcmVyLnRzIiwid2VicGFjazovLy8uL3NyYy9TZXJ2aWNlcy9VcmlIZWxwZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0Jvb3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1BsYXRmb3JtL01vbm8vTW9ub1BsYXRmb3JtLnRzIiwid2VicGFjazovLy8uL3NyYy9JbnRlcm9wL0ludGVybmFsUmVnaXN0ZXJlZEZ1bmN0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9JbnRlcm9wL0ludm9rZUphdmFTY3JpcHRGdW5jdGlvbldpdGhKc29uTWFyc2hhbGxpbmcudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JlbmRlcmluZy9SZW5kZXJCYXRjaC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUmVuZGVyaW5nL0Jyb3dzZXJSZW5kZXJlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUmVuZGVyaW5nL1JlbmRlclRyZWVFZGl0LnRzIiwid2VicGFjazovLy8uL3NyYy9SZW5kZXJpbmcvUmVuZGVyVHJlZUZyYW1lLnRzIiwid2VicGFjazovLy8uL3NyYy9SZW5kZXJpbmcvRXZlbnREZWxlZ2F0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JlbmRlcmluZy9FdmVudEZvckRvdE5ldC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUmVuZGVyaW5nL0xvZ2ljYWxFbGVtZW50cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvU2VydmljZXMvSHR0cC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR2xvYmFsRXhwb3J0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7QUN6REEsNENBQTREO0FBQy9DLGdCQUFRLEdBQWEsMkJBQVksQ0FBQzs7Ozs7Ozs7OztBQ0wvQywwREFBMkU7QUFFM0UsSUFBTSxtQkFBbUIsR0FBbUQsRUFBRSxDQUFDO0FBRS9FLDBCQUFpQyxVQUFrQixFQUFFLGNBQXdCO0lBQzNFLEVBQUUsQ0FBQyxDQUFDLHdEQUEyQixDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0QsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBNEIsVUFBVSw0Q0FBeUMsQ0FBQyxDQUFDO0lBQ25HLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sSUFBSSxLQUFLLENBQUMscUNBQW1DLFVBQVUsbUNBQWdDLENBQUMsQ0FBQztJQUNqRyxDQUFDO0lBRUQsbUJBQW1CLENBQUMsVUFBVSxDQUFDLEdBQUcsY0FBYyxDQUFDO0FBQ25ELENB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LHdCQUF3QixDQUFDLElBQUk7SUFDN0Isa0JBQWtCLENBQUMsSUFBSSxFQUN2QixzQkFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FDdEMsQ0FBQztBQUNKLENBQUM7QUFFRCwwQkFBMEIsRUFBVSxFQUFFLGtCQUF3QyxFQUFFLFlBQXNDLEVBQUUsWUFBa0M7SUFDeEosRUFBRSxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7UUFDM0IscUJBQXFCLEdBQUcsc0JBQVEsQ0FBQyxVQUFVLENBQ3pDLGtCQUFrQixFQUNsQixtQkFBbUIsRUFDbkIsa0JBQWtCLEVBQ2xCLGlCQUFpQixDQUNsQixDQUFDO0lBQ0osQ0FBQztJQUVELHNCQUFRLENBQUMsVUFBVSxDQUFDLHFCQUFxQixFQUFFLElBQUksRUFBRTtRQUMvQyxzQkFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDdEMsa0JBQWtCO1FBQ2xCLFlBQVk7UUFDWixZQUFZO0tBQ2IsQ0FBQyxDQUFDO0FBQ0wsQ0FBQzs7Ozs7Ozs7OztBQ2pHRCwyQ0FBd0M7QUFDeEMsa0RBQWdFO0FBQ2hFLHlDQUFrRDtBQUNsRCxxRUFBOEc7QUFFOUcsRUFBRSxDQUFDLENBQUMsT0FBTyxNQUFNLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNsQywyRUFBMkU7SUFDM0Usa0VBQWtFO0lBQ2xFLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRztRQUNqQixRQUFRO1FBQ1IsZ0JBQWdCO1FBQ2hCLFVBQVU7UUFDVixrQkFBa0I7UUFDbEIsdUJBQXVCO0tBQ3hCLENBQUM7QUFDSixDQUFDIiwiZmlsZSI6ImJsYXpvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDcpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGJlYWU5NmM3MDY4NmIxYTI4YWRjIiwiLy8gRXhwb3NlIGFuIGV4cG9ydCBjYWxsZWQgJ3BsYXRmb3JtJyBvZiB0aGUgaW50ZXJmYWNlIHR5cGUgJ1BsYXRmb3JtJyxcclxuLy8gc28gdGhhdCBjb25zdW1lcnMgY2FuIGJlIGFnbm9zdGljIGFib3V0IHdoaWNoIGltcGxlbWVudGF0aW9uIHRoZXkgdXNlLlxyXG4vLyBCYXNpYyBhbHRlcm5hdGl2ZSB0byBoYXZpbmcgYW4gYWN0dWFsIERJIGNvbnRhaW5lci5cclxuaW1wb3J0IHsgUGxhdGZvcm0gfSBmcm9tICcuL1BsYXRmb3JtL1BsYXRmb3JtJztcclxuaW1wb3J0IHsgbW9ub1BsYXRmb3JtIH0gZnJvbSAnLi9QbGF0Zm9ybS9Nb25vL01vbm9QbGF0Zm9ybSc7XHJcbmV4cG9ydCBjb25zdCBwbGF0Zm9ybTogUGxhdGZvcm0gPSBtb25vUGxhdGZvcm07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9FbnZpcm9ubWVudC50cyIsImltcG9ydCB7IGludGVybmFsUmVnaXN0ZXJlZEZ1bmN0aW9ucyB9IGZyb20gJy4vSW50ZXJuYWxSZWdpc3RlcmVkRnVuY3Rpb24nO1xyXG5cclxuY29uc3QgcmVnaXN0ZXJlZEZ1bmN0aW9uczogeyBbaWRlbnRpZmllcjogc3RyaW5nXTogRnVuY3Rpb24gfCB1bmRlZmluZWQgfSA9IHt9O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyRnVuY3Rpb24oaWRlbnRpZmllcjogc3RyaW5nLCBpbXBsZW1lbnRhdGlvbjogRnVuY3Rpb24pIHtcclxuICBpZiAoaW50ZXJuYWxSZWdpc3RlcmVkRnVuY3Rpb25zLmhhc093blByb3BlcnR5KGlkZW50aWZpZXIpKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBmdW5jdGlvbiBpZGVudGlmaWVyICcke2lkZW50aWZpZXJ9JyBpcyByZXNlcnZlZCBhbmQgY2Fubm90IGJlIHJlZ2lzdGVyZWQuYCk7XHJcbiAgfVxyXG5cclxuICBpZiAocmVnaXN0ZXJlZEZ1bmN0aW9ucy5oYXNPd25Qcm9wZXJ0eShpZGVudGlmaWVyKSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBBIGZ1bmN0aW9uIHdpdGggdGhlIGlkZW50aWZpZXIgJyR7aWRlbnRpZmllcn0nIGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZC5gKTtcclxuICB9XHJcblxyXG4gIHJlZ2lzdGVyZWRGdW5jdGlvbnNbaWRlbnRpZmllcl0gPSBpbXBsZW1lbnRhdGlvbjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlZ2lzdGVyZWRGdW5jdGlvbihpZGVudGlmaWVyOiBzdHJpbmcpOiBGdW5jdGlvbiB7XHJcbiAgLy8gQnkgcHJpb3JpdGlzaW5nIHRoZSBpbnRlcm5hbCBvbmVzLCB3ZSBlbnN1cmUgeW91IGNhbid0IG92ZXJyaWRlIHRoZW1cclxuICBjb25zdCByZXN1bHQgPSBpbnRlcm5hbFJlZ2lzdGVyZWRGdW5jdGlvbnNbaWRlbnRpZmllcl0gfHwgcmVnaXN0ZXJlZEZ1bmN0aW9uc1tpZGVudGlmaWVyXTtcclxuICBpZiAocmVzdWx0KSB7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIHJlZ2lzdGVyZWQgZnVuY3Rpb24gd2l0aCBuYW1lICcke2lkZW50aWZpZXJ9Jy5gKTtcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0ludGVyb3AvUmVnaXN0ZXJlZEZ1bmN0aW9uLnRzIiwiaW1wb3J0IHsgcGxhdGZvcm0gfSBmcm9tICcuLi9FbnZpcm9ubWVudCc7XHJcbmltcG9ydCB7IFN5c3RlbV9TdHJpbmcsIFBvaW50ZXIsIE1ldGhvZEhhbmRsZSB9IGZyb20gJy4uL1BsYXRmb3JtL1BsYXRmb3JtJztcclxuaW1wb3J0IHsgZ2V0UmVnaXN0ZXJlZEZ1bmN0aW9uIH0gZnJvbSAnLi9SZWdpc3RlcmVkRnVuY3Rpb24nO1xyXG5pbXBvcnQgeyBlcnJvciB9IGZyb20gJ3V0aWwnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBNZXRob2RPcHRpb25zIHtcclxuICB0eXBlOiBUeXBlSWRlbnRpZmllcjtcclxuICBtZXRob2Q6IE1ldGhvZElkZW50aWZpZXI7XHJcbn1cclxuXHJcbi8vIEtlZXAgaW4gc3luYyB3aXRoIEludm9jYXRpb25SZXN1bHQuY3NcclxuZXhwb3J0IGludGVyZmFjZSBJbnZvY2F0aW9uUmVzdWx0IHtcclxuICBzdWNjZWVkZWQ6IGJvb2xlYW47XHJcbiAgcmVzdWx0PzogYW55O1xyXG4gIG1lc3NhZ2U/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTWV0aG9kSWRlbnRpZmllciB7XHJcbiAgbmFtZTogc3RyaW5nO1xyXG4gIHR5cGVBcmd1bWVudHM/OiB7IFtrZXk6IHN0cmluZ106IFR5cGVJZGVudGlmaWVyIH1cclxuICBwYXJhbWV0ZXJUeXBlcz86IFR5cGVJZGVudGlmaWVyW107XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVHlwZUlkZW50aWZpZXIge1xyXG4gIGFzc2VtYmx5OiBzdHJpbmc7XHJcbiAgbmFtZTogc3RyaW5nO1xyXG4gIHR5cGVBcmd1bWVudHM/OiB7IFtrZXk6IHN0cmluZ106IFR5cGVJZGVudGlmaWVyIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbnZva2VEb3ROZXRNZXRob2Q8VD4obWV0aG9kT3B0aW9uczogTWV0aG9kT3B0aW9ucywgLi4uYXJnczogYW55W10pOiAoVCB8IG51bGwpIHtcclxuICByZXR1cm4gaW52b2tlRG90TmV0TWV0aG9kQ29yZShtZXRob2RPcHRpb25zLCBudWxsLCAuLi5hcmdzKTtcclxufVxyXG5cclxuY29uc3QgcmVnaXN0cmF0aW9ucyA9IHt9O1xyXG5sZXQgZmluZERvdE5ldE1ldGhvZEhhbmRsZTogTWV0aG9kSGFuZGxlO1xyXG5cclxuZnVuY3Rpb24gZ2V0RmluZERvdE5ldE1ldGhvZEhhbmRsZSgpIHtcclxuICBpZiAoZmluZERvdE5ldE1ldGhvZEhhbmRsZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICBmaW5kRG90TmV0TWV0aG9kSGFuZGxlID0gcGxhdGZvcm0uZmluZE1ldGhvZChcclxuICAgICAgJ01pY3Jvc29mdC5Bc3BOZXRDb3JlLkJsYXpvci5Ccm93c2VyJyxcclxuICAgICAgJ01pY3Jvc29mdC5Bc3BOZXRDb3JlLkJsYXpvci5Ccm93c2VyLkludGVyb3AnLFxyXG4gICAgICAnSW52b2tlRG90TmV0RnJvbUphdmFTY3JpcHQnLFxyXG4gICAgICAnRmluZERvdE5ldE1ldGhvZCcpO1xyXG4gIH1cclxuICByZXR1cm4gZmluZERvdE5ldE1ldGhvZEhhbmRsZTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVzb2x2ZVJlZ2lzdHJhdGlvbihtZXRob2RPcHRpb25zOiBNZXRob2RPcHRpb25zKSB7XHJcbiAgY29uc3QgZmluZERvdE5ldE1ldGhvZEhhbmRsZSA9IGdldEZpbmREb3ROZXRNZXRob2RIYW5kbGUoKTtcclxuICBjb25zdCBhc3NlbWJseUVudHJ5ID0gcmVnaXN0cmF0aW9uc1ttZXRob2RPcHRpb25zLnR5cGUuYXNzZW1ibHldO1xyXG4gIGNvbnN0IHR5cGVFbnRyeSA9IGFzc2VtYmx5RW50cnkgJiYgYXNzZW1ibHlFbnRyeVttZXRob2RPcHRpb25zLnR5cGUubmFtZV07XHJcbiAgY29uc3QgcmVnaXN0cmF0aW9uID0gdHlwZUVudHJ5ICYmIHR5cGVFbnRyeVttZXRob2RPcHRpb25zLm1ldGhvZC5uYW1lXTtcclxuICBpZiAocmVnaXN0cmF0aW9uICE9PSB1bmRlZmluZWQpIHtcclxuICAgIHJldHVybiByZWdpc3RyYXRpb247XHJcbiAgfSBlbHNlIHtcclxuXHJcbiAgICBjb25zdCBzZXJpYWxpemVkT3B0aW9ucyA9IHBsYXRmb3JtLnRvRG90TmV0U3RyaW5nKEpTT04uc3RyaW5naWZ5KG1ldGhvZE9wdGlvbnMpKTtcclxuICAgIGNvbnN0IHJlc3VsdCA9IHBsYXRmb3JtLmNhbGxNZXRob2QoZmluZERvdE5ldE1ldGhvZEhhbmRsZSwgbnVsbCwgW3NlcmlhbGl6ZWRPcHRpb25zXSk7XHJcbiAgICBjb25zdCByZWdpc3RyYXRpb24gPSBwbGF0Zm9ybS50b0phdmFTY3JpcHRTdHJpbmcocmVzdWx0IGFzIFN5c3RlbV9TdHJpbmcpO1xyXG5cclxuICAgIGlmIChhc3NlbWJseUVudHJ5ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgY29uc3QgYXNzZW1ibHkgPSB7fTtcclxuICAgICAgY29uc3QgdHlwZSA9IHt9O1xyXG4gICAgICByZWdpc3RyYXRpb25zW21ldGhvZE9wdGlvbnMudHlwZS5hc3NlbWJseV0gPSBhc3NlbWJseTtcclxuICAgICAgYXNzZW1ibHlbbWV0aG9kT3B0aW9ucy50eXBlLm5hbWVdID0gdHlwZTtcclxuICAgICAgdHlwZVttZXRob2RPcHRpb25zLm1ldGhvZC5uYW1lXSA9IHJlZ2lzdHJhdGlvbjtcclxuICAgIH0gZWxzZSBpZiAodHlwZUVudHJ5ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgY29uc3QgdHlwZSA9IHt9O1xyXG4gICAgICBhc3NlbWJseUVudHJ5W21ldGhvZE9wdGlvbnMudHlwZS5uYW1lXSA9IHR5cGU7XHJcbiAgICAgIHR5cGVbbWV0aG9kT3B0aW9ucy5tZXRob2QubmFtZV0gPSByZWdpc3RyYXRpb247XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0eXBlRW50cnlbbWV0aG9kT3B0aW9ucy5tZXRob2QubmFtZV0gPSByZWdpc3RyYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlZ2lzdHJhdGlvbjtcclxuICB9XHJcbn1cclxuXHJcbmxldCBpbnZva2VEb3ROZXRNZXRob2RIYW5kbGU6IE1ldGhvZEhhbmRsZTtcclxuXHJcbmZ1bmN0aW9uIGdldEludm9rZURvdE5ldE1ldGhvZEhhbmRsZSgpIHtcclxuICBpZiAoaW52b2tlRG90TmV0TWV0aG9kSGFuZGxlID09PSB1bmRlZmluZWQpIHtcclxuICAgIGludm9rZURvdE5ldE1ldGhvZEhhbmRsZSA9IHBsYXRmb3JtLmZpbmRNZXRob2QoXHJcbiAgICAgICdNaWNyb3NvZnQuQXNwTmV0Q29yZS5CbGF6b3IuQnJvd3NlcicsXHJcbiAgICAgICdNaWNyb3NvZnQuQXNwTmV0Q29yZS5CbGF6b3IuQnJvd3Nlci5JbnRlcm9wJyxcclxuICAgICAgJ0ludm9rZURvdE5ldEZyb21KYXZhU2NyaXB0JyxcclxuICAgICAgJ0ludm9rZURvdE5ldE1ldGhvZCcpO1xyXG4gIH1cclxuICByZXR1cm4gaW52b2tlRG90TmV0TWV0aG9kSGFuZGxlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbnZva2VEb3ROZXRNZXRob2RDb3JlPFQ+KG1ldGhvZE9wdGlvbnM6IE1ldGhvZE9wdGlvbnMsIGNhbGxiYWNrSWQ6IHN0cmluZyB8IG51bGwsIC4uLmFyZ3M6IGFueVtdKTogKFQgfCBudWxsKSB7XHJcbiAgY29uc3QgaW52b2tlRG90TmV0TWV0aG9kSGFuZGxlID0gZ2V0SW52b2tlRG90TmV0TWV0aG9kSGFuZGxlKCk7XHJcbiAgY29uc3QgcmVnaXN0cmF0aW9uID0gcmVzb2x2ZVJlZ2lzdHJhdGlvbihtZXRob2RPcHRpb25zKTtcclxuXHJcbiAgY29uc3QgcGFja2VkQXJncyA9IHBhY2tBcmd1bWVudHMoYXJncyk7XHJcblxyXG4gIGNvbnN0IHNlcmlhbGl6ZWRDYWxsYmFjayA9IGNhbGxiYWNrSWQgIT0gbnVsbCA/IHBsYXRmb3JtLnRvRG90TmV0U3RyaW5nKGNhbGxiYWNrSWQpIDogbnVsbDtcclxuICBjb25zdCBzZXJpYWxpemVkQXJncyA9IHBsYXRmb3JtLnRvRG90TmV0U3RyaW5nKEpTT04uc3RyaW5naWZ5KHBhY2tlZEFyZ3MpKTtcclxuICBjb25zdCBzZXJpYWxpemVkUmVnaXN0cmF0aW9uID0gcGxhdGZvcm0udG9Eb3ROZXRTdHJpbmcocmVnaXN0cmF0aW9uKTtcclxuICBjb25zdCBzZXJpYWxpemVkUmVzdWx0ID0gcGxhdGZvcm0uY2FsbE1ldGhvZChpbnZva2VEb3ROZXRNZXRob2RIYW5kbGUsIG51bGwsIFtzZXJpYWxpemVkUmVnaXN0cmF0aW9uLCBzZXJpYWxpemVkQ2FsbGJhY2ssIHNlcmlhbGl6ZWRBcmdzXSk7XHJcblxyXG4gIGNvbnN0IHJlc3VsdCA9IEpTT04ucGFyc2UocGxhdGZvcm0udG9KYXZhU2NyaXB0U3RyaW5nKHNlcmlhbGl6ZWRSZXN1bHQgYXMgU3lzdGVtX1N0cmluZykpO1xyXG4gIGlmIChyZXN1bHQuc3VjY2VlZGVkKSB7XHJcbiAgICByZXR1cm4gcmVzdWx0LnJlc3VsdDtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKHJlc3VsdC5tZXNzYWdlKTtcclxuICB9XHJcbn1cclxuXHJcbi8vIFdlIGRvbid0IGhhdmUgdG8gd29ycnkgYWJvdXQgb3ZlcmZsb3dzIGhlcmUuIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSIGluIEpTIGlzIDJeNTMtMVxyXG5sZXQgZ2xvYmFsSWQgPSAwO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGludm9rZURvdE5ldE1ldGhvZEFzeW5jPFQ+KG1ldGhvZE9wdGlvbnM6IE1ldGhvZE9wdGlvbnMsIC4uLmFyZ3M6IGFueVtdKTogUHJvbWlzZTxUIHwgbnVsbD4ge1xyXG4gIGNvbnN0IGNhbGxiYWNrSWQgPSAoZ2xvYmFsSWQrKykudG9TdHJpbmcoKTtcclxuXHJcbiAgY29uc3QgcmVzdWx0ID0gbmV3IFByb21pc2U8VCB8IG51bGw+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgIFRyYWNrZWRSZWZlcmVuY2UudHJhY2soY2FsbGJhY2tJZCwgKGludm9jYXRpb25SZXN1bHQ6IEludm9jYXRpb25SZXN1bHQpID0+IHtcclxuICAgICAgLy8gV2UgZ290IGludm9rZWQsIHNvIHdlIHVucmVnaXN0ZXIgb3Vyc2VsdmVzLlxyXG4gICAgICBUcmFja2VkUmVmZXJlbmNlLnVudHJhY2soY2FsbGJhY2tJZCk7XHJcbiAgICAgIGlmIChpbnZvY2F0aW9uUmVzdWx0LnN1Y2NlZWRlZCkge1xyXG4gICAgICAgIHJlc29sdmUoaW52b2NhdGlvblJlc3VsdC5yZXN1bHQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoaW52b2NhdGlvblJlc3VsdC5tZXNzYWdlKSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBpbnZva2VEb3ROZXRNZXRob2RDb3JlKG1ldGhvZE9wdGlvbnMsIGNhbGxiYWNrSWQsIC4uLmFyZ3MpO1xyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW52b2tlUHJvbWlzZUNhbGxiYWNrKGlkOiBzdHJpbmcsIGludm9jYXRpb25SZXN1bHQ6IEludm9jYXRpb25SZXN1bHQpOiB2b2lkIHtcclxuICBjb25zdCBjYWxsYmFjayA9IFRyYWNrZWRSZWZlcmVuY2UuZ2V0KGlkKSBhcyBGdW5jdGlvbjtcclxuICBjYWxsYmFjay5jYWxsKG51bGwsIGludm9jYXRpb25SZXN1bHQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwYWNrQXJndW1lbnRzKGFyZ3M6IGFueVtdKSB7XHJcbiAgY29uc3QgcmVzdWx0ID0ge307XHJcbiAgaWYgKGFyZ3MubGVuZ3RoID09IDApIHtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBpZiAoYXJncy5sZW5ndGggPiA3KSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7IGkrKykge1xyXG4gICAgICByZXN1bHRbYGFyZ3VtZW50JHtbaSArIDFdfWBdID0gYXJnc1tpXTtcclxuICAgIH1cclxuICAgIHJlc3VsdFsnYXJndW1lbnQ4J10gPSBwYWNrQXJndW1lbnRzKGFyZ3Muc2xpY2UoNykpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgcmVzdWx0W2Bhcmd1bWVudCR7W2kgKyAxXX1gXSA9IGFyZ3NbaV07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5jbGFzcyBUcmFja2VkUmVmZXJlbmNlIHtcclxuICBwcml2YXRlIHN0YXRpYyByZWZlcmVuY2VzOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0ge307XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgdHJhY2soaWQ6IHN0cmluZywgdHJhY2tlZE9iamVjdDogYW55KTogdm9pZCB7XHJcbiAgICBjb25zdCByZWZzID0gVHJhY2tlZFJlZmVyZW5jZS5yZWZlcmVuY2VzO1xyXG4gICAgaWYgKHJlZnNbaWRdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbiBlbGVtZW50IHdpdGggaWQgJyR7aWR9JyBpcyBhbHJlYWR5IGJlaW5nIHRyYWNrZWQuYCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVmc1tpZF0gPSB0cmFja2VkT2JqZWN0O1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyB1bnRyYWNrKGlkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGNvbnN0IHJlZnMgPSBUcmFja2VkUmVmZXJlbmNlLnJlZmVyZW5jZXM7XHJcbiAgICBjb25zdCByZXN1bHQgPSByZWZzW2lkXTtcclxuICAgIGlmIChyZXN1bHQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFuIGVsZW1lbnQgd2l0aCBpZCAnJHtpZH0nIGlzIG5vdCBiZWluZyBiZWluZyB0cmFja2VkLmApO1xyXG4gICAgfVxyXG5cclxuICAgIHJlZnNbaWRdID0gdW5kZWZpbmVkO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyBnZXQoaWQ6IHN0cmluZyk6IGFueSB7XHJcbiAgICBjb25zdCByZWZzID0gVHJhY2tlZFJlZmVyZW5jZS5yZWZlcmVuY2VzO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gcmVmc1tpZF07XHJcbiAgICBpZiAocmVzdWx0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbiBlbGVtZW50IHdpdGggaWQgJyR7aWR9JyBpcyBub3QgYmVpbmcgYmVpbmcgdHJhY2tlZC5gKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvSW50ZXJvcC9JbnZva2VEb3ROZXRNZXRob2RXaXRoSnNvbk1hcnNoYWxsaW5nLnRzIiwiZXhwb3J0IGZ1bmN0aW9uIGdldEFzc2VtYmx5TmFtZUZyb21VcmwodXJsOiBzdHJpbmcpIHtcclxuICBjb25zdCBsYXN0U2VnbWVudCA9IHVybC5zdWJzdHJpbmcodXJsLmxhc3RJbmRleE9mKCcvJykgKyAxKTtcclxuICBjb25zdCBxdWVyeVN0cmluZ1N0YXJ0UG9zID0gbGFzdFNlZ21lbnQuaW5kZXhPZignPycpO1xyXG4gIGNvbnN0IGZpbGVuYW1lID0gcXVlcnlTdHJpbmdTdGFydFBvcyA8IDAgPyBsYXN0U2VnbWVudCA6IGxhc3RTZWdtZW50LnN1YnN0cmluZygwLCBxdWVyeVN0cmluZ1N0YXJ0UG9zKTtcclxuICByZXR1cm4gZmlsZW5hbWUucmVwbGFjZSgvXFwuZGxsJC8sICcnKTtcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUGxhdGZvcm0vRG90TmV0LnRzIiwiZXhwb3J0IGZ1bmN0aW9uIGFwcGx5Q2FwdHVyZUlkVG9FbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQsIHJlZmVyZW5jZUNhcHR1cmVJZDogbnVtYmVyKSB7XHJcbiAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoZ2V0Q2FwdHVyZUlkQXR0cmlidXRlTmFtZShyZWZlcmVuY2VDYXB0dXJlSWQpLCAnJyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50QnlDYXB0dXJlSWQocmVmZXJlbmNlQ2FwdHVyZUlkOiBudW1iZXIpIHtcclxuICBjb25zdCBzZWxlY3RvciA9IGBbJHtnZXRDYXB0dXJlSWRBdHRyaWJ1dGVOYW1lKHJlZmVyZW5jZUNhcHR1cmVJZCl9XWA7XHJcbiAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDYXB0dXJlSWRBdHRyaWJ1dGVOYW1lKHJlZmVyZW5jZUNhcHR1cmVJZDogbnVtYmVyKSB7XHJcbiAgcmV0dXJuIGBfYmxfJHtyZWZlcmVuY2VDYXB0dXJlSWR9YDtcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9SZW5kZXJpbmcvRWxlbWVudFJlZmVyZW5jZUNhcHR1cmUudHMiLCJpbXBvcnQgeyBTeXN0ZW1fT2JqZWN0LCBTeXN0ZW1fU3RyaW5nLCBTeXN0ZW1fQXJyYXksIE1ldGhvZEhhbmRsZSwgUG9pbnRlciB9IGZyb20gJy4uL1BsYXRmb3JtL1BsYXRmb3JtJztcclxuaW1wb3J0IHsgcGxhdGZvcm0gfSBmcm9tICcuLi9FbnZpcm9ubWVudCc7XHJcbmltcG9ydCB7IHJlbmRlckJhdGNoIGFzIHJlbmRlckJhdGNoU3RydWN0LCBhcnJheVJhbmdlLCBhcnJheVNlZ21lbnQsIHJlbmRlclRyZWVEaWZmU3RydWN0TGVuZ3RoLCByZW5kZXJUcmVlRGlmZiwgUmVuZGVyQmF0Y2hQb2ludGVyLCBSZW5kZXJUcmVlRGlmZlBvaW50ZXIgfSBmcm9tICcuL1JlbmRlckJhdGNoJztcclxuaW1wb3J0IHsgQnJvd3NlclJlbmRlcmVyIH0gZnJvbSAnLi9Ccm93c2VyUmVuZGVyZXInO1xyXG5cclxudHlwZSBCcm93c2VyUmVuZGVyZXJSZWdpc3RyeSA9IHsgW2Jyb3dzZXJSZW5kZXJlcklkOiBudW1iZXJdOiBCcm93c2VyUmVuZGVyZXIgfTtcclxuY29uc3QgYnJvd3NlclJlbmRlcmVyczogQnJvd3NlclJlbmRlcmVyUmVnaXN0cnkgPSB7fTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhdHRhY2hSb290Q29tcG9uZW50VG9FbGVtZW50KGJyb3dzZXJSZW5kZXJlcklkOiBudW1iZXIsIGVsZW1lbnRTZWxlY3RvcjogU3lzdGVtX1N0cmluZywgY29tcG9uZW50SWQ6IG51bWJlcikge1xyXG4gIGNvbnN0IGVsZW1lbnRTZWxlY3RvckpzID0gcGxhdGZvcm0udG9KYXZhU2NyaXB0U3RyaW5nKGVsZW1lbnRTZWxlY3Rvcik7XHJcbiAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudFNlbGVjdG9ySnMpO1xyXG4gIGlmICghZWxlbWVudCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBhbnkgZWxlbWVudCBtYXRjaGluZyBzZWxlY3RvciAnJHtlbGVtZW50U2VsZWN0b3JKc30nLmApO1xyXG4gIH1cclxuXHJcbiAgbGV0IGJyb3dzZXJSZW5kZXJlciA9IGJyb3dzZXJSZW5kZXJlcnNbYnJvd3NlclJlbmRlcmVySWRdO1xyXG4gIGlmICghYnJvd3NlclJlbmRlcmVyKSB7XHJcbiAgICBicm93c2VyUmVuZGVyZXIgPSBicm93c2VyUmVuZGVyZXJzW2Jyb3dzZXJSZW5kZXJlcklkXSA9IG5ldyBCcm93c2VyUmVuZGVyZXIoYnJvd3NlclJlbmRlcmVySWQpO1xyXG4gIH1cclxuICBjbGVhckVsZW1lbnQoZWxlbWVudCk7XHJcbiAgYnJvd3NlclJlbmRlcmVyLmF0dGFjaFJvb3RDb21wb25lbnRUb0VsZW1lbnQoY29tcG9uZW50SWQsIGVsZW1lbnQpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyQmF0Y2goYnJvd3NlclJlbmRlcmVySWQ6IG51bWJlciwgYmF0Y2g6IFJlbmRlckJhdGNoUG9pbnRlcikge1xyXG4gIGNvbnN0IGJyb3dzZXJSZW5kZXJlciA9IGJyb3dzZXJSZW5kZXJlcnNbYnJvd3NlclJlbmRlcmVySWRdO1xyXG4gIGlmICghYnJvd3NlclJlbmRlcmVyKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZXJlIGlzIG5vIGJyb3dzZXIgcmVuZGVyZXIgd2l0aCBJRCAke2Jyb3dzZXJSZW5kZXJlcklkfS5gKTtcclxuICB9XHJcbiAgXHJcbiAgY29uc3QgdXBkYXRlZENvbXBvbmVudHMgPSByZW5kZXJCYXRjaFN0cnVjdC51cGRhdGVkQ29tcG9uZW50cyhiYXRjaCk7XHJcbiAgY29uc3QgdXBkYXRlZENvbXBvbmVudHNMZW5ndGggPSBhcnJheVJhbmdlLmNvdW50KHVwZGF0ZWRDb21wb25lbnRzKTtcclxuICBjb25zdCB1cGRhdGVkQ29tcG9uZW50c0FycmF5ID0gYXJyYXlSYW5nZS5hcnJheSh1cGRhdGVkQ29tcG9uZW50cyk7XHJcbiAgY29uc3QgcmVmZXJlbmNlRnJhbWVzU3RydWN0ID0gcmVuZGVyQmF0Y2hTdHJ1Y3QucmVmZXJlbmNlRnJhbWVzKGJhdGNoKTtcclxuICBjb25zdCByZWZlcmVuY2VGcmFtZXMgPSBhcnJheVJhbmdlLmFycmF5KHJlZmVyZW5jZUZyYW1lc1N0cnVjdCk7XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdXBkYXRlZENvbXBvbmVudHNMZW5ndGg7IGkrKykge1xyXG4gICAgY29uc3QgZGlmZiA9IHBsYXRmb3JtLmdldEFycmF5RW50cnlQdHIodXBkYXRlZENvbXBvbmVudHNBcnJheSwgaSwgcmVuZGVyVHJlZURpZmZTdHJ1Y3RMZW5ndGgpO1xyXG4gICAgY29uc3QgY29tcG9uZW50SWQgPSByZW5kZXJUcmVlRGlmZi5jb21wb25lbnRJZChkaWZmKTtcclxuXHJcbiAgICBjb25zdCBlZGl0c0FycmF5U2VnbWVudCA9IHJlbmRlclRyZWVEaWZmLmVkaXRzKGRpZmYpO1xyXG4gICAgY29uc3QgZWRpdHMgPSBhcnJheVNlZ21lbnQuYXJyYXkoZWRpdHNBcnJheVNlZ21lbnQpO1xyXG4gICAgY29uc3QgZWRpdHNPZmZzZXQgPSBhcnJheVNlZ21lbnQub2Zmc2V0KGVkaXRzQXJyYXlTZWdtZW50KTtcclxuICAgIGNvbnN0IGVkaXRzTGVuZ3RoID0gYXJyYXlTZWdtZW50LmNvdW50KGVkaXRzQXJyYXlTZWdtZW50KTtcclxuXHJcbiAgICBicm93c2VyUmVuZGVyZXIudXBkYXRlQ29tcG9uZW50KGNvbXBvbmVudElkLCBlZGl0cywgZWRpdHNPZmZzZXQsIGVkaXRzTGVuZ3RoLCByZWZlcmVuY2VGcmFtZXMpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZGlzcG9zZWRDb21wb25lbnRJZHMgPSByZW5kZXJCYXRjaFN0cnVjdC5kaXNwb3NlZENvbXBvbmVudElkcyhiYXRjaCk7XHJcbiAgY29uc3QgZGlzcG9zZWRDb21wb25lbnRJZHNMZW5ndGggPSBhcnJheVJhbmdlLmNvdW50KGRpc3Bvc2VkQ29tcG9uZW50SWRzKTtcclxuICBjb25zdCBkaXNwb3NlZENvbXBvbmVudElkc0FycmF5ID0gYXJyYXlSYW5nZS5hcnJheShkaXNwb3NlZENvbXBvbmVudElkcyk7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaXNwb3NlZENvbXBvbmVudElkc0xlbmd0aDsgaSsrKSB7XHJcbiAgICBjb25zdCBjb21wb25lbnRJZFB0ciA9IHBsYXRmb3JtLmdldEFycmF5RW50cnlQdHIoZGlzcG9zZWRDb21wb25lbnRJZHNBcnJheSwgaSwgNCk7XHJcbiAgICBjb25zdCBjb21wb25lbnRJZCA9IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKGNvbXBvbmVudElkUHRyKTtcclxuICAgIGJyb3dzZXJSZW5kZXJlci5kaXNwb3NlQ29tcG9uZW50KGNvbXBvbmVudElkKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGRpc3Bvc2VkRXZlbnRIYW5kbGVySWRzID0gcmVuZGVyQmF0Y2hTdHJ1Y3QuZGlzcG9zZWRFdmVudEhhbmRsZXJJZHMoYmF0Y2gpO1xyXG4gIGNvbnN0IGRpc3Bvc2VkRXZlbnRIYW5kbGVySWRzTGVuZ3RoID0gYXJyYXlSYW5nZS5jb3VudChkaXNwb3NlZEV2ZW50SGFuZGxlcklkcyk7XHJcbiAgY29uc3QgZGlzcG9zZWRFdmVudEhhbmRsZXJJZHNBcnJheSA9IGFycmF5UmFuZ2UuYXJyYXkoZGlzcG9zZWRFdmVudEhhbmRsZXJJZHMpO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZGlzcG9zZWRFdmVudEhhbmRsZXJJZHNMZW5ndGg7IGkrKykge1xyXG4gICAgY29uc3QgZXZlbnRIYW5kbGVySWRQdHIgPSBwbGF0Zm9ybS5nZXRBcnJheUVudHJ5UHRyKGRpc3Bvc2VkRXZlbnRIYW5kbGVySWRzQXJyYXksIGksIDQpO1xyXG4gICAgY29uc3QgZXZlbnRIYW5kbGVySWQgPSBwbGF0Zm9ybS5yZWFkSW50MzJGaWVsZChldmVudEhhbmRsZXJJZFB0cik7XHJcbiAgICBicm93c2VyUmVuZGVyZXIuZGlzcG9zZUV2ZW50SGFuZGxlcihldmVudEhhbmRsZXJJZCk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjbGVhckVsZW1lbnQoZWxlbWVudDogRWxlbWVudCkge1xyXG4gIGxldCBjaGlsZE5vZGU6IE5vZGUgfCBudWxsO1xyXG4gIHdoaWxlIChjaGlsZE5vZGUgPSBlbGVtZW50LmZpcnN0Q2hpbGQpIHtcclxuICAgIGVsZW1lbnQucmVtb3ZlQ2hpbGQoY2hpbGROb2RlKTtcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1JlbmRlcmluZy9SZW5kZXJlci50cyIsImltcG9ydCB7IHJlZ2lzdGVyRnVuY3Rpb24gfSBmcm9tICcuLi9JbnRlcm9wL1JlZ2lzdGVyZWRGdW5jdGlvbic7XHJcbmltcG9ydCB7IHBsYXRmb3JtIH0gZnJvbSAnLi4vRW52aXJvbm1lbnQnO1xyXG5pbXBvcnQgeyBNZXRob2RIYW5kbGUsIFN5c3RlbV9TdHJpbmcgfSBmcm9tICcuLi9QbGF0Zm9ybS9QbGF0Zm9ybSc7XHJcbmNvbnN0IHJlZ2lzdGVyZWRGdW5jdGlvblByZWZpeCA9ICdNaWNyb3NvZnQuQXNwTmV0Q29yZS5CbGF6b3IuQnJvd3Nlci5TZXJ2aWNlcy5Ccm93c2VyVXJpSGVscGVyJztcclxubGV0IG5vdGlmeUxvY2F0aW9uQ2hhbmdlZE1ldGhvZDogTWV0aG9kSGFuZGxlO1xyXG5sZXQgaGFzUmVnaXN0ZXJlZEV2ZW50TGlzdGVuZXJzID0gZmFsc2U7XHJcblxyXG5yZWdpc3RlckZ1bmN0aW9uKGAke3JlZ2lzdGVyZWRGdW5jdGlvblByZWZpeH0uZ2V0TG9jYXRpb25IcmVmYCxcclxuICAoKSA9PiBwbGF0Zm9ybS50b0RvdE5ldFN0cmluZyhsb2NhdGlvbi5ocmVmKSk7XHJcblxyXG5yZWdpc3RlckZ1bmN0aW9uKGAke3JlZ2lzdGVyZWRGdW5jdGlvblByZWZpeH0uZ2V0QmFzZVVSSWAsXHJcbiAgKCkgPT4gZG9jdW1lbnQuYmFzZVVSSSA/IHBsYXRmb3JtLnRvRG90TmV0U3RyaW5nKGRvY3VtZW50LmJhc2VVUkkpIDogbnVsbCk7XHJcblxyXG5yZWdpc3RlckZ1bmN0aW9uKGAke3JlZ2lzdGVyZWRGdW5jdGlvblByZWZpeH0uZW5hYmxlTmF2aWdhdGlvbkludGVyY2VwdGlvbmAsICgpID0+IHtcclxuICBpZiAoaGFzUmVnaXN0ZXJlZEV2ZW50TGlzdGVuZXJzKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIGhhc1JlZ2lzdGVyZWRFdmVudExpc3RlbmVycyA9IHRydWU7XHJcblxyXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG4gICAgLy8gSW50ZXJjZXB0IGNsaWNrcyBvbiBhbGwgPGE+IGVsZW1lbnRzIHdoZXJlIHRoZSBocmVmIGlzIHdpdGhpbiB0aGUgPGJhc2UgaHJlZj4gVVJJIHNwYWNlXHJcbiAgICAvLyBXZSBtdXN0IGV4cGxpY2l0bHkgY2hlY2sgaWYgaXQgaGFzIGFuICdocmVmJyBhdHRyaWJ1dGUsIGJlY2F1c2UgaWYgaXQgZG9lc24ndCwgdGhlIHJlc3VsdCBtaWdodCBiZSBudWxsIG9yIGFuIGVtcHR5IHN0cmluZyBkZXBlbmRpbmcgb24gdGhlIGJyb3dzZXJcclxuICAgIGNvbnN0IGFuY2hvclRhcmdldCA9IGZpbmRDbG9zZXN0QW5jZXN0b3IoZXZlbnQudGFyZ2V0IGFzIEVsZW1lbnQgfCBudWxsLCAnQScpIGFzIEhUTUxBbmNob3JFbGVtZW50O1xyXG4gICAgY29uc3QgaHJlZkF0dHJpYnV0ZU5hbWUgPSAnaHJlZic7XHJcbiAgICBpZiAoYW5jaG9yVGFyZ2V0ICYmIGFuY2hvclRhcmdldC5oYXNBdHRyaWJ1dGUoaHJlZkF0dHJpYnV0ZU5hbWUpKSB7XHJcbiAgICAgIGNvbnN0IGhyZWYgPSBhbmNob3JUYXJnZXQuZ2V0QXR0cmlidXRlKGhyZWZBdHRyaWJ1dGVOYW1lKSE7XHJcbiAgICAgIGNvbnN0IGFic29sdXRlSHJlZiA9IHRvQWJzb2x1dGVVcmkoaHJlZik7XHJcblxyXG4gICAgICAvLyBEb24ndCBzdG9wIGN0cmwvbWV0YS1jbGljayAoZXRjKSBmcm9tIG9wZW5pbmcgbGlua3MgaW4gbmV3IHRhYnMvd2luZG93c1xyXG4gICAgICBpZiAoaXNXaXRoaW5CYXNlVXJpU3BhY2UoYWJzb2x1dGVIcmVmKSAmJiAhZXZlbnRIYXNTcGVjaWFsS2V5KGV2ZW50KSkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgcGVyZm9ybUludGVybmFsTmF2aWdhdGlvbihhYnNvbHV0ZUhyZWYpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGhhbmRsZUludGVybmFsTmF2aWdhdGlvbik7XHJcbn0pO1xyXG5cclxucmVnaXN0ZXJGdW5jdGlvbihgJHtyZWdpc3RlcmVkRnVuY3Rpb25QcmVmaXh9Lm5hdmlnYXRlVG9gLCAodXJpRG90TmV0U3RyaW5nOiBTeXN0ZW1fU3RyaW5nKSA9PiB7XHJcbiAgbmF2aWdhdGVUbyhwbGF0Zm9ybS50b0phdmFTY3JpcHRTdHJpbmcodXJpRG90TmV0U3RyaW5nKSk7XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG5hdmlnYXRlVG8odXJpOiBzdHJpbmcpIHtcclxuICBjb25zdCBhYnNvbHV0ZVVyaSA9IHRvQWJzb2x1dGVVcmkodXJpKTtcclxuICBpZiAoaXNXaXRoaW5CYXNlVXJpU3BhY2UoYWJzb2x1dGVVcmkpKSB7XHJcbiAgICBwZXJmb3JtSW50ZXJuYWxOYXZpZ2F0aW9uKGFic29sdXRlVXJpKTtcclxuICB9IGVsc2Uge1xyXG4gICAgbG9jYXRpb24uaHJlZiA9IHVyaTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBlcmZvcm1JbnRlcm5hbE5hdmlnYXRpb24oYWJzb2x1dGVJbnRlcm5hbEhyZWY6IHN0cmluZykge1xyXG4gIGhpc3RvcnkucHVzaFN0YXRlKG51bGwsIC8qIGlnbm9yZWQgdGl0bGUgKi8gJycsIGFic29sdXRlSW50ZXJuYWxIcmVmKTtcclxuICBoYW5kbGVJbnRlcm5hbE5hdmlnYXRpb24oKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlSW50ZXJuYWxOYXZpZ2F0aW9uKCkge1xyXG4gIGlmICghbm90aWZ5TG9jYXRpb25DaGFuZ2VkTWV0aG9kKSB7XHJcbiAgICBub3RpZnlMb2NhdGlvbkNoYW5nZWRNZXRob2QgPSBwbGF0Zm9ybS5maW5kTWV0aG9kKFxyXG4gICAgICAnTWljcm9zb2Z0LkFzcE5ldENvcmUuQmxhem9yLkJyb3dzZXInLFxyXG4gICAgICAnTWljcm9zb2Z0LkFzcE5ldENvcmUuQmxhem9yLkJyb3dzZXIuU2VydmljZXMnLFxyXG4gICAgICAnQnJvd3NlclVyaUhlbHBlcicsXHJcbiAgICAgICdOb3RpZnlMb2NhdGlvbkNoYW5nZWQnXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcGxhdGZvcm0uY2FsbE1ldGhvZChub3RpZnlMb2NhdGlvbkNoYW5nZWRNZXRob2QsIG51bGwsIFtcclxuICAgIHBsYXRmb3JtLnRvRG90TmV0U3RyaW5nKGxvY2F0aW9uLmhyZWYpXHJcbiAgXSk7XHJcbn1cclxuXHJcbmxldCB0ZXN0QW5jaG9yOiBIVE1MQW5jaG9yRWxlbWVudDtcclxuZnVuY3Rpb24gdG9BYnNvbHV0ZVVyaShyZWxhdGl2ZVVyaTogc3RyaW5nKSB7XHJcbiAgdGVzdEFuY2hvciA9IHRlc3RBbmNob3IgfHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gIHRlc3RBbmNob3IuaHJlZiA9IHJlbGF0aXZlVXJpO1xyXG4gIHJldHVybiB0ZXN0QW5jaG9yLmhyZWY7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbmRDbG9zZXN0QW5jZXN0b3IoZWxlbWVudDogRWxlbWVudCB8IG51bGwsIHRhZ05hbWU6IHN0cmluZykge1xyXG4gIHJldHVybiAhZWxlbWVudFxyXG4gICAgPyBudWxsXHJcbiAgICA6IGVsZW1lbnQudGFnTmFtZSA9PT0gdGFnTmFtZVxyXG4gICAgICA/IGVsZW1lbnRcclxuICAgICAgOiBmaW5kQ2xvc2VzdEFuY2VzdG9yKGVsZW1lbnQucGFyZW50RWxlbWVudCwgdGFnTmFtZSlcclxufVxyXG5cclxuZnVuY3Rpb24gaXNXaXRoaW5CYXNlVXJpU3BhY2UoaHJlZjogc3RyaW5nKSB7XHJcbiAgY29uc3QgYmFzZVVyaVdpdGhUcmFpbGluZ1NsYXNoID0gdG9CYXNlVXJpV2l0aFRyYWlsaW5nU2xhc2goZG9jdW1lbnQuYmFzZVVSSSEpOyAvLyBUT0RPOiBNaWdodCBiYXNlVVJJIHJlYWxseSBiZSBudWxsP1xyXG4gIHJldHVybiBocmVmLnN0YXJ0c1dpdGgoYmFzZVVyaVdpdGhUcmFpbGluZ1NsYXNoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdG9CYXNlVXJpV2l0aFRyYWlsaW5nU2xhc2goYmFzZVVyaTogc3RyaW5nKSB7XHJcbiAgcmV0dXJuIGJhc2VVcmkuc3Vic3RyKDAsIGJhc2VVcmkubGFzdEluZGV4T2YoJy8nKSArIDEpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBldmVudEhhc1NwZWNpYWxLZXkoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuICByZXR1cm4gZXZlbnQuY3RybEtleSB8fCBldmVudC5zaGlmdEtleSB8fCBldmVudC5hbHRLZXkgfHwgZXZlbnQubWV0YUtleTtcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvU2VydmljZXMvVXJpSGVscGVyLnRzIiwiaW1wb3J0IHsgcGxhdGZvcm0gfSBmcm9tICcuL0Vudmlyb25tZW50JztcclxuaW1wb3J0IHsgZ2V0QXNzZW1ibHlOYW1lRnJvbVVybCB9IGZyb20gJy4vUGxhdGZvcm0vRG90TmV0JztcclxuaW1wb3J0ICcuL1JlbmRlcmluZy9SZW5kZXJlcic7XHJcbmltcG9ydCAnLi9TZXJ2aWNlcy9IdHRwJztcclxuaW1wb3J0ICcuL1NlcnZpY2VzL1VyaUhlbHBlcic7XHJcbmltcG9ydCAnLi9HbG9iYWxFeHBvcnRzJztcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGJvb3QoKSB7XHJcbiAgLy8gUmVhZCBzdGFydHVwIGNvbmZpZyBmcm9tIHRoZSA8c2NyaXB0PiBlbGVtZW50IHRoYXQncyBpbXBvcnRpbmcgdGhpcyBmaWxlXHJcbiAgY29uc3QgYWxsU2NyaXB0RWxlbXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0Jyk7XHJcbiAgY29uc3QgdGhpc1NjcmlwdEVsZW0gPSAoZG9jdW1lbnQuY3VycmVudFNjcmlwdCB8fCBhbGxTY3JpcHRFbGVtc1thbGxTY3JpcHRFbGVtcy5sZW5ndGggLSAxXSkgYXMgSFRNTFNjcmlwdEVsZW1lbnQ7XHJcbiAgY29uc3QgaXNMaW5rZXJFbmFibGVkID0gdGhpc1NjcmlwdEVsZW0uZ2V0QXR0cmlidXRlKCdsaW5rZXItZW5hYmxlZCcpID09PSAndHJ1ZSc7XHJcbiAgY29uc3QgZW50cnlQb2ludERsbCA9IGdldFJlcXVpcmVkQm9vdFNjcmlwdEF0dHJpYnV0ZSh0aGlzU2NyaXB0RWxlbSwgJ21haW4nKTtcclxuICBjb25zdCBlbnRyeVBvaW50TWV0aG9kID0gZ2V0UmVxdWlyZWRCb290U2NyaXB0QXR0cmlidXRlKHRoaXNTY3JpcHRFbGVtLCAnZW50cnlwb2ludCcpO1xyXG4gIGNvbnN0IGVudHJ5UG9pbnRBc3NlbWJseU5hbWUgPSBnZXRBc3NlbWJseU5hbWVGcm9tVXJsKGVudHJ5UG9pbnREbGwpO1xyXG4gIGNvbnN0IHJlZmVyZW5jZUFzc2VtYmxpZXNDb21tYVNlcGFyYXRlZCA9IHRoaXNTY3JpcHRFbGVtLmdldEF0dHJpYnV0ZSgncmVmZXJlbmNlcycpIHx8ICcnO1xyXG4gIGNvbnN0IHJlZmVyZW5jZUFzc2VtYmxpZXMgPSByZWZlcmVuY2VBc3NlbWJsaWVzQ29tbWFTZXBhcmF0ZWRcclxuICAgIC5zcGxpdCgnLCcpXHJcbiAgICAubWFwKHMgPT4gcy50cmltKCkpXHJcbiAgICAuZmlsdGVyKHMgPT4gISFzKTtcclxuXHJcbiAgaWYgKCFpc0xpbmtlckVuYWJsZWQpIHtcclxuICAgIGNvbnNvbGUuaW5mbygnQmxhem9yIGlzIHJ1bm5pbmcgaW4gZGV2IG1vZGUgd2l0aG91dCBJTCBzdHJpcHBpbmcuIFRvIG1ha2UgdGhlIGJ1bmRsZSBzaXplIHNpZ25pZmljYW50bHkgc21hbGxlciwgcHVibGlzaCB0aGUgYXBwbGljYXRpb24gb3Igc2VlIGh0dHBzOi8vZ28ubWljcm9zb2Z0LmNvbS9md2xpbmsvP2xpbmtpZD04NzA0MTQnKTtcclxuICB9XHJcblxyXG4gIC8vIERldGVybWluZSB0aGUgVVJMcyBvZiB0aGUgYXNzZW1ibGllcyB3ZSB3YW50IHRvIGxvYWRcclxuICBjb25zdCBsb2FkQXNzZW1ibHlVcmxzID0gW2VudHJ5UG9pbnREbGxdXHJcbiAgICAuY29uY2F0KHJlZmVyZW5jZUFzc2VtYmxpZXMpXHJcbiAgICAubWFwKGZpbGVuYW1lID0+IGBfZnJhbWV3b3JrL19iaW4vJHtmaWxlbmFtZX1gKTtcclxuXHJcbiAgdHJ5IHtcclxuICAgIGF3YWl0IHBsYXRmb3JtLnN0YXJ0KGxvYWRBc3NlbWJseVVybHMpO1xyXG4gIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBzdGFydCBwbGF0Zm9ybS4gUmVhc29uOiAke2V4fWApO1xyXG4gIH1cclxuXHJcbiAgLy8gU3RhcnQgdXAgdGhlIGFwcGxpY2F0aW9uXHJcbiAgcGxhdGZvcm0uY2FsbEVudHJ5UG9pbnQoZW50cnlQb2ludEFzc2VtYmx5TmFtZSwgZW50cnlQb2ludE1ldGhvZCwgW10pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRSZXF1aXJlZEJvb3RTY3JpcHRBdHRyaWJ1dGUoZWxlbTogSFRNTFNjcmlwdEVsZW1lbnQsIGF0dHJpYnV0ZU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgY29uc3QgcmVzdWx0ID0gZWxlbS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XHJcbiAgaWYgKCFyZXN1bHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBcIiR7YXR0cmlidXRlTmFtZX1cIiBhdHRyaWJ1dGUgb24gQmxhem9yIHNjcmlwdCB0YWcuYCk7XHJcbiAgfVxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmJvb3QoKTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0Jvb3QudHMiLCJpbXBvcnQgeyBNZXRob2RIYW5kbGUsIFN5c3RlbV9PYmplY3QsIFN5c3RlbV9TdHJpbmcsIFN5c3RlbV9BcnJheSwgUG9pbnRlciwgUGxhdGZvcm0gfSBmcm9tICcuLi9QbGF0Zm9ybSc7XHJcbmltcG9ydCB7IGdldEFzc2VtYmx5TmFtZUZyb21VcmwgfSBmcm9tICcuLi9Eb3ROZXQnO1xyXG5pbXBvcnQgeyBnZXRSZWdpc3RlcmVkRnVuY3Rpb24gfSBmcm9tICcuLi8uLi9JbnRlcm9wL1JlZ2lzdGVyZWRGdW5jdGlvbic7XHJcblxyXG5jb25zdCBhc3NlbWJseUhhbmRsZUNhY2hlOiB7IFthc3NlbWJseU5hbWU6IHN0cmluZ106IG51bWJlciB9ID0ge307XHJcbmNvbnN0IHR5cGVIYW5kbGVDYWNoZTogeyBbZnVsbHlRdWFsaWZpZWRUeXBlTmFtZTogc3RyaW5nXTogbnVtYmVyIH0gPSB7fTtcclxuY29uc3QgbWV0aG9kSGFuZGxlQ2FjaGU6IHsgW2Z1bGx5UXVhbGlmaWVkTWV0aG9kTmFtZTogc3RyaW5nXTogTWV0aG9kSGFuZGxlIH0gPSB7fTtcclxuXHJcbmxldCBhc3NlbWJseV9sb2FkOiAoYXNzZW1ibHlOYW1lOiBzdHJpbmcpID0+IG51bWJlcjtcclxubGV0IGZpbmRfY2xhc3M6IChhc3NlbWJseUhhbmRsZTogbnVtYmVyLCBuYW1lc3BhY2U6IHN0cmluZywgY2xhc3NOYW1lOiBzdHJpbmcpID0+IG51bWJlcjtcclxubGV0IGZpbmRfbWV0aG9kOiAodHlwZUhhbmRsZTogbnVtYmVyLCBtZXRob2ROYW1lOiBzdHJpbmcsIHVua25vd25Bcmc6IG51bWJlcikgPT4gTWV0aG9kSGFuZGxlO1xyXG5sZXQgaW52b2tlX21ldGhvZDogKG1ldGhvZDogTWV0aG9kSGFuZGxlLCB0YXJnZXQ6IFN5c3RlbV9PYmplY3QsIGFyZ3NBcnJheVB0cjogbnVtYmVyLCBleGNlcHRpb25GbGFnSW50UHRyOiBudW1iZXIpID0+IFN5c3RlbV9PYmplY3Q7XHJcbmxldCBtb25vX3N0cmluZ19nZXRfdXRmODogKG1hbmFnZWRTdHJpbmc6IFN5c3RlbV9TdHJpbmcpID0+IE1vbm8uVXRmOFB0cjtcclxubGV0IG1vbm9fc3RyaW5nOiAoanNTdHJpbmc6IHN0cmluZykgPT4gU3lzdGVtX1N0cmluZztcclxuXHJcbmV4cG9ydCBjb25zdCBtb25vUGxhdGZvcm06IFBsYXRmb3JtID0ge1xyXG4gIHN0YXJ0OiBmdW5jdGlvbiBzdGFydChsb2FkQXNzZW1ibHlVcmxzOiBzdHJpbmdbXSkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgLy8gbW9uby5qcyBhc3N1bWVzIHRoZSBleGlzdGVuY2Ugb2YgdGhpc1xyXG4gICAgICB3aW5kb3dbJ0Jyb3dzZXInXSA9IHtcclxuICAgICAgICBpbml0OiAoKSA9PiB7IH0sXHJcbiAgICAgICAgYXN5bmNMb2FkOiBhc3luY0xvYWRcclxuICAgICAgfTtcclxuICAgICAgLy8gRW1zY3JpcHRlbiB3b3JrcyBieSBleHBlY3RpbmcgdGhlIG1vZHVsZSBjb25maWcgdG8gYmUgYSBnbG9iYWxcclxuICAgICAgd2luZG93WydNb2R1bGUnXSA9IGNyZWF0ZUVtc2NyaXB0ZW5Nb2R1bGVJbnN0YW5jZShsb2FkQXNzZW1ibHlVcmxzLCByZXNvbHZlLCByZWplY3QpO1xyXG5cclxuICAgICAgYWRkU2NyaXB0VGFnc1RvRG9jdW1lbnQoKTtcclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIGZpbmRNZXRob2Q6IGZpbmRNZXRob2QsXHJcblxyXG4gIGNhbGxFbnRyeVBvaW50OiBmdW5jdGlvbiBjYWxsRW50cnlQb2ludChhc3NlbWJseU5hbWU6IHN0cmluZywgZW50cnlwb2ludE1ldGhvZDogc3RyaW5nLCBhcmdzOiBTeXN0ZW1fT2JqZWN0W10pOiB2b2lkIHtcclxuICAgIC8vIFBhcnNlIHRoZSBlbnRyeXBvaW50TWV0aG9kLCB3aGljaCBpcyBvZiB0aGUgZm9ybSBNeUFwcC5NeU5hbWVzcGFjZS5NeVR5cGVOYW1lOjpNeU1ldGhvZE5hbWVcclxuICAgIC8vIE5vdGUgdGhhdCB3ZSBkb24ndCBzdXBwb3J0IHNwZWNpZnlpbmcgYSBtZXRob2Qgb3ZlcmxvYWQsIHNvIGl0IGhhcyB0byBiZSB1bmlxdWVcclxuICAgIGNvbnN0IGVudHJ5cG9pbnRTZWdtZW50cyA9IGVudHJ5cG9pbnRNZXRob2Quc3BsaXQoJzo6Jyk7XHJcbiAgICBpZiAoZW50cnlwb2ludFNlZ21lbnRzLmxlbmd0aCAhPSAyKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWFsZm9ybWVkIGVudHJ5IHBvaW50IG1ldGhvZCBuYW1lOyBjb3VsZCBub3QgcmVzb2x2ZSBjbGFzcyBuYW1lIGFuZCBtZXRob2QgbmFtZS4nKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHR5cGVGdWxsTmFtZSA9IGVudHJ5cG9pbnRTZWdtZW50c1swXTtcclxuICAgIGNvbnN0IG1ldGhvZE5hbWUgPSBlbnRyeXBvaW50U2VnbWVudHNbMV07XHJcbiAgICBjb25zdCBsYXN0RG90ID0gdHlwZUZ1bGxOYW1lLmxhc3RJbmRleE9mKCcuJyk7XHJcbiAgICBjb25zdCBuYW1lc3BhY2UgPSBsYXN0RG90ID4gLTEgPyB0eXBlRnVsbE5hbWUuc3Vic3RyaW5nKDAsIGxhc3REb3QpIDogJyc7XHJcbiAgICBjb25zdCB0eXBlU2hvcnROYW1lID0gbGFzdERvdCA+IC0xID8gdHlwZUZ1bGxOYW1lLnN1YnN0cmluZyhsYXN0RG90ICsgMSkgOiB0eXBlRnVsbE5hbWU7XHJcblxyXG4gICAgY29uc3QgZW50cnlQb2ludE1ldGhvZEhhbmRsZSA9IG1vbm9QbGF0Zm9ybS5maW5kTWV0aG9kKGFzc2VtYmx5TmFtZSwgbmFtZXNwYWNlLCB0eXBlU2hvcnROYW1lLCBtZXRob2ROYW1lKTtcclxuICAgIG1vbm9QbGF0Zm9ybS5jYWxsTWV0aG9kKGVudHJ5UG9pbnRNZXRob2RIYW5kbGUsIG51bGwsIGFyZ3MpO1xyXG4gIH0sXHJcblxyXG4gIGNhbGxNZXRob2Q6IGZ1bmN0aW9uIGNhbGxNZXRob2QobWV0aG9kOiBNZXRob2RIYW5kbGUsIHRhcmdldDogU3lzdGVtX09iamVjdCwgYXJnczogU3lzdGVtX09iamVjdFtdKTogU3lzdGVtX09iamVjdCB7XHJcbiAgICBpZiAoYXJncy5sZW5ndGggPiA0KSB7XHJcbiAgICAgIC8vIEhvcGVmdWxseSB0aGlzIHJlc3RyaWN0aW9uIGNhbiBiZSBlYXNlZCBzb29uLCBidXQgZm9yIG5vdyBtYWtlIGl0IGNsZWFyIHdoYXQncyBnb2luZyBvblxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEN1cnJlbnRseSwgTW9ub1BsYXRmb3JtIHN1cHBvcnRzIHBhc3NpbmcgYSBtYXhpbXVtIG9mIDQgYXJndW1lbnRzIGZyb20gSlMgdG8gLk5FVC4gWW91IHRyaWVkIHRvIHBhc3MgJHthcmdzLmxlbmd0aH0uYCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc3RhY2sgPSBNb2R1bGUuc3RhY2tTYXZlKCk7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgYXJnc0J1ZmZlciA9IE1vZHVsZS5zdGFja0FsbG9jKGFyZ3MubGVuZ3RoKTtcclxuICAgICAgY29uc3QgZXhjZXB0aW9uRmxhZ01hbmFnZWRJbnQgPSBNb2R1bGUuc3RhY2tBbGxvYyg0KTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgTW9kdWxlLnNldFZhbHVlKGFyZ3NCdWZmZXIgKyBpICogNCwgYXJnc1tpXSwgJ2kzMicpO1xyXG4gICAgICB9XHJcbiAgICAgIE1vZHVsZS5zZXRWYWx1ZShleGNlcHRpb25GbGFnTWFuYWdlZEludCwgMCwgJ2kzMicpO1xyXG5cclxuICAgICAgY29uc3QgcmVzID0gaW52b2tlX21ldGhvZChtZXRob2QsIHRhcmdldCwgYXJnc0J1ZmZlciwgZXhjZXB0aW9uRmxhZ01hbmFnZWRJbnQpO1xyXG5cclxuICAgICAgaWYgKE1vZHVsZS5nZXRWYWx1ZShleGNlcHRpb25GbGFnTWFuYWdlZEludCwgJ2kzMicpICE9PSAwKSB7XHJcbiAgICAgICAgLy8gSWYgdGhlIGV4Y2VwdGlvbiBmbGFnIGlzIHNldCwgdGhlIHJldHVybmVkIHZhbHVlIGlzIGV4Y2VwdGlvbi5Ub1N0cmluZygpXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1vbm9QbGF0Zm9ybS50b0phdmFTY3JpcHRTdHJpbmcoPFN5c3RlbV9TdHJpbmc+cmVzKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiByZXM7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICBNb2R1bGUuc3RhY2tSZXN0b3JlKHN0YWNrKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICB0b0phdmFTY3JpcHRTdHJpbmc6IGZ1bmN0aW9uIHRvSmF2YVNjcmlwdFN0cmluZyhtYW5hZ2VkU3RyaW5nOiBTeXN0ZW1fU3RyaW5nKSB7XHJcbiAgICAvLyBDb21tZW50cyBmcm9tIG9yaWdpbmFsIE1vbm8gc2FtcGxlOlxyXG4gICAgLy9GSVhNRSB0aGlzIGlzIHdhc3RlZnVsbCwgd2UgY291bGQgcmVtb3ZlIHRoZSB0ZW1wIG1hbGxvYyBieSBnb2luZyB0aGUgVVRGMTYgcm91dGVcclxuICAgIC8vRklYTUUgdGhpcyBpcyB1bnNhZmUsIGN1eiByYXcgb2JqZWN0cyBjb3VsZCBiZSBHQydkLlxyXG5cclxuICAgIGNvbnN0IHV0ZjggPSBtb25vX3N0cmluZ19nZXRfdXRmOChtYW5hZ2VkU3RyaW5nKTtcclxuICAgIGNvbnN0IHJlcyA9IE1vZHVsZS5VVEY4VG9TdHJpbmcodXRmOCk7XHJcbiAgICBNb2R1bGUuX2ZyZWUodXRmOCBhcyBhbnkpO1xyXG4gICAgcmV0dXJuIHJlcztcclxuICB9LFxyXG5cclxuICB0b0RvdE5ldFN0cmluZzogZnVuY3Rpb24gdG9Eb3ROZXRTdHJpbmcoanNTdHJpbmc6IHN0cmluZyk6IFN5c3RlbV9TdHJpbmcge1xyXG4gICAgcmV0dXJuIG1vbm9fc3RyaW5nKGpzU3RyaW5nKTtcclxuICB9LFxyXG5cclxuICB0b1VpbnQ4QXJyYXk6IGZ1bmN0aW9uIHRvVWludDhBcnJheShhcnJheTogU3lzdGVtX0FycmF5PGFueT4pOiBVaW50OEFycmF5IHtcclxuICAgIGNvbnN0IGRhdGFQdHIgPSBnZXRBcnJheURhdGFQb2ludGVyKGFycmF5KTtcclxuICAgIGNvbnN0IGxlbmd0aCA9IE1vZHVsZS5nZXRWYWx1ZShkYXRhUHRyLCAnaTMyJyk7XHJcbiAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoTW9kdWxlLkhFQVBVOC5idWZmZXIsIGRhdGFQdHIgKyA0LCBsZW5ndGgpO1xyXG4gIH0sXHJcblxyXG4gIGdldEFycmF5TGVuZ3RoOiBmdW5jdGlvbiBnZXRBcnJheUxlbmd0aChhcnJheTogU3lzdGVtX0FycmF5PGFueT4pOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIE1vZHVsZS5nZXRWYWx1ZShnZXRBcnJheURhdGFQb2ludGVyKGFycmF5KSwgJ2kzMicpO1xyXG4gIH0sXHJcblxyXG4gIGdldEFycmF5RW50cnlQdHI6IGZ1bmN0aW9uIGdldEFycmF5RW50cnlQdHI8VFB0ciBleHRlbmRzIFBvaW50ZXI+KGFycmF5OiBTeXN0ZW1fQXJyYXk8VFB0cj4sIGluZGV4OiBudW1iZXIsIGl0ZW1TaXplOiBudW1iZXIpOiBUUHRyIHtcclxuICAgIC8vIEZpcnN0IGJ5dGUgaXMgYXJyYXkgbGVuZ3RoLCBmb2xsb3dlZCBieSBlbnRyaWVzXHJcbiAgICBjb25zdCBhZGRyZXNzID0gZ2V0QXJyYXlEYXRhUG9pbnRlcihhcnJheSkgKyA0ICsgaW5kZXggKiBpdGVtU2l6ZTtcclxuICAgIHJldHVybiBhZGRyZXNzIGFzIGFueSBhcyBUUHRyO1xyXG4gIH0sXHJcblxyXG4gIGdldE9iamVjdEZpZWxkc0Jhc2VBZGRyZXNzOiBmdW5jdGlvbiBnZXRPYmplY3RGaWVsZHNCYXNlQWRkcmVzcyhyZWZlcmVuY2VUeXBlZE9iamVjdDogU3lzdGVtX09iamVjdCk6IFBvaW50ZXIge1xyXG4gICAgLy8gVGhlIGZpcnN0IHR3byBpbnQzMiB2YWx1ZXMgYXJlIGludGVybmFsIE1vbm8gZGF0YVxyXG4gICAgcmV0dXJuIChyZWZlcmVuY2VUeXBlZE9iamVjdCBhcyBhbnkgYXMgbnVtYmVyICsgOCkgYXMgYW55IGFzIFBvaW50ZXI7XHJcbiAgfSxcclxuXHJcbiAgcmVhZEludDMyRmllbGQ6IGZ1bmN0aW9uIHJlYWRIZWFwSW50MzIoYmFzZUFkZHJlc3M6IFBvaW50ZXIsIGZpZWxkT2Zmc2V0PzogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBNb2R1bGUuZ2V0VmFsdWUoKGJhc2VBZGRyZXNzIGFzIGFueSBhcyBudW1iZXIpICsgKGZpZWxkT2Zmc2V0IHx8IDApLCAnaTMyJyk7XHJcbiAgfSxcclxuXHJcbiAgcmVhZEZsb2F0RmllbGQ6IGZ1bmN0aW9uIHJlYWRIZWFwRmxvYXQoYmFzZUFkZHJlc3M6IFBvaW50ZXIsIGZpZWxkT2Zmc2V0PzogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBNb2R1bGUuZ2V0VmFsdWUoKGJhc2VBZGRyZXNzIGFzIGFueSBhcyBudW1iZXIpICsgKGZpZWxkT2Zmc2V0IHx8IDApLCAnZmxvYXQnKTtcclxuICB9LFxyXG5cclxuICByZWFkT2JqZWN0RmllbGQ6IGZ1bmN0aW9uIHJlYWRIZWFwT2JqZWN0PFQgZXh0ZW5kcyBTeXN0ZW1fT2JqZWN0PihiYXNlQWRkcmVzczogUG9pbnRlciwgZmllbGRPZmZzZXQ/OiBudW1iZXIpOiBUIHtcclxuICAgIHJldHVybiBNb2R1bGUuZ2V0VmFsdWUoKGJhc2VBZGRyZXNzIGFzIGFueSBhcyBudW1iZXIpICsgKGZpZWxkT2Zmc2V0IHx8IDApLCAnaTMyJykgYXMgYW55IGFzIFQ7XHJcbiAgfSxcclxuXHJcbiAgcmVhZFN0cmluZ0ZpZWxkOiBmdW5jdGlvbiByZWFkSGVhcE9iamVjdChiYXNlQWRkcmVzczogUG9pbnRlciwgZmllbGRPZmZzZXQ/OiBudW1iZXIpOiBzdHJpbmcgfCBudWxsIHtcclxuICAgIGNvbnN0IGZpZWxkVmFsdWUgPSBNb2R1bGUuZ2V0VmFsdWUoKGJhc2VBZGRyZXNzIGFzIGFueSBhcyBudW1iZXIpICsgKGZpZWxkT2Zmc2V0IHx8IDApLCAnaTMyJyk7XHJcbiAgICByZXR1cm4gZmllbGRWYWx1ZSA9PT0gMCA/IG51bGwgOiBtb25vUGxhdGZvcm0udG9KYXZhU2NyaXB0U3RyaW5nKGZpZWxkVmFsdWUgYXMgYW55IGFzIFN5c3RlbV9TdHJpbmcpO1xyXG4gIH0sXHJcblxyXG4gIHJlYWRTdHJ1Y3RGaWVsZDogZnVuY3Rpb24gcmVhZFN0cnVjdEZpZWxkPFQgZXh0ZW5kcyBQb2ludGVyPihiYXNlQWRkcmVzczogUG9pbnRlciwgZmllbGRPZmZzZXQ/OiBudW1iZXIpOiBUIHtcclxuICAgIHJldHVybiAoKGJhc2VBZGRyZXNzIGFzIGFueSBhcyBudW1iZXIpICsgKGZpZWxkT2Zmc2V0IHx8IDApKSBhcyBhbnkgYXMgVDtcclxuICB9LFxyXG59O1xyXG5cclxuLy8gQnlwYXNzIG5vcm1hbCB0eXBlIGNoZWNraW5nIHRvIGFkZCB0aGlzIGV4dHJhIGZ1bmN0aW9uLiBJdCdzIG9ubHkgaW50ZW5kZWQgdG8gYmUgY2FsbGVkIGZyb21cclxuLy8gdGhlIEpTIGNvZGUgaW4gTW9ubydzIGRyaXZlci5jLiBJdCdzIG5ldmVyIGludGVuZGVkIHRvIGJlIGNhbGxlZCBmcm9tIFR5cGVTY3JpcHQuXHJcbihtb25vUGxhdGZvcm0gYXMgYW55KS5tb25vR2V0UmVnaXN0ZXJlZEZ1bmN0aW9uID0gZ2V0UmVnaXN0ZXJlZEZ1bmN0aW9uO1xyXG5cclxuZnVuY3Rpb24gZmluZEFzc2VtYmx5KGFzc2VtYmx5TmFtZTogc3RyaW5nKTogbnVtYmVyIHtcclxuICBsZXQgYXNzZW1ibHlIYW5kbGUgPSBhc3NlbWJseUhhbmRsZUNhY2hlW2Fzc2VtYmx5TmFtZV07XHJcbiAgaWYgKCFhc3NlbWJseUhhbmRsZSkge1xyXG4gICAgYXNzZW1ibHlIYW5kbGUgPSBhc3NlbWJseV9sb2FkKGFzc2VtYmx5TmFtZSk7XHJcbiAgICBpZiAoIWFzc2VtYmx5SGFuZGxlKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgYXNzZW1ibHkgXCIke2Fzc2VtYmx5TmFtZX1cImApO1xyXG4gICAgfVxyXG4gICAgYXNzZW1ibHlIYW5kbGVDYWNoZVthc3NlbWJseU5hbWVdID0gYXNzZW1ibHlIYW5kbGU7XHJcbiAgfVxyXG4gIHJldHVybiBhc3NlbWJseUhhbmRsZTtcclxufVxyXG5cclxuZnVuY3Rpb24gZmluZFR5cGUoYXNzZW1ibHlOYW1lOiBzdHJpbmcsIG5hbWVzcGFjZTogc3RyaW5nLCBjbGFzc05hbWU6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgY29uc3QgZnVsbHlRdWFsaWZpZWRUeXBlTmFtZSA9IGBbJHthc3NlbWJseU5hbWV9XSR7bmFtZXNwYWNlfS4ke2NsYXNzTmFtZX1gO1xyXG4gIGxldCB0eXBlSGFuZGxlID0gdHlwZUhhbmRsZUNhY2hlW2Z1bGx5UXVhbGlmaWVkVHlwZU5hbWVdO1xyXG4gIGlmICghdHlwZUhhbmRsZSkge1xyXG4gICAgdHlwZUhhbmRsZSA9IGZpbmRfY2xhc3MoZmluZEFzc2VtYmx5KGFzc2VtYmx5TmFtZSksIG5hbWVzcGFjZSwgY2xhc3NOYW1lKTtcclxuICAgIGlmICghdHlwZUhhbmRsZSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIHR5cGUgXCIke2NsYXNzTmFtZX1cIiBpbiBuYW1lc3BhY2UgXCIke25hbWVzcGFjZX1cIiBpbiBhc3NlbWJseSBcIiR7YXNzZW1ibHlOYW1lfVwiYCk7XHJcbiAgICB9XHJcbiAgICB0eXBlSGFuZGxlQ2FjaGVbZnVsbHlRdWFsaWZpZWRUeXBlTmFtZV0gPSB0eXBlSGFuZGxlO1xyXG4gIH1cclxuICByZXR1cm4gdHlwZUhhbmRsZTtcclxufVxyXG5cclxuZnVuY3Rpb24gZmluZE1ldGhvZChhc3NlbWJseU5hbWU6IHN0cmluZywgbmFtZXNwYWNlOiBzdHJpbmcsIGNsYXNzTmFtZTogc3RyaW5nLCBtZXRob2ROYW1lOiBzdHJpbmcpOiBNZXRob2RIYW5kbGUge1xyXG4gIGNvbnN0IGZ1bGx5UXVhbGlmaWVkTWV0aG9kTmFtZSA9IGBbJHthc3NlbWJseU5hbWV9XSR7bmFtZXNwYWNlfS4ke2NsYXNzTmFtZX06OiR7bWV0aG9kTmFtZX1gO1xyXG4gIGxldCBtZXRob2RIYW5kbGUgPSBtZXRob2RIYW5kbGVDYWNoZVtmdWxseVF1YWxpZmllZE1ldGhvZE5hbWVdO1xyXG4gIGlmICghbWV0aG9kSGFuZGxlKSB7XHJcbiAgICBtZXRob2RIYW5kbGUgPSBmaW5kX21ldGhvZChmaW5kVHlwZShhc3NlbWJseU5hbWUsIG5hbWVzcGFjZSwgY2xhc3NOYW1lKSwgbWV0aG9kTmFtZSwgLTEpO1xyXG4gICAgaWYgKCFtZXRob2RIYW5kbGUpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBtZXRob2QgXCIke21ldGhvZE5hbWV9XCIgb24gdHlwZSBcIiR7bmFtZXNwYWNlfS4ke2NsYXNzTmFtZX1cImApO1xyXG4gICAgfVxyXG4gICAgbWV0aG9kSGFuZGxlQ2FjaGVbZnVsbHlRdWFsaWZpZWRNZXRob2ROYW1lXSA9IG1ldGhvZEhhbmRsZTtcclxuICB9XHJcbiAgcmV0dXJuIG1ldGhvZEhhbmRsZTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkU2NyaXB0VGFnc1RvRG9jdW1lbnQoKSB7XHJcbiAgLy8gTG9hZCBlaXRoZXIgdGhlIHdhc20gb3IgYXNtLmpzIHZlcnNpb24gb2YgdGhlIE1vbm8gcnVudGltZVxyXG4gIGNvbnN0IGJyb3dzZXJTdXBwb3J0c05hdGl2ZVdlYkFzc2VtYmx5ID0gdHlwZW9mIFdlYkFzc2VtYmx5ICE9PSAndW5kZWZpbmVkJyAmJiBXZWJBc3NlbWJseS52YWxpZGF0ZTtcclxuICBjb25zdCBtb25vUnVudGltZVVybEJhc2UgPSAnX2ZyYW1ld29yay8nICsgKGJyb3dzZXJTdXBwb3J0c05hdGl2ZVdlYkFzc2VtYmx5ID8gJ3dhc20nIDogJ2FzbWpzJyk7XHJcbiAgY29uc3QgbW9ub1J1bnRpbWVTY3JpcHRVcmwgPSBgJHttb25vUnVudGltZVVybEJhc2V9L21vbm8uanNgO1xyXG5cclxuICBpZiAoIWJyb3dzZXJTdXBwb3J0c05hdGl2ZVdlYkFzc2VtYmx5KSB7XHJcbiAgICAvLyBJbiB0aGUgYXNtanMgY2FzZSwgdGhlIGluaXRpYWwgbWVtb3J5IHN0cnVjdHVyZSBpcyBpbiBhIHNlcGFyYXRlIGZpbGUgd2UgbmVlZCB0byBkb3dubG9hZFxyXG4gICAgY29uc3QgbWVtaW5pdFhIUiA9IE1vZHVsZVsnbWVtb3J5SW5pdGlhbGl6ZXJSZXF1ZXN0J10gPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgIG1lbWluaXRYSFIub3BlbignR0VUJywgYCR7bW9ub1J1bnRpbWVVcmxCYXNlfS9tb25vLmpzLm1lbWApO1xyXG4gICAgbWVtaW5pdFhIUi5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xyXG4gICAgbWVtaW5pdFhIUi5zZW5kKG51bGwpO1xyXG4gIH1cclxuXHJcbiAgZG9jdW1lbnQud3JpdGUoYDxzY3JpcHQgZGVmZXIgc3JjPVwiJHttb25vUnVudGltZVNjcmlwdFVybH1cIj48L3NjcmlwdD5gKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRW1zY3JpcHRlbk1vZHVsZUluc3RhbmNlKGxvYWRBc3NlbWJseVVybHM6IHN0cmluZ1tdLCBvblJlYWR5OiAoKSA9PiB2b2lkLCBvbkVycm9yOiAocmVhc29uPzogYW55KSA9PiB2b2lkKSB7XHJcbiAgY29uc3QgbW9kdWxlID0ge30gYXMgdHlwZW9mIE1vZHVsZTtcclxuICBjb25zdCB3YXNtQmluYXJ5RmlsZSA9ICdfZnJhbWV3b3JrL3dhc20vbW9uby53YXNtJztcclxuICBjb25zdCBhc21qc0NvZGVGaWxlID0gJ19mcmFtZXdvcmsvYXNtanMvbW9uby5hc20uanMnO1xyXG5cclxuICBtb2R1bGUucHJpbnQgPSBsaW5lID0+IGNvbnNvbGUubG9nKGBXQVNNOiAke2xpbmV9YCk7XHJcbiAgbW9kdWxlLnByaW50RXJyID0gbGluZSA9PiBjb25zb2xlLmVycm9yKGBXQVNNOiAke2xpbmV9YCk7XHJcbiAgbW9kdWxlLnByZVJ1biA9IFtdO1xyXG4gIG1vZHVsZS5wb3N0UnVuID0gW107XHJcbiAgbW9kdWxlLnByZWxvYWRQbHVnaW5zID0gW107XHJcblxyXG4gIG1vZHVsZS5sb2NhdGVGaWxlID0gZmlsZU5hbWUgPT4ge1xyXG4gICAgc3dpdGNoIChmaWxlTmFtZSkge1xyXG4gICAgICBjYXNlICdtb25vLndhc20nOiByZXR1cm4gd2FzbUJpbmFyeUZpbGU7XHJcbiAgICAgIGNhc2UgJ21vbm8uYXNtLmpzJzogcmV0dXJuIGFzbWpzQ29kZUZpbGU7XHJcbiAgICAgIGRlZmF1bHQ6IHJldHVybiBmaWxlTmFtZTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBtb2R1bGUucHJlUnVuLnB1c2goKCkgPT4ge1xyXG4gICAgLy8gQnkgbm93LCBlbXNjcmlwdGVuIHNob3VsZCBiZSBpbml0aWFsaXNlZCBlbm91Z2ggdGhhdCB3ZSBjYW4gY2FwdHVyZSB0aGVzZSBtZXRob2RzIGZvciBsYXRlciB1c2VcclxuICAgIGFzc2VtYmx5X2xvYWQgPSBNb2R1bGUuY3dyYXAoJ21vbm9fd2FzbV9hc3NlbWJseV9sb2FkJywgJ251bWJlcicsIFsnc3RyaW5nJ10pO1xyXG4gICAgZmluZF9jbGFzcyA9IE1vZHVsZS5jd3JhcCgnbW9ub193YXNtX2Fzc2VtYmx5X2ZpbmRfY2xhc3MnLCAnbnVtYmVyJywgWydudW1iZXInLCAnc3RyaW5nJywgJ3N0cmluZyddKTtcclxuICAgIGZpbmRfbWV0aG9kID0gTW9kdWxlLmN3cmFwKCdtb25vX3dhc21fYXNzZW1ibHlfZmluZF9tZXRob2QnLCAnbnVtYmVyJywgWydudW1iZXInLCAnc3RyaW5nJywgJ251bWJlciddKTtcclxuICAgIGludm9rZV9tZXRob2QgPSBNb2R1bGUuY3dyYXAoJ21vbm9fd2FzbV9pbnZva2VfbWV0aG9kJywgJ251bWJlcicsIFsnbnVtYmVyJywgJ251bWJlcicsICdudW1iZXInXSk7XHJcbiAgICBtb25vX3N0cmluZ19nZXRfdXRmOCA9IE1vZHVsZS5jd3JhcCgnbW9ub193YXNtX3N0cmluZ19nZXRfdXRmOCcsICdudW1iZXInLCBbJ251bWJlciddKTtcclxuICAgIG1vbm9fc3RyaW5nID0gTW9kdWxlLmN3cmFwKCdtb25vX3dhc21fc3RyaW5nX2Zyb21fanMnLCAnbnVtYmVyJywgWydzdHJpbmcnXSk7XHJcblxyXG4gICAgTW9kdWxlLkZTX2NyZWF0ZVBhdGgoJy8nLCAnYXBwQmluRGlyJywgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICBsb2FkQXNzZW1ibHlVcmxzLmZvckVhY2godXJsID0+XHJcbiAgICAgIEZTLmNyZWF0ZVByZWxvYWRlZEZpbGUoJ2FwcEJpbkRpcicsIGAke2dldEFzc2VtYmx5TmFtZUZyb21VcmwodXJsKX0uZGxsYCwgdXJsLCB0cnVlLCBmYWxzZSwgdW5kZWZpbmVkLCBvbkVycm9yKSk7XHJcbiAgfSk7XHJcblxyXG4gIG1vZHVsZS5wb3N0UnVuLnB1c2goKCkgPT4ge1xyXG4gICAgY29uc3QgbG9hZF9ydW50aW1lID0gTW9kdWxlLmN3cmFwKCdtb25vX3dhc21fbG9hZF9ydW50aW1lJywgbnVsbCwgWydzdHJpbmcnXSk7XHJcbiAgICBsb2FkX3J1bnRpbWUoJ2FwcEJpbkRpcicpO1xyXG4gICAgb25SZWFkeSgpO1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gbW9kdWxlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhc3luY0xvYWQodXJsLCBvbmxvYWQsIG9uZXJyb3IpIHtcclxuICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0O1xyXG4gIHhoci5vcGVuKCdHRVQnLCB1cmwsIC8qIGFzeW5jOiAqLyB0cnVlKTtcclxuICB4aHIucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcclxuICB4aHIub25sb2FkID0gZnVuY3Rpb24geGhyX29ubG9hZCgpIHtcclxuICAgIGlmICh4aHIuc3RhdHVzID09IDIwMCB8fCB4aHIuc3RhdHVzID09IDAgJiYgeGhyLnJlc3BvbnNlKSB7XHJcbiAgICAgIHZhciBhc20gPSBuZXcgVWludDhBcnJheSh4aHIucmVzcG9uc2UpO1xyXG4gICAgICBvbmxvYWQoYXNtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG9uZXJyb3IoeGhyKTtcclxuICAgIH1cclxuICB9O1xyXG4gIHhoci5vbmVycm9yID0gb25lcnJvcjtcclxuICB4aHIuc2VuZChudWxsKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0QXJyYXlEYXRhUG9pbnRlcjxUPihhcnJheTogU3lzdGVtX0FycmF5PFQ+KTogbnVtYmVyIHtcclxuICByZXR1cm4gPG51bWJlcj48YW55PmFycmF5ICsgMTI7IC8vIEZpcnN0IGJ5dGUgZnJvbSBoZXJlIGlzIGxlbmd0aCwgdGhlbiBmb2xsb3dpbmcgYnl0ZXMgYXJlIGVudHJpZXNcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUGxhdGZvcm0vTW9uby9Nb25vUGxhdGZvcm0udHMiLCJpbXBvcnQgeyBpbnZva2VXaXRoSnNvbk1hcnNoYWxsaW5nLCBpbnZva2VXaXRoSnNvbk1hcnNoYWxsaW5nQXN5bmMgfSBmcm9tICcuL0ludm9rZUphdmFTY3JpcHRGdW5jdGlvbldpdGhKc29uTWFyc2hhbGxpbmcnO1xyXG5pbXBvcnQgeyBpbnZva2VQcm9taXNlQ2FsbGJhY2sgfSBmcm9tICcuL0ludm9rZURvdE5ldE1ldGhvZFdpdGhKc29uTWFyc2hhbGxpbmcnO1xyXG5pbXBvcnQgeyBhdHRhY2hSb290Q29tcG9uZW50VG9FbGVtZW50LCByZW5kZXJCYXRjaCB9IGZyb20gJy4uL1JlbmRlcmluZy9SZW5kZXJlcic7XHJcblxyXG4vKipcclxuICogVGhlIGRlZmluaXRpdmUgbGlzdCBvZiBpbnRlcm5hbCBmdW5jdGlvbnMgaW52b2thYmxlIGZyb20gLk5FVCBjb2RlLlxyXG4gKiBUaGVzZSBmdW5jdGlvbiBuYW1lcyBhcmUgdHJlYXRlZCBhcyAncmVzZXJ2ZWQnIGFuZCBjYW5ub3QgYmUgcGFzc2VkIHRvIHJlZ2lzdGVyRnVuY3Rpb24uXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgaW50ZXJuYWxSZWdpc3RlcmVkRnVuY3Rpb25zID0ge1xyXG4gIGF0dGFjaFJvb3RDb21wb25lbnRUb0VsZW1lbnQsXHJcbiAgaW52b2tlV2l0aEpzb25NYXJzaGFsbGluZyxcclxuICBpbnZva2VXaXRoSnNvbk1hcnNoYWxsaW5nQXN5bmMsXHJcbiAgaW52b2tlUHJvbWlzZUNhbGxiYWNrLFxyXG4gIHJlbmRlckJhdGNoLFxyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvSW50ZXJvcC9JbnRlcm5hbFJlZ2lzdGVyZWRGdW5jdGlvbi50cyIsImltcG9ydCB7IHBsYXRmb3JtIH0gZnJvbSAnLi4vRW52aXJvbm1lbnQnO1xyXG5pbXBvcnQgeyBTeXN0ZW1fU3RyaW5nIH0gZnJvbSAnLi4vUGxhdGZvcm0vUGxhdGZvcm0nO1xyXG5pbXBvcnQgeyBnZXRSZWdpc3RlcmVkRnVuY3Rpb24gfSBmcm9tICcuL1JlZ2lzdGVyZWRGdW5jdGlvbic7XHJcbmltcG9ydCB7IGludm9rZURvdE5ldE1ldGhvZCwgTWV0aG9kT3B0aW9ucywgSW52b2NhdGlvblJlc3VsdCB9IGZyb20gJy4vSW52b2tlRG90TmV0TWV0aG9kV2l0aEpzb25NYXJzaGFsbGluZyc7XHJcbmltcG9ydCB7IGdldEVsZW1lbnRCeUNhcHR1cmVJZCB9IGZyb20gJy4uL1JlbmRlcmluZy9FbGVtZW50UmVmZXJlbmNlQ2FwdHVyZSc7XHJcbmltcG9ydCB7IFN5c3RlbSB9IGZyb20gJ3R5cGVzY3JpcHQnO1xyXG5pbXBvcnQgeyBlcnJvciB9IGZyb20gJ3V0aWwnO1xyXG5cclxuY29uc3QgZWxlbWVudFJlZktleSA9ICdfYmxhem9yRWxlbWVudFJlZic7IC8vIEtlZXAgaW4gc3luYyB3aXRoIEVsZW1lbnRSZWYuY3NcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbnZva2VXaXRoSnNvbk1hcnNoYWxsaW5nKGlkZW50aWZpZXI6IFN5c3RlbV9TdHJpbmcsIC4uLmFyZ3NKc29uOiBTeXN0ZW1fU3RyaW5nW10pIHtcclxuICBsZXQgcmVzdWx0OiBJbnZvY2F0aW9uUmVzdWx0O1xyXG4gIGNvbnN0IGlkZW50aWZpZXJKc1N0cmluZyA9IHBsYXRmb3JtLnRvSmF2YVNjcmlwdFN0cmluZyhpZGVudGlmaWVyKTtcclxuICBjb25zdCBhcmdzID0gYXJnc0pzb24ubWFwKGpzb24gPT4gSlNPTi5wYXJzZShwbGF0Zm9ybS50b0phdmFTY3JpcHRTdHJpbmcoanNvbiksIGpzb25SZXZpdmVyKSk7XHJcblxyXG4gIHRyeSB7XHJcbiAgICByZXN1bHQgPSB7IHN1Y2NlZWRlZDogdHJ1ZSwgcmVzdWx0OiBpbnZva2VXaXRoSnNvbk1hcnNoYWxsaW5nQ29yZShpZGVudGlmaWVySnNTdHJpbmcsIC4uLmFyZ3MpIH07XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgcmVzdWx0ID0geyBzdWNjZWVkZWQ6IGZhbHNlLCBtZXNzYWdlOiBlIGluc3RhbmNlb2YgRXJyb3IgPyBgJHtlLm1lc3NhZ2V9XFxuJHtlLnN0YWNrfWAgOiAoZSA/IGUudG9TdHJpbmcoKSA6IG51bGwpIH07XHJcbiAgfVxyXG5cclxuICBjb25zdCByZXN1bHRKc29uID0gSlNPTi5zdHJpbmdpZnkocmVzdWx0KTtcclxuICByZXR1cm4gcGxhdGZvcm0udG9Eb3ROZXRTdHJpbmcocmVzdWx0SnNvbik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGludm9rZVdpdGhKc29uTWFyc2hhbGxpbmdDb3JlKGlkZW50aWZpZXI6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcclxuICBjb25zdCBmdW5jSW5zdGFuY2UgPSBnZXRSZWdpc3RlcmVkRnVuY3Rpb24oaWRlbnRpZmllcik7XHJcbiAgY29uc3QgcmVzdWx0ID0gZnVuY0luc3RhbmNlLmFwcGx5KG51bGwsIGFyZ3MpO1xyXG4gIGlmIChyZXN1bHQgIT09IG51bGwgJiYgcmVzdWx0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgaW52b2tlRG90TmV0Q2FsbGJhY2s6IE1ldGhvZE9wdGlvbnMgPSB7XHJcbiAgdHlwZToge1xyXG4gICAgYXNzZW1ibHk6ICdNaWNyb3NvZnQuQXNwTmV0Q29yZS5CbGF6b3IuQnJvd3NlcicsXHJcbiAgICBuYW1lOiAnTWljcm9zb2Z0LkFzcE5ldENvcmUuQmxhem9yLkJyb3dzZXIuSW50ZXJvcC5UYXNrQ2FsbGJhY2snXHJcbiAgfSxcclxuICBtZXRob2Q6IHtcclxuICAgIG5hbWU6ICdJbnZva2VUYXNrQ2FsbGJhY2snXHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGludm9rZVdpdGhKc29uTWFyc2hhbGxpbmdBc3luYzxUPihpZGVudGlmaWVyOiBzdHJpbmcsIGNhbGxiYWNrSWQ6IHN0cmluZywgLi4uYXJnc0pzb246IHN0cmluZ1tdKSB7XHJcbiAgY29uc3QgcmVzdWx0ID0gaW52b2tlV2l0aEpzb25NYXJzaGFsbGluZ0NvcmUoaWRlbnRpZmllciwgLi4uYXJnc0pzb24pIGFzIFByb21pc2U8YW55PjtcclxuXHJcbiAgcmVzdWx0XHJcbiAgICAudGhlbihyZXMgPT4gaW52b2tlRG90TmV0TWV0aG9kKGludm9rZURvdE5ldENhbGxiYWNrLCBjYWxsYmFja0lkLCBKU09OLnN0cmluZ2lmeSh7IHN1Y2NlZWRlZDogdHJ1ZSwgcmVzdWx0OiByZXMgfSkpKVxyXG4gICAgLmNhdGNoKHJlYXNvbiA9PiBpbnZva2VEb3ROZXRNZXRob2QoXHJcbiAgICAgIGludm9rZURvdE5ldENhbGxiYWNrLFxyXG4gICAgICBjYWxsYmFja0lkLFxyXG4gICAgICBKU09OLnN0cmluZ2lmeSh7IHN1Y2NlZWRlZDogZmFsc2UsIG1lc3NhZ2U6IChyZWFzb24gJiYgcmVhc29uLm1lc3NhZ2UpIHx8IChyZWFzb24gJiYgcmVhc29uLnRvU3RyaW5nICYmIHJlYXNvbi50b1N0cmluZygpKSB9KSkpO1xyXG5cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGpzb25SZXZpdmVyKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KTogYW55IHtcclxuICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZS5oYXNPd25Qcm9wZXJ0eShlbGVtZW50UmVmS2V5KSAmJiB0eXBlb2YgdmFsdWVbZWxlbWVudFJlZktleV0gPT09ICdudW1iZXInKSB7XHJcbiAgICByZXR1cm4gZ2V0RWxlbWVudEJ5Q2FwdHVyZUlkKHZhbHVlW2VsZW1lbnRSZWZLZXldKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB2YWx1ZTtcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvSW50ZXJvcC9JbnZva2VKYXZhU2NyaXB0RnVuY3Rpb25XaXRoSnNvbk1hcnNoYWxsaW5nLnRzIiwiaW1wb3J0IHsgUG9pbnRlciwgU3lzdGVtX0FycmF5IH0gZnJvbSAnLi4vUGxhdGZvcm0vUGxhdGZvcm0nO1xyXG5pbXBvcnQgeyBwbGF0Zm9ybSB9IGZyb20gJy4uL0Vudmlyb25tZW50JztcclxuaW1wb3J0IHsgUmVuZGVyVHJlZUZyYW1lUG9pbnRlciB9IGZyb20gJy4vUmVuZGVyVHJlZUZyYW1lJztcclxuaW1wb3J0IHsgUmVuZGVyVHJlZUVkaXRQb2ludGVyIH0gZnJvbSAnLi9SZW5kZXJUcmVlRWRpdCc7XHJcblxyXG4vLyBLZWVwIGluIHN5bmMgd2l0aCB0aGUgc3RydWN0cyBpbiAuTkVUIGNvZGVcclxuXHJcbmV4cG9ydCBjb25zdCByZW5kZXJCYXRjaCA9IHtcclxuICB1cGRhdGVkQ29tcG9uZW50czogKG9iajogUmVuZGVyQmF0Y2hQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkU3RydWN0RmllbGQ8QXJyYXlSYW5nZVBvaW50ZXI8UmVuZGVyVHJlZURpZmZQb2ludGVyPj4ob2JqLCAwKSxcclxuICByZWZlcmVuY2VGcmFtZXM6IChvYmo6IFJlbmRlckJhdGNoUG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZFN0cnVjdEZpZWxkPEFycmF5UmFuZ2VQb2ludGVyPFJlbmRlclRyZWVGcmFtZVBvaW50ZXI+PihvYmosIGFycmF5UmFuZ2VTdHJ1Y3RMZW5ndGgpLFxyXG4gIGRpc3Bvc2VkQ29tcG9uZW50SWRzOiAob2JqOiBSZW5kZXJCYXRjaFBvaW50ZXIpID0+IHBsYXRmb3JtLnJlYWRTdHJ1Y3RGaWVsZDxBcnJheVJhbmdlUG9pbnRlcjxudW1iZXI+PihvYmosIGFycmF5UmFuZ2VTdHJ1Y3RMZW5ndGggKyBhcnJheVJhbmdlU3RydWN0TGVuZ3RoKSxcclxuICBkaXNwb3NlZEV2ZW50SGFuZGxlcklkczogKG9iajogUmVuZGVyQmF0Y2hQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkU3RydWN0RmllbGQ8QXJyYXlSYW5nZVBvaW50ZXI8bnVtYmVyPj4ob2JqLCBhcnJheVJhbmdlU3RydWN0TGVuZ3RoICsgYXJyYXlSYW5nZVN0cnVjdExlbmd0aCArIGFycmF5UmFuZ2VTdHJ1Y3RMZW5ndGgpLFxyXG59O1xyXG5cclxuY29uc3QgYXJyYXlSYW5nZVN0cnVjdExlbmd0aCA9IDg7XHJcbmV4cG9ydCBjb25zdCBhcnJheVJhbmdlID0ge1xyXG4gIGFycmF5OiA8VD4ob2JqOiBBcnJheVJhbmdlUG9pbnRlcjxUPikgPT4gcGxhdGZvcm0ucmVhZE9iamVjdEZpZWxkPFN5c3RlbV9BcnJheTxUPj4ob2JqLCAwKSxcclxuICBjb3VudDogPFQ+KG9iajogQXJyYXlSYW5nZVBvaW50ZXI8VD4pID0+IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKG9iaiwgNCksXHJcbn07XHJcblxyXG5jb25zdCBhcnJheVNlZ21lbnRTdHJ1Y3RMZW5ndGggPSAxMjtcclxuZXhwb3J0IGNvbnN0IGFycmF5U2VnbWVudCA9IHtcclxuICBhcnJheTogPFQ+KG9iajogQXJyYXlTZWdtZW50UG9pbnRlcjxUPikgPT4gcGxhdGZvcm0ucmVhZE9iamVjdEZpZWxkPFN5c3RlbV9BcnJheTxUPj4ob2JqLCAwKSxcclxuICBvZmZzZXQ6IDxUPihvYmo6IEFycmF5U2VnbWVudFBvaW50ZXI8VD4pID0+IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKG9iaiwgNCksXHJcbiAgY291bnQ6IDxUPihvYmo6IEFycmF5U2VnbWVudFBvaW50ZXI8VD4pID0+IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKG9iaiwgOCksXHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgcmVuZGVyVHJlZURpZmZTdHJ1Y3RMZW5ndGggPSA0ICsgYXJyYXlTZWdtZW50U3RydWN0TGVuZ3RoO1xyXG5leHBvcnQgY29uc3QgcmVuZGVyVHJlZURpZmYgPSB7XHJcbiAgY29tcG9uZW50SWQ6IChvYmo6IFJlbmRlclRyZWVEaWZmUG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZEludDMyRmllbGQob2JqLCAwKSxcclxuICBlZGl0czogKG9iajogUmVuZGVyVHJlZURpZmZQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkU3RydWN0RmllbGQ8QXJyYXlTZWdtZW50UG9pbnRlcjxSZW5kZXJUcmVlRWRpdFBvaW50ZXI+PihvYmosIDQpLCAgXHJcbn07XHJcblxyXG4vLyBOb21pbmFsIHR5cGVzIHRvIGVuc3VyZSBvbmx5IHZhbGlkIHBvaW50ZXJzIGFyZSBwYXNzZWQgdG8gdGhlIGZ1bmN0aW9ucyBhYm92ZS5cclxuLy8gQXQgcnVudGltZSB0aGUgdmFsdWVzIGFyZSBqdXN0IG51bWJlcnMuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmVuZGVyQmF0Y2hQb2ludGVyIGV4dGVuZHMgUG9pbnRlciB7IFJlbmRlckJhdGNoUG9pbnRlcl9fRE9fTk9UX0lNUExFTUVOVDogYW55IH1cclxuZXhwb3J0IGludGVyZmFjZSBBcnJheVJhbmdlUG9pbnRlcjxUPiBleHRlbmRzIFBvaW50ZXIgeyBBcnJheVJhbmdlUG9pbnRlcl9fRE9fTk9UX0lNUExFTUVOVDogYW55IH1cclxuZXhwb3J0IGludGVyZmFjZSBBcnJheVNlZ21lbnRQb2ludGVyPFQ+IGV4dGVuZHMgUG9pbnRlciB7IEFycmF5U2VnbWVudFBvaW50ZXJfX0RPX05PVF9JTVBMRU1FTlQ6IGFueSB9XHJcbmV4cG9ydCBpbnRlcmZhY2UgUmVuZGVyVHJlZURpZmZQb2ludGVyIGV4dGVuZHMgUG9pbnRlciB7IFJlbmRlclRyZWVEaWZmUG9pbnRlcl9fRE9fTk9UX0lNUExFTUVOVDogYW55IH1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1JlbmRlcmluZy9SZW5kZXJCYXRjaC50cyIsImltcG9ydCB7IFN5c3RlbV9BcnJheSwgTWV0aG9kSGFuZGxlIH0gZnJvbSAnLi4vUGxhdGZvcm0vUGxhdGZvcm0nO1xyXG5pbXBvcnQgeyBnZXRSZW5kZXJUcmVlRWRpdFB0ciwgcmVuZGVyVHJlZUVkaXQsIFJlbmRlclRyZWVFZGl0UG9pbnRlciwgRWRpdFR5cGUgfSBmcm9tICcuL1JlbmRlclRyZWVFZGl0JztcclxuaW1wb3J0IHsgZ2V0VHJlZUZyYW1lUHRyLCByZW5kZXJUcmVlRnJhbWUsIEZyYW1lVHlwZSwgUmVuZGVyVHJlZUZyYW1lUG9pbnRlciB9IGZyb20gJy4vUmVuZGVyVHJlZUZyYW1lJztcclxuaW1wb3J0IHsgcGxhdGZvcm0gfSBmcm9tICcuLi9FbnZpcm9ubWVudCc7XHJcbmltcG9ydCB7IEV2ZW50RGVsZWdhdG9yIH0gZnJvbSAnLi9FdmVudERlbGVnYXRvcic7XHJcbmltcG9ydCB7IEV2ZW50Rm9yRG90TmV0LCBVSUV2ZW50QXJncyB9IGZyb20gJy4vRXZlbnRGb3JEb3ROZXQnO1xyXG5pbXBvcnQgeyBMb2dpY2FsRWxlbWVudCwgdG9Mb2dpY2FsRWxlbWVudCwgaW5zZXJ0TG9naWNhbENoaWxkLCByZW1vdmVMb2dpY2FsQ2hpbGQsIGdldExvZ2ljYWxQYXJlbnQsIGdldExvZ2ljYWxDaGlsZCwgY3JlYXRlQW5kSW5zZXJ0TG9naWNhbENvbnRhaW5lciwgaXNTdmdFbGVtZW50IH0gZnJvbSAnLi9Mb2dpY2FsRWxlbWVudHMnO1xyXG5pbXBvcnQgeyBhcHBseUNhcHR1cmVJZFRvRWxlbWVudCB9IGZyb20gJy4vRWxlbWVudFJlZmVyZW5jZUNhcHR1cmUnO1xyXG5jb25zdCBzZWxlY3RWYWx1ZVByb3BuYW1lID0gJ19ibGF6b3JTZWxlY3RWYWx1ZSc7XHJcbmxldCByYWlzZUV2ZW50TWV0aG9kOiBNZXRob2RIYW5kbGU7XHJcbmxldCByZW5kZXJDb21wb25lbnRNZXRob2Q6IE1ldGhvZEhhbmRsZTtcclxuXHJcbmV4cG9ydCBjbGFzcyBCcm93c2VyUmVuZGVyZXIge1xyXG4gIHByaXZhdGUgZXZlbnREZWxlZ2F0b3I6IEV2ZW50RGVsZWdhdG9yO1xyXG4gIHByaXZhdGUgY2hpbGRDb21wb25lbnRMb2NhdGlvbnM6IHsgW2NvbXBvbmVudElkOiBudW1iZXJdOiBMb2dpY2FsRWxlbWVudCB9ID0ge307XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYnJvd3NlclJlbmRlcmVySWQ6IG51bWJlcikge1xyXG4gICAgdGhpcy5ldmVudERlbGVnYXRvciA9IG5ldyBFdmVudERlbGVnYXRvcigoZXZlbnQsIGNvbXBvbmVudElkLCBldmVudEhhbmRsZXJJZCwgZXZlbnRBcmdzKSA9PiB7XHJcbiAgICAgIHJhaXNlRXZlbnQoZXZlbnQsIHRoaXMuYnJvd3NlclJlbmRlcmVySWQsIGNvbXBvbmVudElkLCBldmVudEhhbmRsZXJJZCwgZXZlbnRBcmdzKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGF0dGFjaFJvb3RDb21wb25lbnRUb0VsZW1lbnQoY29tcG9uZW50SWQ6IG51bWJlciwgZWxlbWVudDogRWxlbWVudCkge1xyXG4gICAgdGhpcy5hdHRhY2hDb21wb25lbnRUb0VsZW1lbnQoY29tcG9uZW50SWQsIHRvTG9naWNhbEVsZW1lbnQoZWxlbWVudCkpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHVwZGF0ZUNvbXBvbmVudChjb21wb25lbnRJZDogbnVtYmVyLCBlZGl0czogU3lzdGVtX0FycmF5PFJlbmRlclRyZWVFZGl0UG9pbnRlcj4sIGVkaXRzT2Zmc2V0OiBudW1iZXIsIGVkaXRzTGVuZ3RoOiBudW1iZXIsIHJlZmVyZW5jZUZyYW1lczogU3lzdGVtX0FycmF5PFJlbmRlclRyZWVGcmFtZVBvaW50ZXI+KSB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5jaGlsZENvbXBvbmVudExvY2F0aW9uc1tjb21wb25lbnRJZF07XHJcbiAgICBpZiAoIWVsZW1lbnQpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBlbGVtZW50IGlzIGN1cnJlbnRseSBhc3NvY2lhdGVkIHdpdGggY29tcG9uZW50ICR7Y29tcG9uZW50SWR9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5hcHBseUVkaXRzKGNvbXBvbmVudElkLCBlbGVtZW50LCAwLCBlZGl0cywgZWRpdHNPZmZzZXQsIGVkaXRzTGVuZ3RoLCByZWZlcmVuY2VGcmFtZXMpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRpc3Bvc2VDb21wb25lbnQoY29tcG9uZW50SWQ6IG51bWJlcikge1xyXG4gICAgZGVsZXRlIHRoaXMuY2hpbGRDb21wb25lbnRMb2NhdGlvbnNbY29tcG9uZW50SWRdO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRpc3Bvc2VFdmVudEhhbmRsZXIoZXZlbnRIYW5kbGVySWQ6IG51bWJlcikge1xyXG4gICAgdGhpcy5ldmVudERlbGVnYXRvci5yZW1vdmVMaXN0ZW5lcihldmVudEhhbmRsZXJJZCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGF0dGFjaENvbXBvbmVudFRvRWxlbWVudChjb21wb25lbnRJZDogbnVtYmVyLCBlbGVtZW50OiBMb2dpY2FsRWxlbWVudCkge1xyXG4gICAgdGhpcy5jaGlsZENvbXBvbmVudExvY2F0aW9uc1tjb21wb25lbnRJZF0gPSBlbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhcHBseUVkaXRzKGNvbXBvbmVudElkOiBudW1iZXIsIHBhcmVudDogTG9naWNhbEVsZW1lbnQsIGNoaWxkSW5kZXg6IG51bWJlciwgZWRpdHM6IFN5c3RlbV9BcnJheTxSZW5kZXJUcmVlRWRpdFBvaW50ZXI+LCBlZGl0c09mZnNldDogbnVtYmVyLCBlZGl0c0xlbmd0aDogbnVtYmVyLCByZWZlcmVuY2VGcmFtZXM6IFN5c3RlbV9BcnJheTxSZW5kZXJUcmVlRnJhbWVQb2ludGVyPikge1xyXG4gICAgbGV0IGN1cnJlbnREZXB0aCA9IDA7XHJcbiAgICBsZXQgY2hpbGRJbmRleEF0Q3VycmVudERlcHRoID0gY2hpbGRJbmRleDtcclxuICAgIGNvbnN0IG1heEVkaXRJbmRleEV4Y2wgPSBlZGl0c09mZnNldCArIGVkaXRzTGVuZ3RoO1xyXG4gICAgZm9yIChsZXQgZWRpdEluZGV4ID0gZWRpdHNPZmZzZXQ7IGVkaXRJbmRleCA8IG1heEVkaXRJbmRleEV4Y2w7IGVkaXRJbmRleCsrKSB7XHJcbiAgICAgIGNvbnN0IGVkaXQgPSBnZXRSZW5kZXJUcmVlRWRpdFB0cihlZGl0cywgZWRpdEluZGV4KTtcclxuICAgICAgY29uc3QgZWRpdFR5cGUgPSByZW5kZXJUcmVlRWRpdC50eXBlKGVkaXQpO1xyXG4gICAgICBzd2l0Y2ggKGVkaXRUeXBlKSB7XHJcbiAgICAgICAgY2FzZSBFZGl0VHlwZS5wcmVwZW5kRnJhbWU6IHtcclxuICAgICAgICAgIGNvbnN0IGZyYW1lSW5kZXggPSByZW5kZXJUcmVlRWRpdC5uZXdUcmVlSW5kZXgoZWRpdCk7XHJcbiAgICAgICAgICBjb25zdCBmcmFtZSA9IGdldFRyZWVGcmFtZVB0cihyZWZlcmVuY2VGcmFtZXMsIGZyYW1lSW5kZXgpO1xyXG4gICAgICAgICAgY29uc3Qgc2libGluZ0luZGV4ID0gcmVuZGVyVHJlZUVkaXQuc2libGluZ0luZGV4KGVkaXQpO1xyXG4gICAgICAgICAgdGhpcy5pbnNlcnRGcmFtZShjb21wb25lbnRJZCwgcGFyZW50LCBjaGlsZEluZGV4QXRDdXJyZW50RGVwdGggKyBzaWJsaW5nSW5kZXgsIHJlZmVyZW5jZUZyYW1lcywgZnJhbWUsIGZyYW1lSW5kZXgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgRWRpdFR5cGUucmVtb3ZlRnJhbWU6IHtcclxuICAgICAgICAgIGNvbnN0IHNpYmxpbmdJbmRleCA9IHJlbmRlclRyZWVFZGl0LnNpYmxpbmdJbmRleChlZGl0KTtcclxuICAgICAgICAgIHJlbW92ZUxvZ2ljYWxDaGlsZChwYXJlbnQsIGNoaWxkSW5kZXhBdEN1cnJlbnREZXB0aCArIHNpYmxpbmdJbmRleCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBFZGl0VHlwZS5zZXRBdHRyaWJ1dGU6IHtcclxuICAgICAgICAgIGNvbnN0IGZyYW1lSW5kZXggPSByZW5kZXJUcmVlRWRpdC5uZXdUcmVlSW5kZXgoZWRpdCk7XHJcbiAgICAgICAgICBjb25zdCBmcmFtZSA9IGdldFRyZWVGcmFtZVB0cihyZWZlcmVuY2VGcmFtZXMsIGZyYW1lSW5kZXgpO1xyXG4gICAgICAgICAgY29uc3Qgc2libGluZ0luZGV4ID0gcmVuZGVyVHJlZUVkaXQuc2libGluZ0luZGV4KGVkaXQpO1xyXG4gICAgICAgICAgY29uc3QgZWxlbWVudCA9IGdldExvZ2ljYWxDaGlsZChwYXJlbnQsIGNoaWxkSW5kZXhBdEN1cnJlbnREZXB0aCArIHNpYmxpbmdJbmRleCk7XHJcbiAgICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwbHlBdHRyaWJ1dGUoY29tcG9uZW50SWQsIGVsZW1lbnQsIGZyYW1lKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHNldCBhdHRyaWJ1dGUgb24gbm9uLWVsZW1lbnQgY2hpbGRgKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIEVkaXRUeXBlLnJlbW92ZUF0dHJpYnV0ZToge1xyXG4gICAgICAgICAgLy8gTm90ZSB0aGF0IHdlIGRvbid0IGhhdmUgdG8gZGlzcG9zZSB0aGUgaW5mbyB3ZSB0cmFjayBhYm91dCBldmVudCBoYW5kbGVycyBoZXJlLCBiZWNhdXNlIHRoZVxyXG4gICAgICAgICAgLy8gZGlzcG9zZWQgZXZlbnQgaGFuZGxlciBJRHMgYXJlIGRlbGl2ZXJlZCBzZXBhcmF0ZWx5IChpbiB0aGUgJ2Rpc3Bvc2VkRXZlbnRIYW5kbGVySWRzJyBhcnJheSlcclxuICAgICAgICAgIGNvbnN0IHNpYmxpbmdJbmRleCA9IHJlbmRlclRyZWVFZGl0LnNpYmxpbmdJbmRleChlZGl0KTtcclxuICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBnZXRMb2dpY2FsQ2hpbGQocGFyZW50LCBjaGlsZEluZGV4QXRDdXJyZW50RGVwdGggKyBzaWJsaW5nSW5kZXgpO1xyXG4gICAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgICBjb25zdCBhdHRyaWJ1dGVOYW1lID0gcmVuZGVyVHJlZUVkaXQucmVtb3ZlZEF0dHJpYnV0ZU5hbWUoZWRpdCkhO1xyXG4gICAgICAgICAgICAvLyBGaXJzdCB0cnkgdG8gcmVtb3ZlIGFueSBzcGVjaWFsIHByb3BlcnR5IHdlIHVzZSBmb3IgdGhpcyBhdHRyaWJ1dGVcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnRyeUFwcGx5U3BlY2lhbFByb3BlcnR5KGVsZW1lbnQsIGF0dHJpYnV0ZU5hbWUsIG51bGwpKSB7XHJcbiAgICAgICAgICAgICAgLy8gSWYgdGhhdCdzIG5vdCBhcHBsaWNhYmxlLCBpdCdzIGEgcmVndWxhciBET00gYXR0cmlidXRlIHNvIHJlbW92ZSB0aGF0XHJcbiAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHJlbW92ZSBhdHRyaWJ1dGUgZnJvbSBub24tZWxlbWVudCBjaGlsZGApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgRWRpdFR5cGUudXBkYXRlVGV4dDoge1xyXG4gICAgICAgICAgY29uc3QgZnJhbWVJbmRleCA9IHJlbmRlclRyZWVFZGl0Lm5ld1RyZWVJbmRleChlZGl0KTtcclxuICAgICAgICAgIGNvbnN0IGZyYW1lID0gZ2V0VHJlZUZyYW1lUHRyKHJlZmVyZW5jZUZyYW1lcywgZnJhbWVJbmRleCk7XHJcbiAgICAgICAgICBjb25zdCBzaWJsaW5nSW5kZXggPSByZW5kZXJUcmVlRWRpdC5zaWJsaW5nSW5kZXgoZWRpdCk7XHJcbiAgICAgICAgICBjb25zdCB0ZXh0Tm9kZSA9IGdldExvZ2ljYWxDaGlsZChwYXJlbnQsIGNoaWxkSW5kZXhBdEN1cnJlbnREZXB0aCArIHNpYmxpbmdJbmRleCk7XHJcbiAgICAgICAgICBpZiAodGV4dE5vZGUgaW5zdGFuY2VvZiBUZXh0KSB7XHJcbiAgICAgICAgICAgIHRleHROb2RlLnRleHRDb250ZW50ID0gcmVuZGVyVHJlZUZyYW1lLnRleHRDb250ZW50KGZyYW1lKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHNldCB0ZXh0IGNvbnRlbnQgb24gbm9uLXRleHQgY2hpbGRgKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIEVkaXRUeXBlLnN0ZXBJbjoge1xyXG4gICAgICAgICAgY29uc3Qgc2libGluZ0luZGV4ID0gcmVuZGVyVHJlZUVkaXQuc2libGluZ0luZGV4KGVkaXQpO1xyXG4gICAgICAgICAgcGFyZW50ID0gZ2V0TG9naWNhbENoaWxkKHBhcmVudCwgY2hpbGRJbmRleEF0Q3VycmVudERlcHRoICsgc2libGluZ0luZGV4KTtcclxuICAgICAgICAgIGN1cnJlbnREZXB0aCsrO1xyXG4gICAgICAgICAgY2hpbGRJbmRleEF0Q3VycmVudERlcHRoID0gMDtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIEVkaXRUeXBlLnN0ZXBPdXQ6IHtcclxuICAgICAgICAgIHBhcmVudCA9IGdldExvZ2ljYWxQYXJlbnQocGFyZW50KSE7XHJcbiAgICAgICAgICBjdXJyZW50RGVwdGgtLTtcclxuICAgICAgICAgIGNoaWxkSW5kZXhBdEN1cnJlbnREZXB0aCA9IGN1cnJlbnREZXB0aCA9PT0gMCA/IGNoaWxkSW5kZXggOiAwOyAvLyBUaGUgY2hpbGRJbmRleCBpcyBvbmx5IGV2ZXIgbm9uemVybyBhdCB6ZXJvIGRlcHRoXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgY29uc3QgdW5rbm93blR5cGU6IG5ldmVyID0gZWRpdFR5cGU7IC8vIENvbXBpbGUtdGltZSB2ZXJpZmljYXRpb24gdGhhdCB0aGUgc3dpdGNoIHdhcyBleGhhdXN0aXZlXHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gZWRpdCB0eXBlOiAke3Vua25vd25UeXBlfWApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbnNlcnRGcmFtZShjb21wb25lbnRJZDogbnVtYmVyLCBwYXJlbnQ6IExvZ2ljYWxFbGVtZW50LCBjaGlsZEluZGV4OiBudW1iZXIsIGZyYW1lczogU3lzdGVtX0FycmF5PFJlbmRlclRyZWVGcmFtZVBvaW50ZXI+LCBmcmFtZTogUmVuZGVyVHJlZUZyYW1lUG9pbnRlciwgZnJhbWVJbmRleDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IGZyYW1lVHlwZSA9IHJlbmRlclRyZWVGcmFtZS5mcmFtZVR5cGUoZnJhbWUpO1xyXG4gICAgc3dpdGNoIChmcmFtZVR5cGUpIHtcclxuICAgICAgY2FzZSBGcmFtZVR5cGUuZWxlbWVudDpcclxuICAgICAgICB0aGlzLmluc2VydEVsZW1lbnQoY29tcG9uZW50SWQsIHBhcmVudCwgY2hpbGRJbmRleCwgZnJhbWVzLCBmcmFtZSwgZnJhbWVJbmRleCk7XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgIGNhc2UgRnJhbWVUeXBlLnRleHQ6XHJcbiAgICAgICAgdGhpcy5pbnNlcnRUZXh0KHBhcmVudCwgY2hpbGRJbmRleCwgZnJhbWUpO1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgICBjYXNlIEZyYW1lVHlwZS5hdHRyaWJ1dGU6XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdHRyaWJ1dGUgZnJhbWVzIHNob3VsZCBvbmx5IGJlIHByZXNlbnQgYXMgbGVhZGluZyBjaGlsZHJlbiBvZiBlbGVtZW50IGZyYW1lcy4nKTtcclxuICAgICAgY2FzZSBGcmFtZVR5cGUuY29tcG9uZW50OlxyXG4gICAgICAgIHRoaXMuaW5zZXJ0Q29tcG9uZW50KHBhcmVudCwgY2hpbGRJbmRleCwgZnJhbWUpO1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgICBjYXNlIEZyYW1lVHlwZS5yZWdpb246XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zZXJ0RnJhbWVSYW5nZShjb21wb25lbnRJZCwgcGFyZW50LCBjaGlsZEluZGV4LCBmcmFtZXMsIGZyYW1lSW5kZXggKyAxLCBmcmFtZUluZGV4ICsgcmVuZGVyVHJlZUZyYW1lLnN1YnRyZWVMZW5ndGgoZnJhbWUpKTtcclxuICAgICAgY2FzZSBGcmFtZVR5cGUuZWxlbWVudFJlZmVyZW5jZUNhcHR1cmU6XHJcbiAgICAgICAgaWYgKHBhcmVudCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcclxuICAgICAgICAgIGFwcGx5Q2FwdHVyZUlkVG9FbGVtZW50KHBhcmVudCwgcmVuZGVyVHJlZUZyYW1lLmVsZW1lbnRSZWZlcmVuY2VDYXB0dXJlSWQoZnJhbWUpKTtcclxuICAgICAgICAgIHJldHVybiAwOyAvLyBBIFwiY2FwdHVyZVwiIGlzIGEgY2hpbGQgaW4gdGhlIGRpZmYsIGJ1dCBoYXMgbm8gbm9kZSBpbiB0aGUgRE9NXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUmVmZXJlbmNlIGNhcHR1cmUgZnJhbWVzIGNhbiBvbmx5IGJlIGNoaWxkcmVuIG9mIGVsZW1lbnQgZnJhbWVzLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBjb25zdCB1bmtub3duVHlwZTogbmV2ZXIgPSBmcmFtZVR5cGU7IC8vIENvbXBpbGUtdGltZSB2ZXJpZmljYXRpb24gdGhhdCB0aGUgc3dpdGNoIHdhcyBleGhhdXN0aXZlXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGZyYW1lIHR5cGU6ICR7dW5rbm93blR5cGV9YCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluc2VydEVsZW1lbnQoY29tcG9uZW50SWQ6IG51bWJlciwgcGFyZW50OiBMb2dpY2FsRWxlbWVudCwgY2hpbGRJbmRleDogbnVtYmVyLCBmcmFtZXM6IFN5c3RlbV9BcnJheTxSZW5kZXJUcmVlRnJhbWVQb2ludGVyPiwgZnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIsIGZyYW1lSW5kZXg6IG51bWJlcikge1xyXG4gICAgY29uc3QgdGFnTmFtZSA9IHJlbmRlclRyZWVGcmFtZS5lbGVtZW50TmFtZShmcmFtZSkhO1xyXG4gICAgY29uc3QgbmV3RG9tRWxlbWVudFJhdyA9IHRhZ05hbWUgPT09ICdzdmcnIHx8IGlzU3ZnRWxlbWVudChwYXJlbnQpID9cclxuICAgICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsIHRhZ05hbWUpIDpcclxuICAgICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKTtcclxuICAgIGNvbnN0IG5ld0VsZW1lbnQgPSB0b0xvZ2ljYWxFbGVtZW50KG5ld0RvbUVsZW1lbnRSYXcpO1xyXG4gICAgaW5zZXJ0TG9naWNhbENoaWxkKG5ld0RvbUVsZW1lbnRSYXcsIHBhcmVudCwgY2hpbGRJbmRleCk7XHJcblxyXG4gICAgLy8gQXBwbHkgYXR0cmlidXRlc1xyXG4gICAgY29uc3QgZGVzY2VuZGFudHNFbmRJbmRleEV4Y2wgPSBmcmFtZUluZGV4ICsgcmVuZGVyVHJlZUZyYW1lLnN1YnRyZWVMZW5ndGgoZnJhbWUpO1xyXG4gICAgZm9yIChsZXQgZGVzY2VuZGFudEluZGV4ID0gZnJhbWVJbmRleCArIDE7IGRlc2NlbmRhbnRJbmRleCA8IGRlc2NlbmRhbnRzRW5kSW5kZXhFeGNsOyBkZXNjZW5kYW50SW5kZXgrKykge1xyXG4gICAgICBjb25zdCBkZXNjZW5kYW50RnJhbWUgPSBnZXRUcmVlRnJhbWVQdHIoZnJhbWVzLCBkZXNjZW5kYW50SW5kZXgpO1xyXG4gICAgICBpZiAocmVuZGVyVHJlZUZyYW1lLmZyYW1lVHlwZShkZXNjZW5kYW50RnJhbWUpID09PSBGcmFtZVR5cGUuYXR0cmlidXRlKSB7XHJcbiAgICAgICAgdGhpcy5hcHBseUF0dHJpYnV0ZShjb21wb25lbnRJZCwgbmV3RG9tRWxlbWVudFJhdywgZGVzY2VuZGFudEZyYW1lKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBBcyBzb29uIGFzIHdlIHNlZSBhIG5vbi1hdHRyaWJ1dGUgY2hpbGQsIGFsbCB0aGUgc3Vic2VxdWVudCBjaGlsZCBmcmFtZXMgYXJlXHJcbiAgICAgICAgLy8gbm90IGF0dHJpYnV0ZXMsIHNvIGJhaWwgb3V0IGFuZCBpbnNlcnQgdGhlIHJlbW5hbnRzIHJlY3Vyc2l2ZWx5XHJcbiAgICAgICAgdGhpcy5pbnNlcnRGcmFtZVJhbmdlKGNvbXBvbmVudElkLCBuZXdFbGVtZW50LCAwLCBmcmFtZXMsIGRlc2NlbmRhbnRJbmRleCwgZGVzY2VuZGFudHNFbmRJbmRleEV4Y2wpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluc2VydENvbXBvbmVudChwYXJlbnQ6IExvZ2ljYWxFbGVtZW50LCBjaGlsZEluZGV4OiBudW1iZXIsIGZyYW1lOiBSZW5kZXJUcmVlRnJhbWVQb2ludGVyKSB7XHJcbiAgICBjb25zdCBjb250YWluZXJFbGVtZW50ID0gY3JlYXRlQW5kSW5zZXJ0TG9naWNhbENvbnRhaW5lcihwYXJlbnQsIGNoaWxkSW5kZXgpO1xyXG5cclxuICAgIC8vIEFsbCB3ZSBoYXZlIHRvIGRvIGlzIGFzc29jaWF0ZSB0aGUgY2hpbGQgY29tcG9uZW50IElEIHdpdGggaXRzIGxvY2F0aW9uLiBXZSBkb24ndCBhY3R1YWxseVxyXG4gICAgLy8gZG8gYW55IHJlbmRlcmluZyBoZXJlLCBiZWNhdXNlIHRoZSBkaWZmIGZvciB0aGUgY2hpbGQgd2lsbCBhcHBlYXIgbGF0ZXIgaW4gdGhlIHJlbmRlciBiYXRjaC5cclxuICAgIGNvbnN0IGNoaWxkQ29tcG9uZW50SWQgPSByZW5kZXJUcmVlRnJhbWUuY29tcG9uZW50SWQoZnJhbWUpO1xyXG4gICAgdGhpcy5hdHRhY2hDb21wb25lbnRUb0VsZW1lbnQoY2hpbGRDb21wb25lbnRJZCwgY29udGFpbmVyRWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluc2VydFRleHQocGFyZW50OiBMb2dpY2FsRWxlbWVudCwgY2hpbGRJbmRleDogbnVtYmVyLCB0ZXh0RnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIpIHtcclxuICAgIGNvbnN0IHRleHRDb250ZW50ID0gcmVuZGVyVHJlZUZyYW1lLnRleHRDb250ZW50KHRleHRGcmFtZSkhO1xyXG4gICAgY29uc3QgbmV3VGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0Q29udGVudCk7XHJcbiAgICBpbnNlcnRMb2dpY2FsQ2hpbGQobmV3VGV4dE5vZGUsIHBhcmVudCwgY2hpbGRJbmRleCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFwcGx5QXR0cmlidXRlKGNvbXBvbmVudElkOiBudW1iZXIsIHRvRG9tRWxlbWVudDogRWxlbWVudCwgYXR0cmlidXRlRnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIpIHtcclxuICAgIGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSByZW5kZXJUcmVlRnJhbWUuYXR0cmlidXRlTmFtZShhdHRyaWJ1dGVGcmFtZSkhO1xyXG4gICAgY29uc3QgYnJvd3NlclJlbmRlcmVySWQgPSB0aGlzLmJyb3dzZXJSZW5kZXJlcklkO1xyXG4gICAgY29uc3QgZXZlbnRIYW5kbGVySWQgPSByZW5kZXJUcmVlRnJhbWUuYXR0cmlidXRlRXZlbnRIYW5kbGVySWQoYXR0cmlidXRlRnJhbWUpO1xyXG5cclxuICAgIGlmIChldmVudEhhbmRsZXJJZCkge1xyXG4gICAgICBjb25zdCBmaXJzdFR3b0NoYXJzID0gYXR0cmlidXRlTmFtZS5zdWJzdHJpbmcoMCwgMik7XHJcbiAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGF0dHJpYnV0ZU5hbWUuc3Vic3RyaW5nKDIpO1xyXG4gICAgICBpZiAoZmlyc3RUd29DaGFycyAhPT0gJ29uJyB8fCAhZXZlbnROYW1lKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBdHRyaWJ1dGUgaGFzIG5vbnplcm8gZXZlbnQgaGFuZGxlciBJRCwgYnV0IGF0dHJpYnV0ZSBuYW1lICcke2F0dHJpYnV0ZU5hbWV9JyBkb2VzIG5vdCBzdGFydCB3aXRoICdvbicuYCk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5ldmVudERlbGVnYXRvci5zZXRMaXN0ZW5lcih0b0RvbUVsZW1lbnQsIGV2ZW50TmFtZSwgY29tcG9uZW50SWQsIGV2ZW50SGFuZGxlcklkKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEZpcnN0IHNlZSBpZiB3ZSBoYXZlIHNwZWNpYWwgaGFuZGxpbmcgZm9yIHRoaXMgYXR0cmlidXRlXHJcbiAgICBpZiAoIXRoaXMudHJ5QXBwbHlTcGVjaWFsUHJvcGVydHkodG9Eb21FbGVtZW50LCBhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVGcmFtZSkpIHtcclxuICAgICAgLy8gSWYgbm90LCB0cmVhdCBpdCBhcyBhIHJlZ3VsYXIgc3RyaW5nLXZhbHVlZCBhdHRyaWJ1dGVcclxuICAgICAgdG9Eb21FbGVtZW50LnNldEF0dHJpYnV0ZShcclxuICAgICAgICBhdHRyaWJ1dGVOYW1lLFxyXG4gICAgICAgIHJlbmRlclRyZWVGcmFtZS5hdHRyaWJ1dGVWYWx1ZShhdHRyaWJ1dGVGcmFtZSkhXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRyeUFwcGx5U3BlY2lhbFByb3BlcnR5KGVsZW1lbnQ6IEVsZW1lbnQsIGF0dHJpYnV0ZU5hbWU6IHN0cmluZywgYXR0cmlidXRlRnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIgfCBudWxsKSB7XHJcbiAgICBzd2l0Y2ggKGF0dHJpYnV0ZU5hbWUpIHtcclxuICAgICAgY2FzZSAndmFsdWUnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLnRyeUFwcGx5VmFsdWVQcm9wZXJ0eShlbGVtZW50LCBhdHRyaWJ1dGVGcmFtZSk7XHJcbiAgICAgIGNhc2UgJ2NoZWNrZWQnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLnRyeUFwcGx5Q2hlY2tlZFByb3BlcnR5KGVsZW1lbnQsIGF0dHJpYnV0ZUZyYW1lKTtcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRyeUFwcGx5VmFsdWVQcm9wZXJ0eShlbGVtZW50OiBFbGVtZW50LCBhdHRyaWJ1dGVGcmFtZTogUmVuZGVyVHJlZUZyYW1lUG9pbnRlciB8IG51bGwpIHtcclxuICAgIC8vIENlcnRhaW4gZWxlbWVudHMgaGF2ZSBidWlsdC1pbiBiZWhhdmlvdXIgZm9yIHRoZWlyICd2YWx1ZScgcHJvcGVydHlcclxuICAgIHN3aXRjaCAoZWxlbWVudC50YWdOYW1lKSB7XHJcbiAgICAgIGNhc2UgJ0lOUFVUJzpcclxuICAgICAgY2FzZSAnU0VMRUNUJzpcclxuICAgICAgY2FzZSAnVEVYVEFSRUEnOiB7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBhdHRyaWJ1dGVGcmFtZSA/IHJlbmRlclRyZWVGcmFtZS5hdHRyaWJ1dGVWYWx1ZShhdHRyaWJ1dGVGcmFtZSkgOiBudWxsO1xyXG4gICAgICAgIChlbGVtZW50IGFzIGFueSkudmFsdWUgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKGVsZW1lbnQudGFnTmFtZSA9PT0gJ1NFTEVDVCcpIHtcclxuICAgICAgICAgIC8vIDxzZWxlY3Q+IGlzIHNwZWNpYWwsIGluIHRoYXQgYW55dGhpbmcgd2Ugd3JpdGUgdG8gLnZhbHVlIHdpbGwgYmUgbG9zdCBpZiB0aGVyZVxyXG4gICAgICAgICAgLy8gaXNuJ3QgeWV0IGEgbWF0Y2hpbmcgPG9wdGlvbj4uIFRvIG1haW50YWluIHRoZSBleHBlY3RlZCBiZWhhdmlvciBubyBtYXR0ZXIgdGhlXHJcbiAgICAgICAgICAvLyBlbGVtZW50IGluc2VydGlvbi91cGRhdGUgb3JkZXIsIHByZXNlcnZlIHRoZSBkZXNpcmVkIHZhbHVlIHNlcGFyYXRlbHkgc29cclxuICAgICAgICAgIC8vIHdlIGNhbiByZWNvdmVyIGl0IHdoZW4gaW5zZXJ0aW5nIGFueSBtYXRjaGluZyA8b3B0aW9uPi5cclxuICAgICAgICAgIGVsZW1lbnRbc2VsZWN0VmFsdWVQcm9wbmFtZV0gPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgY2FzZSAnT1BUSU9OJzoge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gYXR0cmlidXRlRnJhbWUgPyByZW5kZXJUcmVlRnJhbWUuYXR0cmlidXRlVmFsdWUoYXR0cmlidXRlRnJhbWUpIDogbnVsbDtcclxuICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsIHZhbHVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ3ZhbHVlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFNlZSBhYm92ZSBmb3Igd2h5IHdlIGhhdmUgdGhpcyBzcGVjaWFsIGhhbmRsaW5nIGZvciA8c2VsZWN0Pi88b3B0aW9uPlxyXG4gICAgICAgIGNvbnN0IHBhcmVudEVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgaWYgKHBhcmVudEVsZW1lbnQgJiYgKHNlbGVjdFZhbHVlUHJvcG5hbWUgaW4gcGFyZW50RWxlbWVudCkgJiYgcGFyZW50RWxlbWVudFtzZWxlY3RWYWx1ZVByb3BuYW1lXSA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgIHRoaXMudHJ5QXBwbHlWYWx1ZVByb3BlcnR5KHBhcmVudEVsZW1lbnQsIGF0dHJpYnV0ZUZyYW1lKTtcclxuICAgICAgICAgIGRlbGV0ZSBwYXJlbnRFbGVtZW50W3NlbGVjdFZhbHVlUHJvcG5hbWVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgdHJ5QXBwbHlDaGVja2VkUHJvcGVydHkoZWxlbWVudDogRWxlbWVudCwgYXR0cmlidXRlRnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIgfCBudWxsKSB7XHJcbiAgICAvLyBDZXJ0YWluIGVsZW1lbnRzIGhhdmUgYnVpbHQtaW4gYmVoYXZpb3VyIGZvciB0aGVpciAnY2hlY2tlZCcgcHJvcGVydHlcclxuICAgIGlmIChlbGVtZW50LnRhZ05hbWUgPT09ICdJTlBVVCcpIHtcclxuICAgICAgY29uc3QgdmFsdWUgPSBhdHRyaWJ1dGVGcmFtZSA/IHJlbmRlclRyZWVGcmFtZS5hdHRyaWJ1dGVWYWx1ZShhdHRyaWJ1dGVGcmFtZSkgOiBudWxsO1xyXG4gICAgICAoZWxlbWVudCBhcyBhbnkpLmNoZWNrZWQgPSB2YWx1ZSAhPT0gbnVsbDtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluc2VydEZyYW1lUmFuZ2UoY29tcG9uZW50SWQ6IG51bWJlciwgcGFyZW50OiBMb2dpY2FsRWxlbWVudCwgY2hpbGRJbmRleDogbnVtYmVyLCBmcmFtZXM6IFN5c3RlbV9BcnJheTxSZW5kZXJUcmVlRnJhbWVQb2ludGVyPiwgc3RhcnRJbmRleDogbnVtYmVyLCBlbmRJbmRleEV4Y2w6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICBjb25zdCBvcmlnQ2hpbGRJbmRleCA9IGNoaWxkSW5kZXg7XHJcbiAgICBmb3IgKGxldCBpbmRleCA9IHN0YXJ0SW5kZXg7IGluZGV4IDwgZW5kSW5kZXhFeGNsOyBpbmRleCsrKSB7XHJcbiAgICAgIGNvbnN0IGZyYW1lID0gZ2V0VHJlZUZyYW1lUHRyKGZyYW1lcywgaW5kZXgpO1xyXG4gICAgICBjb25zdCBudW1DaGlsZHJlbkluc2VydGVkID0gdGhpcy5pbnNlcnRGcmFtZShjb21wb25lbnRJZCwgcGFyZW50LCBjaGlsZEluZGV4LCBmcmFtZXMsIGZyYW1lLCBpbmRleCk7XHJcbiAgICAgIGNoaWxkSW5kZXggKz0gbnVtQ2hpbGRyZW5JbnNlcnRlZDtcclxuXHJcbiAgICAgIC8vIFNraXAgb3ZlciBhbnkgZGVzY2VuZGFudHMsIHNpbmNlIHRoZXkgYXJlIGFscmVhZHkgZGVhbHQgd2l0aCByZWN1cnNpdmVseVxyXG4gICAgICBpbmRleCArPSBjb3VudERlc2NlbmRhbnRGcmFtZXMoZnJhbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAoY2hpbGRJbmRleCAtIG9yaWdDaGlsZEluZGV4KTsgLy8gVG90YWwgbnVtYmVyIG9mIGNoaWxkcmVuIGluc2VydGVkXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjb3VudERlc2NlbmRhbnRGcmFtZXMoZnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIpOiBudW1iZXIge1xyXG4gIHN3aXRjaCAocmVuZGVyVHJlZUZyYW1lLmZyYW1lVHlwZShmcmFtZSkpIHtcclxuICAgIC8vIFRoZSBmb2xsb3dpbmcgZnJhbWUgdHlwZXMgaGF2ZSBhIHN1YnRyZWUgbGVuZ3RoLiBPdGhlciBmcmFtZXMgbWF5IHVzZSB0aGF0IG1lbW9yeSBzbG90XHJcbiAgICAvLyB0byBtZWFuIHNvbWV0aGluZyBlbHNlLCBzbyB3ZSBtdXN0IG5vdCByZWFkIGl0LiBXZSBzaG91bGQgY29uc2lkZXIgaGF2aW5nIG5vbWluYWwgc3VidHlwZXNcclxuICAgIC8vIG9mIFJlbmRlclRyZWVGcmFtZVBvaW50ZXIgdGhhdCBwcmV2ZW50IGFjY2VzcyB0byBub24tYXBwbGljYWJsZSBmaWVsZHMuXHJcbiAgICBjYXNlIEZyYW1lVHlwZS5jb21wb25lbnQ6XHJcbiAgICBjYXNlIEZyYW1lVHlwZS5lbGVtZW50OlxyXG4gICAgY2FzZSBGcmFtZVR5cGUucmVnaW9uOlxyXG4gICAgICByZXR1cm4gcmVuZGVyVHJlZUZyYW1lLnN1YnRyZWVMZW5ndGgoZnJhbWUpIC0gMTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiAwO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmFpc2VFdmVudChldmVudDogRXZlbnQsIGJyb3dzZXJSZW5kZXJlcklkOiBudW1iZXIsIGNvbXBvbmVudElkOiBudW1iZXIsIGV2ZW50SGFuZGxlcklkOiBudW1iZXIsIGV2ZW50QXJnczogRXZlbnRGb3JEb3ROZXQ8VUlFdmVudEFyZ3M+KSB7XHJcbiAgaWYgKCFyYWlzZUV2ZW50TWV0aG9kKSB7XHJcbiAgICByYWlzZUV2ZW50TWV0aG9kID0gcGxhdGZvcm0uZmluZE1ldGhvZChcclxuICAgICAgJ01pY3Jvc29mdC5Bc3BOZXRDb3JlLkJsYXpvci5Ccm93c2VyJywgJ01pY3Jvc29mdC5Bc3BOZXRDb3JlLkJsYXpvci5Ccm93c2VyLlJlbmRlcmluZycsICdCcm93c2VyUmVuZGVyZXJFdmVudERpc3BhdGNoZXInLCAnRGlzcGF0Y2hFdmVudCdcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBldmVudERlc2NyaXB0b3IgPSB7XHJcbiAgICBicm93c2VyUmVuZGVyZXJJZCxcclxuICAgIGNvbXBvbmVudElkLFxyXG4gICAgZXZlbnRIYW5kbGVySWQsXHJcbiAgICBldmVudEFyZ3NUeXBlOiBldmVudEFyZ3MudHlwZVxyXG4gIH07XHJcblxyXG4gIHBsYXRmb3JtLmNhbGxNZXRob2QocmFpc2VFdmVudE1ldGhvZCwgbnVsbCwgW1xyXG4gICAgcGxhdGZvcm0udG9Eb3ROZXRTdHJpbmcoSlNPTi5zdHJpbmdpZnkoZXZlbnREZXNjcmlwdG9yKSksXHJcbiAgICBwbGF0Zm9ybS50b0RvdE5ldFN0cmluZyhKU09OLnN0cmluZ2lmeShldmVudEFyZ3MuZGF0YSkpXHJcbiAgXSk7XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1JlbmRlcmluZy9Ccm93c2VyUmVuZGVyZXIudHMiLCJpbXBvcnQgeyBTeXN0ZW1fQXJyYXksIFBvaW50ZXIgfSBmcm9tICcuLi9QbGF0Zm9ybS9QbGF0Zm9ybSc7XHJcbmltcG9ydCB7IHBsYXRmb3JtIH0gZnJvbSAnLi4vRW52aXJvbm1lbnQnO1xyXG5jb25zdCByZW5kZXJUcmVlRWRpdFN0cnVjdExlbmd0aCA9IDE2O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlbmRlclRyZWVFZGl0UHRyKHJlbmRlclRyZWVFZGl0czogU3lzdGVtX0FycmF5PFJlbmRlclRyZWVFZGl0UG9pbnRlcj4sIGluZGV4OiBudW1iZXIpIHtcclxuICByZXR1cm4gcGxhdGZvcm0uZ2V0QXJyYXlFbnRyeVB0cihyZW5kZXJUcmVlRWRpdHMsIGluZGV4LCByZW5kZXJUcmVlRWRpdFN0cnVjdExlbmd0aCk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCByZW5kZXJUcmVlRWRpdCA9IHtcclxuICAvLyBUaGUgcHJvcGVydGllcyBhbmQgbWVtb3J5IGxheW91dCBtdXN0IGJlIGtlcHQgaW4gc3luYyB3aXRoIHRoZSAuTkVUIGVxdWl2YWxlbnQgaW4gUmVuZGVyVHJlZUVkaXQuY3NcclxuICB0eXBlOiAoZWRpdDogUmVuZGVyVHJlZUVkaXRQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkSW50MzJGaWVsZChlZGl0LCAwKSBhcyBFZGl0VHlwZSxcclxuICBzaWJsaW5nSW5kZXg6IChlZGl0OiBSZW5kZXJUcmVlRWRpdFBvaW50ZXIpID0+IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKGVkaXQsIDQpLFxyXG4gIG5ld1RyZWVJbmRleDogKGVkaXQ6IFJlbmRlclRyZWVFZGl0UG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZEludDMyRmllbGQoZWRpdCwgOCksXHJcbiAgcmVtb3ZlZEF0dHJpYnV0ZU5hbWU6IChlZGl0OiBSZW5kZXJUcmVlRWRpdFBvaW50ZXIpID0+IHBsYXRmb3JtLnJlYWRTdHJpbmdGaWVsZChlZGl0LCAxMiksXHJcbn07XHJcblxyXG5leHBvcnQgZW51bSBFZGl0VHlwZSB7XHJcbiAgcHJlcGVuZEZyYW1lID0gMSxcclxuICByZW1vdmVGcmFtZSA9IDIsXHJcbiAgc2V0QXR0cmlidXRlID0gMyxcclxuICByZW1vdmVBdHRyaWJ1dGUgPSA0LFxyXG4gIHVwZGF0ZVRleHQgPSA1LFxyXG4gIHN0ZXBJbiA9IDYsXHJcbiAgc3RlcE91dCA9IDcsXHJcbn1cclxuXHJcbi8vIE5vbWluYWwgdHlwZSB0byBlbnN1cmUgb25seSB2YWxpZCBwb2ludGVycyBhcmUgcGFzc2VkIHRvIHRoZSByZW5kZXJUcmVlRWRpdCBmdW5jdGlvbnMuXHJcbi8vIEF0IHJ1bnRpbWUgdGhlIHZhbHVlcyBhcmUganVzdCBudW1iZXJzLlxyXG5leHBvcnQgaW50ZXJmYWNlIFJlbmRlclRyZWVFZGl0UG9pbnRlciBleHRlbmRzIFBvaW50ZXIgeyBSZW5kZXJUcmVlRWRpdFBvaW50ZXJfX0RPX05PVF9JTVBMRU1FTlQ6IGFueSB9XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9SZW5kZXJpbmcvUmVuZGVyVHJlZUVkaXQudHMiLCJpbXBvcnQgeyBTeXN0ZW1fU3RyaW5nLCBTeXN0ZW1fQXJyYXksIFBvaW50ZXIgfSBmcm9tICcuLi9QbGF0Zm9ybS9QbGF0Zm9ybSc7XHJcbmltcG9ydCB7IHBsYXRmb3JtIH0gZnJvbSAnLi4vRW52aXJvbm1lbnQnO1xyXG5jb25zdCByZW5kZXJUcmVlRnJhbWVTdHJ1Y3RMZW5ndGggPSAyODtcclxuXHJcbi8vIFRvIG1pbmltaXNlIEdDIHByZXNzdXJlLCBpbnN0ZWFkIG9mIGluc3RhbnRpYXRpbmcgYSBKUyBvYmplY3QgdG8gcmVwcmVzZW50IGVhY2ggdHJlZSBmcmFtZSxcclxuLy8gd2Ugd29yayBpbiB0ZXJtcyBvZiBwb2ludGVycyB0byB0aGUgc3RydWN0cyBvbiB0aGUgLk5FVCBoZWFwLCBhbmQgdXNlIHN0YXRpYyBmdW5jdGlvbnMgdGhhdFxyXG4vLyBrbm93IGhvdyB0byByZWFkIHByb3BlcnR5IHZhbHVlcyBmcm9tIHRob3NlIHN0cnVjdHMuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VHJlZUZyYW1lUHRyKHJlbmRlclRyZWVFbnRyaWVzOiBTeXN0ZW1fQXJyYXk8UmVuZGVyVHJlZUZyYW1lUG9pbnRlcj4sIGluZGV4OiBudW1iZXIpIHtcclxuICByZXR1cm4gcGxhdGZvcm0uZ2V0QXJyYXlFbnRyeVB0cihyZW5kZXJUcmVlRW50cmllcywgaW5kZXgsIHJlbmRlclRyZWVGcmFtZVN0cnVjdExlbmd0aCk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCByZW5kZXJUcmVlRnJhbWUgPSB7XHJcbiAgLy8gVGhlIHByb3BlcnRpZXMgYW5kIG1lbW9yeSBsYXlvdXQgbXVzdCBiZSBrZXB0IGluIHN5bmMgd2l0aCB0aGUgLk5FVCBlcXVpdmFsZW50IGluIFJlbmRlclRyZWVGcmFtZS5jc1xyXG4gIGZyYW1lVHlwZTogKGZyYW1lOiBSZW5kZXJUcmVlRnJhbWVQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkSW50MzJGaWVsZChmcmFtZSwgNCkgYXMgRnJhbWVUeXBlLFxyXG4gIHN1YnRyZWVMZW5ndGg6IChmcmFtZTogUmVuZGVyVHJlZUZyYW1lUG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZEludDMyRmllbGQoZnJhbWUsIDgpIGFzIEZyYW1lVHlwZSxcclxuICBlbGVtZW50UmVmZXJlbmNlQ2FwdHVyZUlkOiAoZnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIpID0+IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKGZyYW1lLCA4KSxcclxuICBjb21wb25lbnRJZDogKGZyYW1lOiBSZW5kZXJUcmVlRnJhbWVQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkSW50MzJGaWVsZChmcmFtZSwgMTIpLFxyXG4gIGVsZW1lbnROYW1lOiAoZnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIpID0+IHBsYXRmb3JtLnJlYWRTdHJpbmdGaWVsZChmcmFtZSwgMTYpLFxyXG4gIHRleHRDb250ZW50OiAoZnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIpID0+IHBsYXRmb3JtLnJlYWRTdHJpbmdGaWVsZChmcmFtZSwgMTYpLFxyXG4gIGF0dHJpYnV0ZU5hbWU6IChmcmFtZTogUmVuZGVyVHJlZUZyYW1lUG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZFN0cmluZ0ZpZWxkKGZyYW1lLCAxNiksXHJcbiAgYXR0cmlidXRlVmFsdWU6IChmcmFtZTogUmVuZGVyVHJlZUZyYW1lUG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZFN0cmluZ0ZpZWxkKGZyYW1lLCAyNCksXHJcbiAgYXR0cmlidXRlRXZlbnRIYW5kbGVySWQ6IChmcmFtZTogUmVuZGVyVHJlZUZyYW1lUG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZEludDMyRmllbGQoZnJhbWUsIDgpLFxyXG59O1xyXG5cclxuZXhwb3J0IGVudW0gRnJhbWVUeXBlIHtcclxuICAvLyBUaGUgdmFsdWVzIG11c3QgYmUga2VwdCBpbiBzeW5jIHdpdGggdGhlIC5ORVQgZXF1aXZhbGVudCBpbiBSZW5kZXJUcmVlRnJhbWVUeXBlLmNzXHJcbiAgZWxlbWVudCA9IDEsXHJcbiAgdGV4dCA9IDIsXHJcbiAgYXR0cmlidXRlID0gMyxcclxuICBjb21wb25lbnQgPSA0LFxyXG4gIHJlZ2lvbiA9IDUsXHJcbiAgZWxlbWVudFJlZmVyZW5jZUNhcHR1cmUgPSA2LFxyXG59XHJcblxyXG4vLyBOb21pbmFsIHR5cGUgdG8gZW5zdXJlIG9ubHkgdmFsaWQgcG9pbnRlcnMgYXJlIHBhc3NlZCB0byB0aGUgcmVuZGVyVHJlZUZyYW1lIGZ1bmN0aW9ucy5cclxuLy8gQXQgcnVudGltZSB0aGUgdmFsdWVzIGFyZSBqdXN0IG51bWJlcnMuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmVuZGVyVHJlZUZyYW1lUG9pbnRlciBleHRlbmRzIFBvaW50ZXIgeyBSZW5kZXJUcmVlRnJhbWVQb2ludGVyX19ET19OT1RfSU1QTEVNRU5UOiBhbnkgfVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUmVuZGVyaW5nL1JlbmRlclRyZWVGcmFtZS50cyIsImltcG9ydCB7IEV2ZW50Rm9yRG90TmV0LCBVSUV2ZW50QXJncyB9IGZyb20gJy4vRXZlbnRGb3JEb3ROZXQnO1xyXG5cclxuY29uc3Qgbm9uQnViYmxpbmdFdmVudHMgPSB0b0xvb2t1cChbXHJcbiAgJ2Fib3J0JywgJ2JsdXInLCAnY2hhbmdlJywgJ2Vycm9yJywgJ2ZvY3VzJywgJ2xvYWQnLCAnbG9hZGVuZCcsICdsb2Fkc3RhcnQnLCAnbW91c2VlbnRlcicsICdtb3VzZWxlYXZlJyxcclxuICAncHJvZ3Jlc3MnLCAncmVzZXQnLCAnc2Nyb2xsJywgJ3N1Ym1pdCcsICd1bmxvYWQnLCAnRE9NTm9kZUluc2VydGVkSW50b0RvY3VtZW50JywgJ0RPTU5vZGVSZW1vdmVkRnJvbURvY3VtZW50J1xyXG5dKTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgT25FdmVudENhbGxiYWNrIHtcclxuICAoZXZlbnQ6IEV2ZW50LCBjb21wb25lbnRJZDogbnVtYmVyLCBldmVudEhhbmRsZXJJZDogbnVtYmVyLCBldmVudEFyZ3M6IEV2ZW50Rm9yRG90TmV0PFVJRXZlbnRBcmdzPik6IHZvaWQ7XHJcbn1cclxuXHJcbi8vIFJlc3BvbnNpYmxlIGZvciBhZGRpbmcvcmVtb3ZpbmcgdGhlIGV2ZW50SW5mbyBvbiBhbiBleHBhbmRvIHByb3BlcnR5IG9uIERPTSBlbGVtZW50cywgYW5kXHJcbi8vIGNhbGxpbmcgYW4gRXZlbnRJbmZvU3RvcmUgdGhhdCBkZWFscyB3aXRoIHJlZ2lzdGVyaW5nL3VucmVnaXN0ZXJpbmcgdGhlIHVuZGVybHlpbmcgZGVsZWdhdGVkXHJcbi8vIGV2ZW50IGxpc3RlbmVycyBhcyByZXF1aXJlZCAoYW5kIGFsc28gbWFwcyBhY3R1YWwgZXZlbnRzIGJhY2sgdG8gdGhlIGdpdmVuIGNhbGxiYWNrKS5cclxuZXhwb3J0IGNsYXNzIEV2ZW50RGVsZWdhdG9yIHtcclxuICBwcml2YXRlIHN0YXRpYyBuZXh0RXZlbnREZWxlZ2F0b3JJZCA9IDA7XHJcbiAgcHJpdmF0ZSBldmVudHNDb2xsZWN0aW9uS2V5OiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBldmVudEluZm9TdG9yZTogRXZlbnRJbmZvU3RvcmU7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgb25FdmVudDogT25FdmVudENhbGxiYWNrKSB7XHJcbiAgICBjb25zdCBldmVudERlbGVnYXRvcklkID0gKytFdmVudERlbGVnYXRvci5uZXh0RXZlbnREZWxlZ2F0b3JJZDtcclxuICAgIHRoaXMuZXZlbnRzQ29sbGVjdGlvbktleSA9IGBfYmxhem9yRXZlbnRzXyR7ZXZlbnREZWxlZ2F0b3JJZH1gO1xyXG4gICAgdGhpcy5ldmVudEluZm9TdG9yZSA9IG5ldyBFdmVudEluZm9TdG9yZSh0aGlzLm9uR2xvYmFsRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2V0TGlzdGVuZXIoZWxlbWVudDogRWxlbWVudCwgZXZlbnROYW1lOiBzdHJpbmcsIGNvbXBvbmVudElkOiBudW1iZXIsIGV2ZW50SGFuZGxlcklkOiBudW1iZXIpIHtcclxuICAgIC8vIEVuc3VyZSB3ZSBoYXZlIGEgcGxhY2UgdG8gc3RvcmUgZXZlbnQgaW5mbyBmb3IgdGhpcyBlbGVtZW50XHJcbiAgICBsZXQgaW5mb0ZvckVsZW1lbnQ6IEV2ZW50SGFuZGxlckluZm9zRm9yRWxlbWVudCA9IGVsZW1lbnRbdGhpcy5ldmVudHNDb2xsZWN0aW9uS2V5XTtcclxuICAgIGlmICghaW5mb0ZvckVsZW1lbnQpIHtcclxuICAgICAgaW5mb0ZvckVsZW1lbnQgPSBlbGVtZW50W3RoaXMuZXZlbnRzQ29sbGVjdGlvbktleV0gPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaW5mb0ZvckVsZW1lbnQuaGFzT3duUHJvcGVydHkoZXZlbnROYW1lKSkge1xyXG4gICAgICAvLyBXZSBjYW4gY2hlYXBseSB1cGRhdGUgdGhlIGluZm8gb24gdGhlIGV4aXN0aW5nIG9iamVjdCBhbmQgZG9uJ3QgbmVlZCBhbnkgb3RoZXIgaG91c2VrZWVwaW5nXHJcbiAgICAgIGNvbnN0IG9sZEluZm8gPSBpbmZvRm9yRWxlbWVudFtldmVudE5hbWVdO1xyXG4gICAgICB0aGlzLmV2ZW50SW5mb1N0b3JlLnVwZGF0ZShvbGRJbmZvLmV2ZW50SGFuZGxlcklkLCBldmVudEhhbmRsZXJJZCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBHbyB0aHJvdWdoIHRoZSB3aG9sZSBmbG93IHdoaWNoIG1pZ2h0IGludm9sdmUgcmVnaXN0ZXJpbmcgYSBuZXcgZ2xvYmFsIGhhbmRsZXJcclxuICAgICAgY29uc3QgbmV3SW5mbyA9IHsgZWxlbWVudCwgZXZlbnROYW1lLCBjb21wb25lbnRJZCwgZXZlbnRIYW5kbGVySWQgfTtcclxuICAgICAgdGhpcy5ldmVudEluZm9TdG9yZS5hZGQobmV3SW5mbyk7XHJcbiAgICAgIGluZm9Gb3JFbGVtZW50W2V2ZW50TmFtZV0gPSBuZXdJbmZvO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlbW92ZUxpc3RlbmVyKGV2ZW50SGFuZGxlcklkOiBudW1iZXIpIHtcclxuICAgIC8vIFRoaXMgbWV0aG9kIGdldHMgY2FsbGVkIHdoZW5ldmVyIHRoZSAuTkVULXNpZGUgY29kZSByZXBvcnRzIHRoYXQgYSBjZXJ0YWluIGV2ZW50IGhhbmRsZXJcclxuICAgIC8vIGhhcyBiZWVuIGRpc3Bvc2VkLiBIb3dldmVyIHdlIHdpbGwgYWxyZWFkeSBoYXZlIGRpc3Bvc2VkIHRoZSBpbmZvIGFib3V0IHRoYXQgaGFuZGxlciBpZlxyXG4gICAgLy8gdGhlIGV2ZW50SGFuZGxlcklkIGZvciB0aGUgKGVsZW1lbnQsZXZlbnROYW1lKSBwYWlyIHdhcyByZXBsYWNlZCBkdXJpbmcgZGlmZiBhcHBsaWNhdGlvbi5cclxuICAgIGNvbnN0IGluZm8gPSB0aGlzLmV2ZW50SW5mb1N0b3JlLnJlbW92ZShldmVudEhhbmRsZXJJZCk7XHJcbiAgICBpZiAoaW5mbykge1xyXG4gICAgICAvLyBMb29rcyBsaWtlIHRoaXMgZXZlbnQgaGFuZGxlciB3YXNuJ3QgYWxyZWFkeSBkaXNwb3NlZFxyXG4gICAgICAvLyBSZW1vdmUgdGhlIGFzc29jaWF0ZWQgZGF0YSBmcm9tIHRoZSBET00gZWxlbWVudFxyXG4gICAgICBjb25zdCBlbGVtZW50ID0gaW5mby5lbGVtZW50O1xyXG4gICAgICBpZiAoZWxlbWVudC5oYXNPd25Qcm9wZXJ0eSh0aGlzLmV2ZW50c0NvbGxlY3Rpb25LZXkpKSB7XHJcbiAgICAgICAgY29uc3QgZWxlbWVudEV2ZW50SW5mb3M6IEV2ZW50SGFuZGxlckluZm9zRm9yRWxlbWVudCA9IGVsZW1lbnRbdGhpcy5ldmVudHNDb2xsZWN0aW9uS2V5XTtcclxuICAgICAgICBkZWxldGUgZWxlbWVudEV2ZW50SW5mb3NbaW5mby5ldmVudE5hbWVdO1xyXG4gICAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhlbGVtZW50RXZlbnRJbmZvcykubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICBkZWxldGUgZWxlbWVudFt0aGlzLmV2ZW50c0NvbGxlY3Rpb25LZXldO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvbkdsb2JhbEV2ZW50KGV2dDogRXZlbnQpIHtcclxuICAgIGlmICghKGV2dC50YXJnZXQgaW5zdGFuY2VvZiBFbGVtZW50KSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2NhbiB1cCB0aGUgZWxlbWVudCBoaWVyYXJjaHksIGxvb2tpbmcgZm9yIGFueSBtYXRjaGluZyByZWdpc3RlcmVkIGV2ZW50IGhhbmRsZXJzXHJcbiAgICBsZXQgY2FuZGlkYXRlRWxlbWVudCA9IGV2dC50YXJnZXQgYXMgRWxlbWVudCB8IG51bGw7XHJcbiAgICBsZXQgZXZlbnRBcmdzOiBFdmVudEZvckRvdE5ldDxVSUV2ZW50QXJncz4gfCBudWxsID0gbnVsbDsgLy8gUG9wdWxhdGUgbGF6aWx5XHJcbiAgICBjb25zdCBldmVudElzTm9uQnViYmxpbmcgPSBub25CdWJibGluZ0V2ZW50cy5oYXNPd25Qcm9wZXJ0eShldnQudHlwZSk7XHJcbiAgICB3aGlsZSAoY2FuZGlkYXRlRWxlbWVudCkge1xyXG4gICAgICBpZiAoY2FuZGlkYXRlRWxlbWVudC5oYXNPd25Qcm9wZXJ0eSh0aGlzLmV2ZW50c0NvbGxlY3Rpb25LZXkpKSB7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlckluZm9zID0gY2FuZGlkYXRlRWxlbWVudFt0aGlzLmV2ZW50c0NvbGxlY3Rpb25LZXldO1xyXG4gICAgICAgIGlmIChoYW5kbGVySW5mb3MuaGFzT3duUHJvcGVydHkoZXZ0LnR5cGUpKSB7XHJcbiAgICAgICAgICAvLyBXZSBhcmUgZ29pbmcgdG8gcmFpc2UgYW4gZXZlbnQgZm9yIHRoaXMgZWxlbWVudCwgc28gcHJlcGFyZSBpbmZvIG5lZWRlZCBieSB0aGUgLk5FVCBjb2RlXHJcbiAgICAgICAgICBpZiAoIWV2ZW50QXJncykge1xyXG4gICAgICAgICAgICBldmVudEFyZ3MgPSBFdmVudEZvckRvdE5ldC5mcm9tRE9NRXZlbnQoZXZ0KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBjb25zdCBoYW5kbGVySW5mbyA9IGhhbmRsZXJJbmZvc1tldnQudHlwZV07XHJcbiAgICAgICAgICB0aGlzLm9uRXZlbnQoZXZ0LCBoYW5kbGVySW5mby5jb21wb25lbnRJZCwgaGFuZGxlckluZm8uZXZlbnRIYW5kbGVySWQsIGV2ZW50QXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjYW5kaWRhdGVFbGVtZW50ID0gZXZlbnRJc05vbkJ1YmJsaW5nID8gbnVsbCA6IGNhbmRpZGF0ZUVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8vIFJlc3BvbnNpYmxlIGZvciBhZGRpbmcgYW5kIHJlbW92aW5nIHRoZSBnbG9iYWwgbGlzdGVuZXIgd2hlbiB0aGUgbnVtYmVyIG9mIGxpc3RlbmVyc1xyXG4vLyBmb3IgYSBnaXZlbiBldmVudCBuYW1lIGNoYW5nZXMgYmV0d2VlbiB6ZXJvIGFuZCBub256ZXJvXHJcbmNsYXNzIEV2ZW50SW5mb1N0b3JlIHtcclxuICBwcml2YXRlIGluZm9zQnlFdmVudEhhbmRsZXJJZDogeyBbZXZlbnRIYW5kbGVySWQ6IG51bWJlcl06IEV2ZW50SGFuZGxlckluZm8gfSA9IHt9O1xyXG4gIHByaXZhdGUgY291bnRCeUV2ZW50TmFtZTogeyBbZXZlbnROYW1lOiBzdHJpbmddOiBudW1iZXIgfSA9IHt9O1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGdsb2JhbExpc3RlbmVyOiBFdmVudExpc3RlbmVyKSB7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYWRkKGluZm86IEV2ZW50SGFuZGxlckluZm8pIHtcclxuICAgIGlmICh0aGlzLmluZm9zQnlFdmVudEhhbmRsZXJJZFtpbmZvLmV2ZW50SGFuZGxlcklkXSkge1xyXG4gICAgICAvLyBTaG91bGQgbmV2ZXIgaGFwcGVuLCBidXQgd2Ugd2FudCB0byBrbm93IGlmIGl0IGRvZXNcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFdmVudCAke2luZm8uZXZlbnRIYW5kbGVySWR9IGlzIGFscmVhZHkgdHJhY2tlZGApO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5mb3NCeUV2ZW50SGFuZGxlcklkW2luZm8uZXZlbnRIYW5kbGVySWRdID0gaW5mbztcclxuXHJcbiAgICBjb25zdCBldmVudE5hbWUgPSBpbmZvLmV2ZW50TmFtZTtcclxuICAgIGlmICh0aGlzLmNvdW50QnlFdmVudE5hbWUuaGFzT3duUHJvcGVydHkoZXZlbnROYW1lKSkge1xyXG4gICAgICB0aGlzLmNvdW50QnlFdmVudE5hbWVbZXZlbnROYW1lXSsrO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jb3VudEJ5RXZlbnROYW1lW2V2ZW50TmFtZV0gPSAxO1xyXG5cclxuICAgICAgLy8gVG8gbWFrZSBkZWxlZ2F0aW9uIHdvcmsgd2l0aCBub24tYnViYmxpbmcgZXZlbnRzLCByZWdpc3RlciBhICdjYXB0dXJlJyBsaXN0ZW5lci5cclxuICAgICAgLy8gV2UgcHJlc2VydmUgdGhlIG5vbi1idWJibGluZyBiZWhhdmlvciBieSBvbmx5IGRpc3BhdGNoaW5nIHN1Y2ggZXZlbnRzIHRvIHRoZSB0YXJnZXRlZCBlbGVtZW50LlxyXG4gICAgICBjb25zdCB1c2VDYXB0dXJlID0gbm9uQnViYmxpbmdFdmVudHMuaGFzT3duUHJvcGVydHkoZXZlbnROYW1lKTtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHRoaXMuZ2xvYmFsTGlzdGVuZXIsIHVzZUNhcHR1cmUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHVwZGF0ZShvbGRFdmVudEhhbmRsZXJJZDogbnVtYmVyLCBuZXdFdmVudEhhbmRsZXJJZDogbnVtYmVyKSB7XHJcbiAgICBpZiAodGhpcy5pbmZvc0J5RXZlbnRIYW5kbGVySWQuaGFzT3duUHJvcGVydHkobmV3RXZlbnRIYW5kbGVySWQpKSB7XHJcbiAgICAgIC8vIFNob3VsZCBuZXZlciBoYXBwZW4sIGJ1dCB3ZSB3YW50IHRvIGtub3cgaWYgaXQgZG9lc1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEV2ZW50ICR7bmV3RXZlbnRIYW5kbGVySWR9IGlzIGFscmVhZHkgdHJhY2tlZGApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFNpbmNlIHdlJ3JlIGp1c3QgdXBkYXRpbmcgdGhlIGV2ZW50IGhhbmRsZXIgSUQsIHRoZXJlJ3Mgbm8gbmVlZCB0byB1cGRhdGUgdGhlIGdsb2JhbCBjb3VudHNcclxuICAgIGNvbnN0IGluZm8gPSB0aGlzLmluZm9zQnlFdmVudEhhbmRsZXJJZFtvbGRFdmVudEhhbmRsZXJJZF07XHJcbiAgICBkZWxldGUgdGhpcy5pbmZvc0J5RXZlbnRIYW5kbGVySWRbb2xkRXZlbnRIYW5kbGVySWRdO1xyXG4gICAgaW5mby5ldmVudEhhbmRsZXJJZCA9IG5ld0V2ZW50SGFuZGxlcklkO1xyXG4gICAgdGhpcy5pbmZvc0J5RXZlbnRIYW5kbGVySWRbbmV3RXZlbnRIYW5kbGVySWRdID0gaW5mbztcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZW1vdmUoZXZlbnRIYW5kbGVySWQ6IG51bWJlcik6IEV2ZW50SGFuZGxlckluZm8ge1xyXG4gICAgY29uc3QgaW5mbyA9IHRoaXMuaW5mb3NCeUV2ZW50SGFuZGxlcklkW2V2ZW50SGFuZGxlcklkXTtcclxuICAgIGlmIChpbmZvKSB7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLmluZm9zQnlFdmVudEhhbmRsZXJJZFtldmVudEhhbmRsZXJJZF07XHJcblxyXG4gICAgICBjb25zdCBldmVudE5hbWUgPSBpbmZvLmV2ZW50TmFtZTtcclxuICAgICAgaWYgKC0tdGhpcy5jb3VudEJ5RXZlbnROYW1lW2V2ZW50TmFtZV0gPT09IDApIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5jb3VudEJ5RXZlbnROYW1lW2V2ZW50TmFtZV07XHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHRoaXMuZ2xvYmFsTGlzdGVuZXIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGluZm87XHJcbiAgfVxyXG59XHJcblxyXG5pbnRlcmZhY2UgRXZlbnRIYW5kbGVySW5mb3NGb3JFbGVtZW50IHtcclxuICAvLyBBbHRob3VnaCB3ZSAqY291bGQqIHRyYWNrIG11bHRpcGxlIGV2ZW50IGhhbmRsZXJzIHBlciAoZWxlbWVudCwgZXZlbnROYW1lKSBwYWlyXHJcbiAgLy8gKHNpbmNlIHRoZXkgaGF2ZSBkaXN0aW5jdCBldmVudEhhbmRsZXJJZCB2YWx1ZXMpLCB0aGVyZSdzIG5vIHBvaW50IGRvaW5nIHNvIGJlY2F1c2VcclxuICAvLyBvdXIgcHJvZ3JhbW1pbmcgbW9kZWwgaXMgdGhhdCB5b3UgZGVjbGFyZSBldmVudCBoYW5kbGVycyBhcyBhdHRyaWJ1dGVzLiBBbiBlbGVtZW50XHJcbiAgLy8gY2FuIG9ubHkgaGF2ZSBvbmUgYXR0cmlidXRlIHdpdGggYSBnaXZlbiBuYW1lLCBoZW5jZSBvbmx5IG9uZSBldmVudCBoYW5kbGVyIHdpdGhcclxuICAvLyB0aGF0IG5hbWUgYXQgYW55IG9uZSB0aW1lLlxyXG4gIC8vIFNvIHRvIGtlZXAgdGhpbmdzIHNpbXBsZSwgb25seSB0cmFjayBvbmUgRXZlbnRIYW5kbGVySW5mbyBwZXIgKGVsZW1lbnQsIGV2ZW50TmFtZSlcclxuICBbZXZlbnROYW1lOiBzdHJpbmddOiBFdmVudEhhbmRsZXJJbmZvXHJcbn1cclxuXHJcbmludGVyZmFjZSBFdmVudEhhbmRsZXJJbmZvIHtcclxuICBlbGVtZW50OiBFbGVtZW50O1xyXG4gIGV2ZW50TmFtZTogc3RyaW5nO1xyXG4gIGNvbXBvbmVudElkOiBudW1iZXI7XHJcbiAgZXZlbnRIYW5kbGVySWQ6IG51bWJlcjtcclxufVxyXG5cclxuZnVuY3Rpb24gdG9Mb29rdXAoaXRlbXM6IHN0cmluZ1tdKTogeyBba2V5OiBzdHJpbmddOiBib29sZWFuIH0ge1xyXG4gIGNvbnN0IHJlc3VsdCA9IHt9O1xyXG4gIGl0ZW1zLmZvckVhY2godmFsdWUgPT4geyByZXN1bHRbdmFsdWVdID0gdHJ1ZTsgfSk7XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUmVuZGVyaW5nL0V2ZW50RGVsZWdhdG9yLnRzIiwiZXhwb3J0IGNsYXNzIEV2ZW50Rm9yRG90TmV0PFREYXRhIGV4dGVuZHMgVUlFdmVudEFyZ3M+IHtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgdHlwZTogRXZlbnRBcmdzVHlwZSwgcHVibGljIHJlYWRvbmx5IGRhdGE6IFREYXRhKSB7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZnJvbURPTUV2ZW50KGV2ZW50OiBFdmVudCk6IEV2ZW50Rm9yRG90TmV0PFVJRXZlbnRBcmdzPiB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gZXZlbnQudGFyZ2V0IGFzIEVsZW1lbnQ7XHJcbiAgICBzd2l0Y2ggKGV2ZW50LnR5cGUpIHtcclxuXHJcbiAgICAgIGNhc2UgJ2NoYW5nZSc6IHtcclxuICAgICAgICBjb25zdCB0YXJnZXRJc0NoZWNrYm94ID0gaXNDaGVja2JveChlbGVtZW50KTtcclxuICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IHRhcmdldElzQ2hlY2tib3ggPyAhIWVsZW1lbnRbJ2NoZWNrZWQnXSA6IGVsZW1lbnRbJ3ZhbHVlJ107XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFdmVudEZvckRvdE5ldDxVSUNoYW5nZUV2ZW50QXJncz4oJ2NoYW5nZScsIHsgdHlwZTogZXZlbnQudHlwZSwgdmFsdWU6IG5ld1ZhbHVlIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjYXNlICdjb3B5JzpcclxuICAgICAgY2FzZSAnY3V0JzpcclxuICAgICAgY2FzZSAncGFzdGUnOlxyXG4gICAgICAgIHJldHVybiBuZXcgRXZlbnRGb3JEb3ROZXQ8VUlDbGlwYm9hcmRFdmVudEFyZ3M+KCdjbGlwYm9hcmQnLCB7IHR5cGU6IGV2ZW50LnR5cGUgfSk7XHJcblxyXG4gICAgICBjYXNlICdkcmFnJzpcclxuICAgICAgY2FzZSAnZHJhZ2VuZCc6XHJcbiAgICAgIGNhc2UgJ2RyYWdlbnRlcic6XHJcbiAgICAgIGNhc2UgJ2RyYWdsZWF2ZSc6XHJcbiAgICAgIGNhc2UgJ2RyYWdvdmVyJzpcclxuICAgICAgY2FzZSAnZHJhZ3N0YXJ0JzpcclxuICAgICAgY2FzZSAnZHJvcCc6XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFdmVudEZvckRvdE5ldDxVSURyYWdFdmVudEFyZ3M+KCdkcmFnJywgcGFyc2VEcmFnRXZlbnQoZXZlbnQpKTtcclxuXHJcbiAgICAgIGNhc2UgJ2ZvY3VzJzpcclxuICAgICAgY2FzZSAnYmx1cic6XHJcbiAgICAgIGNhc2UgJ2ZvY3VzaW4nOlxyXG4gICAgICBjYXNlICdmb2N1c291dCc6XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFdmVudEZvckRvdE5ldDxVSUZvY3VzRXZlbnRBcmdzPignZm9jdXMnLCB7IHR5cGU6IGV2ZW50LnR5cGUgfSk7XHJcblxyXG4gICAgICBjYXNlICdrZXlkb3duJzpcclxuICAgICAgY2FzZSAna2V5dXAnOlxyXG4gICAgICBjYXNlICdrZXlwcmVzcyc6XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFdmVudEZvckRvdE5ldDxVSUtleWJvYXJkRXZlbnRBcmdzPigna2V5Ym9hcmQnLCBwYXJzZUtleWJvYXJkRXZlbnQoPEtleWJvYXJkRXZlbnQ+ZXZlbnQpKTtcclxuXHJcbiAgICAgIGNhc2UgJ2NvbnRleHRtZW51JzpcclxuICAgICAgY2FzZSAnY2xpY2snOlxyXG4gICAgICBjYXNlICdtb3VzZW92ZXInOlxyXG4gICAgICBjYXNlICdtb3VzZW91dCc6XHJcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XHJcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XHJcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxyXG4gICAgICBjYXNlICdkYmxjbGljayc6XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFdmVudEZvckRvdE5ldDxVSU1vdXNlRXZlbnRBcmdzPignbW91c2UnLCBwYXJzZU1vdXNlRXZlbnQoPE1vdXNlRXZlbnQ+ZXZlbnQpKTtcclxuXHJcbiAgICAgIGNhc2UgJ2Vycm9yJzpcclxuICAgICAgICByZXR1cm4gbmV3IEV2ZW50Rm9yRG90TmV0PFVJRXJyb3JFdmVudEFyZ3M+KCdlcnJvcicsIHBhcnNlRXJyb3JFdmVudCg8RXJyb3JFdmVudD5ldmVudCkpO1xyXG5cclxuICAgICAgY2FzZSAnbG9hZHN0YXJ0JzpcclxuICAgICAgY2FzZSAndGltZW91dCc6XHJcbiAgICAgIGNhc2UgJ2Fib3J0JzpcclxuICAgICAgY2FzZSAnbG9hZCc6XHJcbiAgICAgIGNhc2UgJ2xvYWRlbmQnOlxyXG4gICAgICBjYXNlICdwcm9ncmVzcyc6XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFdmVudEZvckRvdE5ldDxVSVByb2dyZXNzRXZlbnRBcmdzPigncHJvZ3Jlc3MnLCBwYXJzZVByb2dyZXNzRXZlbnQoPFByb2dyZXNzRXZlbnQ+ZXZlbnQpKTtcclxuXHJcbiAgICAgIGNhc2UgJ3RvdWNoY2FuY2VsJzpcclxuICAgICAgY2FzZSAndG91Y2hlbmQnOlxyXG4gICAgICBjYXNlICd0b3VjaG1vdmUnOlxyXG4gICAgICBjYXNlICd0b3VjaGVudGVyJzpcclxuICAgICAgY2FzZSAndG91Y2hsZWF2ZSc6XHJcbiAgICAgIGNhc2UgJ3RvdWNoc3RhcnQnOlxyXG4gICAgICAgIHJldHVybiBuZXcgRXZlbnRGb3JEb3ROZXQ8VUlUb3VjaEV2ZW50QXJncz4oJ3RvdWNoJywgcGFyc2VUb3VjaEV2ZW50KDxUb3VjaEV2ZW50PmV2ZW50KSk7XHJcblxyXG4gICAgICBjYXNlICdnb3Rwb2ludGVyY2FwdHVyZSc6XHJcbiAgICAgIGNhc2UgJ2xvc3Rwb2ludGVyY2FwdHVyZSc6XHJcbiAgICAgIGNhc2UgJ3BvaW50ZXJjYW5jZWwnOlxyXG4gICAgICBjYXNlICdwb2ludGVyZG93bic6XHJcbiAgICAgIGNhc2UgJ3BvaW50ZXJlbnRlcic6XHJcbiAgICAgIGNhc2UgJ3BvaW50ZXJsZWF2ZSc6XHJcbiAgICAgIGNhc2UgJ3BvaW50ZXJtb3ZlJzpcclxuICAgICAgY2FzZSAncG9pbnRlcm91dCc6XHJcbiAgICAgIGNhc2UgJ3BvaW50ZXJvdmVyJzpcclxuICAgICAgY2FzZSAncG9pbnRlcnVwJzpcclxuICAgICAgICByZXR1cm4gbmV3IEV2ZW50Rm9yRG90TmV0PFVJUG9pbnRlckV2ZW50QXJncz4oJ3BvaW50ZXInLCBwYXJzZVBvaW50ZXJFdmVudCg8UG9pbnRlckV2ZW50PmV2ZW50KSk7XHJcblxyXG4gICAgICBjYXNlICd3aGVlbCc6XHJcbiAgICAgIGNhc2UgJ21vdXNld2hlZWwnOlxyXG4gICAgICAgIHJldHVybiBuZXcgRXZlbnRGb3JEb3ROZXQ8VUlXaGVlbEV2ZW50QXJncz4oJ3doZWVsJywgcGFyc2VXaGVlbEV2ZW50KDxXaGVlbEV2ZW50PmV2ZW50KSk7XHJcblxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHJldHVybiBuZXcgRXZlbnRGb3JEb3ROZXQ8VUlFdmVudEFyZ3M+KCd1bmtub3duJywgeyB0eXBlOiBldmVudC50eXBlIH0pO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VEcmFnRXZlbnQoZXZlbnQ6IGFueSkge1xyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBldmVudC50eXBlLFxyXG4gICAgZGV0YWlsOiBldmVudC5kZXRhaWwsXHJcbiAgICBkYXRhVHJhbnNmZXI6IGV2ZW50LmRhdGFUcmFuc2ZlcixcclxuICAgIHNjcmVlblg6IGV2ZW50LnNjcmVlblgsXHJcbiAgICBzY3JlZW5ZOiBldmVudC5zY3JlZW5ZLFxyXG4gICAgY2xpZW50WDogZXZlbnQuY2xpZW50WCxcclxuICAgIGNsaWVudFk6IGV2ZW50LmNsaWVudFksXHJcbiAgICBidXR0b246IGV2ZW50LmJ1dHRvbixcclxuICAgIGJ1dHRvbnM6IGV2ZW50LmJ1dHRvbnMsXHJcbiAgICBjdHJsS2V5OiBldmVudC5jdHJsS2V5LFxyXG4gICAgc2hpZnRLZXk6IGV2ZW50LnNoaWZ0S2V5LFxyXG4gICAgYWx0S2V5OiBldmVudC5hbHRLZXksXHJcbiAgICBtZXRhS2V5OiBldmVudC5tZXRhS2V5XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZVdoZWVsRXZlbnQoZXZlbnQ6IFdoZWVsRXZlbnQpIHtcclxuICByZXR1cm4ge1xyXG4gICAgLi4ucGFyc2VNb3VzZUV2ZW50KGV2ZW50KSxcclxuICAgIGRlbHRhWDogZXZlbnQuZGVsdGFYLFxyXG4gICAgZGVsdGFZOiBldmVudC5kZWx0YVksXHJcbiAgICBkZWx0YVo6IGV2ZW50LmRlbHRhWixcclxuICAgIGRlbHRhTW9kZTogZXZlbnQuZGVsdGFNb2RlXHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VFcnJvckV2ZW50KGV2ZW50OiBFcnJvckV2ZW50KSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHR5cGU6IGV2ZW50LnR5cGUsXHJcbiAgICBtZXNzYWdlOiBldmVudC5tZXNzYWdlLFxyXG4gICAgZmlsZW5hbWU6IGV2ZW50LmZpbGVuYW1lLFxyXG4gICAgbGluZW5vOiBldmVudC5saW5lbm8sXHJcbiAgICBjb2xubzogZXZlbnQuY29sbm9cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlUHJvZ3Jlc3NFdmVudChldmVudDogUHJvZ3Jlc3NFdmVudCkge1xyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBldmVudC50eXBlLFxyXG4gICAgbGVuZ3RoQ29tcHV0YWJsZTogZXZlbnQubGVuZ3RoQ29tcHV0YWJsZSxcclxuICAgIGxvYWRlZDogZXZlbnQubG9hZGVkLFxyXG4gICAgdG90YWw6IGV2ZW50LnRvdGFsXHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VUb3VjaEV2ZW50KGV2ZW50OiBUb3VjaEV2ZW50KSB7XHJcblxyXG4gIGZ1bmN0aW9uIHBhcnNlVG91Y2godG91Y2hMaXN0OiBUb3VjaExpc3QpIHtcclxuICAgIGNvbnN0IHRvdWNoZXM6IFVJVG91Y2hQb2ludFtdID0gW107XHJcbiAgICBcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG91Y2hMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IHRvdWNoID0gdG91Y2hMaXN0W2ldO1xyXG4gICAgICB0b3VjaGVzLnB1c2goe1xyXG4gICAgICAgIGlkZW50aWZpZXI6IHRvdWNoLmlkZW50aWZpZXIsXHJcbiAgICAgICAgY2xpZW50WDogdG91Y2guY2xpZW50WCxcclxuICAgICAgICBjbGllbnRZOiB0b3VjaC5jbGllbnRZLFxyXG4gICAgICAgIHNjcmVlblg6IHRvdWNoLnNjcmVlblgsXHJcbiAgICAgICAgc2NyZWVuWTogdG91Y2guc2NyZWVuWSxcclxuICAgICAgICBwYWdlWDogdG91Y2gucGFnZVgsXHJcbiAgICAgICAgcGFnZVk6IHRvdWNoLnBhZ2VZXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvdWNoZXM7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdHlwZTogZXZlbnQudHlwZSxcclxuICAgIGRldGFpbDogZXZlbnQuZGV0YWlsLFxyXG4gICAgdG91Y2hlczogcGFyc2VUb3VjaChldmVudC50b3VjaGVzKSxcclxuICAgIHRhcmdldFRvdWNoZXM6IHBhcnNlVG91Y2goZXZlbnQudGFyZ2V0VG91Y2hlcyksXHJcbiAgICBjaGFuZ2VkVG91Y2hlczogcGFyc2VUb3VjaChldmVudC5jaGFuZ2VkVG91Y2hlcyksXHJcbiAgICBjdHJsS2V5OiBldmVudC5jdHJsS2V5LFxyXG4gICAgc2hpZnRLZXk6IGV2ZW50LnNoaWZ0S2V5LFxyXG4gICAgYWx0S2V5OiBldmVudC5hbHRLZXksXHJcbiAgICBtZXRhS2V5OiBldmVudC5tZXRhS2V5XHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VLZXlib2FyZEV2ZW50KGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHR5cGU6IGV2ZW50LnR5cGUsXHJcbiAgICBrZXk6IGV2ZW50LmtleSxcclxuICAgIGNvZGU6IGV2ZW50LmNvZGUsXHJcbiAgICBsb2NhdGlvbjogZXZlbnQubG9jYXRpb24sXHJcbiAgICByZXBlYXQ6IGV2ZW50LnJlcGVhdCxcclxuICAgIGN0cmxLZXk6IGV2ZW50LmN0cmxLZXksXHJcbiAgICBzaGlmdEtleTogZXZlbnQuc2hpZnRLZXksXHJcbiAgICBhbHRLZXk6IGV2ZW50LmFsdEtleSxcclxuICAgIG1ldGFLZXk6IGV2ZW50Lm1ldGFLZXlcclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZVBvaW50ZXJFdmVudChldmVudDogUG9pbnRlckV2ZW50KSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIC4uLnBhcnNlTW91c2VFdmVudChldmVudCksXHJcbiAgICBwb2ludGVySWQ6IGV2ZW50LnBvaW50ZXJJZCxcclxuICAgIHdpZHRoOiBldmVudC53aWR0aCxcclxuICAgIGhlaWdodDogZXZlbnQuaGVpZ2h0LFxyXG4gICAgcHJlc3N1cmU6IGV2ZW50LnByZXNzdXJlLFxyXG4gICAgdGlsdFg6IGV2ZW50LnRpbHRYLFxyXG4gICAgdGlsdFk6IGV2ZW50LnRpbHRZLFxyXG4gICAgcG9pbnRlclR5cGU6IGV2ZW50LnBvaW50ZXJUeXBlLFxyXG4gICAgaXNQcmltYXJ5OiBldmVudC5pc1ByaW1hcnlcclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZU1vdXNlRXZlbnQoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuICByZXR1cm4ge1xyXG4gICAgdHlwZTogZXZlbnQudHlwZSxcclxuICAgIGRldGFpbDogZXZlbnQuZGV0YWlsLFxyXG4gICAgc2NyZWVuWDogZXZlbnQuc2NyZWVuWCxcclxuICAgIHNjcmVlblk6IGV2ZW50LnNjcmVlblksXHJcbiAgICBjbGllbnRYOiBldmVudC5jbGllbnRYLFxyXG4gICAgY2xpZW50WTogZXZlbnQuY2xpZW50WSxcclxuICAgIGJ1dHRvbjogZXZlbnQuYnV0dG9uLFxyXG4gICAgYnV0dG9uczogZXZlbnQuYnV0dG9ucyxcclxuICAgIGN0cmxLZXk6IGV2ZW50LmN0cmxLZXksXHJcbiAgICBzaGlmdEtleTogZXZlbnQuc2hpZnRLZXksXHJcbiAgICBhbHRLZXk6IGV2ZW50LmFsdEtleSxcclxuICAgIG1ldGFLZXk6IGV2ZW50Lm1ldGFLZXlcclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0NoZWNrYm94KGVsZW1lbnQ6IEVsZW1lbnQgfCBudWxsKSB7XHJcbiAgcmV0dXJuIGVsZW1lbnQgJiYgZWxlbWVudC50YWdOYW1lID09PSAnSU5QVVQnICYmIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdjaGVja2JveCc7XHJcbn1cclxuXHJcbi8vIFRoZSBmb2xsb3dpbmcgaW50ZXJmYWNlcyBtdXN0IGJlIGtlcHQgaW4gc3luYyB3aXRoIHRoZSBVSUV2ZW50QXJncyBDIyBjbGFzc2VzXHJcblxyXG50eXBlIEV2ZW50QXJnc1R5cGUgPSAnY2hhbmdlJyB8ICdjbGlwYm9hcmQnIHwgJ2RyYWcnIHwgJ2Vycm9yJyB8ICdmb2N1cycgfCAna2V5Ym9hcmQnIHwgJ21vdXNlJyB8ICdwb2ludGVyJyB8ICdwcm9ncmVzcycgfCAndG91Y2gnIHwgJ3Vua25vd24nIHwgJ3doZWVsJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVUlFdmVudEFyZ3Mge1xyXG4gIHR5cGU6IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIFVJQ2hhbmdlRXZlbnRBcmdzIGV4dGVuZHMgVUlFdmVudEFyZ3Mge1xyXG4gIHZhbHVlOiBzdHJpbmcgfCBib29sZWFuO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgVUlDbGlwYm9hcmRFdmVudEFyZ3MgZXh0ZW5kcyBVSUV2ZW50QXJncyB7XHJcbn1cclxuXHJcbmludGVyZmFjZSBVSURyYWdFdmVudEFyZ3MgZXh0ZW5kcyBVSUV2ZW50QXJncyB7XHJcbiAgZGV0YWlsOiBudW1iZXI7XHJcbiAgZGF0YVRyYW5zZmVyOiBVSURhdGFUcmFuc2ZlcjtcclxuICBzY3JlZW5YOiBudW1iZXI7XHJcbiAgc2NyZWVuWTogbnVtYmVyO1xyXG4gIGNsaWVudFg6IG51bWJlcjtcclxuICBjbGllbnRZOiBudW1iZXI7XHJcbiAgYnV0dG9uOiBudW1iZXI7XHJcbiAgYnV0dG9uczogbnVtYmVyO1xyXG4gIGN0cmxLZXk6IGJvb2xlYW47XHJcbiAgc2hpZnRLZXk6IGJvb2xlYW47XHJcbiAgYWx0S2V5OiBib29sZWFuO1xyXG4gIG1ldGFLZXk6IGJvb2xlYW47XHJcbn1cclxuXHJcbmludGVyZmFjZSBVSURhdGFUcmFuc2ZlciB7XHJcbiAgZHJvcEVmZmVjdDogc3RyaW5nO1xyXG4gIGVmZmVjdEFsbG93ZWQ6IHN0cmluZztcclxuICBmaWxlczogc3RyaW5nW107XHJcbiAgaXRlbXM6IFVJRGF0YVRyYW5zZmVySXRlbVtdO1xyXG4gIHR5cGVzOiBzdHJpbmdbXTtcclxufVxyXG5cclxuaW50ZXJmYWNlIFVJRGF0YVRyYW5zZmVySXRlbSB7XHJcbiAga2luZDogc3RyaW5nO1xyXG4gIHR5cGU6IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIFVJRXJyb3JFdmVudEFyZ3MgZXh0ZW5kcyBVSUV2ZW50QXJncyB7XHJcbiAgbWVzc2FnZTogc3RyaW5nO1xyXG4gIGZpbGVuYW1lOiBzdHJpbmc7XHJcbiAgbGluZW5vOiBudW1iZXI7XHJcbiAgY29sbm86IG51bWJlcjtcclxuXHJcbiAgLy8gb21pdHRpbmcgJ2Vycm9yJyBoZXJlIHNpbmNlIHdlJ2QgaGF2ZSB0byBzZXJpYWxpemUgaXQsIGFuZCBpdCdzIG5vdCBjbGVhciB3ZSB3aWxsIHdhbnQgdG9cclxuICAvLyBkbyB0aGF0LiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRXJyb3JFdmVudFxyXG59XHJcblxyXG5pbnRlcmZhY2UgVUlGb2N1c0V2ZW50QXJncyBleHRlbmRzIFVJRXZlbnRBcmdzIHtcclxufVxyXG5cclxuaW50ZXJmYWNlIFVJS2V5Ym9hcmRFdmVudEFyZ3MgZXh0ZW5kcyBVSUV2ZW50QXJncyB7XHJcbiAga2V5OiBzdHJpbmc7XHJcbiAgY29kZTogc3RyaW5nO1xyXG4gIGxvY2F0aW9uOiBudW1iZXI7XHJcbiAgcmVwZWF0OiBib29sZWFuO1xyXG4gIGN0cmxLZXk6IGJvb2xlYW47XHJcbiAgc2hpZnRLZXk6IGJvb2xlYW47XHJcbiAgYWx0S2V5OiBib29sZWFuO1xyXG4gIG1ldGFLZXk6IGJvb2xlYW47XHJcbn1cclxuXHJcbmludGVyZmFjZSBVSU1vdXNlRXZlbnRBcmdzIGV4dGVuZHMgVUlFdmVudEFyZ3Mge1xyXG4gIGRldGFpbDogbnVtYmVyO1xyXG4gIHNjcmVlblg6IG51bWJlcjtcclxuICBzY3JlZW5ZOiBudW1iZXI7XHJcbiAgY2xpZW50WDogbnVtYmVyO1xyXG4gIGNsaWVudFk6IG51bWJlcjtcclxuICBidXR0b246IG51bWJlcjtcclxuICBidXR0b25zOiBudW1iZXI7XHJcbiAgY3RybEtleTogYm9vbGVhbjtcclxuICBzaGlmdEtleTogYm9vbGVhbjtcclxuICBhbHRLZXk6IGJvb2xlYW47XHJcbiAgbWV0YUtleTogYm9vbGVhbjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFVJUG9pbnRlckV2ZW50QXJncyBleHRlbmRzIFVJTW91c2VFdmVudEFyZ3Mge1xyXG4gIHBvaW50ZXJJZDogbnVtYmVyO1xyXG4gIHdpZHRoOiBudW1iZXI7XHJcbiAgaGVpZ2h0OiBudW1iZXI7XHJcbiAgcHJlc3N1cmU6IG51bWJlcjtcclxuICB0aWx0WDogbnVtYmVyO1xyXG4gIHRpbHRZOiBudW1iZXI7XHJcbiAgcG9pbnRlclR5cGU6IHN0cmluZztcclxuICBpc1ByaW1hcnk6IGJvb2xlYW47XHJcbn1cclxuXHJcbmludGVyZmFjZSBVSVByb2dyZXNzRXZlbnRBcmdzIGV4dGVuZHMgVUlFdmVudEFyZ3Mge1xyXG4gIGxlbmd0aENvbXB1dGFibGU6IGJvb2xlYW47XHJcbiAgbG9hZGVkOiBudW1iZXI7XHJcbiAgdG90YWw6IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFVJVG91Y2hFdmVudEFyZ3MgZXh0ZW5kcyBVSUV2ZW50QXJncyB7XHJcbiAgZGV0YWlsOiBudW1iZXI7XHJcbiAgdG91Y2hlczogVUlUb3VjaFBvaW50W107XHJcbiAgdGFyZ2V0VG91Y2hlczogVUlUb3VjaFBvaW50W107XHJcbiAgY2hhbmdlZFRvdWNoZXM6IFVJVG91Y2hQb2ludFtdO1xyXG4gIGN0cmxLZXk6IGJvb2xlYW47XHJcbiAgc2hpZnRLZXk6IGJvb2xlYW47XHJcbiAgYWx0S2V5OiBib29sZWFuO1xyXG4gIG1ldGFLZXk6IGJvb2xlYW47XHJcbn1cclxuXHJcbmludGVyZmFjZSBVSVRvdWNoUG9pbnQge1xyXG4gIGlkZW50aWZpZXI6IG51bWJlcjtcclxuICBzY3JlZW5YOiBudW1iZXI7XHJcbiAgc2NyZWVuWTogbnVtYmVyO1xyXG4gIGNsaWVudFg6IG51bWJlcjtcclxuICBjbGllbnRZOiBudW1iZXI7XHJcbiAgcGFnZVg6IG51bWJlcjtcclxuICBwYWdlWTogbnVtYmVyO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgVUlXaGVlbEV2ZW50QXJncyBleHRlbmRzIFVJTW91c2VFdmVudEFyZ3Mge1xyXG4gIGRlbHRhWDogbnVtYmVyO1xyXG4gIGRlbHRhWTogbnVtYmVyO1xyXG4gIGRlbHRhWjogbnVtYmVyO1xyXG4gIGRlbHRhTW9kZTogbnVtYmVyO1xyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9SZW5kZXJpbmcvRXZlbnRGb3JEb3ROZXQudHMiLCIvKlxyXG4gIEEgTG9naWNhbEVsZW1lbnQgcGxheXMgdGhlIHNhbWUgcm9sZSBhcyBhbiBFbGVtZW50IGluc3RhbmNlIGZyb20gdGhlIHBvaW50IG9mIHZpZXcgb2YgdGhlXHJcbiAgQVBJIGNvbnN1bWVyLiBJbnNlcnRpbmcgYW5kIHJlbW92aW5nIGxvZ2ljYWwgZWxlbWVudHMgdXBkYXRlcyB0aGUgYnJvd3NlciBET00ganVzdCB0aGUgc2FtZS5cclxuXHJcbiAgVGhlIGRpZmZlcmVuY2UgaXMgdGhhdCwgdW5saWtlIHJlZ3VsYXIgRE9NIG11dGF0aW9uIEFQSXMsIHRoZSBMb2dpY2FsRWxlbWVudCBBUElzIGRvbid0IHVzZVxyXG4gIHRoZSB1bmRlcmx5aW5nIERPTSBzdHJ1Y3R1cmUgYXMgdGhlIGRhdGEgc3RvcmFnZSBmb3IgdGhlIGVsZW1lbnQgaGllcmFyY2h5LiBJbnN0ZWFkLCB0aGVcclxuICBMb2dpY2FsRWxlbWVudCBBUElzIHRha2UgY2FyZSBvZiB0cmFja2luZyBoaWVyYXJjaGljYWwgcmVsYXRpb25zaGlwcyBzZXBhcmF0ZWx5LiBUaGUgcG9pbnRcclxuICBvZiB0aGlzIGlzIHRvIHBlcm1pdCBhIGxvZ2ljYWwgdHJlZSBzdHJ1Y3R1cmUgaW4gd2hpY2ggcGFyZW50L2NoaWxkIHJlbGF0aW9uc2hpcHMgZG9uJ3RcclxuICBoYXZlIHRvIGJlIG1hdGVyaWFsaXplZCBpbiB0ZXJtcyBvZiBET00gZWxlbWVudCBwYXJlbnQvY2hpbGQgcmVsYXRpb25zaGlwcy4gQW5kIHRoZSByZWFzb25cclxuICB3aHkgd2Ugd2FudCB0aGF0IGlzIHNvIHRoYXQgaGllcmFyY2hpZXMgb2YgQmxhem9yIGNvbXBvbmVudHMgY2FuIGJlIHRyYWNrZWQgZXZlbiB3aGVuIHRob3NlXHJcbiAgY29tcG9uZW50cycgcmVuZGVyIG91dHB1dCBuZWVkIG5vdCBiZSBhIHNpbmdsZSBsaXRlcmFsIERPTSBlbGVtZW50LlxyXG5cclxuICBDb25zdW1lcnMgb2YgdGhlIEFQSSBkb24ndCBuZWVkIHRvIGtub3cgYWJvdXQgdGhlIGltcGxlbWVudGF0aW9uLCBidXQgaG93IGl0J3MgZG9uZSBpczpcclxuICAtIEVhY2ggTG9naWNhbEVsZW1lbnQgaXMgbWF0ZXJpYWxpemVkIGluIHRoZSBET00gYXMgZWl0aGVyOlxyXG4gICAgLSBBIE5vZGUgaW5zdGFuY2UsIGZvciBhY3R1YWwgTm9kZSBpbnN0YW5jZXMgaW5zZXJ0ZWQgdXNpbmcgJ2luc2VydExvZ2ljYWxDaGlsZCcgb3JcclxuICAgICAgZm9yIEVsZW1lbnQgaW5zdGFuY2VzIHByb21vdGVkIHRvIExvZ2ljYWxFbGVtZW50IHZpYSAndG9Mb2dpY2FsRWxlbWVudCdcclxuICAgIC0gQSBDb21tZW50IGluc3RhbmNlLCBmb3IgJ2xvZ2ljYWwgY29udGFpbmVyJyBpbnN0YW5jZXMgaW5zZXJ0ZWQgdXNpbmcgJ2NyZWF0ZUFuZEluc2VydExvZ2ljYWxDb250YWluZXInXHJcbiAgLSBUaGVuLCBvbiB0aGF0IGluc3RhbmNlIChpLmUuLCB0aGUgTm9kZSBvciBDb21tZW50KSwgd2Ugc3RvcmUgYW4gYXJyYXkgb2YgJ2xvZ2ljYWwgY2hpbGRyZW4nXHJcbiAgICBpbnN0YW5jZXMsIGUuZy4sXHJcbiAgICAgIFtmaXJzdENoaWxkLCBzZWNvbmRDaGlsZCwgdGhpcmRDaGlsZCwgLi4uXVxyXG4gICAgLi4uIHBsdXMgd2Ugc3RvcmUgYSByZWZlcmVuY2UgdG8gdGhlICdsb2dpY2FsIHBhcmVudCcgKGlmIGFueSlcclxuICAtIFRoZSAnbG9naWNhbCBjaGlsZHJlbicgYXJyYXkgbWVhbnMgd2UgY2FuIGxvb2sgdXAgaW4gTygxKTpcclxuICAgIC0gVGhlIG51bWJlciBvZiBsb2dpY2FsIGNoaWxkcmVuIChub3QgY3VycmVudGx5IGltcGxlbWVudGVkIGJlY2F1c2Ugbm90IHJlcXVpcmVkLCBidXQgdHJpdmlhbClcclxuICAgIC0gVGhlIGxvZ2ljYWwgY2hpbGQgYXQgYW55IGdpdmVuIGluZGV4XHJcbiAgLSBXaGVuZXZlciBhIGxvZ2ljYWwgY2hpbGQgaXMgYWRkZWQgb3IgcmVtb3ZlZCwgd2UgdXBkYXRlIHRoZSBwYXJlbnQncyBhcnJheSBvZiBsb2dpY2FsIGNoaWxkcmVuXHJcbiovXHJcblxyXG5jb25zdCBsb2dpY2FsQ2hpbGRyZW5Qcm9wbmFtZSA9IGNyZWF0ZVN5bWJvbE9yRmFsbGJhY2soJ19ibGF6b3JMb2dpY2FsQ2hpbGRyZW4nKTtcclxuY29uc3QgbG9naWNhbFBhcmVudFByb3BuYW1lID0gY3JlYXRlU3ltYm9sT3JGYWxsYmFjaygnX2JsYXpvckxvZ2ljYWxQYXJlbnQnKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0b0xvZ2ljYWxFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQpIHtcclxuICBpZiAoZWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignTmV3IGxvZ2ljYWwgZWxlbWVudHMgbXVzdCBzdGFydCBlbXB0eScpO1xyXG4gIH1cclxuXHJcbiAgZWxlbWVudFtsb2dpY2FsQ2hpbGRyZW5Qcm9wbmFtZV0gPSBbXTtcclxuICByZXR1cm4gZWxlbWVudCBhcyBhbnkgYXMgTG9naWNhbEVsZW1lbnQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBbmRJbnNlcnRMb2dpY2FsQ29udGFpbmVyKHBhcmVudDogTG9naWNhbEVsZW1lbnQsIGNoaWxkSW5kZXg6IG51bWJlcik6IExvZ2ljYWxFbGVtZW50IHtcclxuICBjb25zdCBjb250YWluZXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgnIScpO1xyXG4gIGluc2VydExvZ2ljYWxDaGlsZChjb250YWluZXJFbGVtZW50LCBwYXJlbnQsIGNoaWxkSW5kZXgpO1xyXG4gIHJldHVybiBjb250YWluZXJFbGVtZW50IGFzIGFueSBhcyBMb2dpY2FsRWxlbWVudDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGluc2VydExvZ2ljYWxDaGlsZChjaGlsZDogTm9kZSwgcGFyZW50OiBMb2dpY2FsRWxlbWVudCwgY2hpbGRJbmRleDogbnVtYmVyKSB7XHJcbiAgY29uc3QgY2hpbGRBc0xvZ2ljYWxFbGVtZW50ID0gY2hpbGQgYXMgYW55IGFzIExvZ2ljYWxFbGVtZW50O1xyXG4gIGlmIChjaGlsZCBpbnN0YW5jZW9mIENvbW1lbnQpIHtcclxuICAgIGNvbnN0IGV4aXN0aW5nR3JhbmRjaGlsZHJlbiA9IGdldExvZ2ljYWxDaGlsZHJlbkFycmF5KGNoaWxkQXNMb2dpY2FsRWxlbWVudCk7XHJcbiAgICBpZiAoZXhpc3RpbmdHcmFuZGNoaWxkcmVuICYmIGdldExvZ2ljYWxDaGlsZHJlbkFycmF5KGNoaWxkQXNMb2dpY2FsRWxlbWVudCkubGVuZ3RoID4gMCkge1xyXG4gICAgICAvLyBUaGVyZSdzIG5vdGhpbmcgdG8gc3RvcCB1cyBpbXBsZW1lbnRpbmcgc3VwcG9ydCBmb3IgdGhpcyBzY2VuYXJpbywgYW5kIGl0J3Mgbm90IGRpZmZpY3VsdFxyXG4gICAgICAvLyAoYWZ0ZXIgaW5zZXJ0aW5nICdjaGlsZCcgaXRzZWxmLCBhbHNvIGl0ZXJhdGUgdGhyb3VnaCBpdHMgbG9naWNhbCBjaGlsZHJlbiBhbmQgcGh5c2ljYWxseVxyXG4gICAgICAvLyBwdXQgdGhlbSBhcyBmb2xsb3dpbmctc2libGluZ3MgaW4gdGhlIERPTSkuIEhvd2V2ZXIgdGhlcmUncyBubyBzY2VuYXJpbyB0aGF0IHJlcXVpcmVzIGl0XHJcbiAgICAgIC8vIHByZXNlbnRseSwgc28gaWYgd2UgZGlkIGltcGxlbWVudCBpdCB0aGVyZSdkIGJlIG5vIGdvb2Qgd2F5IHRvIGhhdmUgdGVzdHMgZm9yIGl0LlxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZDogaW5zZXJ0aW5nIG5vbi1lbXB0eSBsb2dpY2FsIGNvbnRhaW5lcicpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKGdldExvZ2ljYWxQYXJlbnQoY2hpbGRBc0xvZ2ljYWxFbGVtZW50KSkge1xyXG4gICAgLy8gTGlrZXdpc2UsIHdlIGNvdWxkIGVhc2lseSBzdXBwb3J0IHRoaXMgc2NlbmFyaW8gdG9vIChpbiB0aGlzICdpZicgYmxvY2ssIGp1c3Qgc3BsaWNlXHJcbiAgICAvLyBvdXQgJ2NoaWxkJyBmcm9tIHRoZSBsb2dpY2FsIGNoaWxkcmVuIGFycmF5IG9mIGl0cyBwcmV2aW91cyBsb2dpY2FsIHBhcmVudCBieSB1c2luZ1xyXG4gICAgLy8gQXJyYXkucHJvdG90eXBlLmluZGV4T2YgdG8gZGV0ZXJtaW5lIGl0cyBwcmV2aW91cyBzaWJsaW5nIGluZGV4KS5cclxuICAgIC8vIEJ1dCBhZ2Fpbiwgc2luY2UgdGhlcmUncyBub3QgY3VycmVudGx5IGFueSBzY2VuYXJpbyB0aGF0IHdvdWxkIHVzZSBpdCwgd2Ugd291bGQgbm90XHJcbiAgICAvLyBoYXZlIGFueSB0ZXN0IGNvdmVyYWdlIGZvciBzdWNoIGFuIGltcGxlbWVudGF0aW9uLlxyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQ6IG1vdmluZyBleGlzdGluZyBsb2dpY2FsIGNoaWxkcmVuJyk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBuZXdTaWJsaW5ncyA9IGdldExvZ2ljYWxDaGlsZHJlbkFycmF5KHBhcmVudCk7XHJcbiAgaWYgKGNoaWxkSW5kZXggPCBuZXdTaWJsaW5ncy5sZW5ndGgpIHtcclxuICAgIC8vIEluc2VydFxyXG4gICAgY29uc3QgbmV4dFNpYmxpbmcgPSBuZXdTaWJsaW5nc1tjaGlsZEluZGV4XSBhcyBhbnkgYXMgTm9kZTtcclxuICAgIG5leHRTaWJsaW5nLnBhcmVudE5vZGUhLmluc2VydEJlZm9yZShjaGlsZCwgbmV4dFNpYmxpbmcpO1xyXG4gICAgbmV3U2libGluZ3Muc3BsaWNlKGNoaWxkSW5kZXgsIDAsIGNoaWxkQXNMb2dpY2FsRWxlbWVudCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIEFwcGVuZFxyXG4gICAgYXBwZW5kRG9tTm9kZShjaGlsZCwgcGFyZW50KTtcclxuICAgIG5ld1NpYmxpbmdzLnB1c2goY2hpbGRBc0xvZ2ljYWxFbGVtZW50KTtcclxuICB9XHJcblxyXG4gIGNoaWxkQXNMb2dpY2FsRWxlbWVudFtsb2dpY2FsUGFyZW50UHJvcG5hbWVdID0gcGFyZW50O1xyXG4gIGlmICghKGxvZ2ljYWxDaGlsZHJlblByb3BuYW1lIGluIGNoaWxkQXNMb2dpY2FsRWxlbWVudCkpIHtcclxuICAgIGNoaWxkQXNMb2dpY2FsRWxlbWVudFtsb2dpY2FsQ2hpbGRyZW5Qcm9wbmFtZV0gPSBbXTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVMb2dpY2FsQ2hpbGQocGFyZW50OiBMb2dpY2FsRWxlbWVudCwgY2hpbGRJbmRleDogbnVtYmVyKSB7XHJcbiAgY29uc3QgY2hpbGRyZW5BcnJheSA9IGdldExvZ2ljYWxDaGlsZHJlbkFycmF5KHBhcmVudCk7XHJcbiAgY29uc3QgY2hpbGRUb1JlbW92ZSA9IGNoaWxkcmVuQXJyYXkuc3BsaWNlKGNoaWxkSW5kZXgsIDEpWzBdO1xyXG5cclxuICAvLyBJZiBpdCdzIGEgbG9naWNhbCBjb250YWluZXIsIGFsc28gcmVtb3ZlIGl0cyBkZXNjZW5kYW50c1xyXG4gIGlmIChjaGlsZFRvUmVtb3ZlIGluc3RhbmNlb2YgQ29tbWVudCkge1xyXG4gICAgY29uc3QgZ3JhbmRjaGlsZHJlbkFycmF5ID0gZ2V0TG9naWNhbENoaWxkcmVuQXJyYXkoY2hpbGRUb1JlbW92ZSk7XHJcbiAgICB3aGlsZSAoZ3JhbmRjaGlsZHJlbkFycmF5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgcmVtb3ZlTG9naWNhbENoaWxkKGNoaWxkVG9SZW1vdmUsIDApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gRmluYWxseSwgcmVtb3ZlIHRoZSBub2RlIGl0c2VsZlxyXG4gIGNvbnN0IGRvbU5vZGVUb1JlbW92ZSA9IGNoaWxkVG9SZW1vdmUgYXMgYW55IGFzIE5vZGU7XHJcbiAgZG9tTm9kZVRvUmVtb3ZlLnBhcmVudE5vZGUhLnJlbW92ZUNoaWxkKGRvbU5vZGVUb1JlbW92ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRMb2dpY2FsUGFyZW50KGVsZW1lbnQ6IExvZ2ljYWxFbGVtZW50KTogTG9naWNhbEVsZW1lbnQgfCBudWxsIHtcclxuICByZXR1cm4gKGVsZW1lbnRbbG9naWNhbFBhcmVudFByb3BuYW1lXSBhcyBMb2dpY2FsRWxlbWVudCkgfHwgbnVsbDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldExvZ2ljYWxDaGlsZChwYXJlbnQ6IExvZ2ljYWxFbGVtZW50LCBjaGlsZEluZGV4OiBudW1iZXIpOiBMb2dpY2FsRWxlbWVudCB7XHJcbiAgcmV0dXJuIGdldExvZ2ljYWxDaGlsZHJlbkFycmF5KHBhcmVudClbY2hpbGRJbmRleF07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1N2Z0VsZW1lbnQoZWxlbWVudDogTG9naWNhbEVsZW1lbnQpIHtcclxuICByZXR1cm4gZ2V0Q2xvc2VzdERvbUVsZW1lbnQoZWxlbWVudCkubmFtZXNwYWNlVVJJID09PSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRMb2dpY2FsQ2hpbGRyZW5BcnJheShlbGVtZW50OiBMb2dpY2FsRWxlbWVudCkge1xyXG4gIHJldHVybiBlbGVtZW50W2xvZ2ljYWxDaGlsZHJlblByb3BuYW1lXSBhcyBMb2dpY2FsRWxlbWVudFtdO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRMb2dpY2FsTmV4dFNpYmxpbmcoZWxlbWVudDogTG9naWNhbEVsZW1lbnQpOiBMb2dpY2FsRWxlbWVudCB8IG51bGwge1xyXG4gIGNvbnN0IHNpYmxpbmdzID0gZ2V0TG9naWNhbENoaWxkcmVuQXJyYXkoZ2V0TG9naWNhbFBhcmVudChlbGVtZW50KSEpO1xyXG4gIGNvbnN0IHNpYmxpbmdJbmRleCA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoc2libGluZ3MsIGVsZW1lbnQpO1xyXG4gIHJldHVybiBzaWJsaW5nc1tzaWJsaW5nSW5kZXggKyAxXSB8fCBudWxsO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDbG9zZXN0RG9tRWxlbWVudChsb2dpY2FsRWxlbWVudDogTG9naWNhbEVsZW1lbnQpIHtcclxuICBpZiAobG9naWNhbEVsZW1lbnQgaW5zdGFuY2VvZiBFbGVtZW50KSB7XHJcbiAgICByZXR1cm4gbG9naWNhbEVsZW1lbnQ7XHJcbiAgfSBlbHNlIGlmIChsb2dpY2FsRWxlbWVudCBpbnN0YW5jZW9mIENvbW1lbnQpIHtcclxuICAgIHJldHVybiBsb2dpY2FsRWxlbWVudC5wYXJlbnROb2RlISBhcyBFbGVtZW50O1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBhIHZhbGlkIGxvZ2ljYWwgZWxlbWVudCcpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gYXBwZW5kRG9tTm9kZShjaGlsZDogTm9kZSwgcGFyZW50OiBMb2dpY2FsRWxlbWVudCkge1xyXG4gIC8vIFRoaXMgZnVuY3Rpb24gb25seSBwdXRzICdjaGlsZCcgaW50byB0aGUgRE9NIGluIHRoZSByaWdodCBwbGFjZSByZWxhdGl2ZSB0byAncGFyZW50J1xyXG4gIC8vIEl0IGRvZXMgbm90IHVwZGF0ZSB0aGUgbG9naWNhbCBjaGlsZHJlbiBhcnJheSBvZiBhbnl0aGluZ1xyXG4gIGlmIChwYXJlbnQgaW5zdGFuY2VvZiBFbGVtZW50KSB7XHJcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xyXG4gIH0gZWxzZSBpZiAocGFyZW50IGluc3RhbmNlb2YgQ29tbWVudCkge1xyXG4gICAgY29uc3QgcGFyZW50TG9naWNhbE5leHRTaWJsaW5nID0gZ2V0TG9naWNhbE5leHRTaWJsaW5nKHBhcmVudCkgYXMgYW55IGFzIE5vZGU7XHJcbiAgICBpZiAocGFyZW50TG9naWNhbE5leHRTaWJsaW5nKSB7XHJcbiAgICAgIC8vIFNpbmNlIHRoZSBwYXJlbnQgaGFzIGEgbG9naWNhbCBuZXh0LXNpYmxpbmcsIGl0cyBhcHBlbmRlZCBjaGlsZCBnb2VzIHJpZ2h0IGJlZm9yZSB0aGF0XHJcbiAgICAgIHBhcmVudExvZ2ljYWxOZXh0U2libGluZy5wYXJlbnROb2RlIS5pbnNlcnRCZWZvcmUoY2hpbGQsIHBhcmVudExvZ2ljYWxOZXh0U2libGluZyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBTaW5jZSB0aGUgcGFyZW50IGhhcyBubyBsb2dpY2FsIG5leHQtc2libGluZywga2VlcCByZWN1cnNpbmcgdXB3YXJkcyB1bnRpbCB3ZSBmaW5kXHJcbiAgICAgIC8vIGEgbG9naWNhbCBhbmNlc3RvciB0aGF0IGRvZXMgaGF2ZSBhIG5leHQtc2libGluZyBvciBpcyBhIHBoeXNpY2FsIGVsZW1lbnQuXHJcbiAgICAgIGFwcGVuZERvbU5vZGUoY2hpbGQsIGdldExvZ2ljYWxQYXJlbnQocGFyZW50KSEpO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBTaG91bGQgbmV2ZXIgaGFwcGVuXHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBhcHBlbmQgbm9kZSBiZWNhdXNlIHRoZSBwYXJlbnQgaXMgbm90IGEgdmFsaWQgbG9naWNhbCBlbGVtZW50LiBQYXJlbnQ6ICR7cGFyZW50fWApO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlU3ltYm9sT3JGYWxsYmFjayhmYWxsYmFjazogc3RyaW5nKTogc3ltYm9sIHwgc3RyaW5nIHtcclxuICByZXR1cm4gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyA/IFN5bWJvbCgpIDogZmFsbGJhY2s7XHJcbn1cclxuXHJcbi8vIE5vbWluYWwgdHlwZSB0byByZXByZXNlbnQgYSBsb2dpY2FsIGVsZW1lbnQgd2l0aG91dCBuZWVkaW5nIHRvIGFsbG9jYXRlIGFueSBvYmplY3QgZm9yIGluc3RhbmNlc1xyXG5leHBvcnQgaW50ZXJmYWNlIExvZ2ljYWxFbGVtZW50IHsgTG9naWNhbEVsZW1lbnRfX0RPX05PVF9JTVBMRU1FTlQ6IGFueSB9O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUmVuZGVyaW5nL0xvZ2ljYWxFbGVtZW50cy50cyIsImltcG9ydCB7IHJlZ2lzdGVyRnVuY3Rpb24gfSBmcm9tICcuLi9JbnRlcm9wL1JlZ2lzdGVyZWRGdW5jdGlvbic7XHJcbmltcG9ydCB7IHBsYXRmb3JtIH0gZnJvbSAnLi4vRW52aXJvbm1lbnQnO1xyXG5pbXBvcnQgeyBNZXRob2RIYW5kbGUsIFN5c3RlbV9TdHJpbmcsIFN5c3RlbV9BcnJheSB9IGZyb20gJy4uL1BsYXRmb3JtL1BsYXRmb3JtJztcclxuY29uc3QgaHR0cENsaWVudEFzc2VtYmx5ID0gJ01pY3Jvc29mdC5Bc3BOZXRDb3JlLkJsYXpvci5Ccm93c2VyJztcclxuY29uc3QgaHR0cENsaWVudE5hbWVzcGFjZSA9IGAke2h0dHBDbGllbnRBc3NlbWJseX0uSHR0cGA7XHJcbmNvbnN0IGh0dHBDbGllbnRUeXBlTmFtZSA9ICdCcm93c2VySHR0cE1lc3NhZ2VIYW5kbGVyJztcclxuY29uc3QgaHR0cENsaWVudEZ1bGxUeXBlTmFtZSA9IGAke2h0dHBDbGllbnROYW1lc3BhY2V9LiR7aHR0cENsaWVudFR5cGVOYW1lfWA7XHJcbmxldCByZWNlaXZlUmVzcG9uc2VNZXRob2Q6IE1ldGhvZEhhbmRsZTtcclxubGV0IGFsbG9jYXRlQXJyYXlNZXRob2Q6IE1ldGhvZEhhbmRsZTtcclxuXHJcbnJlZ2lzdGVyRnVuY3Rpb24oYCR7aHR0cENsaWVudEZ1bGxUeXBlTmFtZX0uU2VuZGAsIChpZDogbnVtYmVyLCBib2R5OiBTeXN0ZW1fQXJyYXk8YW55PiwganNvbkZldGNoQXJnczogU3lzdGVtX1N0cmluZykgPT4ge1xyXG4gIHNlbmRBc3luYyhpZCwgYm9keSwganNvbkZldGNoQXJncyk7XHJcbn0pO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gc2VuZEFzeW5jKGlkOiBudW1iZXIsIGJvZHk6IFN5c3RlbV9BcnJheTxhbnk+LCBqc29uRmV0Y2hBcmdzOiBTeXN0ZW1fU3RyaW5nKSB7XHJcbiAgbGV0IHJlc3BvbnNlOiBSZXNwb25zZTtcclxuICBsZXQgcmVzcG9uc2VEYXRhOiBBcnJheUJ1ZmZlcjtcclxuXHJcbiAgY29uc3QgZmV0Y2hPcHRpb25zOiBGZXRjaE9wdGlvbnMgPSBKU09OLnBhcnNlKHBsYXRmb3JtLnRvSmF2YVNjcmlwdFN0cmluZyhqc29uRmV0Y2hBcmdzKSk7XHJcbiAgY29uc3QgcmVxdWVzdEluaXQ6IFJlcXVlc3RJbml0ID0gT2JqZWN0LmFzc2lnbihmZXRjaE9wdGlvbnMucmVxdWVzdEluaXQsIGZldGNoT3B0aW9ucy5yZXF1ZXN0SW5pdE92ZXJyaWRlcyk7XHJcblxyXG4gIGlmIChib2R5KSB7XHJcbiAgICByZXF1ZXN0SW5pdC5ib2R5ID0gcGxhdGZvcm0udG9VaW50OEFycmF5KGJvZHkpO1xyXG4gIH1cclxuXHJcbiAgdHJ5IHtcclxuICAgIHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goZmV0Y2hPcHRpb25zLnJlcXVlc3RVcmksIHJlcXVlc3RJbml0KTtcclxuICAgIHJlc3BvbnNlRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmFycmF5QnVmZmVyKCk7XHJcbiAgfSBjYXRjaCAoZXgpIHtcclxuICAgIGRpc3BhdGNoRXJyb3JSZXNwb25zZShpZCwgZXgudG9TdHJpbmcoKSk7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBkaXNwYXRjaFN1Y2Nlc3NSZXNwb25zZShpZCwgcmVzcG9uc2UsIHJlc3BvbnNlRGF0YSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpc3BhdGNoU3VjY2Vzc1Jlc3BvbnNlKGlkOiBudW1iZXIsIHJlc3BvbnNlOiBSZXNwb25zZSwgcmVzcG9uc2VEYXRhOiBBcnJheUJ1ZmZlcikge1xyXG4gIGNvbnN0IHJlc3BvbnNlRGVzY3JpcHRvcjogUmVzcG9uc2VEZXNjcmlwdG9yID0ge1xyXG4gICAgc3RhdHVzQ29kZTogcmVzcG9uc2Uuc3RhdHVzLFxyXG4gICAgc3RhdHVzVGV4dDogcmVzcG9uc2Uuc3RhdHVzVGV4dCxcclxuICAgIGhlYWRlcnM6IFtdXHJcbiAgfTtcclxuICByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHZhbHVlLCBuYW1lKSA9PiB7XHJcbiAgICByZXNwb25zZURlc2NyaXB0b3IuaGVhZGVycy5wdXNoKFtuYW1lLCB2YWx1ZV0pO1xyXG4gIH0pO1xyXG5cclxuICBpZiAoIWFsbG9jYXRlQXJyYXlNZXRob2QpIHtcclxuICAgIGFsbG9jYXRlQXJyYXlNZXRob2QgPSBwbGF0Zm9ybS5maW5kTWV0aG9kKFxyXG4gICAgICBodHRwQ2xpZW50QXNzZW1ibHksXHJcbiAgICAgIGh0dHBDbGllbnROYW1lc3BhY2UsXHJcbiAgICAgIGh0dHBDbGllbnRUeXBlTmFtZSxcclxuICAgICAgJ0FsbG9jYXRlQXJyYXknXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLy8gYWxsb2NhdGUgYSBtYW5hZ2VkIGJ5dGVbXSBvZiB0aGUgcmlnaHQgc2l6ZVxyXG4gIGNvbnN0IGRvdE5ldEFycmF5ID0gcGxhdGZvcm0uY2FsbE1ldGhvZChhbGxvY2F0ZUFycmF5TWV0aG9kLCBudWxsLCBbcGxhdGZvcm0udG9Eb3ROZXRTdHJpbmcocmVzcG9uc2VEYXRhLmJ5dGVMZW5ndGgudG9TdHJpbmcoKSldKSBhcyBTeXN0ZW1fQXJyYXk8YW55PjtcclxuXHJcbiAgLy8gZ2V0IGFuIFVpbnQ4QXJyYXkgdmlldyBvZiBpdFxyXG4gIGNvbnN0IGFycmF5ID0gcGxhdGZvcm0udG9VaW50OEFycmF5KGRvdE5ldEFycmF5KTtcclxuXHJcbiAgLy8gY29weSB0aGUgcmVzcG9uc2VEYXRhIHRvIG91ciBtYW5hZ2VkIGJ5dGVbXVxyXG4gIGFycmF5LnNldChuZXcgVWludDhBcnJheShyZXNwb25zZURhdGEpKTtcclxuXHJcbiAgZGlzcGF0Y2hSZXNwb25zZShcclxuICAgIGlkLFxyXG4gICAgcGxhdGZvcm0udG9Eb3ROZXRTdHJpbmcoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2VEZXNjcmlwdG9yKSksXHJcbiAgICBkb3ROZXRBcnJheSxcclxuICAgIC8qIGVycm9yTWVzc2FnZSAqLyBudWxsXHJcbiAgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGlzcGF0Y2hFcnJvclJlc3BvbnNlKGlkOiBudW1iZXIsIGVycm9yTWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgZGlzcGF0Y2hSZXNwb25zZShcclxuICAgIGlkLFxyXG4gICAgLyogcmVzcG9uc2VEZXNjcmlwdG9yICovIG51bGwsXHJcbiAgICAvKiByZXNwb25zZVRleHQgKi8gbnVsbCxcclxuICAgIHBsYXRmb3JtLnRvRG90TmV0U3RyaW5nKGVycm9yTWVzc2FnZSlcclxuICApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkaXNwYXRjaFJlc3BvbnNlKGlkOiBudW1iZXIsIHJlc3BvbnNlRGVzY3JpcHRvcjogU3lzdGVtX1N0cmluZyB8IG51bGwsIHJlc3BvbnNlRGF0YTogU3lzdGVtX0FycmF5PGFueT4gfCBudWxsLCBlcnJvck1lc3NhZ2U6IFN5c3RlbV9TdHJpbmcgfCBudWxsKSB7XHJcbiAgaWYgKCFyZWNlaXZlUmVzcG9uc2VNZXRob2QpIHtcclxuICAgIHJlY2VpdmVSZXNwb25zZU1ldGhvZCA9IHBsYXRmb3JtLmZpbmRNZXRob2QoXHJcbiAgICAgIGh0dHBDbGllbnRBc3NlbWJseSxcclxuICAgICAgaHR0cENsaWVudE5hbWVzcGFjZSxcclxuICAgICAgaHR0cENsaWVudFR5cGVOYW1lLFxyXG4gICAgICAnUmVjZWl2ZVJlc3BvbnNlJ1xyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHBsYXRmb3JtLmNhbGxNZXRob2QocmVjZWl2ZVJlc3BvbnNlTWV0aG9kLCBudWxsLCBbXHJcbiAgICBwbGF0Zm9ybS50b0RvdE5ldFN0cmluZyhpZC50b1N0cmluZygpKSxcclxuICAgIHJlc3BvbnNlRGVzY3JpcHRvcixcclxuICAgIHJlc3BvbnNlRGF0YSxcclxuICAgIGVycm9yTWVzc2FnZSxcclxuICBdKTtcclxufVxyXG5cclxuLy8gS2VlcCB0aGVzZSBpbiBzeW5jIHdpdGggdGhlIC5ORVQgZXF1aXZhbGVudCBpbiBCcm93c2VySHR0cE1lc3NhZ2VIYW5kbGVyLmNzXHJcbmludGVyZmFjZSBGZXRjaE9wdGlvbnMge1xyXG4gIHJlcXVlc3RVcmk6IHN0cmluZztcclxuICByZXF1ZXN0SW5pdDogUmVxdWVzdEluaXQ7XHJcbiAgcmVxdWVzdEluaXRPdmVycmlkZXM6IFJlcXVlc3RJbml0O1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUmVzcG9uc2VEZXNjcmlwdG9yIHtcclxuICAvLyBXZSBkb24ndCBoYXZlIEJvZHlUZXh0IGluIGhlcmUgYmVjYXVzZSBpZiB3ZSBkaWQsIHRoZW4gaW4gdGhlIEpTT04tcmVzcG9uc2UgY2FzZSAod2hpY2hcclxuICAvLyBpcyB0aGUgbW9zdCBjb21tb24gY2FzZSksIHdlJ2QgYmUgZG91YmxlLWVuY29kaW5nIGl0LCBzaW5jZSB0aGUgZW50aXJlIFJlc3BvbnNlRGVzY3JpcHRvclxyXG4gIC8vIGFsc28gZ2V0cyBKU09OIGVuY29kZWQuIEl0IHdvdWxkIHdvcmsgYnV0IGlzIHR3aWNlIHRoZSBhbW91bnQgb2Ygc3RyaW5nIHByb2Nlc3NpbmcuXHJcbiAgc3RhdHVzQ29kZTogbnVtYmVyO1xyXG4gIHN0YXR1c1RleHQ6IHN0cmluZztcclxuICBoZWFkZXJzOiBzdHJpbmdbXVtdO1xyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9TZXJ2aWNlcy9IdHRwLnRzIiwiaW1wb3J0IHsgcGxhdGZvcm0gfSBmcm9tICcuL0Vudmlyb25tZW50J1xyXG5pbXBvcnQgeyByZWdpc3RlckZ1bmN0aW9uIH0gZnJvbSAnLi9JbnRlcm9wL1JlZ2lzdGVyZWRGdW5jdGlvbic7XHJcbmltcG9ydCB7IG5hdmlnYXRlVG8gfSBmcm9tICcuL1NlcnZpY2VzL1VyaUhlbHBlcic7XHJcbmltcG9ydCB7IGludm9rZURvdE5ldE1ldGhvZCwgaW52b2tlRG90TmV0TWV0aG9kQXN5bmMgfSBmcm9tICcuL0ludGVyb3AvSW52b2tlRG90TmV0TWV0aG9kV2l0aEpzb25NYXJzaGFsbGluZyc7XHJcblxyXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAvLyBXaGVuIHRoZSBsaWJyYXJ5IGlzIGxvYWRlZCBpbiBhIGJyb3dzZXIgdmlhIGEgPHNjcmlwdD4gZWxlbWVudCwgbWFrZSB0aGVcclxuICAvLyBmb2xsb3dpbmcgQVBJcyBhdmFpbGFibGUgaW4gZ2xvYmFsIHNjb3BlIGZvciBpbnZvY2F0aW9uIGZyb20gSlNcclxuICB3aW5kb3dbJ0JsYXpvciddID0ge1xyXG4gICAgcGxhdGZvcm0sXHJcbiAgICByZWdpc3RlckZ1bmN0aW9uLFxyXG4gICAgbmF2aWdhdGVUbyxcclxuICAgIGludm9rZURvdE5ldE1ldGhvZCxcclxuICAgIGludm9rZURvdE5ldE1ldGhvZEFzeW5jXHJcbiAgfTtcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvR2xvYmFsRXhwb3J0cy50cyJdLCJzb3VyY2VSb290IjoiIn0=