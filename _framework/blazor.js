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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/Boot.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../Microsoft.JSInterop/JavaScriptRuntime/src/Microsoft.JSInterop.ts":
/*!***************************************************************************!*\
  !*** ../Microsoft.JSInterop/JavaScriptRuntime/src/Microsoft.JSInterop.ts ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// This is a single-file self-contained module to avoid the need for a Webpack build
var DotNet;
(function (DotNet) {
    window.DotNet = DotNet; // Ensure reachable from anywhere
    var jsonRevivers = [];
    var pendingAsyncCalls = {};
    var cachedJSFunctions = {};
    var nextAsyncCallId = 1; // Start at 1 because zero signals "no response needed"
    var dotNetDispatcher = null;
    /**
     * Sets the specified .NET call dispatcher as the current instance so that it will be used
     * for future invocations.
     *
     * @param dispatcher An object that can dispatch calls from JavaScript to a .NET runtime.
     */
    function attachDispatcher(dispatcher) {
        dotNetDispatcher = dispatcher;
    }
    DotNet.attachDispatcher = attachDispatcher;
    /**
     * Adds a JSON reviver callback that will be used when parsing arguments received from .NET.
     * @param reviver The reviver to add.
     */
    function attachReviver(reviver) {
        jsonRevivers.push(reviver);
    }
    DotNet.attachReviver = attachReviver;
    /**
     * Invokes the specified .NET public method synchronously. Not all hosting scenarios support
     * synchronous invocation, so if possible use invokeMethodAsync instead.
     *
     * @param assemblyName The short name (without key/version or .dll extension) of the .NET assembly containing the method.
     * @param methodIdentifier The identifier of the method to invoke. The method must have a [JSInvokable] attribute specifying this identifier.
     * @param args Arguments to pass to the method, each of which must be JSON-serializable.
     * @returns The result of the operation.
     */
    function invokeMethod(assemblyName, methodIdentifier) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var dispatcher = getRequiredDispatcher();
        if (dispatcher.invokeDotNetFromJS) {
            var argsJson = JSON.stringify(args);
            return dispatcher.invokeDotNetFromJS(assemblyName, methodIdentifier, argsJson);
        }
        else {
            throw new Error('The current dispatcher does not support synchronous calls from JS to .NET. Use invokeAsync instead.');
        }
    }
    DotNet.invokeMethod = invokeMethod;
    /**
     * Invokes the specified .NET public method asynchronously.
     *
     * @param assemblyName The short name (without key/version or .dll extension) of the .NET assembly containing the method.
     * @param methodIdentifier The identifier of the method to invoke. The method must have a [JSInvokable] attribute specifying this identifier.
     * @param args Arguments to pass to the method, each of which must be JSON-serializable.
     * @returns A promise representing the result of the operation.
     */
    function invokeMethodAsync(assemblyName, methodIdentifier) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var asyncCallId = nextAsyncCallId++;
        var resultPromise = new Promise(function (resolve, reject) {
            pendingAsyncCalls[asyncCallId] = { resolve: resolve, reject: reject };
        });
        try {
            var argsJson = JSON.stringify(args);
            getRequiredDispatcher().beginInvokeDotNetFromJS(asyncCallId, assemblyName, methodIdentifier, argsJson);
        }
        catch (ex) {
            // Synchronous failure
            completePendingCall(asyncCallId, false, ex);
        }
        return resultPromise;
    }
    DotNet.invokeMethodAsync = invokeMethodAsync;
    function getRequiredDispatcher() {
        if (dotNetDispatcher !== null) {
            return dotNetDispatcher;
        }
        throw new Error('No .NET call dispatcher has been set.');
    }
    function completePendingCall(asyncCallId, success, resultOrError) {
        if (!pendingAsyncCalls.hasOwnProperty(asyncCallId)) {
            throw new Error("There is no pending async call with ID " + asyncCallId + ".");
        }
        var asyncCall = pendingAsyncCalls[asyncCallId];
        delete pendingAsyncCalls[asyncCallId];
        if (success) {
            asyncCall.resolve(resultOrError);
        }
        else {
            asyncCall.reject(resultOrError);
        }
    }
    /**
     * Receives incoming calls from .NET and dispatches them to JavaScript.
     */
    DotNet.jsCallDispatcher = {
        /**
         * Finds the JavaScript function matching the specified identifier.
         *
         * @param identifier Identifies the globally-reachable function to be returned.
         * @returns A Function instance.
         */
        findJSFunction: findJSFunction,
        /**
         * Invokes the specified synchronous JavaScript function.
         *
         * @param identifier Identifies the globally-reachable function to invoke.
         * @param argsJson JSON representation of arguments to be passed to the function.
         * @returns JSON representation of the invocation result.
         */
        invokeJSFromDotNet: function (identifier, argsJson) {
            var result = findJSFunction(identifier).apply(null, parseJsonWithRevivers(argsJson));
            return result === null || result === undefined
                ? null
                : JSON.stringify(result);
        },
        /**
         * Invokes the specified synchronous or asynchronous JavaScript function.
         *
         * @param asyncHandle A value identifying the asynchronous operation. This value will be passed back in a later call to endInvokeJSFromDotNet.
         * @param identifier Identifies the globally-reachable function to invoke.
         * @param argsJson JSON representation of arguments to be passed to the function.
         */
        beginInvokeJSFromDotNet: function (asyncHandle, identifier, argsJson) {
            // Coerce synchronous functions into async ones, plus treat
            // synchronous exceptions the same as async ones
            var promise = new Promise(function (resolve) {
                var synchronousResultOrPromise = findJSFunction(identifier).apply(null, parseJsonWithRevivers(argsJson));
                resolve(synchronousResultOrPromise);
            });
            // We only listen for a result if the caller wants to be notified about it
            if (asyncHandle) {
                // On completion, dispatch result back to .NET
                // Not using "await" because it codegens a lot of boilerplate
                promise.then(function (result) { return getRequiredDispatcher().beginInvokeDotNetFromJS(0, 'Microsoft.JSInterop', 'DotNetDispatcher.EndInvoke', JSON.stringify([asyncHandle, true, result])); }, function (error) { return getRequiredDispatcher().beginInvokeDotNetFromJS(0, 'Microsoft.JSInterop', 'DotNetDispatcher.EndInvoke', JSON.stringify([asyncHandle, false, formatError(error)])); });
            }
        },
        /**
         * Receives notification that an async call from JS to .NET has completed.
         * @param asyncCallId The identifier supplied in an earlier call to beginInvokeDotNetFromJS.
         * @param success A flag to indicate whether the operation completed successfully.
         * @param resultOrExceptionMessage Either the operation result or an error message.
         */
        endInvokeDotNetFromJS: function (asyncCallId, success, resultOrExceptionMessage) {
            var resultOrError = success ? resultOrExceptionMessage : new Error(resultOrExceptionMessage);
            completePendingCall(parseInt(asyncCallId), success, resultOrError);
        }
    };
    function parseJsonWithRevivers(json) {
        return json ? JSON.parse(json, function (key, initialValue) {
            // Invoke each reviver in order, passing the output from the previous reviver,
            // so that each one gets a chance to transform the value
            return jsonRevivers.reduce(function (latestValue, reviver) { return reviver(key, latestValue); }, initialValue);
        }) : null;
    }
    function formatError(error) {
        if (error instanceof Error) {
            return error.message + "\n" + error.stack;
        }
        else {
            return error ? error.toString() : 'null';
        }
    }
    function findJSFunction(identifier) {
        if (cachedJSFunctions.hasOwnProperty(identifier)) {
            return cachedJSFunctions[identifier];
        }
        var result = window;
        var resultIdentifier = 'window';
        identifier.split('.').forEach(function (segment) {
            if (segment in result) {
                result = result[segment];
                resultIdentifier += '.' + segment;
            }
            else {
                throw new Error("Could not find '" + segment + "' in '" + resultIdentifier + "'.");
            }
        });
        if (result instanceof Function) {
            return result;
        }
        else {
            throw new Error("The value '" + resultIdentifier + "' is not a function.");
        }
    }
})(DotNet || (DotNet = {}));


/***/ }),

/***/ "./src/Boot.ts":
/*!*********************!*\
  !*** ./src/Boot.ts ***!
  \*********************/
/*! no static exports found */
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
__webpack_require__(/*! ../../Microsoft.JSInterop/JavaScriptRuntime/src/Microsoft.JSInterop */ "../Microsoft.JSInterop/JavaScriptRuntime/src/Microsoft.JSInterop.ts");
var Environment_1 = __webpack_require__(/*! ./Environment */ "./src/Environment.ts");
var DotNet_1 = __webpack_require__(/*! ./Platform/DotNet */ "./src/Platform/DotNet.ts");
__webpack_require__(/*! ./GlobalExports */ "./src/GlobalExports.ts");
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

/***/ "./src/Environment.ts":
/*!****************************!*\
  !*** ./src/Environment.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MonoPlatform_1 = __webpack_require__(/*! ./Platform/Mono/MonoPlatform */ "./src/Platform/Mono/MonoPlatform.ts");
exports.platform = MonoPlatform_1.monoPlatform;


/***/ }),

/***/ "./src/GlobalExports.ts":
/*!******************************!*\
  !*** ./src/GlobalExports.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(/*! ./Environment */ "./src/Environment.ts");
var UriHelper_1 = __webpack_require__(/*! ./Services/UriHelper */ "./src/Services/UriHelper.ts");
var Http_1 = __webpack_require__(/*! ./Services/Http */ "./src/Services/Http.ts");
var Renderer_1 = __webpack_require__(/*! ./Rendering/Renderer */ "./src/Rendering/Renderer.ts");
var SharedMemoryRenderBatch_1 = __webpack_require__(/*! ./Rendering/RenderBatch/SharedMemoryRenderBatch */ "./src/Rendering/RenderBatch/SharedMemoryRenderBatch.ts");
if (typeof window !== 'undefined') {
    // When the library is loaded in a browser via a <script> element, make the
    // following APIs available in global scope for invocation from JS
    window['Blazor'] = {
        platform: Environment_1.platform,
        navigateTo: UriHelper_1.navigateTo,
        _internal: {
            attachRootComponentToElement: Renderer_1.attachRootComponentToElement,
            renderBatch: function (browserRendererId, batchAddress) { return Renderer_1.renderBatch(browserRendererId, new SharedMemoryRenderBatch_1.SharedMemoryRenderBatch(batchAddress)); },
            http: Http_1.internalFunctions,
            uriHelper: UriHelper_1.internalFunctions
        }
    };
}


/***/ }),

/***/ "./src/Platform/DotNet.ts":
/*!********************************!*\
  !*** ./src/Platform/DotNet.ts ***!
  \********************************/
/*! no static exports found */
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

/***/ "./src/Platform/Mono/MonoPlatform.ts":
/*!*******************************************!*\
  !*** ./src/Platform/Mono/MonoPlatform.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DotNet_1 = __webpack_require__(/*! ../DotNet */ "./src/Platform/DotNet.ts");
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
        attachInteropInvoker();
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
function attachInteropInvoker() {
    var dotNetDispatcherInvokeMethodHandle = findMethod('Microsoft.JSInterop', 'Microsoft.JSInterop', 'DotNetDispatcher', 'Invoke');
    var dotNetDispatcherBeginInvokeMethodHandle = findMethod('Microsoft.JSInterop', 'Microsoft.JSInterop', 'DotNetDispatcher', 'BeginInvoke');
    DotNet.attachDispatcher({
        beginInvokeDotNetFromJS: function (callId, assemblyName, methodIdentifier, argsJson) {
            exports.monoPlatform.callMethod(dotNetDispatcherBeginInvokeMethodHandle, null, [
                callId ? exports.monoPlatform.toDotNetString(callId.toString()) : null,
                exports.monoPlatform.toDotNetString(assemblyName),
                exports.monoPlatform.toDotNetString(methodIdentifier),
                exports.monoPlatform.toDotNetString(argsJson)
            ]);
        },
        invokeDotNetFromJS: function (assemblyName, methodIdentifier, argsJson) {
            var resultJsonStringPtr = exports.monoPlatform.callMethod(dotNetDispatcherInvokeMethodHandle, null, [
                exports.monoPlatform.toDotNetString(assemblyName),
                exports.monoPlatform.toDotNetString(methodIdentifier),
                exports.monoPlatform.toDotNetString(argsJson)
            ]);
            return resultJsonStringPtr
                ? JSON.parse(exports.monoPlatform.toJavaScriptString(resultJsonStringPtr))
                : null;
        },
    });
}


/***/ }),

/***/ "./src/Rendering/BrowserRenderer.ts":
/*!******************************************!*\
  !*** ./src/Rendering/BrowserRenderer.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RenderBatch_1 = __webpack_require__(/*! ./RenderBatch/RenderBatch */ "./src/Rendering/RenderBatch/RenderBatch.ts");
var Environment_1 = __webpack_require__(/*! ../Environment */ "./src/Environment.ts");
var EventDelegator_1 = __webpack_require__(/*! ./EventDelegator */ "./src/Rendering/EventDelegator.ts");
var LogicalElements_1 = __webpack_require__(/*! ./LogicalElements */ "./src/Rendering/LogicalElements.ts");
var ElementReferenceCapture_1 = __webpack_require__(/*! ./ElementReferenceCapture */ "./src/Rendering/ElementReferenceCapture.ts");
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
    BrowserRenderer.prototype.updateComponent = function (batch, componentId, edits, referenceFrames) {
        var element = this.childComponentLocations[componentId];
        if (!element) {
            throw new Error("No element is currently associated with component " + componentId);
        }
        this.applyEdits(batch, componentId, element, 0, edits, referenceFrames);
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
    BrowserRenderer.prototype.applyEdits = function (batch, componentId, parent, childIndex, edits, referenceFrames) {
        var currentDepth = 0;
        var childIndexAtCurrentDepth = childIndex;
        var arraySegmentReader = batch.arraySegmentReader;
        var editReader = batch.editReader;
        var frameReader = batch.frameReader;
        var editsValues = arraySegmentReader.values(edits);
        var editsOffset = arraySegmentReader.offset(edits);
        var editsLength = arraySegmentReader.count(edits);
        var maxEditIndexExcl = editsOffset + editsLength;
        for (var editIndex = editsOffset; editIndex < maxEditIndexExcl; editIndex++) {
            var edit = batch.diffReader.editsEntry(editsValues, editIndex);
            var editType = editReader.editType(edit);
            switch (editType) {
                case RenderBatch_1.EditType.prependFrame: {
                    var frameIndex = editReader.newTreeIndex(edit);
                    var frame = batch.referenceFramesEntry(referenceFrames, frameIndex);
                    var siblingIndex = editReader.siblingIndex(edit);
                    this.insertFrame(batch, componentId, parent, childIndexAtCurrentDepth + siblingIndex, referenceFrames, frame, frameIndex);
                    break;
                }
                case RenderBatch_1.EditType.removeFrame: {
                    var siblingIndex = editReader.siblingIndex(edit);
                    LogicalElements_1.removeLogicalChild(parent, childIndexAtCurrentDepth + siblingIndex);
                    break;
                }
                case RenderBatch_1.EditType.setAttribute: {
                    var frameIndex = editReader.newTreeIndex(edit);
                    var frame = batch.referenceFramesEntry(referenceFrames, frameIndex);
                    var siblingIndex = editReader.siblingIndex(edit);
                    var element = LogicalElements_1.getLogicalChild(parent, childIndexAtCurrentDepth + siblingIndex);
                    if (element instanceof HTMLElement) {
                        this.applyAttribute(batch, componentId, element, frame);
                    }
                    else {
                        throw new Error("Cannot set attribute on non-element child");
                    }
                    break;
                }
                case RenderBatch_1.EditType.removeAttribute: {
                    // Note that we don't have to dispose the info we track about event handlers here, because the
                    // disposed event handler IDs are delivered separately (in the 'disposedEventHandlerIds' array)
                    var siblingIndex = editReader.siblingIndex(edit);
                    var element = LogicalElements_1.getLogicalChild(parent, childIndexAtCurrentDepth + siblingIndex);
                    if (element instanceof HTMLElement) {
                        var attributeName = editReader.removedAttributeName(edit);
                        // First try to remove any special property we use for this attribute
                        if (!this.tryApplySpecialProperty(batch, element, attributeName, null)) {
                            // If that's not applicable, it's a regular DOM attribute so remove that
                            element.removeAttribute(attributeName);
                        }
                    }
                    else {
                        throw new Error("Cannot remove attribute from non-element child");
                    }
                    break;
                }
                case RenderBatch_1.EditType.updateText: {
                    var frameIndex = editReader.newTreeIndex(edit);
                    var frame = batch.referenceFramesEntry(referenceFrames, frameIndex);
                    var siblingIndex = editReader.siblingIndex(edit);
                    var textNode = LogicalElements_1.getLogicalChild(parent, childIndexAtCurrentDepth + siblingIndex);
                    if (textNode instanceof Text) {
                        textNode.textContent = frameReader.textContent(frame);
                    }
                    else {
                        throw new Error("Cannot set text content on non-text child");
                    }
                    break;
                }
                case RenderBatch_1.EditType.stepIn: {
                    var siblingIndex = editReader.siblingIndex(edit);
                    parent = LogicalElements_1.getLogicalChild(parent, childIndexAtCurrentDepth + siblingIndex);
                    currentDepth++;
                    childIndexAtCurrentDepth = 0;
                    break;
                }
                case RenderBatch_1.EditType.stepOut: {
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
    BrowserRenderer.prototype.insertFrame = function (batch, componentId, parent, childIndex, frames, frame, frameIndex) {
        var frameReader = batch.frameReader;
        var frameType = frameReader.frameType(frame);
        switch (frameType) {
            case RenderBatch_1.FrameType.element:
                this.insertElement(batch, componentId, parent, childIndex, frames, frame, frameIndex);
                return 1;
            case RenderBatch_1.FrameType.text:
                this.insertText(batch, parent, childIndex, frame);
                return 1;
            case RenderBatch_1.FrameType.attribute:
                throw new Error('Attribute frames should only be present as leading children of element frames.');
            case RenderBatch_1.FrameType.component:
                this.insertComponent(batch, parent, childIndex, frame);
                return 1;
            case RenderBatch_1.FrameType.region:
                return this.insertFrameRange(batch, componentId, parent, childIndex, frames, frameIndex + 1, frameIndex + frameReader.subtreeLength(frame));
            case RenderBatch_1.FrameType.elementReferenceCapture:
                if (parent instanceof Element) {
                    ElementReferenceCapture_1.applyCaptureIdToElement(parent, frameReader.elementReferenceCaptureId(frame));
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
    BrowserRenderer.prototype.insertElement = function (batch, componentId, parent, childIndex, frames, frame, frameIndex) {
        var frameReader = batch.frameReader;
        var tagName = frameReader.elementName(frame);
        var newDomElementRaw = tagName === 'svg' || LogicalElements_1.isSvgElement(parent) ?
            document.createElementNS('http://www.w3.org/2000/svg', tagName) :
            document.createElement(tagName);
        var newElement = LogicalElements_1.toLogicalElement(newDomElementRaw);
        LogicalElements_1.insertLogicalChild(newDomElementRaw, parent, childIndex);
        // Apply attributes
        var descendantsEndIndexExcl = frameIndex + frameReader.subtreeLength(frame);
        for (var descendantIndex = frameIndex + 1; descendantIndex < descendantsEndIndexExcl; descendantIndex++) {
            var descendantFrame = batch.referenceFramesEntry(frames, descendantIndex);
            if (frameReader.frameType(descendantFrame) === RenderBatch_1.FrameType.attribute) {
                this.applyAttribute(batch, componentId, newDomElementRaw, descendantFrame);
            }
            else {
                // As soon as we see a non-attribute child, all the subsequent child frames are
                // not attributes, so bail out and insert the remnants recursively
                this.insertFrameRange(batch, componentId, newElement, 0, frames, descendantIndex, descendantsEndIndexExcl);
                break;
            }
        }
    };
    BrowserRenderer.prototype.insertComponent = function (batch, parent, childIndex, frame) {
        var containerElement = LogicalElements_1.createAndInsertLogicalContainer(parent, childIndex);
        // All we have to do is associate the child component ID with its location. We don't actually
        // do any rendering here, because the diff for the child will appear later in the render batch.
        var childComponentId = batch.frameReader.componentId(frame);
        this.attachComponentToElement(childComponentId, containerElement);
    };
    BrowserRenderer.prototype.insertText = function (batch, parent, childIndex, textFrame) {
        var textContent = batch.frameReader.textContent(textFrame);
        var newTextNode = document.createTextNode(textContent);
        LogicalElements_1.insertLogicalChild(newTextNode, parent, childIndex);
    };
    BrowserRenderer.prototype.applyAttribute = function (batch, componentId, toDomElement, attributeFrame) {
        var frameReader = batch.frameReader;
        var attributeName = frameReader.attributeName(attributeFrame);
        var browserRendererId = this.browserRendererId;
        var eventHandlerId = frameReader.attributeEventHandlerId(attributeFrame);
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
        if (!this.tryApplySpecialProperty(batch, toDomElement, attributeName, attributeFrame)) {
            // If not, treat it as a regular string-valued attribute
            toDomElement.setAttribute(attributeName, frameReader.attributeValue(attributeFrame));
        }
    };
    BrowserRenderer.prototype.tryApplySpecialProperty = function (batch, element, attributeName, attributeFrame) {
        switch (attributeName) {
            case 'value':
                return this.tryApplyValueProperty(batch, element, attributeFrame);
            case 'checked':
                return this.tryApplyCheckedProperty(batch, element, attributeFrame);
            default:
                return false;
        }
    };
    BrowserRenderer.prototype.tryApplyValueProperty = function (batch, element, attributeFrame) {
        // Certain elements have built-in behaviour for their 'value' property
        var frameReader = batch.frameReader;
        switch (element.tagName) {
            case 'INPUT':
            case 'SELECT':
            case 'TEXTAREA': {
                var value = attributeFrame ? frameReader.attributeValue(attributeFrame) : null;
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
                var value = attributeFrame ? frameReader.attributeValue(attributeFrame) : null;
                if (value) {
                    element.setAttribute('value', value);
                }
                else {
                    element.removeAttribute('value');
                }
                // See above for why we have this special handling for <select>/<option>
                var parentElement = element.parentElement;
                if (parentElement && (selectValuePropname in parentElement) && parentElement[selectValuePropname] === value) {
                    this.tryApplyValueProperty(batch, parentElement, attributeFrame);
                    delete parentElement[selectValuePropname];
                }
                return true;
            }
            default:
                return false;
        }
    };
    BrowserRenderer.prototype.tryApplyCheckedProperty = function (batch, element, attributeFrame) {
        // Certain elements have built-in behaviour for their 'checked' property
        if (element.tagName === 'INPUT') {
            var value = attributeFrame ? batch.frameReader.attributeValue(attributeFrame) : null;
            element.checked = value !== null;
            return true;
        }
        else {
            return false;
        }
    };
    BrowserRenderer.prototype.insertFrameRange = function (batch, componentId, parent, childIndex, frames, startIndex, endIndexExcl) {
        var origChildIndex = childIndex;
        for (var index = startIndex; index < endIndexExcl; index++) {
            var frame = batch.referenceFramesEntry(frames, index);
            var numChildrenInserted = this.insertFrame(batch, componentId, parent, childIndex, frames, frame, index);
            childIndex += numChildrenInserted;
            // Skip over any descendants, since they are already dealt with recursively
            index += countDescendantFrames(batch, frame);
        }
        return (childIndex - origChildIndex); // Total number of children inserted
    };
    return BrowserRenderer;
}());
exports.BrowserRenderer = BrowserRenderer;
function countDescendantFrames(batch, frame) {
    var frameReader = batch.frameReader;
    switch (frameReader.frameType(frame)) {
        // The following frame types have a subtree length. Other frames may use that memory slot
        // to mean something else, so we must not read it. We should consider having nominal subtypes
        // of RenderTreeFramePointer that prevent access to non-applicable fields.
        case RenderBatch_1.FrameType.component:
        case RenderBatch_1.FrameType.element:
        case RenderBatch_1.FrameType.region:
            return frameReader.subtreeLength(frame) - 1;
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

/***/ "./src/Rendering/ElementReferenceCapture.ts":
/*!**************************************************!*\
  !*** ./src/Rendering/ElementReferenceCapture.ts ***!
  \**************************************************/
/*! no static exports found */
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
function getCaptureIdAttributeName(referenceCaptureId) {
    return "_bl_" + referenceCaptureId;
}
// Support receiving ElementRef instances as args in interop calls
var elementRefKey = '_blazorElementRef'; // Keep in sync with ElementRef.cs
DotNet.attachReviver(function (key, value) {
    if (value && typeof value === 'object' && value.hasOwnProperty(elementRefKey) && typeof value[elementRefKey] === 'number') {
        return getElementByCaptureId(value[elementRefKey]);
    }
    else {
        return value;
    }
});


/***/ }),

/***/ "./src/Rendering/EventDelegator.ts":
/*!*****************************************!*\
  !*** ./src/Rendering/EventDelegator.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventForDotNet_1 = __webpack_require__(/*! ./EventForDotNet */ "./src/Rendering/EventForDotNet.ts");
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

/***/ "./src/Rendering/EventForDotNet.ts":
/*!*****************************************!*\
  !*** ./src/Rendering/EventForDotNet.ts ***!
  \*****************************************/
/*! no static exports found */
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

/***/ "./src/Rendering/LogicalElements.ts":
/*!******************************************!*\
  !*** ./src/Rendering/LogicalElements.ts ***!
  \******************************************/
/*! no static exports found */
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

/***/ "./src/Rendering/RenderBatch/RenderBatch.ts":
/*!**************************************************!*\
  !*** ./src/Rendering/RenderBatch/RenderBatch.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EditType;
(function (EditType) {
    // The values must be kept in sync with the .NET equivalent in RenderTreeEditType.cs
    EditType[EditType["prependFrame"] = 1] = "prependFrame";
    EditType[EditType["removeFrame"] = 2] = "removeFrame";
    EditType[EditType["setAttribute"] = 3] = "setAttribute";
    EditType[EditType["removeAttribute"] = 4] = "removeAttribute";
    EditType[EditType["updateText"] = 5] = "updateText";
    EditType[EditType["stepIn"] = 6] = "stepIn";
    EditType[EditType["stepOut"] = 7] = "stepOut";
})(EditType = exports.EditType || (exports.EditType = {}));
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

/***/ "./src/Rendering/RenderBatch/SharedMemoryRenderBatch.ts":
/*!**************************************************************!*\
  !*** ./src/Rendering/RenderBatch/SharedMemoryRenderBatch.ts ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(/*! ../../Environment */ "./src/Environment.ts");
// Used when running on Mono WebAssembly for shared-memory interop. The code here encapsulates
// our knowledge of the memory layout of RenderBatch and all referenced types.
//
// In this implementation, all the DTO types are really heap pointers at runtime, hence all
// the casts to 'any' whenever we pass them to platform.read.
var SharedMemoryRenderBatch = /** @class */ (function () {
    function SharedMemoryRenderBatch(batchAddress) {
        this.batchAddress = batchAddress;
        this.arrayRangeReader = arrayRangeReader;
        this.arraySegmentReader = arraySegmentReader;
        this.diffReader = diffReader;
        this.editReader = editReader;
        this.frameReader = frameReader;
    }
    // Keep in sync with memory layout in RenderBatch.cs
    SharedMemoryRenderBatch.prototype.updatedComponents = function () { return Environment_1.platform.readStructField(this.batchAddress, 0); };
    SharedMemoryRenderBatch.prototype.referenceFrames = function () { return Environment_1.platform.readStructField(this.batchAddress, arrayRangeReader.structLength); };
    SharedMemoryRenderBatch.prototype.disposedComponentIds = function () { return Environment_1.platform.readStructField(this.batchAddress, arrayRangeReader.structLength * 2); };
    SharedMemoryRenderBatch.prototype.disposedEventHandlerIds = function () { return Environment_1.platform.readStructField(this.batchAddress, arrayRangeReader.structLength * 3); };
    SharedMemoryRenderBatch.prototype.updatedComponentsEntry = function (values, index) {
        return arrayValuesEntry(values, index, diffReader.structLength);
    };
    SharedMemoryRenderBatch.prototype.referenceFramesEntry = function (values, index) {
        return arrayValuesEntry(values, index, frameReader.structLength);
    };
    SharedMemoryRenderBatch.prototype.disposedComponentIdsEntry = function (values, index) {
        return arrayValuesEntry(values, index, /* int length */ 4);
    };
    SharedMemoryRenderBatch.prototype.disposedEventHandlerIdsEntry = function (values, index) {
        return arrayValuesEntry(values, index, /* int length */ 4);
    };
    return SharedMemoryRenderBatch;
}());
exports.SharedMemoryRenderBatch = SharedMemoryRenderBatch;
// Keep in sync with memory layout in ArrayRange.cs
var arrayRangeReader = {
    structLength: 8,
    values: function (arrayRange) { return Environment_1.platform.readObjectField(arrayRange, 0); },
    count: function (arrayRange) { return Environment_1.platform.readInt32Field(arrayRange, 4); },
};
// Keep in sync with memory layout in ArraySegment
var arraySegmentReader = {
    structLength: 12,
    values: function (arraySegment) { return Environment_1.platform.readObjectField(arraySegment, 0); },
    offset: function (arraySegment) { return Environment_1.platform.readInt32Field(arraySegment, 4); },
    count: function (arraySegment) { return Environment_1.platform.readInt32Field(arraySegment, 8); },
};
// Keep in sync with memory layout in RenderTreeDiff.cs
var diffReader = {
    structLength: 4 + arraySegmentReader.structLength,
    componentId: function (diff) { return Environment_1.platform.readInt32Field(diff, 0); },
    edits: function (diff) { return Environment_1.platform.readStructField(diff, 4); },
    editsEntry: function (values, index) { return arrayValuesEntry(values, index, editReader.structLength); },
};
// Keep in sync with memory layout in RenderTreeEdit.cs
var editReader = {
    structLength: 16,
    editType: function (edit) { return Environment_1.platform.readInt32Field(edit, 0); },
    siblingIndex: function (edit) { return Environment_1.platform.readInt32Field(edit, 4); },
    newTreeIndex: function (edit) { return Environment_1.platform.readInt32Field(edit, 8); },
    removedAttributeName: function (edit) { return Environment_1.platform.readStringField(edit, 12); },
};
// Keep in sync with memory layout in RenderTreeFrame.cs
var frameReader = {
    structLength: 28,
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
function arrayValuesEntry(arrayValues, index, itemSize) {
    return Environment_1.platform.getArrayEntryPtr(arrayValues, index, itemSize);
}


/***/ }),

/***/ "./src/Rendering/Renderer.ts":
/*!***********************************!*\
  !*** ./src/Rendering/Renderer.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BrowserRenderer_1 = __webpack_require__(/*! ./BrowserRenderer */ "./src/Rendering/BrowserRenderer.ts");
var browserRenderers = {};
function attachRootComponentToElement(browserRendererId, elementSelector, componentId) {
    var element = document.querySelector(elementSelector);
    if (!element) {
        throw new Error("Could not find any element matching selector '" + elementSelector + "'.");
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
    var arrayRangeReader = batch.arrayRangeReader;
    var updatedComponentsRange = batch.updatedComponents();
    var updatedComponentsValues = arrayRangeReader.values(updatedComponentsRange);
    var updatedComponentsLength = arrayRangeReader.count(updatedComponentsRange);
    var referenceFrames = batch.referenceFrames();
    var referenceFramesValues = arrayRangeReader.values(referenceFrames);
    var diffReader = batch.diffReader;
    for (var i = 0; i < updatedComponentsLength; i++) {
        var diff = batch.updatedComponentsEntry(updatedComponentsValues, i);
        var componentId = diffReader.componentId(diff);
        var edits = diffReader.edits(diff);
        browserRenderer.updateComponent(batch, componentId, edits, referenceFramesValues);
    }
    var disposedComponentIdsRange = batch.disposedComponentIds();
    var disposedComponentIdsValues = arrayRangeReader.values(disposedComponentIdsRange);
    var disposedComponentIdsLength = arrayRangeReader.count(disposedComponentIdsRange);
    for (var i = 0; i < disposedComponentIdsLength; i++) {
        var componentId = batch.disposedComponentIdsEntry(disposedComponentIdsValues, i);
        browserRenderer.disposeComponent(componentId);
    }
    var disposedEventHandlerIdsRange = batch.disposedEventHandlerIds();
    var disposedEventHandlerIdsValues = arrayRangeReader.values(disposedComponentIdsRange);
    var disposedEventHandlerIdsLength = arrayRangeReader.count(disposedEventHandlerIdsRange);
    for (var i = 0; i < disposedEventHandlerIdsLength; i++) {
        var eventHandlerId = batch.disposedEventHandlerIdsEntry(disposedEventHandlerIdsValues, i);
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

/***/ "./src/Services/Http.ts":
/*!******************************!*\
  !*** ./src/Services/Http.ts ***!
  \******************************/
/*! no static exports found */
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
var Environment_1 = __webpack_require__(/*! ../Environment */ "./src/Environment.ts");
var httpClientAssembly = 'Microsoft.AspNetCore.Blazor.Browser';
var httpClientNamespace = httpClientAssembly + ".Http";
var httpClientTypeName = 'BrowserHttpMessageHandler';
var httpClientFullTypeName = httpClientNamespace + "." + httpClientTypeName;
var receiveResponseMethod;
var allocateArrayMethod;
// These are the functions we're making available for invocation from .NET
exports.internalFunctions = {
    sendAsync: sendAsync
};
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

/***/ "./src/Services/UriHelper.ts":
/*!***********************************!*\
  !*** ./src/Services/UriHelper.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(/*! ../Environment */ "./src/Environment.ts");
var registeredFunctionPrefix = 'Microsoft.AspNetCore.Blazor.Browser.Services.BrowserUriHelper';
var notifyLocationChangedMethod;
var hasRegisteredEventListeners = false;
// These are the functions we're making available for invocation from .NET
exports.internalFunctions = {
    enableNavigationInterception: enableNavigationInterception,
    navigateTo: navigateTo,
    getBaseURI: function () { return document.baseURI; },
    getLocationHref: function () { return location.href; },
};
function enableNavigationInterception() {
    if (hasRegisteredEventListeners) {
        return;
    }
    hasRegisteredEventListeners = true;
    document.addEventListener('click', function (event) {
        // Intercept clicks on all <a> elements where the href is within the <base href> URI space
        // We must explicitly check if it has an 'href' attribute, because if it doesn't, the result might be null or an empty string depending on the browser
        var anchorTarget = findClosestAncestor(event.target, 'A');
        var hrefAttributeName = 'href';
        if (anchorTarget && anchorTarget.hasAttribute(hrefAttributeName) && event.button === 0) {
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
}
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


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4uL01pY3Jvc29mdC5KU0ludGVyb3AvSmF2YVNjcmlwdFJ1bnRpbWUvc3JjL01pY3Jvc29mdC5KU0ludGVyb3AudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0Jvb3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0Vudmlyb25tZW50LnRzIiwid2VicGFjazovLy8uL3NyYy9HbG9iYWxFeHBvcnRzLnRzIiwid2VicGFjazovLy8uL3NyYy9QbGF0Zm9ybS9Eb3ROZXQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1BsYXRmb3JtL01vbm8vTW9ub1BsYXRmb3JtLnRzIiwid2VicGFjazovLy8uL3NyYy9SZW5kZXJpbmcvQnJvd3NlclJlbmRlcmVyLnRzIiwid2VicGFjazovLy8uL3NyYy9SZW5kZXJpbmcvRWxlbWVudFJlZmVyZW5jZUNhcHR1cmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JlbmRlcmluZy9FdmVudERlbGVnYXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUmVuZGVyaW5nL0V2ZW50Rm9yRG90TmV0LnRzIiwid2VicGFjazovLy8uL3NyYy9SZW5kZXJpbmcvTG9naWNhbEVsZW1lbnRzLnRzIiwid2VicGFjazovLy8uL3NyYy9SZW5kZXJpbmcvUmVuZGVyQmF0Y2gvUmVuZGVyQmF0Y2gudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JlbmRlcmluZy9SZW5kZXJCYXRjaC9TaGFyZWRNZW1vcnlSZW5kZXJCYXRjaC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUmVuZGVyaW5nL1JlbmRlcmVyLnRzIiwid2VicGFjazovLy8uL3NyYy9TZXJ2aWNlcy9IdHRwLnRzIiwid2VicGFjazovLy8uL3NyYy9TZXJ2aWNlcy9VcmlIZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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Q1QsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDO0FBQzNELENBQUM7QUFFRCw4QkFBOEIsSUFBWTtJQUN4QyxJQUFNLHdCQUF3QixHQUFHLDBCQUEwQixDQUFDLFFBQVEsQ0FBQyxPQUFRLENBQUMsQ0FBQyxDQUFDLHNDQUFzQztJQUN0SCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUNuRCxDQUFDO0FBRUQsb0NBQW9DLE9BQWU7SUFDakQsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3pELENBQUM7QUFFRCw0QkFBNEIsS0FBaUI7SUFDM0MsT0FBTyxLQUFLLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxRQUFRLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDO0FBQzFFLENBQUMiLCJmaWxlIjoiYmxhem9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvQm9vdC50c1wiKTtcbiIsIi8vIFRoaXMgaXMgYSBzaW5nbGUtZmlsZSBzZWxmLWNvbnRhaW5lZCBtb2R1bGUgdG8gYXZvaWQgdGhlIG5lZWQgZm9yIGEgV2VicGFjayBidWlsZFxyXG5cclxubW9kdWxlIERvdE5ldCB7XHJcbiAgKHdpbmRvdyBhcyBhbnkpLkRvdE5ldCA9IERvdE5ldDsgLy8gRW5zdXJlIHJlYWNoYWJsZSBmcm9tIGFueXdoZXJlXHJcblxyXG4gIGV4cG9ydCB0eXBlIEpzb25SZXZpdmVyID0gKChrZXk6IGFueSwgdmFsdWU6IGFueSkgPT4gYW55KTtcclxuICBjb25zdCBqc29uUmV2aXZlcnM6IEpzb25SZXZpdmVyW10gPSBbXTtcclxuXHJcbiAgY29uc3QgcGVuZGluZ0FzeW5jQ2FsbHM6IHsgW2lkOiBudW1iZXJdOiBQZW5kaW5nQXN5bmNDYWxsPGFueT4gfSA9IHt9O1xyXG4gIGNvbnN0IGNhY2hlZEpTRnVuY3Rpb25zOiB7IFtpZGVudGlmaWVyOiBzdHJpbmddOiBGdW5jdGlvbiB9ID0ge307XHJcbiAgbGV0IG5leHRBc3luY0NhbGxJZCA9IDE7IC8vIFN0YXJ0IGF0IDEgYmVjYXVzZSB6ZXJvIHNpZ25hbHMgXCJubyByZXNwb25zZSBuZWVkZWRcIlxyXG5cclxuICBsZXQgZG90TmV0RGlzcGF0Y2hlcjogRG90TmV0Q2FsbERpc3BhdGNoZXIgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgc3BlY2lmaWVkIC5ORVQgY2FsbCBkaXNwYXRjaGVyIGFzIHRoZSBjdXJyZW50IGluc3RhbmNlIHNvIHRoYXQgaXQgd2lsbCBiZSB1c2VkXHJcbiAgICogZm9yIGZ1dHVyZSBpbnZvY2F0aW9ucy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBkaXNwYXRjaGVyIEFuIG9iamVjdCB0aGF0IGNhbiBkaXNwYXRjaCBjYWxscyBmcm9tIEphdmFTY3JpcHQgdG8gYSAuTkVUIHJ1bnRpbWUuXHJcbiAgICovXHJcbiAgZXhwb3J0IGZ1bmN0aW9uIGF0dGFjaERpc3BhdGNoZXIoZGlzcGF0Y2hlcjogRG90TmV0Q2FsbERpc3BhdGNoZXIpIHtcclxuICAgIGRvdE5ldERpc3BhdGNoZXIgPSBkaXNwYXRjaGVyO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQWRkcyBhIEpTT04gcmV2aXZlciBjYWxsYmFjayB0aGF0IHdpbGwgYmUgdXNlZCB3aGVuIHBhcnNpbmcgYXJndW1lbnRzIHJlY2VpdmVkIGZyb20gLk5FVC5cclxuICAgKiBAcGFyYW0gcmV2aXZlciBUaGUgcmV2aXZlciB0byBhZGQuXHJcbiAgICovXHJcbiAgZXhwb3J0IGZ1bmN0aW9uIGF0dGFjaFJldml2ZXIocmV2aXZlcjogSnNvblJldml2ZXIpIHtcclxuICAgIGpzb25SZXZpdmVycy5wdXNoKHJldml2ZXIpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSW52b2tlcyB0aGUgc3BlY2lmaWVkIC5ORVQgcHVibGljIG1ldGhvZCBzeW5jaHJvbm91c2x5LiBOb3QgYWxsIGhvc3Rpbmcgc2NlbmFyaW9zIHN1cHBvcnRcclxuICAgKiBzeW5jaHJvbm91cyBpbnZvY2F0aW9uLCBzbyBpZiBwb3NzaWJsZSB1c2UgaW52b2tlTWV0aG9kQXN5bmMgaW5zdGVhZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBhc3NlbWJseU5hbWUgVGhlIHNob3J0IG5hbWUgKHdpdGhvdXQga2V5L3ZlcnNpb24gb3IgLmRsbCBleHRlbnNpb24pIG9mIHRoZSAuTkVUIGFzc2VtYmx5IGNvbnRhaW5pbmcgdGhlIG1ldGhvZC5cclxuICAgKiBAcGFyYW0gbWV0aG9kSWRlbnRpZmllciBUaGUgaWRlbnRpZmllciBvZiB0aGUgbWV0aG9kIHRvIGludm9rZS4gVGhlIG1ldGhvZCBtdXN0IGhhdmUgYSBbSlNJbnZva2FibGVdIGF0dHJpYnV0ZSBzcGVjaWZ5aW5nIHRoaXMgaWRlbnRpZmllci5cclxuICAgKiBAcGFyYW0gYXJncyBBcmd1bWVudHMgdG8gcGFzcyB0byB0aGUgbWV0aG9kLCBlYWNoIG9mIHdoaWNoIG11c3QgYmUgSlNPTi1zZXJpYWxpemFibGUuXHJcbiAgICogQHJldHVybnMgVGhlIHJlc3VsdCBvZiB0aGUgb3BlcmF0aW9uLlxyXG4gICAqL1xyXG4gIGV4cG9ydCBmdW5jdGlvbiBpbnZva2VNZXRob2Q8VD4oYXNzZW1ibHlOYW1lOiBzdHJpbmcsIG1ldGhvZElkZW50aWZpZXI6IHN0cmluZywgLi4uYXJnczogYW55W10pOiBUIHtcclxuICAgIGNvbnN0IGRpc3BhdGNoZXIgPSBnZXRSZXF1aXJlZERpc3BhdGNoZXIoKTtcclxuICAgIGlmIChkaXNwYXRjaGVyLmludm9rZURvdE5ldEZyb21KUykge1xyXG4gICAgICBjb25zdCBhcmdzSnNvbiA9IEpTT04uc3RyaW5naWZ5KGFyZ3MpO1xyXG4gICAgICByZXR1cm4gZGlzcGF0Y2hlci5pbnZva2VEb3ROZXRGcm9tSlMoYXNzZW1ibHlOYW1lLCBtZXRob2RJZGVudGlmaWVyLCBhcmdzSnNvbik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBjdXJyZW50IGRpc3BhdGNoZXIgZG9lcyBub3Qgc3VwcG9ydCBzeW5jaHJvbm91cyBjYWxscyBmcm9tIEpTIHRvIC5ORVQuIFVzZSBpbnZva2VBc3luYyBpbnN0ZWFkLicpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSW52b2tlcyB0aGUgc3BlY2lmaWVkIC5ORVQgcHVibGljIG1ldGhvZCBhc3luY2hyb25vdXNseS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBhc3NlbWJseU5hbWUgVGhlIHNob3J0IG5hbWUgKHdpdGhvdXQga2V5L3ZlcnNpb24gb3IgLmRsbCBleHRlbnNpb24pIG9mIHRoZSAuTkVUIGFzc2VtYmx5IGNvbnRhaW5pbmcgdGhlIG1ldGhvZC5cclxuICAgKiBAcGFyYW0gbWV0aG9kSWRlbnRpZmllciBUaGUgaWRlbnRpZmllciBvZiB0aGUgbWV0aG9kIHRvIGludm9rZS4gVGhlIG1ldGhvZCBtdXN0IGhhdmUgYSBbSlNJbnZva2FibGVdIGF0dHJpYnV0ZSBzcGVjaWZ5aW5nIHRoaXMgaWRlbnRpZmllci5cclxuICAgKiBAcGFyYW0gYXJncyBBcmd1bWVudHMgdG8gcGFzcyB0byB0aGUgbWV0aG9kLCBlYWNoIG9mIHdoaWNoIG11c3QgYmUgSlNPTi1zZXJpYWxpemFibGUuXHJcbiAgICogQHJldHVybnMgQSBwcm9taXNlIHJlcHJlc2VudGluZyB0aGUgcmVzdWx0IG9mIHRoZSBvcGVyYXRpb24uXHJcbiAgICovXHJcbiAgZXhwb3J0IGZ1bmN0aW9uIGludm9rZU1ldGhvZEFzeW5jPFQ+KGFzc2VtYmx5TmFtZTogc3RyaW5nLCBtZXRob2RJZGVudGlmaWVyOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKTogUHJvbWlzZTxUPiB7XHJcbiAgICBjb25zdCBhc3luY0NhbGxJZCA9IG5leHRBc3luY0NhbGxJZCsrO1xyXG4gICAgY29uc3QgcmVzdWx0UHJvbWlzZSA9IG5ldyBQcm9taXNlPFQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgcGVuZGluZ0FzeW5jQ2FsbHNbYXN5bmNDYWxsSWRdID0geyByZXNvbHZlLCByZWplY3QgfTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGFyZ3NKc29uID0gSlNPTi5zdHJpbmdpZnkoYXJncyk7XHJcbiAgICAgIGdldFJlcXVpcmVkRGlzcGF0Y2hlcigpLmJlZ2luSW52b2tlRG90TmV0RnJvbUpTKGFzeW5jQ2FsbElkLCBhc3NlbWJseU5hbWUsIG1ldGhvZElkZW50aWZpZXIsIGFyZ3NKc29uKTtcclxuICAgIH0gY2F0Y2goZXgpIHtcclxuICAgICAgLy8gU3luY2hyb25vdXMgZmFpbHVyZVxyXG4gICAgICBjb21wbGV0ZVBlbmRpbmdDYWxsKGFzeW5jQ2FsbElkLCBmYWxzZSwgZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHRQcm9taXNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2V0UmVxdWlyZWREaXNwYXRjaGVyKCk6IERvdE5ldENhbGxEaXNwYXRjaGVyIHtcclxuICAgIGlmIChkb3ROZXREaXNwYXRjaGVyICE9PSBudWxsKSB7XHJcbiAgICAgIHJldHVybiBkb3ROZXREaXNwYXRjaGVyO1xyXG4gICAgfVxyXG5cclxuICAgIHRocm93IG5ldyBFcnJvcignTm8gLk5FVCBjYWxsIGRpc3BhdGNoZXIgaGFzIGJlZW4gc2V0LicpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY29tcGxldGVQZW5kaW5nQ2FsbChhc3luY0NhbGxJZDogbnVtYmVyLCBzdWNjZXNzOiBib29sZWFuLCByZXN1bHRPckVycm9yOiBhbnkpIHtcclxuICAgIGlmICghcGVuZGluZ0FzeW5jQ2FsbHMuaGFzT3duUHJvcGVydHkoYXN5bmNDYWxsSWQpKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlcmUgaXMgbm8gcGVuZGluZyBhc3luYyBjYWxsIHdpdGggSUQgJHthc3luY0NhbGxJZH0uYCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYXN5bmNDYWxsID0gcGVuZGluZ0FzeW5jQ2FsbHNbYXN5bmNDYWxsSWRdO1xyXG4gICAgZGVsZXRlIHBlbmRpbmdBc3luY0NhbGxzW2FzeW5jQ2FsbElkXTtcclxuICAgIGlmIChzdWNjZXNzKSB7XHJcbiAgICAgIGFzeW5jQ2FsbC5yZXNvbHZlKHJlc3VsdE9yRXJyb3IpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYXN5bmNDYWxsLnJlamVjdChyZXN1bHRPckVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGludGVyZmFjZSBQZW5kaW5nQXN5bmNDYWxsPFQ+IHtcclxuICAgIHJlc29sdmU6ICh2YWx1ZT86IFQgfCBQcm9taXNlTGlrZTxUPikgPT4gdm9pZDtcclxuICAgIHJlamVjdDogKHJlYXNvbj86IGFueSkgPT4gdm9pZDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlcHJlc2VudHMgdGhlIGFiaWxpdHkgdG8gZGlzcGF0Y2ggY2FsbHMgZnJvbSBKYXZhU2NyaXB0IHRvIGEgLk5FVCBydW50aW1lLlxyXG4gICAqL1xyXG4gIGV4cG9ydCBpbnRlcmZhY2UgRG90TmV0Q2FsbERpc3BhdGNoZXIge1xyXG4gICAgLyoqXHJcbiAgICAgKiBPcHRpb25hbC4gSWYgaW1wbGVtZW50ZWQsIGludm9rZWQgYnkgdGhlIHJ1bnRpbWUgdG8gcGVyZm9ybSBhIHN5bmNocm9ub3VzIGNhbGwgdG8gYSAuTkVUIG1ldGhvZC5cclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIGFzc2VtYmx5TmFtZSBUaGUgc2hvcnQgbmFtZSAod2l0aG91dCBrZXkvdmVyc2lvbiBvciAuZGxsIGV4dGVuc2lvbikgb2YgdGhlIC5ORVQgYXNzZW1ibHkgaG9sZGluZyB0aGUgbWV0aG9kIHRvIGludm9rZS5cclxuICAgICAqIEBwYXJhbSBtZXRob2RJZGVudGlmaWVyIFRoZSBpZGVudGlmaWVyIG9mIHRoZSBtZXRob2QgdG8gaW52b2tlLiBUaGUgbWV0aG9kIG11c3QgaGF2ZSBhIFtKU0ludm9rYWJsZV0gYXR0cmlidXRlIHNwZWNpZnlpbmcgdGhpcyBpZGVudGlmaWVyLlxyXG4gICAgICogQHBhcmFtIGFyZ3NKc29uIEpTT04gcmVwcmVzZW50YXRpb24gb2YgYXJndW1lbnRzIHRvIHBhc3MgdG8gdGhlIG1ldGhvZC5cclxuICAgICAqIEByZXR1cm5zIFRoZSByZXN1bHQgb2YgdGhlIGludm9jYXRpb24uXHJcbiAgICAgKi9cclxuICAgIGludm9rZURvdE5ldEZyb21KUz8oYXNzZW1ibHlOYW1lOiBzdHJpbmcsIG1ldGhvZElkZW50aWZpZXI6IHN0cmluZywgYXJnc0pzb246IHN0cmluZyk6IGFueTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEludm9rZWQgYnkgdGhlIHJ1bnRpbWUgdG8gYmVnaW4gYW4gYXN5bmNocm9ub3VzIGNhbGwgdG8gYSAuTkVUIG1ldGhvZC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY2FsbElkIEEgdmFsdWUgaWRlbnRpZnlpbmcgdGhlIGFzeW5jaHJvbm91cyBvcGVyYXRpb24uIFRoaXMgdmFsdWUgc2hvdWxkIGJlIHBhc3NlZCBiYWNrIGluIGEgbGF0ZXIgY2FsbCBmcm9tIC5ORVQgdG8gSlMuXHJcbiAgICAgKiBAcGFyYW0gYXNzZW1ibHlOYW1lIFRoZSBzaG9ydCBuYW1lICh3aXRob3V0IGtleS92ZXJzaW9uIG9yIC5kbGwgZXh0ZW5zaW9uKSBvZiB0aGUgLk5FVCBhc3NlbWJseSBob2xkaW5nIHRoZSBtZXRob2QgdG8gaW52b2tlLlxyXG4gICAgICogQHBhcmFtIG1ldGhvZElkZW50aWZpZXIgVGhlIGlkZW50aWZpZXIgb2YgdGhlIG1ldGhvZCB0byBpbnZva2UuIFRoZSBtZXRob2QgbXVzdCBoYXZlIGEgW0pTSW52b2thYmxlXSBhdHRyaWJ1dGUgc3BlY2lmeWluZyB0aGlzIGlkZW50aWZpZXIuXHJcbiAgICAgKiBAcGFyYW0gYXJnc0pzb24gSlNPTiByZXByZXNlbnRhdGlvbiBvZiBhcmd1bWVudHMgdG8gcGFzcyB0byB0aGUgbWV0aG9kLlxyXG4gICAgICovXHJcbiAgICBiZWdpbkludm9rZURvdE5ldEZyb21KUyhjYWxsSWQ6IG51bWJlciwgYXNzZW1ibHlOYW1lOiBzdHJpbmcsIG1ldGhvZElkZW50aWZpZXI6IHN0cmluZywgYXJnc0pzb246IHN0cmluZyk6IHZvaWQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZWNlaXZlcyBpbmNvbWluZyBjYWxscyBmcm9tIC5ORVQgYW5kIGRpc3BhdGNoZXMgdGhlbSB0byBKYXZhU2NyaXB0LlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjb25zdCBqc0NhbGxEaXNwYXRjaGVyID0ge1xyXG4gICAgLyoqXHJcbiAgICAgKiBGaW5kcyB0aGUgSmF2YVNjcmlwdCBmdW5jdGlvbiBtYXRjaGluZyB0aGUgc3BlY2lmaWVkIGlkZW50aWZpZXIuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGlkZW50aWZpZXIgSWRlbnRpZmllcyB0aGUgZ2xvYmFsbHktcmVhY2hhYmxlIGZ1bmN0aW9uIHRvIGJlIHJldHVybmVkLlxyXG4gICAgICogQHJldHVybnMgQSBGdW5jdGlvbiBpbnN0YW5jZS5cclxuICAgICAqL1xyXG4gICAgZmluZEpTRnVuY3Rpb24sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnZva2VzIHRoZSBzcGVjaWZpZWQgc3luY2hyb25vdXMgSmF2YVNjcmlwdCBmdW5jdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gaWRlbnRpZmllciBJZGVudGlmaWVzIHRoZSBnbG9iYWxseS1yZWFjaGFibGUgZnVuY3Rpb24gdG8gaW52b2tlLlxyXG4gICAgICogQHBhcmFtIGFyZ3NKc29uIEpTT04gcmVwcmVzZW50YXRpb24gb2YgYXJndW1lbnRzIHRvIGJlIHBhc3NlZCB0byB0aGUgZnVuY3Rpb24uXHJcbiAgICAgKiBAcmV0dXJucyBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBpbnZvY2F0aW9uIHJlc3VsdC5cclxuICAgICAqL1xyXG4gICAgaW52b2tlSlNGcm9tRG90TmV0OiAoaWRlbnRpZmllcjogc3RyaW5nLCBhcmdzSnNvbjogc3RyaW5nKSA9PiB7XHJcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGZpbmRKU0Z1bmN0aW9uKGlkZW50aWZpZXIpLmFwcGx5KG51bGwsIHBhcnNlSnNvbldpdGhSZXZpdmVycyhhcmdzSnNvbikpO1xyXG4gICAgICByZXR1cm4gcmVzdWx0ID09PSBudWxsIHx8IHJlc3VsdCA9PT0gdW5kZWZpbmVkXHJcbiAgICAgICAgPyBudWxsXHJcbiAgICAgICAgOiBKU09OLnN0cmluZ2lmeShyZXN1bHQpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEludm9rZXMgdGhlIHNwZWNpZmllZCBzeW5jaHJvbm91cyBvciBhc3luY2hyb25vdXMgSmF2YVNjcmlwdCBmdW5jdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gYXN5bmNIYW5kbGUgQSB2YWx1ZSBpZGVudGlmeWluZyB0aGUgYXN5bmNocm9ub3VzIG9wZXJhdGlvbi4gVGhpcyB2YWx1ZSB3aWxsIGJlIHBhc3NlZCBiYWNrIGluIGEgbGF0ZXIgY2FsbCB0byBlbmRJbnZva2VKU0Zyb21Eb3ROZXQuXHJcbiAgICAgKiBAcGFyYW0gaWRlbnRpZmllciBJZGVudGlmaWVzIHRoZSBnbG9iYWxseS1yZWFjaGFibGUgZnVuY3Rpb24gdG8gaW52b2tlLlxyXG4gICAgICogQHBhcmFtIGFyZ3NKc29uIEpTT04gcmVwcmVzZW50YXRpb24gb2YgYXJndW1lbnRzIHRvIGJlIHBhc3NlZCB0byB0aGUgZnVuY3Rpb24uXHJcbiAgICAgKi9cclxuICAgIGJlZ2luSW52b2tlSlNGcm9tRG90TmV0OiAoYXN5bmNIYW5kbGU6IG51bWJlciwgaWRlbnRpZmllcjogc3RyaW5nLCBhcmdzSnNvbjogc3RyaW5nKTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIENvZXJjZSBzeW5jaHJvbm91cyBmdW5jdGlvbnMgaW50byBhc3luYyBvbmVzLCBwbHVzIHRyZWF0XHJcbiAgICAgIC8vIHN5bmNocm9ub3VzIGV4Y2VwdGlvbnMgdGhlIHNhbWUgYXMgYXN5bmMgb25lc1xyXG4gICAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2U8YW55PihyZXNvbHZlID0+IHtcclxuICAgICAgICBjb25zdCBzeW5jaHJvbm91c1Jlc3VsdE9yUHJvbWlzZSA9IGZpbmRKU0Z1bmN0aW9uKGlkZW50aWZpZXIpLmFwcGx5KG51bGwsIHBhcnNlSnNvbldpdGhSZXZpdmVycyhhcmdzSnNvbikpO1xyXG4gICAgICAgIHJlc29sdmUoc3luY2hyb25vdXNSZXN1bHRPclByb21pc2UpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIFdlIG9ubHkgbGlzdGVuIGZvciBhIHJlc3VsdCBpZiB0aGUgY2FsbGVyIHdhbnRzIHRvIGJlIG5vdGlmaWVkIGFib3V0IGl0XHJcbiAgICAgIGlmIChhc3luY0hhbmRsZSkge1xyXG4gICAgICAgIC8vIE9uIGNvbXBsZXRpb24sIGRpc3BhdGNoIHJlc3VsdCBiYWNrIHRvIC5ORVRcclxuICAgICAgICAvLyBOb3QgdXNpbmcgXCJhd2FpdFwiIGJlY2F1c2UgaXQgY29kZWdlbnMgYSBsb3Qgb2YgYm9pbGVycGxhdGVcclxuICAgICAgICBwcm9taXNlLnRoZW4oXHJcbiAgICAgICAgICByZXN1bHQgPT4gZ2V0UmVxdWlyZWREaXNwYXRjaGVyKCkuYmVnaW5JbnZva2VEb3ROZXRGcm9tSlMoMCwgJ01pY3Jvc29mdC5KU0ludGVyb3AnLCAnRG90TmV0RGlzcGF0Y2hlci5FbmRJbnZva2UnLCBKU09OLnN0cmluZ2lmeShbYXN5bmNIYW5kbGUsIHRydWUsIHJlc3VsdF0pKSxcclxuICAgICAgICAgIGVycm9yID0+IGdldFJlcXVpcmVkRGlzcGF0Y2hlcigpLmJlZ2luSW52b2tlRG90TmV0RnJvbUpTKDAsICdNaWNyb3NvZnQuSlNJbnRlcm9wJywgJ0RvdE5ldERpc3BhdGNoZXIuRW5kSW52b2tlJywgSlNPTi5zdHJpbmdpZnkoW2FzeW5jSGFuZGxlLCBmYWxzZSwgZm9ybWF0RXJyb3IoZXJyb3IpXSkpXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlY2VpdmVzIG5vdGlmaWNhdGlvbiB0aGF0IGFuIGFzeW5jIGNhbGwgZnJvbSBKUyB0byAuTkVUIGhhcyBjb21wbGV0ZWQuXHJcbiAgICAgKiBAcGFyYW0gYXN5bmNDYWxsSWQgVGhlIGlkZW50aWZpZXIgc3VwcGxpZWQgaW4gYW4gZWFybGllciBjYWxsIHRvIGJlZ2luSW52b2tlRG90TmV0RnJvbUpTLlxyXG4gICAgICogQHBhcmFtIHN1Y2Nlc3MgQSBmbGFnIHRvIGluZGljYXRlIHdoZXRoZXIgdGhlIG9wZXJhdGlvbiBjb21wbGV0ZWQgc3VjY2Vzc2Z1bGx5LlxyXG4gICAgICogQHBhcmFtIHJlc3VsdE9yRXhjZXB0aW9uTWVzc2FnZSBFaXRoZXIgdGhlIG9wZXJhdGlvbiByZXN1bHQgb3IgYW4gZXJyb3IgbWVzc2FnZS5cclxuICAgICAqL1xyXG4gICAgZW5kSW52b2tlRG90TmV0RnJvbUpTOiAoYXN5bmNDYWxsSWQ6IHN0cmluZywgc3VjY2VzczogYm9vbGVhbiwgcmVzdWx0T3JFeGNlcHRpb25NZXNzYWdlOiBhbnkpOiB2b2lkID0+IHtcclxuICAgICAgY29uc3QgcmVzdWx0T3JFcnJvciA9IHN1Y2Nlc3MgPyByZXN1bHRPckV4Y2VwdGlvbk1lc3NhZ2UgOiBuZXcgRXJyb3IocmVzdWx0T3JFeGNlcHRpb25NZXNzYWdlKTtcclxuICAgICAgY29tcGxldGVQZW5kaW5nQ2FsbChwYXJzZUludChhc3luY0NhbGxJZCksIHN1Y2Nlc3MsIHJlc3VsdE9yRXJyb3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcGFyc2VKc29uV2l0aFJldml2ZXJzKGpzb246IHN0cmluZyk6IGFueSB7XHJcbiAgICByZXR1cm4ganNvbiA/IEpTT04ucGFyc2UoanNvbiwgKGtleSwgaW5pdGlhbFZhbHVlKSA9PiB7XHJcbiAgICAgIC8vIEludm9rZSBlYWNoIHJldml2ZXIgaW4gb3JkZXIsIHBhc3NpbmcgdGhlIG91dHB1dCBmcm9tIHRoZSBwcmV2aW91cyByZXZpdmVyLFxyXG4gICAgICAvLyBzbyB0aGF0IGVhY2ggb25lIGdldHMgYSBjaGFuY2UgdG8gdHJhbnNmb3JtIHRoZSB2YWx1ZVxyXG4gICAgICByZXR1cm4ganNvblJldml2ZXJzLnJlZHVjZShcclxuICAgICAgICAobGF0ZXN0VmFsdWUsIHJldml2ZXIpID0+IHJldml2ZXIoa2V5LCBsYXRlc3RWYWx1ZSksXHJcbiAgICAgICAgaW5pdGlhbFZhbHVlXHJcbiAgICAgICk7XHJcbiAgICB9KSA6IG51bGw7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBmb3JtYXRFcnJvcihlcnJvcjogYW55KTogc3RyaW5nIHtcclxuICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XHJcbiAgICAgIHJldHVybiBgJHtlcnJvci5tZXNzYWdlfVxcbiR7ZXJyb3Iuc3RhY2t9YDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBlcnJvciA/IGVycm9yLnRvU3RyaW5nKCkgOiAnbnVsbCc7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIGZpbmRKU0Z1bmN0aW9uKGlkZW50aWZpZXI6IHN0cmluZyk6IEZ1bmN0aW9uIHtcclxuICAgIGlmIChjYWNoZWRKU0Z1bmN0aW9ucy5oYXNPd25Qcm9wZXJ0eShpZGVudGlmaWVyKSkge1xyXG4gICAgICByZXR1cm4gY2FjaGVkSlNGdW5jdGlvbnNbaWRlbnRpZmllcl07XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHJlc3VsdDogYW55ID0gd2luZG93O1xyXG4gICAgbGV0IHJlc3VsdElkZW50aWZpZXIgPSAnd2luZG93JztcclxuICAgIGlkZW50aWZpZXIuc3BsaXQoJy4nKS5mb3JFYWNoKHNlZ21lbnQgPT4ge1xyXG4gICAgICBpZiAoc2VnbWVudCBpbiByZXN1bHQpIHtcclxuICAgICAgICByZXN1bHQgPSByZXN1bHRbc2VnbWVudF07XHJcbiAgICAgICAgcmVzdWx0SWRlbnRpZmllciArPSAnLicgKyBzZWdtZW50O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgJyR7c2VnbWVudH0nIGluICcke3Jlc3VsdElkZW50aWZpZXJ9Jy5gKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSB2YWx1ZSAnJHtyZXN1bHRJZGVudGlmaWVyfScgaXMgbm90IGEgZnVuY3Rpb24uYCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCAnLi4vLi4vTWljcm9zb2Z0LkpTSW50ZXJvcC9KYXZhU2NyaXB0UnVudGltZS9zcmMvTWljcm9zb2Z0LkpTSW50ZXJvcCc7XHJcbmltcG9ydCB7IHBsYXRmb3JtIH0gZnJvbSAnLi9FbnZpcm9ubWVudCc7XHJcbmltcG9ydCB7IGdldEFzc2VtYmx5TmFtZUZyb21VcmwgfSBmcm9tICcuL1BsYXRmb3JtL0RvdE5ldCc7XHJcbmltcG9ydCAnLi9HbG9iYWxFeHBvcnRzJztcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGJvb3QoKSB7XHJcbiAgLy8gUmVhZCBzdGFydHVwIGNvbmZpZyBmcm9tIHRoZSA8c2NyaXB0PiBlbGVtZW50IHRoYXQncyBpbXBvcnRpbmcgdGhpcyBmaWxlXHJcbiAgY29uc3QgYWxsU2NyaXB0RWxlbXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0Jyk7XHJcbiAgY29uc3QgdGhpc1NjcmlwdEVsZW0gPSAoZG9jdW1lbnQuY3VycmVudFNjcmlwdCB8fCBhbGxTY3JpcHRFbGVtc1thbGxTY3JpcHRFbGVtcy5sZW5ndGggLSAxXSkgYXMgSFRNTFNjcmlwdEVsZW1lbnQ7XHJcbiAgY29uc3QgaXNMaW5rZXJFbmFibGVkID0gdGhpc1NjcmlwdEVsZW0uZ2V0QXR0cmlidXRlKCdsaW5rZXItZW5hYmxlZCcpID09PSAndHJ1ZSc7XHJcbiAgY29uc3QgZW50cnlQb2ludERsbCA9IGdldFJlcXVpcmVkQm9vdFNjcmlwdEF0dHJpYnV0ZSh0aGlzU2NyaXB0RWxlbSwgJ21haW4nKTtcclxuICBjb25zdCBlbnRyeVBvaW50TWV0aG9kID0gZ2V0UmVxdWlyZWRCb290U2NyaXB0QXR0cmlidXRlKHRoaXNTY3JpcHRFbGVtLCAnZW50cnlwb2ludCcpO1xyXG4gIGNvbnN0IGVudHJ5UG9pbnRBc3NlbWJseU5hbWUgPSBnZXRBc3NlbWJseU5hbWVGcm9tVXJsKGVudHJ5UG9pbnREbGwpO1xyXG4gIGNvbnN0IHJlZmVyZW5jZUFzc2VtYmxpZXNDb21tYVNlcGFyYXRlZCA9IHRoaXNTY3JpcHRFbGVtLmdldEF0dHJpYnV0ZSgncmVmZXJlbmNlcycpIHx8ICcnO1xyXG4gIGNvbnN0IHJlZmVyZW5jZUFzc2VtYmxpZXMgPSByZWZlcmVuY2VBc3NlbWJsaWVzQ29tbWFTZXBhcmF0ZWRcclxuICAgIC5zcGxpdCgnLCcpXHJcbiAgICAubWFwKHMgPT4gcy50cmltKCkpXHJcbiAgICAuZmlsdGVyKHMgPT4gISFzKTtcclxuXHJcbiAgaWYgKCFpc0xpbmtlckVuYWJsZWQpIHtcclxuICAgIGNvbnNvbGUuaW5mbygnQmxhem9yIGlzIHJ1bm5pbmcgaW4gZGV2IG1vZGUgd2l0aG91dCBJTCBzdHJpcHBpbmcuIFRvIG1ha2UgdGhlIGJ1bmRsZSBzaXplIHNpZ25pZmljYW50bHkgc21hbGxlciwgcHVibGlzaCB0aGUgYXBwbGljYXRpb24gb3Igc2VlIGh0dHBzOi8vZ28ubWljcm9zb2Z0LmNvbS9md2xpbmsvP2xpbmtpZD04NzA0MTQnKTtcclxuICB9XHJcblxyXG4gIC8vIERldGVybWluZSB0aGUgVVJMcyBvZiB0aGUgYXNzZW1ibGllcyB3ZSB3YW50IHRvIGxvYWRcclxuICBjb25zdCBsb2FkQXNzZW1ibHlVcmxzID0gW2VudHJ5UG9pbnREbGxdXHJcbiAgICAuY29uY2F0KHJlZmVyZW5jZUFzc2VtYmxpZXMpXHJcbiAgICAubWFwKGZpbGVuYW1lID0+IGBfZnJhbWV3b3JrL19iaW4vJHtmaWxlbmFtZX1gKTtcclxuXHJcbiAgdHJ5IHtcclxuICAgIGF3YWl0IHBsYXRmb3JtLnN0YXJ0KGxvYWRBc3NlbWJseVVybHMpO1xyXG4gIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBzdGFydCBwbGF0Zm9ybS4gUmVhc29uOiAke2V4fWApO1xyXG4gIH1cclxuXHJcbiAgLy8gU3RhcnQgdXAgdGhlIGFwcGxpY2F0aW9uXHJcbiAgcGxhdGZvcm0uY2FsbEVudHJ5UG9pbnQoZW50cnlQb2ludEFzc2VtYmx5TmFtZSwgZW50cnlQb2ludE1ldGhvZCwgW10pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRSZXF1aXJlZEJvb3RTY3JpcHRBdHRyaWJ1dGUoZWxlbTogSFRNTFNjcmlwdEVsZW1lbnQsIGF0dHJpYnV0ZU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgY29uc3QgcmVzdWx0ID0gZWxlbS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XHJcbiAgaWYgKCFyZXN1bHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBcIiR7YXR0cmlidXRlTmFtZX1cIiBhdHRyaWJ1dGUgb24gQmxhem9yIHNjcmlwdCB0YWcuYCk7XHJcbiAgfVxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmJvb3QoKTtcclxuIiwiLy8gRXhwb3NlIGFuIGV4cG9ydCBjYWxsZWQgJ3BsYXRmb3JtJyBvZiB0aGUgaW50ZXJmYWNlIHR5cGUgJ1BsYXRmb3JtJyxcclxuLy8gc28gdGhhdCBjb25zdW1lcnMgY2FuIGJlIGFnbm9zdGljIGFib3V0IHdoaWNoIGltcGxlbWVudGF0aW9uIHRoZXkgdXNlLlxyXG4vLyBCYXNpYyBhbHRlcm5hdGl2ZSB0byBoYXZpbmcgYW4gYWN0dWFsIERJIGNvbnRhaW5lci5cclxuaW1wb3J0IHsgUGxhdGZvcm0gfSBmcm9tICcuL1BsYXRmb3JtL1BsYXRmb3JtJztcclxuaW1wb3J0IHsgbW9ub1BsYXRmb3JtIH0gZnJvbSAnLi9QbGF0Zm9ybS9Nb25vL01vbm9QbGF0Zm9ybSc7XHJcbmV4cG9ydCBjb25zdCBwbGF0Zm9ybTogUGxhdGZvcm0gPSBtb25vUGxhdGZvcm07XHJcbiIsImltcG9ydCB7IHBsYXRmb3JtIH0gZnJvbSAnLi9FbnZpcm9ubWVudCc7XHJcbmltcG9ydCB7IG5hdmlnYXRlVG8sIGludGVybmFsRnVuY3Rpb25zIGFzIHVyaUhlbHBlckludGVybmFsRnVuY3Rpb25zIH0gZnJvbSAnLi9TZXJ2aWNlcy9VcmlIZWxwZXInO1xyXG5pbXBvcnQgeyBpbnRlcm5hbEZ1bmN0aW9ucyBhcyBodHRwSW50ZXJuYWxGdW5jdGlvbnMgfSBmcm9tICcuL1NlcnZpY2VzL0h0dHAnO1xyXG5pbXBvcnQgeyBhdHRhY2hSb290Q29tcG9uZW50VG9FbGVtZW50LCByZW5kZXJCYXRjaCB9IGZyb20gJy4vUmVuZGVyaW5nL1JlbmRlcmVyJztcclxuaW1wb3J0IHsgUG9pbnRlciB9IGZyb20gJy4vUGxhdGZvcm0vUGxhdGZvcm0nO1xyXG5pbXBvcnQgeyBTaGFyZWRNZW1vcnlSZW5kZXJCYXRjaCB9IGZyb20gJy4vUmVuZGVyaW5nL1JlbmRlckJhdGNoL1NoYXJlZE1lbW9yeVJlbmRlckJhdGNoJztcclxuXHJcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xyXG4gIC8vIFdoZW4gdGhlIGxpYnJhcnkgaXMgbG9hZGVkIGluIGEgYnJvd3NlciB2aWEgYSA8c2NyaXB0PiBlbGVtZW50LCBtYWtlIHRoZVxyXG4gIC8vIGZvbGxvd2luZyBBUElzIGF2YWlsYWJsZSBpbiBnbG9iYWwgc2NvcGUgZm9yIGludm9jYXRpb24gZnJvbSBKU1xyXG4gIHdpbmRvd1snQmxhem9yJ10gPSB7XHJcbiAgICBwbGF0Zm9ybSxcclxuICAgIG5hdmlnYXRlVG8sXHJcblxyXG4gICAgX2ludGVybmFsOiB7XHJcbiAgICAgIGF0dGFjaFJvb3RDb21wb25lbnRUb0VsZW1lbnQsXHJcbiAgICAgIHJlbmRlckJhdGNoOiAoYnJvd3NlclJlbmRlcmVySWQ6IG51bWJlciwgYmF0Y2hBZGRyZXNzOiBQb2ludGVyKSA9PiByZW5kZXJCYXRjaChicm93c2VyUmVuZGVyZXJJZCwgbmV3IFNoYXJlZE1lbW9yeVJlbmRlckJhdGNoKGJhdGNoQWRkcmVzcykpLFxyXG4gICAgICBodHRwOiBodHRwSW50ZXJuYWxGdW5jdGlvbnMsXHJcbiAgICAgIHVyaUhlbHBlcjogdXJpSGVscGVySW50ZXJuYWxGdW5jdGlvbnNcclxuICAgIH1cclxuICB9O1xyXG59XHJcbiIsImV4cG9ydCBmdW5jdGlvbiBnZXRBc3NlbWJseU5hbWVGcm9tVXJsKHVybDogc3RyaW5nKSB7XHJcbiAgY29uc3QgbGFzdFNlZ21lbnQgPSB1cmwuc3Vic3RyaW5nKHVybC5sYXN0SW5kZXhPZignLycpICsgMSk7XHJcbiAgY29uc3QgcXVlcnlTdHJpbmdTdGFydFBvcyA9IGxhc3RTZWdtZW50LmluZGV4T2YoJz8nKTtcclxuICBjb25zdCBmaWxlbmFtZSA9IHF1ZXJ5U3RyaW5nU3RhcnRQb3MgPCAwID8gbGFzdFNlZ21lbnQgOiBsYXN0U2VnbWVudC5zdWJzdHJpbmcoMCwgcXVlcnlTdHJpbmdTdGFydFBvcyk7XHJcbiAgcmV0dXJuIGZpbGVuYW1lLnJlcGxhY2UoL1xcLmRsbCQvLCAnJyk7XHJcbn1cclxuIiwiaW1wb3J0IHsgTWV0aG9kSGFuZGxlLCBTeXN0ZW1fT2JqZWN0LCBTeXN0ZW1fU3RyaW5nLCBTeXN0ZW1fQXJyYXksIFBvaW50ZXIsIFBsYXRmb3JtIH0gZnJvbSAnLi4vUGxhdGZvcm0nO1xyXG5pbXBvcnQgeyBnZXRBc3NlbWJseU5hbWVGcm9tVXJsIH0gZnJvbSAnLi4vRG90TmV0JztcclxuXHJcbmNvbnN0IGFzc2VtYmx5SGFuZGxlQ2FjaGU6IHsgW2Fzc2VtYmx5TmFtZTogc3RyaW5nXTogbnVtYmVyIH0gPSB7fTtcclxuY29uc3QgdHlwZUhhbmRsZUNhY2hlOiB7IFtmdWxseVF1YWxpZmllZFR5cGVOYW1lOiBzdHJpbmddOiBudW1iZXIgfSA9IHt9O1xyXG5jb25zdCBtZXRob2RIYW5kbGVDYWNoZTogeyBbZnVsbHlRdWFsaWZpZWRNZXRob2ROYW1lOiBzdHJpbmddOiBNZXRob2RIYW5kbGUgfSA9IHt9O1xyXG5cclxubGV0IGFzc2VtYmx5X2xvYWQ6IChhc3NlbWJseU5hbWU6IHN0cmluZykgPT4gbnVtYmVyO1xyXG5sZXQgZmluZF9jbGFzczogKGFzc2VtYmx5SGFuZGxlOiBudW1iZXIsIG5hbWVzcGFjZTogc3RyaW5nLCBjbGFzc05hbWU6IHN0cmluZykgPT4gbnVtYmVyO1xyXG5sZXQgZmluZF9tZXRob2Q6ICh0eXBlSGFuZGxlOiBudW1iZXIsIG1ldGhvZE5hbWU6IHN0cmluZywgdW5rbm93bkFyZzogbnVtYmVyKSA9PiBNZXRob2RIYW5kbGU7XHJcbmxldCBpbnZva2VfbWV0aG9kOiAobWV0aG9kOiBNZXRob2RIYW5kbGUsIHRhcmdldDogU3lzdGVtX09iamVjdCwgYXJnc0FycmF5UHRyOiBudW1iZXIsIGV4Y2VwdGlvbkZsYWdJbnRQdHI6IG51bWJlcikgPT4gU3lzdGVtX09iamVjdDtcclxubGV0IG1vbm9fc3RyaW5nX2dldF91dGY4OiAobWFuYWdlZFN0cmluZzogU3lzdGVtX1N0cmluZykgPT4gTW9uby5VdGY4UHRyO1xyXG5sZXQgbW9ub19zdHJpbmc6IChqc1N0cmluZzogc3RyaW5nKSA9PiBTeXN0ZW1fU3RyaW5nO1xyXG5cclxuZXhwb3J0IGNvbnN0IG1vbm9QbGF0Zm9ybTogUGxhdGZvcm0gPSB7XHJcbiAgc3RhcnQ6IGZ1bmN0aW9uIHN0YXJ0KGxvYWRBc3NlbWJseVVybHM6IHN0cmluZ1tdKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAvLyBtb25vLmpzIGFzc3VtZXMgdGhlIGV4aXN0ZW5jZSBvZiB0aGlzXHJcbiAgICAgIHdpbmRvd1snQnJvd3NlciddID0ge1xyXG4gICAgICAgIGluaXQ6ICgpID0+IHsgfSxcclxuICAgICAgICBhc3luY0xvYWQ6IGFzeW5jTG9hZFxyXG4gICAgICB9O1xyXG4gICAgICAvLyBFbXNjcmlwdGVuIHdvcmtzIGJ5IGV4cGVjdGluZyB0aGUgbW9kdWxlIGNvbmZpZyB0byBiZSBhIGdsb2JhbFxyXG4gICAgICB3aW5kb3dbJ01vZHVsZSddID0gY3JlYXRlRW1zY3JpcHRlbk1vZHVsZUluc3RhbmNlKGxvYWRBc3NlbWJseVVybHMsIHJlc29sdmUsIHJlamVjdCk7XHJcblxyXG4gICAgICBhZGRTY3JpcHRUYWdzVG9Eb2N1bWVudCgpO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuXHJcbiAgZmluZE1ldGhvZDogZmluZE1ldGhvZCxcclxuXHJcbiAgY2FsbEVudHJ5UG9pbnQ6IGZ1bmN0aW9uIGNhbGxFbnRyeVBvaW50KGFzc2VtYmx5TmFtZTogc3RyaW5nLCBlbnRyeXBvaW50TWV0aG9kOiBzdHJpbmcsIGFyZ3M6IFN5c3RlbV9PYmplY3RbXSk6IHZvaWQge1xyXG4gICAgLy8gUGFyc2UgdGhlIGVudHJ5cG9pbnRNZXRob2QsIHdoaWNoIGlzIG9mIHRoZSBmb3JtIE15QXBwLk15TmFtZXNwYWNlLk15VHlwZU5hbWU6Ok15TWV0aG9kTmFtZVxyXG4gICAgLy8gTm90ZSB0aGF0IHdlIGRvbid0IHN1cHBvcnQgc3BlY2lmeWluZyBhIG1ldGhvZCBvdmVybG9hZCwgc28gaXQgaGFzIHRvIGJlIHVuaXF1ZVxyXG4gICAgY29uc3QgZW50cnlwb2ludFNlZ21lbnRzID0gZW50cnlwb2ludE1ldGhvZC5zcGxpdCgnOjonKTtcclxuICAgIGlmIChlbnRyeXBvaW50U2VnbWVudHMubGVuZ3RoICE9IDIpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNYWxmb3JtZWQgZW50cnkgcG9pbnQgbWV0aG9kIG5hbWU7IGNvdWxkIG5vdCByZXNvbHZlIGNsYXNzIG5hbWUgYW5kIG1ldGhvZCBuYW1lLicpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdHlwZUZ1bGxOYW1lID0gZW50cnlwb2ludFNlZ21lbnRzWzBdO1xyXG4gICAgY29uc3QgbWV0aG9kTmFtZSA9IGVudHJ5cG9pbnRTZWdtZW50c1sxXTtcclxuICAgIGNvbnN0IGxhc3REb3QgPSB0eXBlRnVsbE5hbWUubGFzdEluZGV4T2YoJy4nKTtcclxuICAgIGNvbnN0IG5hbWVzcGFjZSA9IGxhc3REb3QgPiAtMSA/IHR5cGVGdWxsTmFtZS5zdWJzdHJpbmcoMCwgbGFzdERvdCkgOiAnJztcclxuICAgIGNvbnN0IHR5cGVTaG9ydE5hbWUgPSBsYXN0RG90ID4gLTEgPyB0eXBlRnVsbE5hbWUuc3Vic3RyaW5nKGxhc3REb3QgKyAxKSA6IHR5cGVGdWxsTmFtZTtcclxuXHJcbiAgICBjb25zdCBlbnRyeVBvaW50TWV0aG9kSGFuZGxlID0gbW9ub1BsYXRmb3JtLmZpbmRNZXRob2QoYXNzZW1ibHlOYW1lLCBuYW1lc3BhY2UsIHR5cGVTaG9ydE5hbWUsIG1ldGhvZE5hbWUpO1xyXG4gICAgbW9ub1BsYXRmb3JtLmNhbGxNZXRob2QoZW50cnlQb2ludE1ldGhvZEhhbmRsZSwgbnVsbCwgYXJncyk7XHJcbiAgfSxcclxuXHJcbiAgY2FsbE1ldGhvZDogZnVuY3Rpb24gY2FsbE1ldGhvZChtZXRob2Q6IE1ldGhvZEhhbmRsZSwgdGFyZ2V0OiBTeXN0ZW1fT2JqZWN0LCBhcmdzOiBTeXN0ZW1fT2JqZWN0W10pOiBTeXN0ZW1fT2JqZWN0IHtcclxuICAgIGlmIChhcmdzLmxlbmd0aCA+IDQpIHtcclxuICAgICAgLy8gSG9wZWZ1bGx5IHRoaXMgcmVzdHJpY3Rpb24gY2FuIGJlIGVhc2VkIHNvb24sIGJ1dCBmb3Igbm93IG1ha2UgaXQgY2xlYXIgd2hhdCdzIGdvaW5nIG9uXHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ3VycmVudGx5LCBNb25vUGxhdGZvcm0gc3VwcG9ydHMgcGFzc2luZyBhIG1heGltdW0gb2YgNCBhcmd1bWVudHMgZnJvbSBKUyB0byAuTkVULiBZb3UgdHJpZWQgdG8gcGFzcyAke2FyZ3MubGVuZ3RofS5gKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzdGFjayA9IE1vZHVsZS5zdGFja1NhdmUoKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBhcmdzQnVmZmVyID0gTW9kdWxlLnN0YWNrQWxsb2MoYXJncy5sZW5ndGgpO1xyXG4gICAgICBjb25zdCBleGNlcHRpb25GbGFnTWFuYWdlZEludCA9IE1vZHVsZS5zdGFja0FsbG9jKDQpO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICBNb2R1bGUuc2V0VmFsdWUoYXJnc0J1ZmZlciArIGkgKiA0LCBhcmdzW2ldLCAnaTMyJyk7XHJcbiAgICAgIH1cclxuICAgICAgTW9kdWxlLnNldFZhbHVlKGV4Y2VwdGlvbkZsYWdNYW5hZ2VkSW50LCAwLCAnaTMyJyk7XHJcblxyXG4gICAgICBjb25zdCByZXMgPSBpbnZva2VfbWV0aG9kKG1ldGhvZCwgdGFyZ2V0LCBhcmdzQnVmZmVyLCBleGNlcHRpb25GbGFnTWFuYWdlZEludCk7XHJcblxyXG4gICAgICBpZiAoTW9kdWxlLmdldFZhbHVlKGV4Y2VwdGlvbkZsYWdNYW5hZ2VkSW50LCAnaTMyJykgIT09IDApIHtcclxuICAgICAgICAvLyBJZiB0aGUgZXhjZXB0aW9uIGZsYWcgaXMgc2V0LCB0aGUgcmV0dXJuZWQgdmFsdWUgaXMgZXhjZXB0aW9uLlRvU3RyaW5nKClcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobW9ub1BsYXRmb3JtLnRvSmF2YVNjcmlwdFN0cmluZyg8U3lzdGVtX1N0cmluZz5yZXMpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlcztcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIE1vZHVsZS5zdGFja1Jlc3RvcmUoc3RhY2spO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHRvSmF2YVNjcmlwdFN0cmluZzogZnVuY3Rpb24gdG9KYXZhU2NyaXB0U3RyaW5nKG1hbmFnZWRTdHJpbmc6IFN5c3RlbV9TdHJpbmcpIHtcclxuICAgIC8vIENvbW1lbnRzIGZyb20gb3JpZ2luYWwgTW9ubyBzYW1wbGU6XHJcbiAgICAvL0ZJWE1FIHRoaXMgaXMgd2FzdGVmdWxsLCB3ZSBjb3VsZCByZW1vdmUgdGhlIHRlbXAgbWFsbG9jIGJ5IGdvaW5nIHRoZSBVVEYxNiByb3V0ZVxyXG4gICAgLy9GSVhNRSB0aGlzIGlzIHVuc2FmZSwgY3V6IHJhdyBvYmplY3RzIGNvdWxkIGJlIEdDJ2QuXHJcblxyXG4gICAgY29uc3QgdXRmOCA9IG1vbm9fc3RyaW5nX2dldF91dGY4KG1hbmFnZWRTdHJpbmcpO1xyXG4gICAgY29uc3QgcmVzID0gTW9kdWxlLlVURjhUb1N0cmluZyh1dGY4KTtcclxuICAgIE1vZHVsZS5fZnJlZSh1dGY4IGFzIGFueSk7XHJcbiAgICByZXR1cm4gcmVzO1xyXG4gIH0sXHJcblxyXG4gIHRvRG90TmV0U3RyaW5nOiBmdW5jdGlvbiB0b0RvdE5ldFN0cmluZyhqc1N0cmluZzogc3RyaW5nKTogU3lzdGVtX1N0cmluZyB7XHJcbiAgICByZXR1cm4gbW9ub19zdHJpbmcoanNTdHJpbmcpO1xyXG4gIH0sXHJcblxyXG4gIHRvVWludDhBcnJheTogZnVuY3Rpb24gdG9VaW50OEFycmF5KGFycmF5OiBTeXN0ZW1fQXJyYXk8YW55Pik6IFVpbnQ4QXJyYXkge1xyXG4gICAgY29uc3QgZGF0YVB0ciA9IGdldEFycmF5RGF0YVBvaW50ZXIoYXJyYXkpO1xyXG4gICAgY29uc3QgbGVuZ3RoID0gTW9kdWxlLmdldFZhbHVlKGRhdGFQdHIsICdpMzInKTtcclxuICAgIHJldHVybiBuZXcgVWludDhBcnJheShNb2R1bGUuSEVBUFU4LmJ1ZmZlciwgZGF0YVB0ciArIDQsIGxlbmd0aCk7XHJcbiAgfSxcclxuXHJcbiAgZ2V0QXJyYXlMZW5ndGg6IGZ1bmN0aW9uIGdldEFycmF5TGVuZ3RoKGFycmF5OiBTeXN0ZW1fQXJyYXk8YW55Pik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gTW9kdWxlLmdldFZhbHVlKGdldEFycmF5RGF0YVBvaW50ZXIoYXJyYXkpLCAnaTMyJyk7XHJcbiAgfSxcclxuXHJcbiAgZ2V0QXJyYXlFbnRyeVB0cjogZnVuY3Rpb24gZ2V0QXJyYXlFbnRyeVB0cjxUUHRyIGV4dGVuZHMgUG9pbnRlcj4oYXJyYXk6IFN5c3RlbV9BcnJheTxUUHRyPiwgaW5kZXg6IG51bWJlciwgaXRlbVNpemU6IG51bWJlcik6IFRQdHIge1xyXG4gICAgLy8gRmlyc3QgYnl0ZSBpcyBhcnJheSBsZW5ndGgsIGZvbGxvd2VkIGJ5IGVudHJpZXNcclxuICAgIGNvbnN0IGFkZHJlc3MgPSBnZXRBcnJheURhdGFQb2ludGVyKGFycmF5KSArIDQgKyBpbmRleCAqIGl0ZW1TaXplO1xyXG4gICAgcmV0dXJuIGFkZHJlc3MgYXMgYW55IGFzIFRQdHI7XHJcbiAgfSxcclxuXHJcbiAgZ2V0T2JqZWN0RmllbGRzQmFzZUFkZHJlc3M6IGZ1bmN0aW9uIGdldE9iamVjdEZpZWxkc0Jhc2VBZGRyZXNzKHJlZmVyZW5jZVR5cGVkT2JqZWN0OiBTeXN0ZW1fT2JqZWN0KTogUG9pbnRlciB7XHJcbiAgICAvLyBUaGUgZmlyc3QgdHdvIGludDMyIHZhbHVlcyBhcmUgaW50ZXJuYWwgTW9ubyBkYXRhXHJcbiAgICByZXR1cm4gKHJlZmVyZW5jZVR5cGVkT2JqZWN0IGFzIGFueSBhcyBudW1iZXIgKyA4KSBhcyBhbnkgYXMgUG9pbnRlcjtcclxuICB9LFxyXG5cclxuICByZWFkSW50MzJGaWVsZDogZnVuY3Rpb24gcmVhZEhlYXBJbnQzMihiYXNlQWRkcmVzczogUG9pbnRlciwgZmllbGRPZmZzZXQ/OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIE1vZHVsZS5nZXRWYWx1ZSgoYmFzZUFkZHJlc3MgYXMgYW55IGFzIG51bWJlcikgKyAoZmllbGRPZmZzZXQgfHwgMCksICdpMzInKTtcclxuICB9LFxyXG5cclxuICByZWFkRmxvYXRGaWVsZDogZnVuY3Rpb24gcmVhZEhlYXBGbG9hdChiYXNlQWRkcmVzczogUG9pbnRlciwgZmllbGRPZmZzZXQ/OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIE1vZHVsZS5nZXRWYWx1ZSgoYmFzZUFkZHJlc3MgYXMgYW55IGFzIG51bWJlcikgKyAoZmllbGRPZmZzZXQgfHwgMCksICdmbG9hdCcpO1xyXG4gIH0sXHJcblxyXG4gIHJlYWRPYmplY3RGaWVsZDogZnVuY3Rpb24gcmVhZEhlYXBPYmplY3Q8VCBleHRlbmRzIFN5c3RlbV9PYmplY3Q+KGJhc2VBZGRyZXNzOiBQb2ludGVyLCBmaWVsZE9mZnNldD86IG51bWJlcik6IFQge1xyXG4gICAgcmV0dXJuIE1vZHVsZS5nZXRWYWx1ZSgoYmFzZUFkZHJlc3MgYXMgYW55IGFzIG51bWJlcikgKyAoZmllbGRPZmZzZXQgfHwgMCksICdpMzInKSBhcyBhbnkgYXMgVDtcclxuICB9LFxyXG5cclxuICByZWFkU3RyaW5nRmllbGQ6IGZ1bmN0aW9uIHJlYWRIZWFwT2JqZWN0KGJhc2VBZGRyZXNzOiBQb2ludGVyLCBmaWVsZE9mZnNldD86IG51bWJlcik6IHN0cmluZyB8IG51bGwge1xyXG4gICAgY29uc3QgZmllbGRWYWx1ZSA9IE1vZHVsZS5nZXRWYWx1ZSgoYmFzZUFkZHJlc3MgYXMgYW55IGFzIG51bWJlcikgKyAoZmllbGRPZmZzZXQgfHwgMCksICdpMzInKTtcclxuICAgIHJldHVybiBmaWVsZFZhbHVlID09PSAwID8gbnVsbCA6IG1vbm9QbGF0Zm9ybS50b0phdmFTY3JpcHRTdHJpbmcoZmllbGRWYWx1ZSBhcyBhbnkgYXMgU3lzdGVtX1N0cmluZyk7XHJcbiAgfSxcclxuXHJcbiAgcmVhZFN0cnVjdEZpZWxkOiBmdW5jdGlvbiByZWFkU3RydWN0RmllbGQ8VCBleHRlbmRzIFBvaW50ZXI+KGJhc2VBZGRyZXNzOiBQb2ludGVyLCBmaWVsZE9mZnNldD86IG51bWJlcik6IFQge1xyXG4gICAgcmV0dXJuICgoYmFzZUFkZHJlc3MgYXMgYW55IGFzIG51bWJlcikgKyAoZmllbGRPZmZzZXQgfHwgMCkpIGFzIGFueSBhcyBUO1xyXG4gIH0sXHJcbn07XHJcblxyXG5mdW5jdGlvbiBmaW5kQXNzZW1ibHkoYXNzZW1ibHlOYW1lOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gIGxldCBhc3NlbWJseUhhbmRsZSA9IGFzc2VtYmx5SGFuZGxlQ2FjaGVbYXNzZW1ibHlOYW1lXTtcclxuICBpZiAoIWFzc2VtYmx5SGFuZGxlKSB7XHJcbiAgICBhc3NlbWJseUhhbmRsZSA9IGFzc2VtYmx5X2xvYWQoYXNzZW1ibHlOYW1lKTtcclxuICAgIGlmICghYXNzZW1ibHlIYW5kbGUpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBhc3NlbWJseSBcIiR7YXNzZW1ibHlOYW1lfVwiYCk7XHJcbiAgICB9XHJcbiAgICBhc3NlbWJseUhhbmRsZUNhY2hlW2Fzc2VtYmx5TmFtZV0gPSBhc3NlbWJseUhhbmRsZTtcclxuICB9XHJcbiAgcmV0dXJuIGFzc2VtYmx5SGFuZGxlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaW5kVHlwZShhc3NlbWJseU5hbWU6IHN0cmluZywgbmFtZXNwYWNlOiBzdHJpbmcsIGNsYXNzTmFtZTogc3RyaW5nKTogbnVtYmVyIHtcclxuICBjb25zdCBmdWxseVF1YWxpZmllZFR5cGVOYW1lID0gYFske2Fzc2VtYmx5TmFtZX1dJHtuYW1lc3BhY2V9LiR7Y2xhc3NOYW1lfWA7XHJcbiAgbGV0IHR5cGVIYW5kbGUgPSB0eXBlSGFuZGxlQ2FjaGVbZnVsbHlRdWFsaWZpZWRUeXBlTmFtZV07XHJcbiAgaWYgKCF0eXBlSGFuZGxlKSB7XHJcbiAgICB0eXBlSGFuZGxlID0gZmluZF9jbGFzcyhmaW5kQXNzZW1ibHkoYXNzZW1ibHlOYW1lKSwgbmFtZXNwYWNlLCBjbGFzc05hbWUpO1xyXG4gICAgaWYgKCF0eXBlSGFuZGxlKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgdHlwZSBcIiR7Y2xhc3NOYW1lfVwiIGluIG5hbWVzcGFjZSBcIiR7bmFtZXNwYWNlfVwiIGluIGFzc2VtYmx5IFwiJHthc3NlbWJseU5hbWV9XCJgKTtcclxuICAgIH1cclxuICAgIHR5cGVIYW5kbGVDYWNoZVtmdWxseVF1YWxpZmllZFR5cGVOYW1lXSA9IHR5cGVIYW5kbGU7XHJcbiAgfVxyXG4gIHJldHVybiB0eXBlSGFuZGxlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaW5kTWV0aG9kKGFzc2VtYmx5TmFtZTogc3RyaW5nLCBuYW1lc3BhY2U6IHN0cmluZywgY2xhc3NOYW1lOiBzdHJpbmcsIG1ldGhvZE5hbWU6IHN0cmluZyk6IE1ldGhvZEhhbmRsZSB7XHJcbiAgY29uc3QgZnVsbHlRdWFsaWZpZWRNZXRob2ROYW1lID0gYFske2Fzc2VtYmx5TmFtZX1dJHtuYW1lc3BhY2V9LiR7Y2xhc3NOYW1lfTo6JHttZXRob2ROYW1lfWA7XHJcbiAgbGV0IG1ldGhvZEhhbmRsZSA9IG1ldGhvZEhhbmRsZUNhY2hlW2Z1bGx5UXVhbGlmaWVkTWV0aG9kTmFtZV07XHJcbiAgaWYgKCFtZXRob2RIYW5kbGUpIHtcclxuICAgIG1ldGhvZEhhbmRsZSA9IGZpbmRfbWV0aG9kKGZpbmRUeXBlKGFzc2VtYmx5TmFtZSwgbmFtZXNwYWNlLCBjbGFzc05hbWUpLCBtZXRob2ROYW1lLCAtMSk7XHJcbiAgICBpZiAoIW1ldGhvZEhhbmRsZSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIG1ldGhvZCBcIiR7bWV0aG9kTmFtZX1cIiBvbiB0eXBlIFwiJHtuYW1lc3BhY2V9LiR7Y2xhc3NOYW1lfVwiYCk7XHJcbiAgICB9XHJcbiAgICBtZXRob2RIYW5kbGVDYWNoZVtmdWxseVF1YWxpZmllZE1ldGhvZE5hbWVdID0gbWV0aG9kSGFuZGxlO1xyXG4gIH1cclxuICByZXR1cm4gbWV0aG9kSGFuZGxlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRTY3JpcHRUYWdzVG9Eb2N1bWVudCgpIHtcclxuICAvLyBMb2FkIGVpdGhlciB0aGUgd2FzbSBvciBhc20uanMgdmVyc2lvbiBvZiB0aGUgTW9ubyBydW50aW1lXHJcbiAgY29uc3QgYnJvd3NlclN1cHBvcnRzTmF0aXZlV2ViQXNzZW1ibHkgPSB0eXBlb2YgV2ViQXNzZW1ibHkgIT09ICd1bmRlZmluZWQnICYmIFdlYkFzc2VtYmx5LnZhbGlkYXRlO1xyXG4gIGNvbnN0IG1vbm9SdW50aW1lVXJsQmFzZSA9ICdfZnJhbWV3b3JrLycgKyAoYnJvd3NlclN1cHBvcnRzTmF0aXZlV2ViQXNzZW1ibHkgPyAnd2FzbScgOiAnYXNtanMnKTtcclxuICBjb25zdCBtb25vUnVudGltZVNjcmlwdFVybCA9IGAke21vbm9SdW50aW1lVXJsQmFzZX0vbW9uby5qc2A7XHJcblxyXG4gIGlmICghYnJvd3NlclN1cHBvcnRzTmF0aXZlV2ViQXNzZW1ibHkpIHtcclxuICAgIC8vIEluIHRoZSBhc21qcyBjYXNlLCB0aGUgaW5pdGlhbCBtZW1vcnkgc3RydWN0dXJlIGlzIGluIGEgc2VwYXJhdGUgZmlsZSB3ZSBuZWVkIHRvIGRvd25sb2FkXHJcbiAgICBjb25zdCBtZW1pbml0WEhSID0gTW9kdWxlWydtZW1vcnlJbml0aWFsaXplclJlcXVlc3QnXSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgbWVtaW5pdFhIUi5vcGVuKCdHRVQnLCBgJHttb25vUnVudGltZVVybEJhc2V9L21vbm8uanMubWVtYCk7XHJcbiAgICBtZW1pbml0WEhSLnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcic7XHJcbiAgICBtZW1pbml0WEhSLnNlbmQobnVsbCk7XHJcbiAgfVxyXG5cclxuICBkb2N1bWVudC53cml0ZShgPHNjcmlwdCBkZWZlciBzcmM9XCIke21vbm9SdW50aW1lU2NyaXB0VXJsfVwiPjwvc2NyaXB0PmApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVFbXNjcmlwdGVuTW9kdWxlSW5zdGFuY2UobG9hZEFzc2VtYmx5VXJsczogc3RyaW5nW10sIG9uUmVhZHk6ICgpID0+IHZvaWQsIG9uRXJyb3I6IChyZWFzb24/OiBhbnkpID0+IHZvaWQpIHtcclxuICBjb25zdCBtb2R1bGUgPSB7fSBhcyB0eXBlb2YgTW9kdWxlO1xyXG4gIGNvbnN0IHdhc21CaW5hcnlGaWxlID0gJ19mcmFtZXdvcmsvd2FzbS9tb25vLndhc20nO1xyXG4gIGNvbnN0IGFzbWpzQ29kZUZpbGUgPSAnX2ZyYW1ld29yay9hc21qcy9tb25vLmFzbS5qcyc7XHJcblxyXG4gIG1vZHVsZS5wcmludCA9IGxpbmUgPT4gY29uc29sZS5sb2coYFdBU006ICR7bGluZX1gKTtcclxuICBtb2R1bGUucHJpbnRFcnIgPSBsaW5lID0+IGNvbnNvbGUuZXJyb3IoYFdBU006ICR7bGluZX1gKTtcclxuICBtb2R1bGUucHJlUnVuID0gW107XHJcbiAgbW9kdWxlLnBvc3RSdW4gPSBbXTtcclxuICBtb2R1bGUucHJlbG9hZFBsdWdpbnMgPSBbXTtcclxuXHJcbiAgbW9kdWxlLmxvY2F0ZUZpbGUgPSBmaWxlTmFtZSA9PiB7XHJcbiAgICBzd2l0Y2ggKGZpbGVOYW1lKSB7XHJcbiAgICAgIGNhc2UgJ21vbm8ud2FzbSc6IHJldHVybiB3YXNtQmluYXJ5RmlsZTtcclxuICAgICAgY2FzZSAnbW9uby5hc20uanMnOiByZXR1cm4gYXNtanNDb2RlRmlsZTtcclxuICAgICAgZGVmYXVsdDogcmV0dXJuIGZpbGVOYW1lO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIG1vZHVsZS5wcmVSdW4ucHVzaCgoKSA9PiB7XHJcbiAgICAvLyBCeSBub3csIGVtc2NyaXB0ZW4gc2hvdWxkIGJlIGluaXRpYWxpc2VkIGVub3VnaCB0aGF0IHdlIGNhbiBjYXB0dXJlIHRoZXNlIG1ldGhvZHMgZm9yIGxhdGVyIHVzZVxyXG4gICAgYXNzZW1ibHlfbG9hZCA9IE1vZHVsZS5jd3JhcCgnbW9ub193YXNtX2Fzc2VtYmx5X2xvYWQnLCAnbnVtYmVyJywgWydzdHJpbmcnXSk7XHJcbiAgICBmaW5kX2NsYXNzID0gTW9kdWxlLmN3cmFwKCdtb25vX3dhc21fYXNzZW1ibHlfZmluZF9jbGFzcycsICdudW1iZXInLCBbJ251bWJlcicsICdzdHJpbmcnLCAnc3RyaW5nJ10pO1xyXG4gICAgZmluZF9tZXRob2QgPSBNb2R1bGUuY3dyYXAoJ21vbm9fd2FzbV9hc3NlbWJseV9maW5kX21ldGhvZCcsICdudW1iZXInLCBbJ251bWJlcicsICdzdHJpbmcnLCAnbnVtYmVyJ10pO1xyXG4gICAgaW52b2tlX21ldGhvZCA9IE1vZHVsZS5jd3JhcCgnbW9ub193YXNtX2ludm9rZV9tZXRob2QnLCAnbnVtYmVyJywgWydudW1iZXInLCAnbnVtYmVyJywgJ251bWJlciddKTtcclxuICAgIG1vbm9fc3RyaW5nX2dldF91dGY4ID0gTW9kdWxlLmN3cmFwKCdtb25vX3dhc21fc3RyaW5nX2dldF91dGY4JywgJ251bWJlcicsIFsnbnVtYmVyJ10pO1xyXG4gICAgbW9ub19zdHJpbmcgPSBNb2R1bGUuY3dyYXAoJ21vbm9fd2FzbV9zdHJpbmdfZnJvbV9qcycsICdudW1iZXInLCBbJ3N0cmluZyddKTtcclxuXHJcbiAgICBNb2R1bGUuRlNfY3JlYXRlUGF0aCgnLycsICdhcHBCaW5EaXInLCB0cnVlLCB0cnVlKTtcclxuICAgIGxvYWRBc3NlbWJseVVybHMuZm9yRWFjaCh1cmwgPT5cclxuICAgICAgRlMuY3JlYXRlUHJlbG9hZGVkRmlsZSgnYXBwQmluRGlyJywgYCR7Z2V0QXNzZW1ibHlOYW1lRnJvbVVybCh1cmwpfS5kbGxgLCB1cmwsIHRydWUsIGZhbHNlLCB1bmRlZmluZWQsIG9uRXJyb3IpKTtcclxuICB9KTtcclxuXHJcbiAgbW9kdWxlLnBvc3RSdW4ucHVzaCgoKSA9PiB7XHJcbiAgICBjb25zdCBsb2FkX3J1bnRpbWUgPSBNb2R1bGUuY3dyYXAoJ21vbm9fd2FzbV9sb2FkX3J1bnRpbWUnLCBudWxsLCBbJ3N0cmluZyddKTtcclxuICAgIGxvYWRfcnVudGltZSgnYXBwQmluRGlyJyk7XHJcbiAgICBhdHRhY2hJbnRlcm9wSW52b2tlcigpO1xyXG4gICAgb25SZWFkeSgpO1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gbW9kdWxlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhc3luY0xvYWQodXJsLCBvbmxvYWQsIG9uZXJyb3IpIHtcclxuICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0O1xyXG4gIHhoci5vcGVuKCdHRVQnLCB1cmwsIC8qIGFzeW5jOiAqLyB0cnVlKTtcclxuICB4aHIucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcclxuICB4aHIub25sb2FkID0gZnVuY3Rpb24geGhyX29ubG9hZCgpIHtcclxuICAgIGlmICh4aHIuc3RhdHVzID09IDIwMCB8fCB4aHIuc3RhdHVzID09IDAgJiYgeGhyLnJlc3BvbnNlKSB7XHJcbiAgICAgIHZhciBhc20gPSBuZXcgVWludDhBcnJheSh4aHIucmVzcG9uc2UpO1xyXG4gICAgICBvbmxvYWQoYXNtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG9uZXJyb3IoeGhyKTtcclxuICAgIH1cclxuICB9O1xyXG4gIHhoci5vbmVycm9yID0gb25lcnJvcjtcclxuICB4aHIuc2VuZChudWxsKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0QXJyYXlEYXRhUG9pbnRlcjxUPihhcnJheTogU3lzdGVtX0FycmF5PFQ+KTogbnVtYmVyIHtcclxuICByZXR1cm4gPG51bWJlcj48YW55PmFycmF5ICsgMTI7IC8vIEZpcnN0IGJ5dGUgZnJvbSBoZXJlIGlzIGxlbmd0aCwgdGhlbiBmb2xsb3dpbmcgYnl0ZXMgYXJlIGVudHJpZXNcclxufVxyXG5cclxuZnVuY3Rpb24gYXR0YWNoSW50ZXJvcEludm9rZXIoKSB7XHJcbiAgY29uc3QgZG90TmV0RGlzcGF0Y2hlckludm9rZU1ldGhvZEhhbmRsZSA9IGZpbmRNZXRob2QoJ01pY3Jvc29mdC5KU0ludGVyb3AnLCAnTWljcm9zb2Z0LkpTSW50ZXJvcCcsICdEb3ROZXREaXNwYXRjaGVyJywgJ0ludm9rZScpO1xyXG4gIGNvbnN0IGRvdE5ldERpc3BhdGNoZXJCZWdpbkludm9rZU1ldGhvZEhhbmRsZSA9IGZpbmRNZXRob2QoJ01pY3Jvc29mdC5KU0ludGVyb3AnLCAnTWljcm9zb2Z0LkpTSW50ZXJvcCcsICdEb3ROZXREaXNwYXRjaGVyJywgJ0JlZ2luSW52b2tlJyk7XHJcblxyXG4gIERvdE5ldC5hdHRhY2hEaXNwYXRjaGVyKHtcclxuICAgIGJlZ2luSW52b2tlRG90TmV0RnJvbUpTOiAoY2FsbElkLCBhc3NlbWJseU5hbWUsIG1ldGhvZElkZW50aWZpZXIsIGFyZ3NKc29uKSA9PiB7XHJcbiAgICAgIG1vbm9QbGF0Zm9ybS5jYWxsTWV0aG9kKGRvdE5ldERpc3BhdGNoZXJCZWdpbkludm9rZU1ldGhvZEhhbmRsZSwgbnVsbCwgW1xyXG4gICAgICAgIGNhbGxJZCA/IG1vbm9QbGF0Zm9ybS50b0RvdE5ldFN0cmluZyhjYWxsSWQudG9TdHJpbmcoKSkgOiBudWxsLFxyXG4gICAgICAgIG1vbm9QbGF0Zm9ybS50b0RvdE5ldFN0cmluZyhhc3NlbWJseU5hbWUpLFxyXG4gICAgICAgIG1vbm9QbGF0Zm9ybS50b0RvdE5ldFN0cmluZyhtZXRob2RJZGVudGlmaWVyKSxcclxuICAgICAgICBtb25vUGxhdGZvcm0udG9Eb3ROZXRTdHJpbmcoYXJnc0pzb24pXHJcbiAgICAgIF0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbnZva2VEb3ROZXRGcm9tSlM6IChhc3NlbWJseU5hbWUsIG1ldGhvZElkZW50aWZpZXIsIGFyZ3NKc29uKSA9PiB7XHJcbiAgICAgIGNvbnN0IHJlc3VsdEpzb25TdHJpbmdQdHIgPSBtb25vUGxhdGZvcm0uY2FsbE1ldGhvZChkb3ROZXREaXNwYXRjaGVySW52b2tlTWV0aG9kSGFuZGxlLCBudWxsLCBbXHJcbiAgICAgICAgbW9ub1BsYXRmb3JtLnRvRG90TmV0U3RyaW5nKGFzc2VtYmx5TmFtZSksXHJcbiAgICAgICAgbW9ub1BsYXRmb3JtLnRvRG90TmV0U3RyaW5nKG1ldGhvZElkZW50aWZpZXIpLFxyXG4gICAgICAgIG1vbm9QbGF0Zm9ybS50b0RvdE5ldFN0cmluZyhhcmdzSnNvbilcclxuICAgICAgXSkgYXMgU3lzdGVtX1N0cmluZztcclxuICAgICAgcmV0dXJuIHJlc3VsdEpzb25TdHJpbmdQdHJcclxuICAgICAgICA/IEpTT04ucGFyc2UobW9ub1BsYXRmb3JtLnRvSmF2YVNjcmlwdFN0cmluZyhyZXN1bHRKc29uU3RyaW5nUHRyKSlcclxuICAgICAgICA6IG51bGw7XHJcbiAgICB9LFxyXG4gIH0pO1xyXG59XHJcbiIsImltcG9ydCB7IFN5c3RlbV9BcnJheSwgTWV0aG9kSGFuZGxlIH0gZnJvbSAnLi4vUGxhdGZvcm0vUGxhdGZvcm0nO1xyXG5pbXBvcnQgeyBSZW5kZXJCYXRjaCwgQXJyYXlTZWdtZW50LCBBcnJheVJhbmdlLCBSZW5kZXJUcmVlRWRpdCwgUmVuZGVyVHJlZUZyYW1lLCBFZGl0VHlwZSwgRnJhbWVUeXBlLCBBcnJheVZhbHVlcyB9IGZyb20gJy4vUmVuZGVyQmF0Y2gvUmVuZGVyQmF0Y2gnO1xyXG5pbXBvcnQgeyBwbGF0Zm9ybSB9IGZyb20gJy4uL0Vudmlyb25tZW50JztcclxuaW1wb3J0IHsgRXZlbnREZWxlZ2F0b3IgfSBmcm9tICcuL0V2ZW50RGVsZWdhdG9yJztcclxuaW1wb3J0IHsgRXZlbnRGb3JEb3ROZXQsIFVJRXZlbnRBcmdzIH0gZnJvbSAnLi9FdmVudEZvckRvdE5ldCc7XHJcbmltcG9ydCB7IExvZ2ljYWxFbGVtZW50LCB0b0xvZ2ljYWxFbGVtZW50LCBpbnNlcnRMb2dpY2FsQ2hpbGQsIHJlbW92ZUxvZ2ljYWxDaGlsZCwgZ2V0TG9naWNhbFBhcmVudCwgZ2V0TG9naWNhbENoaWxkLCBjcmVhdGVBbmRJbnNlcnRMb2dpY2FsQ29udGFpbmVyLCBpc1N2Z0VsZW1lbnQgfSBmcm9tICcuL0xvZ2ljYWxFbGVtZW50cyc7XHJcbmltcG9ydCB7IGFwcGx5Q2FwdHVyZUlkVG9FbGVtZW50IH0gZnJvbSAnLi9FbGVtZW50UmVmZXJlbmNlQ2FwdHVyZSc7XHJcbmNvbnN0IHNlbGVjdFZhbHVlUHJvcG5hbWUgPSAnX2JsYXpvclNlbGVjdFZhbHVlJztcclxubGV0IHJhaXNlRXZlbnRNZXRob2Q6IE1ldGhvZEhhbmRsZTtcclxubGV0IHJlbmRlckNvbXBvbmVudE1ldGhvZDogTWV0aG9kSGFuZGxlO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJyb3dzZXJSZW5kZXJlciB7XHJcbiAgcHJpdmF0ZSBldmVudERlbGVnYXRvcjogRXZlbnREZWxlZ2F0b3I7XHJcbiAgcHJpdmF0ZSBjaGlsZENvbXBvbmVudExvY2F0aW9uczogeyBbY29tcG9uZW50SWQ6IG51bWJlcl06IExvZ2ljYWxFbGVtZW50IH0gPSB7fTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBicm93c2VyUmVuZGVyZXJJZDogbnVtYmVyKSB7XHJcbiAgICB0aGlzLmV2ZW50RGVsZWdhdG9yID0gbmV3IEV2ZW50RGVsZWdhdG9yKChldmVudCwgY29tcG9uZW50SWQsIGV2ZW50SGFuZGxlcklkLCBldmVudEFyZ3MpID0+IHtcclxuICAgICAgcmFpc2VFdmVudChldmVudCwgdGhpcy5icm93c2VyUmVuZGVyZXJJZCwgY29tcG9uZW50SWQsIGV2ZW50SGFuZGxlcklkLCBldmVudEFyZ3MpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXR0YWNoUm9vdENvbXBvbmVudFRvRWxlbWVudChjb21wb25lbnRJZDogbnVtYmVyLCBlbGVtZW50OiBFbGVtZW50KSB7XHJcbiAgICB0aGlzLmF0dGFjaENvbXBvbmVudFRvRWxlbWVudChjb21wb25lbnRJZCwgdG9Mb2dpY2FsRWxlbWVudChlbGVtZW50KSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdXBkYXRlQ29tcG9uZW50KGJhdGNoOiBSZW5kZXJCYXRjaCwgY29tcG9uZW50SWQ6IG51bWJlciwgZWRpdHM6IEFycmF5U2VnbWVudDxSZW5kZXJUcmVlRWRpdD4sIHJlZmVyZW5jZUZyYW1lczogQXJyYXlWYWx1ZXM8UmVuZGVyVHJlZUZyYW1lPikge1xyXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuY2hpbGRDb21wb25lbnRMb2NhdGlvbnNbY29tcG9uZW50SWRdO1xyXG4gICAgaWYgKCFlbGVtZW50KSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gZWxlbWVudCBpcyBjdXJyZW50bHkgYXNzb2NpYXRlZCB3aXRoIGNvbXBvbmVudCAke2NvbXBvbmVudElkfWApO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYXBwbHlFZGl0cyhiYXRjaCwgY29tcG9uZW50SWQsIGVsZW1lbnQsIDAsIGVkaXRzLCByZWZlcmVuY2VGcmFtZXMpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRpc3Bvc2VDb21wb25lbnQoY29tcG9uZW50SWQ6IG51bWJlcikge1xyXG4gICAgZGVsZXRlIHRoaXMuY2hpbGRDb21wb25lbnRMb2NhdGlvbnNbY29tcG9uZW50SWRdO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRpc3Bvc2VFdmVudEhhbmRsZXIoZXZlbnRIYW5kbGVySWQ6IG51bWJlcikge1xyXG4gICAgdGhpcy5ldmVudERlbGVnYXRvci5yZW1vdmVMaXN0ZW5lcihldmVudEhhbmRsZXJJZCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGF0dGFjaENvbXBvbmVudFRvRWxlbWVudChjb21wb25lbnRJZDogbnVtYmVyLCBlbGVtZW50OiBMb2dpY2FsRWxlbWVudCkge1xyXG4gICAgdGhpcy5jaGlsZENvbXBvbmVudExvY2F0aW9uc1tjb21wb25lbnRJZF0gPSBlbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhcHBseUVkaXRzKGJhdGNoOiBSZW5kZXJCYXRjaCwgY29tcG9uZW50SWQ6IG51bWJlciwgcGFyZW50OiBMb2dpY2FsRWxlbWVudCwgY2hpbGRJbmRleDogbnVtYmVyLCBlZGl0czogQXJyYXlTZWdtZW50PFJlbmRlclRyZWVFZGl0PiwgcmVmZXJlbmNlRnJhbWVzOiBBcnJheVZhbHVlczxSZW5kZXJUcmVlRnJhbWU+KSB7XHJcbiAgICBsZXQgY3VycmVudERlcHRoID0gMDtcclxuICAgIGxldCBjaGlsZEluZGV4QXRDdXJyZW50RGVwdGggPSBjaGlsZEluZGV4O1xyXG5cclxuICAgIGNvbnN0IGFycmF5U2VnbWVudFJlYWRlciA9IGJhdGNoLmFycmF5U2VnbWVudFJlYWRlcjtcclxuICAgIGNvbnN0IGVkaXRSZWFkZXIgPSBiYXRjaC5lZGl0UmVhZGVyO1xyXG4gICAgY29uc3QgZnJhbWVSZWFkZXIgPSBiYXRjaC5mcmFtZVJlYWRlcjtcclxuICAgIGNvbnN0IGVkaXRzVmFsdWVzID0gYXJyYXlTZWdtZW50UmVhZGVyLnZhbHVlcyhlZGl0cyk7XHJcbiAgICBjb25zdCBlZGl0c09mZnNldCA9IGFycmF5U2VnbWVudFJlYWRlci5vZmZzZXQoZWRpdHMpO1xyXG4gICAgY29uc3QgZWRpdHNMZW5ndGggPSBhcnJheVNlZ21lbnRSZWFkZXIuY291bnQoZWRpdHMpO1xyXG4gICAgY29uc3QgbWF4RWRpdEluZGV4RXhjbCA9IGVkaXRzT2Zmc2V0ICsgZWRpdHNMZW5ndGg7XHJcblxyXG4gICAgZm9yIChsZXQgZWRpdEluZGV4ID0gZWRpdHNPZmZzZXQ7IGVkaXRJbmRleCA8IG1heEVkaXRJbmRleEV4Y2w7IGVkaXRJbmRleCsrKSB7XHJcbiAgICAgIGNvbnN0IGVkaXQgPSBiYXRjaC5kaWZmUmVhZGVyLmVkaXRzRW50cnkoZWRpdHNWYWx1ZXMsIGVkaXRJbmRleCk7XHJcbiAgICAgIGNvbnN0IGVkaXRUeXBlID0gZWRpdFJlYWRlci5lZGl0VHlwZShlZGl0KTtcclxuICAgICAgc3dpdGNoIChlZGl0VHlwZSkge1xyXG4gICAgICAgIGNhc2UgRWRpdFR5cGUucHJlcGVuZEZyYW1lOiB7XHJcbiAgICAgICAgICBjb25zdCBmcmFtZUluZGV4ID0gZWRpdFJlYWRlci5uZXdUcmVlSW5kZXgoZWRpdCk7XHJcbiAgICAgICAgICBjb25zdCBmcmFtZSA9IGJhdGNoLnJlZmVyZW5jZUZyYW1lc0VudHJ5KHJlZmVyZW5jZUZyYW1lcywgZnJhbWVJbmRleCk7XHJcbiAgICAgICAgICBjb25zdCBzaWJsaW5nSW5kZXggPSBlZGl0UmVhZGVyLnNpYmxpbmdJbmRleChlZGl0KTtcclxuICAgICAgICAgIHRoaXMuaW5zZXJ0RnJhbWUoYmF0Y2gsIGNvbXBvbmVudElkLCBwYXJlbnQsIGNoaWxkSW5kZXhBdEN1cnJlbnREZXB0aCArIHNpYmxpbmdJbmRleCwgcmVmZXJlbmNlRnJhbWVzLCBmcmFtZSwgZnJhbWVJbmRleCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBFZGl0VHlwZS5yZW1vdmVGcmFtZToge1xyXG4gICAgICAgICAgY29uc3Qgc2libGluZ0luZGV4ID0gZWRpdFJlYWRlci5zaWJsaW5nSW5kZXgoZWRpdCk7XHJcbiAgICAgICAgICByZW1vdmVMb2dpY2FsQ2hpbGQocGFyZW50LCBjaGlsZEluZGV4QXRDdXJyZW50RGVwdGggKyBzaWJsaW5nSW5kZXgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgRWRpdFR5cGUuc2V0QXR0cmlidXRlOiB7XHJcbiAgICAgICAgICBjb25zdCBmcmFtZUluZGV4ID0gZWRpdFJlYWRlci5uZXdUcmVlSW5kZXgoZWRpdCk7XHJcbiAgICAgICAgICBjb25zdCBmcmFtZSA9IGJhdGNoLnJlZmVyZW5jZUZyYW1lc0VudHJ5KHJlZmVyZW5jZUZyYW1lcywgZnJhbWVJbmRleCk7XHJcbiAgICAgICAgICBjb25zdCBzaWJsaW5nSW5kZXggPSBlZGl0UmVhZGVyLnNpYmxpbmdJbmRleChlZGl0KTtcclxuICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBnZXRMb2dpY2FsQ2hpbGQocGFyZW50LCBjaGlsZEluZGV4QXRDdXJyZW50RGVwdGggKyBzaWJsaW5nSW5kZXgpO1xyXG4gICAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLmFwcGx5QXR0cmlidXRlKGJhdGNoLCBjb21wb25lbnRJZCwgZWxlbWVudCwgZnJhbWUpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3Qgc2V0IGF0dHJpYnV0ZSBvbiBub24tZWxlbWVudCBjaGlsZGApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgRWRpdFR5cGUucmVtb3ZlQXR0cmlidXRlOiB7XHJcbiAgICAgICAgICAvLyBOb3RlIHRoYXQgd2UgZG9uJ3QgaGF2ZSB0byBkaXNwb3NlIHRoZSBpbmZvIHdlIHRyYWNrIGFib3V0IGV2ZW50IGhhbmRsZXJzIGhlcmUsIGJlY2F1c2UgdGhlXHJcbiAgICAgICAgICAvLyBkaXNwb3NlZCBldmVudCBoYW5kbGVyIElEcyBhcmUgZGVsaXZlcmVkIHNlcGFyYXRlbHkgKGluIHRoZSAnZGlzcG9zZWRFdmVudEhhbmRsZXJJZHMnIGFycmF5KVxyXG4gICAgICAgICAgY29uc3Qgc2libGluZ0luZGV4ID0gZWRpdFJlYWRlci5zaWJsaW5nSW5kZXgoZWRpdCk7XHJcbiAgICAgICAgICBjb25zdCBlbGVtZW50ID0gZ2V0TG9naWNhbENoaWxkKHBhcmVudCwgY2hpbGRJbmRleEF0Q3VycmVudERlcHRoICsgc2libGluZ0luZGV4KTtcclxuICAgICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgY29uc3QgYXR0cmlidXRlTmFtZSA9IGVkaXRSZWFkZXIucmVtb3ZlZEF0dHJpYnV0ZU5hbWUoZWRpdCkhO1xyXG4gICAgICAgICAgICAvLyBGaXJzdCB0cnkgdG8gcmVtb3ZlIGFueSBzcGVjaWFsIHByb3BlcnR5IHdlIHVzZSBmb3IgdGhpcyBhdHRyaWJ1dGVcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnRyeUFwcGx5U3BlY2lhbFByb3BlcnR5KGJhdGNoLCBlbGVtZW50LCBhdHRyaWJ1dGVOYW1lLCBudWxsKSkge1xyXG4gICAgICAgICAgICAgIC8vIElmIHRoYXQncyBub3QgYXBwbGljYWJsZSwgaXQncyBhIHJlZ3VsYXIgRE9NIGF0dHJpYnV0ZSBzbyByZW1vdmUgdGhhdFxyXG4gICAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCByZW1vdmUgYXR0cmlidXRlIGZyb20gbm9uLWVsZW1lbnQgY2hpbGRgKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIEVkaXRUeXBlLnVwZGF0ZVRleHQ6IHtcclxuICAgICAgICAgIGNvbnN0IGZyYW1lSW5kZXggPSBlZGl0UmVhZGVyLm5ld1RyZWVJbmRleChlZGl0KTtcclxuICAgICAgICAgIGNvbnN0IGZyYW1lID0gYmF0Y2gucmVmZXJlbmNlRnJhbWVzRW50cnkocmVmZXJlbmNlRnJhbWVzLCBmcmFtZUluZGV4KTtcclxuICAgICAgICAgIGNvbnN0IHNpYmxpbmdJbmRleCA9IGVkaXRSZWFkZXIuc2libGluZ0luZGV4KGVkaXQpO1xyXG4gICAgICAgICAgY29uc3QgdGV4dE5vZGUgPSBnZXRMb2dpY2FsQ2hpbGQocGFyZW50LCBjaGlsZEluZGV4QXRDdXJyZW50RGVwdGggKyBzaWJsaW5nSW5kZXgpO1xyXG4gICAgICAgICAgaWYgKHRleHROb2RlIGluc3RhbmNlb2YgVGV4dCkge1xyXG4gICAgICAgICAgICB0ZXh0Tm9kZS50ZXh0Q29udGVudCA9IGZyYW1lUmVhZGVyLnRleHRDb250ZW50KGZyYW1lKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHNldCB0ZXh0IGNvbnRlbnQgb24gbm9uLXRleHQgY2hpbGRgKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIEVkaXRUeXBlLnN0ZXBJbjoge1xyXG4gICAgICAgICAgY29uc3Qgc2libGluZ0luZGV4ID0gZWRpdFJlYWRlci5zaWJsaW5nSW5kZXgoZWRpdCk7XHJcbiAgICAgICAgICBwYXJlbnQgPSBnZXRMb2dpY2FsQ2hpbGQocGFyZW50LCBjaGlsZEluZGV4QXRDdXJyZW50RGVwdGggKyBzaWJsaW5nSW5kZXgpO1xyXG4gICAgICAgICAgY3VycmVudERlcHRoKys7XHJcbiAgICAgICAgICBjaGlsZEluZGV4QXRDdXJyZW50RGVwdGggPSAwO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgRWRpdFR5cGUuc3RlcE91dDoge1xyXG4gICAgICAgICAgcGFyZW50ID0gZ2V0TG9naWNhbFBhcmVudChwYXJlbnQpITtcclxuICAgICAgICAgIGN1cnJlbnREZXB0aC0tO1xyXG4gICAgICAgICAgY2hpbGRJbmRleEF0Q3VycmVudERlcHRoID0gY3VycmVudERlcHRoID09PSAwID8gY2hpbGRJbmRleCA6IDA7IC8vIFRoZSBjaGlsZEluZGV4IGlzIG9ubHkgZXZlciBub256ZXJvIGF0IHplcm8gZGVwdGhcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICBjb25zdCB1bmtub3duVHlwZTogbmV2ZXIgPSBlZGl0VHlwZTsgLy8gQ29tcGlsZS10aW1lIHZlcmlmaWNhdGlvbiB0aGF0IHRoZSBzd2l0Y2ggd2FzIGV4aGF1c3RpdmVcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBlZGl0IHR5cGU6ICR7dW5rbm93blR5cGV9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluc2VydEZyYW1lKGJhdGNoOiBSZW5kZXJCYXRjaCwgY29tcG9uZW50SWQ6IG51bWJlciwgcGFyZW50OiBMb2dpY2FsRWxlbWVudCwgY2hpbGRJbmRleDogbnVtYmVyLCBmcmFtZXM6IEFycmF5VmFsdWVzPFJlbmRlclRyZWVGcmFtZT4sIGZyYW1lOiBSZW5kZXJUcmVlRnJhbWUsIGZyYW1lSW5kZXg6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICBjb25zdCBmcmFtZVJlYWRlciA9IGJhdGNoLmZyYW1lUmVhZGVyO1xyXG4gICAgY29uc3QgZnJhbWVUeXBlID0gZnJhbWVSZWFkZXIuZnJhbWVUeXBlKGZyYW1lKTtcclxuICAgIHN3aXRjaCAoZnJhbWVUeXBlKSB7XHJcbiAgICAgIGNhc2UgRnJhbWVUeXBlLmVsZW1lbnQ6XHJcbiAgICAgICAgdGhpcy5pbnNlcnRFbGVtZW50KGJhdGNoLCBjb21wb25lbnRJZCwgcGFyZW50LCBjaGlsZEluZGV4LCBmcmFtZXMsIGZyYW1lLCBmcmFtZUluZGV4KTtcclxuICAgICAgICByZXR1cm4gMTtcclxuICAgICAgY2FzZSBGcmFtZVR5cGUudGV4dDpcclxuICAgICAgICB0aGlzLmluc2VydFRleHQoYmF0Y2gsIHBhcmVudCwgY2hpbGRJbmRleCwgZnJhbWUpO1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgICBjYXNlIEZyYW1lVHlwZS5hdHRyaWJ1dGU6XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdHRyaWJ1dGUgZnJhbWVzIHNob3VsZCBvbmx5IGJlIHByZXNlbnQgYXMgbGVhZGluZyBjaGlsZHJlbiBvZiBlbGVtZW50IGZyYW1lcy4nKTtcclxuICAgICAgY2FzZSBGcmFtZVR5cGUuY29tcG9uZW50OlxyXG4gICAgICAgIHRoaXMuaW5zZXJ0Q29tcG9uZW50KGJhdGNoLCBwYXJlbnQsIGNoaWxkSW5kZXgsIGZyYW1lKTtcclxuICAgICAgICByZXR1cm4gMTtcclxuICAgICAgY2FzZSBGcmFtZVR5cGUucmVnaW9uOlxyXG4gICAgICAgIHJldHVybiB0aGlzLmluc2VydEZyYW1lUmFuZ2UoYmF0Y2gsIGNvbXBvbmVudElkLCBwYXJlbnQsIGNoaWxkSW5kZXgsIGZyYW1lcywgZnJhbWVJbmRleCArIDEsIGZyYW1lSW5kZXggKyBmcmFtZVJlYWRlci5zdWJ0cmVlTGVuZ3RoKGZyYW1lKSk7XHJcbiAgICAgIGNhc2UgRnJhbWVUeXBlLmVsZW1lbnRSZWZlcmVuY2VDYXB0dXJlOlxyXG4gICAgICAgIGlmIChwYXJlbnQgaW5zdGFuY2VvZiBFbGVtZW50KSB7XHJcbiAgICAgICAgICBhcHBseUNhcHR1cmVJZFRvRWxlbWVudChwYXJlbnQsIGZyYW1lUmVhZGVyLmVsZW1lbnRSZWZlcmVuY2VDYXB0dXJlSWQoZnJhbWUpKTtcclxuICAgICAgICAgIHJldHVybiAwOyAvLyBBIFwiY2FwdHVyZVwiIGlzIGEgY2hpbGQgaW4gdGhlIGRpZmYsIGJ1dCBoYXMgbm8gbm9kZSBpbiB0aGUgRE9NXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUmVmZXJlbmNlIGNhcHR1cmUgZnJhbWVzIGNhbiBvbmx5IGJlIGNoaWxkcmVuIG9mIGVsZW1lbnQgZnJhbWVzLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBjb25zdCB1bmtub3duVHlwZTogbmV2ZXIgPSBmcmFtZVR5cGU7IC8vIENvbXBpbGUtdGltZSB2ZXJpZmljYXRpb24gdGhhdCB0aGUgc3dpdGNoIHdhcyBleGhhdXN0aXZlXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGZyYW1lIHR5cGU6ICR7dW5rbm93blR5cGV9YCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluc2VydEVsZW1lbnQoYmF0Y2g6IFJlbmRlckJhdGNoLCBjb21wb25lbnRJZDogbnVtYmVyLCBwYXJlbnQ6IExvZ2ljYWxFbGVtZW50LCBjaGlsZEluZGV4OiBudW1iZXIsIGZyYW1lczogQXJyYXlWYWx1ZXM8UmVuZGVyVHJlZUZyYW1lPiwgZnJhbWU6IFJlbmRlclRyZWVGcmFtZSwgZnJhbWVJbmRleDogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBmcmFtZVJlYWRlciA9IGJhdGNoLmZyYW1lUmVhZGVyO1xyXG4gICAgY29uc3QgdGFnTmFtZSA9IGZyYW1lUmVhZGVyLmVsZW1lbnROYW1lKGZyYW1lKSE7XHJcbiAgICBjb25zdCBuZXdEb21FbGVtZW50UmF3ID0gdGFnTmFtZSA9PT0gJ3N2ZycgfHwgaXNTdmdFbGVtZW50KHBhcmVudCkgP1xyXG4gICAgICBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgdGFnTmFtZSkgOlxyXG4gICAgICBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpO1xyXG4gICAgY29uc3QgbmV3RWxlbWVudCA9IHRvTG9naWNhbEVsZW1lbnQobmV3RG9tRWxlbWVudFJhdyk7XHJcbiAgICBpbnNlcnRMb2dpY2FsQ2hpbGQobmV3RG9tRWxlbWVudFJhdywgcGFyZW50LCBjaGlsZEluZGV4KTtcclxuXHJcbiAgICAvLyBBcHBseSBhdHRyaWJ1dGVzXHJcbiAgICBjb25zdCBkZXNjZW5kYW50c0VuZEluZGV4RXhjbCA9IGZyYW1lSW5kZXggKyBmcmFtZVJlYWRlci5zdWJ0cmVlTGVuZ3RoKGZyYW1lKTtcclxuICAgIGZvciAobGV0IGRlc2NlbmRhbnRJbmRleCA9IGZyYW1lSW5kZXggKyAxOyBkZXNjZW5kYW50SW5kZXggPCBkZXNjZW5kYW50c0VuZEluZGV4RXhjbDsgZGVzY2VuZGFudEluZGV4KyspIHtcclxuICAgICAgY29uc3QgZGVzY2VuZGFudEZyYW1lID0gYmF0Y2gucmVmZXJlbmNlRnJhbWVzRW50cnkoZnJhbWVzLCBkZXNjZW5kYW50SW5kZXgpO1xyXG4gICAgICBpZiAoZnJhbWVSZWFkZXIuZnJhbWVUeXBlKGRlc2NlbmRhbnRGcmFtZSkgPT09IEZyYW1lVHlwZS5hdHRyaWJ1dGUpIHtcclxuICAgICAgICB0aGlzLmFwcGx5QXR0cmlidXRlKGJhdGNoLCBjb21wb25lbnRJZCwgbmV3RG9tRWxlbWVudFJhdywgZGVzY2VuZGFudEZyYW1lKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBBcyBzb29uIGFzIHdlIHNlZSBhIG5vbi1hdHRyaWJ1dGUgY2hpbGQsIGFsbCB0aGUgc3Vic2VxdWVudCBjaGlsZCBmcmFtZXMgYXJlXHJcbiAgICAgICAgLy8gbm90IGF0dHJpYnV0ZXMsIHNvIGJhaWwgb3V0IGFuZCBpbnNlcnQgdGhlIHJlbW5hbnRzIHJlY3Vyc2l2ZWx5XHJcbiAgICAgICAgdGhpcy5pbnNlcnRGcmFtZVJhbmdlKGJhdGNoLCBjb21wb25lbnRJZCwgbmV3RWxlbWVudCwgMCwgZnJhbWVzLCBkZXNjZW5kYW50SW5kZXgsIGRlc2NlbmRhbnRzRW5kSW5kZXhFeGNsKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbnNlcnRDb21wb25lbnQoYmF0Y2g6IFJlbmRlckJhdGNoLCBwYXJlbnQ6IExvZ2ljYWxFbGVtZW50LCBjaGlsZEluZGV4OiBudW1iZXIsIGZyYW1lOiBSZW5kZXJUcmVlRnJhbWUpIHtcclxuICAgIGNvbnN0IGNvbnRhaW5lckVsZW1lbnQgPSBjcmVhdGVBbmRJbnNlcnRMb2dpY2FsQ29udGFpbmVyKHBhcmVudCwgY2hpbGRJbmRleCk7XHJcblxyXG4gICAgLy8gQWxsIHdlIGhhdmUgdG8gZG8gaXMgYXNzb2NpYXRlIHRoZSBjaGlsZCBjb21wb25lbnQgSUQgd2l0aCBpdHMgbG9jYXRpb24uIFdlIGRvbid0IGFjdHVhbGx5XHJcbiAgICAvLyBkbyBhbnkgcmVuZGVyaW5nIGhlcmUsIGJlY2F1c2UgdGhlIGRpZmYgZm9yIHRoZSBjaGlsZCB3aWxsIGFwcGVhciBsYXRlciBpbiB0aGUgcmVuZGVyIGJhdGNoLlxyXG4gICAgY29uc3QgY2hpbGRDb21wb25lbnRJZCA9IGJhdGNoLmZyYW1lUmVhZGVyLmNvbXBvbmVudElkKGZyYW1lKTtcclxuICAgIHRoaXMuYXR0YWNoQ29tcG9uZW50VG9FbGVtZW50KGNoaWxkQ29tcG9uZW50SWQsIGNvbnRhaW5lckVsZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbnNlcnRUZXh0KGJhdGNoOiBSZW5kZXJCYXRjaCwgcGFyZW50OiBMb2dpY2FsRWxlbWVudCwgY2hpbGRJbmRleDogbnVtYmVyLCB0ZXh0RnJhbWU6IFJlbmRlclRyZWVGcmFtZSkge1xyXG4gICAgY29uc3QgdGV4dENvbnRlbnQgPSBiYXRjaC5mcmFtZVJlYWRlci50ZXh0Q29udGVudCh0ZXh0RnJhbWUpITtcclxuICAgIGNvbnN0IG5ld1RleHROb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dENvbnRlbnQpO1xyXG4gICAgaW5zZXJ0TG9naWNhbENoaWxkKG5ld1RleHROb2RlLCBwYXJlbnQsIGNoaWxkSW5kZXgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhcHBseUF0dHJpYnV0ZShiYXRjaDogUmVuZGVyQmF0Y2gsIGNvbXBvbmVudElkOiBudW1iZXIsIHRvRG9tRWxlbWVudDogRWxlbWVudCwgYXR0cmlidXRlRnJhbWU6IFJlbmRlclRyZWVGcmFtZSkge1xyXG4gICAgY29uc3QgZnJhbWVSZWFkZXIgPSBiYXRjaC5mcmFtZVJlYWRlcjtcclxuICAgIGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSBmcmFtZVJlYWRlci5hdHRyaWJ1dGVOYW1lKGF0dHJpYnV0ZUZyYW1lKSE7XHJcbiAgICBjb25zdCBicm93c2VyUmVuZGVyZXJJZCA9IHRoaXMuYnJvd3NlclJlbmRlcmVySWQ7XHJcbiAgICBjb25zdCBldmVudEhhbmRsZXJJZCA9IGZyYW1lUmVhZGVyLmF0dHJpYnV0ZUV2ZW50SGFuZGxlcklkKGF0dHJpYnV0ZUZyYW1lKTtcclxuXHJcbiAgICBpZiAoZXZlbnRIYW5kbGVySWQpIHtcclxuICAgICAgY29uc3QgZmlyc3RUd29DaGFycyA9IGF0dHJpYnV0ZU5hbWUuc3Vic3RyaW5nKDAsIDIpO1xyXG4gICAgICBjb25zdCBldmVudE5hbWUgPSBhdHRyaWJ1dGVOYW1lLnN1YnN0cmluZygyKTtcclxuICAgICAgaWYgKGZpcnN0VHdvQ2hhcnMgIT09ICdvbicgfHwgIWV2ZW50TmFtZSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQXR0cmlidXRlIGhhcyBub256ZXJvIGV2ZW50IGhhbmRsZXIgSUQsIGJ1dCBhdHRyaWJ1dGUgbmFtZSAnJHthdHRyaWJ1dGVOYW1lfScgZG9lcyBub3Qgc3RhcnQgd2l0aCAnb24nLmApO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuZXZlbnREZWxlZ2F0b3Iuc2V0TGlzdGVuZXIodG9Eb21FbGVtZW50LCBldmVudE5hbWUsIGNvbXBvbmVudElkLCBldmVudEhhbmRsZXJJZCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBGaXJzdCBzZWUgaWYgd2UgaGF2ZSBzcGVjaWFsIGhhbmRsaW5nIGZvciB0aGlzIGF0dHJpYnV0ZVxyXG4gICAgaWYgKCF0aGlzLnRyeUFwcGx5U3BlY2lhbFByb3BlcnR5KGJhdGNoLCB0b0RvbUVsZW1lbnQsIGF0dHJpYnV0ZU5hbWUsIGF0dHJpYnV0ZUZyYW1lKSkge1xyXG4gICAgICAvLyBJZiBub3QsIHRyZWF0IGl0IGFzIGEgcmVndWxhciBzdHJpbmctdmFsdWVkIGF0dHJpYnV0ZVxyXG4gICAgICB0b0RvbUVsZW1lbnQuc2V0QXR0cmlidXRlKFxyXG4gICAgICAgIGF0dHJpYnV0ZU5hbWUsXHJcbiAgICAgICAgZnJhbWVSZWFkZXIuYXR0cmlidXRlVmFsdWUoYXR0cmlidXRlRnJhbWUpIVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB0cnlBcHBseVNwZWNpYWxQcm9wZXJ0eShiYXRjaDogUmVuZGVyQmF0Y2gsIGVsZW1lbnQ6IEVsZW1lbnQsIGF0dHJpYnV0ZU5hbWU6IHN0cmluZywgYXR0cmlidXRlRnJhbWU6IFJlbmRlclRyZWVGcmFtZSB8IG51bGwpIHtcclxuICAgIHN3aXRjaCAoYXR0cmlidXRlTmFtZSkge1xyXG4gICAgICBjYXNlICd2YWx1ZSc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5QXBwbHlWYWx1ZVByb3BlcnR5KGJhdGNoLCBlbGVtZW50LCBhdHRyaWJ1dGVGcmFtZSk7XHJcbiAgICAgIGNhc2UgJ2NoZWNrZWQnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLnRyeUFwcGx5Q2hlY2tlZFByb3BlcnR5KGJhdGNoLCBlbGVtZW50LCBhdHRyaWJ1dGVGcmFtZSk7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB0cnlBcHBseVZhbHVlUHJvcGVydHkoYmF0Y2g6IFJlbmRlckJhdGNoLCBlbGVtZW50OiBFbGVtZW50LCBhdHRyaWJ1dGVGcmFtZTogUmVuZGVyVHJlZUZyYW1lIHwgbnVsbCkge1xyXG4gICAgLy8gQ2VydGFpbiBlbGVtZW50cyBoYXZlIGJ1aWx0LWluIGJlaGF2aW91ciBmb3IgdGhlaXIgJ3ZhbHVlJyBwcm9wZXJ0eVxyXG4gICAgY29uc3QgZnJhbWVSZWFkZXIgPSBiYXRjaC5mcmFtZVJlYWRlcjtcclxuICAgIHN3aXRjaCAoZWxlbWVudC50YWdOYW1lKSB7XHJcbiAgICAgIGNhc2UgJ0lOUFVUJzpcclxuICAgICAgY2FzZSAnU0VMRUNUJzpcclxuICAgICAgY2FzZSAnVEVYVEFSRUEnOiB7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBhdHRyaWJ1dGVGcmFtZSA/IGZyYW1lUmVhZGVyLmF0dHJpYnV0ZVZhbHVlKGF0dHJpYnV0ZUZyYW1lKSA6IG51bGw7XHJcbiAgICAgICAgKGVsZW1lbnQgYXMgYW55KS52YWx1ZSA9IHZhbHVlO1xyXG5cclxuICAgICAgICBpZiAoZWxlbWVudC50YWdOYW1lID09PSAnU0VMRUNUJykge1xyXG4gICAgICAgICAgLy8gPHNlbGVjdD4gaXMgc3BlY2lhbCwgaW4gdGhhdCBhbnl0aGluZyB3ZSB3cml0ZSB0byAudmFsdWUgd2lsbCBiZSBsb3N0IGlmIHRoZXJlXHJcbiAgICAgICAgICAvLyBpc24ndCB5ZXQgYSBtYXRjaGluZyA8b3B0aW9uPi4gVG8gbWFpbnRhaW4gdGhlIGV4cGVjdGVkIGJlaGF2aW9yIG5vIG1hdHRlciB0aGVcclxuICAgICAgICAgIC8vIGVsZW1lbnQgaW5zZXJ0aW9uL3VwZGF0ZSBvcmRlciwgcHJlc2VydmUgdGhlIGRlc2lyZWQgdmFsdWUgc2VwYXJhdGVseSBzb1xyXG4gICAgICAgICAgLy8gd2UgY2FuIHJlY292ZXIgaXQgd2hlbiBpbnNlcnRpbmcgYW55IG1hdGNoaW5nIDxvcHRpb24+LlxyXG4gICAgICAgICAgZWxlbWVudFtzZWxlY3RWYWx1ZVByb3BuYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBjYXNlICdPUFRJT04nOiB7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBhdHRyaWJ1dGVGcmFtZSA/IGZyYW1lUmVhZGVyLmF0dHJpYnV0ZVZhbHVlKGF0dHJpYnV0ZUZyYW1lKSA6IG51bGw7XHJcbiAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgndmFsdWUnLCB2YWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCd2YWx1ZScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBTZWUgYWJvdmUgZm9yIHdoeSB3ZSBoYXZlIHRoaXMgc3BlY2lhbCBoYW5kbGluZyBmb3IgPHNlbGVjdD4vPG9wdGlvbj5cclxuICAgICAgICBjb25zdCBwYXJlbnRFbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgIGlmIChwYXJlbnRFbGVtZW50ICYmIChzZWxlY3RWYWx1ZVByb3BuYW1lIGluIHBhcmVudEVsZW1lbnQpICYmIHBhcmVudEVsZW1lbnRbc2VsZWN0VmFsdWVQcm9wbmFtZV0gPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICB0aGlzLnRyeUFwcGx5VmFsdWVQcm9wZXJ0eShiYXRjaCwgcGFyZW50RWxlbWVudCwgYXR0cmlidXRlRnJhbWUpO1xyXG4gICAgICAgICAgZGVsZXRlIHBhcmVudEVsZW1lbnRbc2VsZWN0VmFsdWVQcm9wbmFtZV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB0cnlBcHBseUNoZWNrZWRQcm9wZXJ0eShiYXRjaDogUmVuZGVyQmF0Y2gsIGVsZW1lbnQ6IEVsZW1lbnQsIGF0dHJpYnV0ZUZyYW1lOiBSZW5kZXJUcmVlRnJhbWUgfCBudWxsKSB7XHJcbiAgICAvLyBDZXJ0YWluIGVsZW1lbnRzIGhhdmUgYnVpbHQtaW4gYmVoYXZpb3VyIGZvciB0aGVpciAnY2hlY2tlZCcgcHJvcGVydHlcclxuICAgIGlmIChlbGVtZW50LnRhZ05hbWUgPT09ICdJTlBVVCcpIHtcclxuICAgICAgY29uc3QgdmFsdWUgPSBhdHRyaWJ1dGVGcmFtZSA/IGJhdGNoLmZyYW1lUmVhZGVyLmF0dHJpYnV0ZVZhbHVlKGF0dHJpYnV0ZUZyYW1lKSA6IG51bGw7XHJcbiAgICAgIChlbGVtZW50IGFzIGFueSkuY2hlY2tlZCA9IHZhbHVlICE9PSBudWxsO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgaW5zZXJ0RnJhbWVSYW5nZShiYXRjaDogUmVuZGVyQmF0Y2gsIGNvbXBvbmVudElkOiBudW1iZXIsIHBhcmVudDogTG9naWNhbEVsZW1lbnQsIGNoaWxkSW5kZXg6IG51bWJlciwgZnJhbWVzOiBBcnJheVZhbHVlczxSZW5kZXJUcmVlRnJhbWU+LCBzdGFydEluZGV4OiBudW1iZXIsIGVuZEluZGV4RXhjbDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IG9yaWdDaGlsZEluZGV4ID0gY2hpbGRJbmRleDtcclxuICAgIGZvciAobGV0IGluZGV4ID0gc3RhcnRJbmRleDsgaW5kZXggPCBlbmRJbmRleEV4Y2w7IGluZGV4KyspIHtcclxuICAgICAgY29uc3QgZnJhbWUgPSBiYXRjaC5yZWZlcmVuY2VGcmFtZXNFbnRyeShmcmFtZXMsIGluZGV4KTtcclxuICAgICAgY29uc3QgbnVtQ2hpbGRyZW5JbnNlcnRlZCA9IHRoaXMuaW5zZXJ0RnJhbWUoYmF0Y2gsIGNvbXBvbmVudElkLCBwYXJlbnQsIGNoaWxkSW5kZXgsIGZyYW1lcywgZnJhbWUsIGluZGV4KTtcclxuICAgICAgY2hpbGRJbmRleCArPSBudW1DaGlsZHJlbkluc2VydGVkO1xyXG5cclxuICAgICAgLy8gU2tpcCBvdmVyIGFueSBkZXNjZW5kYW50cywgc2luY2UgdGhleSBhcmUgYWxyZWFkeSBkZWFsdCB3aXRoIHJlY3Vyc2l2ZWx5XHJcbiAgICAgIGluZGV4ICs9IGNvdW50RGVzY2VuZGFudEZyYW1lcyhiYXRjaCwgZnJhbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAoY2hpbGRJbmRleCAtIG9yaWdDaGlsZEluZGV4KTsgLy8gVG90YWwgbnVtYmVyIG9mIGNoaWxkcmVuIGluc2VydGVkXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjb3VudERlc2NlbmRhbnRGcmFtZXMoYmF0Y2g6IFJlbmRlckJhdGNoLCBmcmFtZTogUmVuZGVyVHJlZUZyYW1lKTogbnVtYmVyIHtcclxuICBjb25zdCBmcmFtZVJlYWRlciA9IGJhdGNoLmZyYW1lUmVhZGVyO1xyXG4gIHN3aXRjaCAoZnJhbWVSZWFkZXIuZnJhbWVUeXBlKGZyYW1lKSkge1xyXG4gICAgLy8gVGhlIGZvbGxvd2luZyBmcmFtZSB0eXBlcyBoYXZlIGEgc3VidHJlZSBsZW5ndGguIE90aGVyIGZyYW1lcyBtYXkgdXNlIHRoYXQgbWVtb3J5IHNsb3RcclxuICAgIC8vIHRvIG1lYW4gc29tZXRoaW5nIGVsc2UsIHNvIHdlIG11c3Qgbm90IHJlYWQgaXQuIFdlIHNob3VsZCBjb25zaWRlciBoYXZpbmcgbm9taW5hbCBzdWJ0eXBlc1xyXG4gICAgLy8gb2YgUmVuZGVyVHJlZUZyYW1lUG9pbnRlciB0aGF0IHByZXZlbnQgYWNjZXNzIHRvIG5vbi1hcHBsaWNhYmxlIGZpZWxkcy5cclxuICAgIGNhc2UgRnJhbWVUeXBlLmNvbXBvbmVudDpcclxuICAgIGNhc2UgRnJhbWVUeXBlLmVsZW1lbnQ6XHJcbiAgICBjYXNlIEZyYW1lVHlwZS5yZWdpb246XHJcbiAgICAgIHJldHVybiBmcmFtZVJlYWRlci5zdWJ0cmVlTGVuZ3RoKGZyYW1lKSAtIDE7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gMDtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJhaXNlRXZlbnQoZXZlbnQ6IEV2ZW50LCBicm93c2VyUmVuZGVyZXJJZDogbnVtYmVyLCBjb21wb25lbnRJZDogbnVtYmVyLCBldmVudEhhbmRsZXJJZDogbnVtYmVyLCBldmVudEFyZ3M6IEV2ZW50Rm9yRG90TmV0PFVJRXZlbnRBcmdzPikge1xyXG4gIGlmICghcmFpc2VFdmVudE1ldGhvZCkge1xyXG4gICAgcmFpc2VFdmVudE1ldGhvZCA9IHBsYXRmb3JtLmZpbmRNZXRob2QoXHJcbiAgICAgICdNaWNyb3NvZnQuQXNwTmV0Q29yZS5CbGF6b3IuQnJvd3NlcicsICdNaWNyb3NvZnQuQXNwTmV0Q29yZS5CbGF6b3IuQnJvd3Nlci5SZW5kZXJpbmcnLCAnQnJvd3NlclJlbmRlcmVyRXZlbnREaXNwYXRjaGVyJywgJ0Rpc3BhdGNoRXZlbnQnXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZXZlbnREZXNjcmlwdG9yID0ge1xyXG4gICAgYnJvd3NlclJlbmRlcmVySWQsXHJcbiAgICBjb21wb25lbnRJZCxcclxuICAgIGV2ZW50SGFuZGxlcklkLFxyXG4gICAgZXZlbnRBcmdzVHlwZTogZXZlbnRBcmdzLnR5cGVcclxuICB9O1xyXG5cclxuICBwbGF0Zm9ybS5jYWxsTWV0aG9kKHJhaXNlRXZlbnRNZXRob2QsIG51bGwsIFtcclxuICAgIHBsYXRmb3JtLnRvRG90TmV0U3RyaW5nKEpTT04uc3RyaW5naWZ5KGV2ZW50RGVzY3JpcHRvcikpLFxyXG4gICAgcGxhdGZvcm0udG9Eb3ROZXRTdHJpbmcoSlNPTi5zdHJpbmdpZnkoZXZlbnRBcmdzLmRhdGEpKVxyXG4gIF0pO1xyXG59XHJcbiIsImV4cG9ydCBmdW5jdGlvbiBhcHBseUNhcHR1cmVJZFRvRWxlbWVudChlbGVtZW50OiBFbGVtZW50LCByZWZlcmVuY2VDYXB0dXJlSWQ6IG51bWJlcikge1xyXG4gIGVsZW1lbnQuc2V0QXR0cmlidXRlKGdldENhcHR1cmVJZEF0dHJpYnV0ZU5hbWUocmVmZXJlbmNlQ2FwdHVyZUlkKSwgJycpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRFbGVtZW50QnlDYXB0dXJlSWQocmVmZXJlbmNlQ2FwdHVyZUlkOiBudW1iZXIpIHtcclxuICBjb25zdCBzZWxlY3RvciA9IGBbJHtnZXRDYXB0dXJlSWRBdHRyaWJ1dGVOYW1lKHJlZmVyZW5jZUNhcHR1cmVJZCl9XWA7XHJcbiAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDYXB0dXJlSWRBdHRyaWJ1dGVOYW1lKHJlZmVyZW5jZUNhcHR1cmVJZDogbnVtYmVyKSB7XHJcbiAgcmV0dXJuIGBfYmxfJHtyZWZlcmVuY2VDYXB0dXJlSWR9YDtcclxufVxyXG5cclxuLy8gU3VwcG9ydCByZWNlaXZpbmcgRWxlbWVudFJlZiBpbnN0YW5jZXMgYXMgYXJncyBpbiBpbnRlcm9wIGNhbGxzXHJcbmNvbnN0IGVsZW1lbnRSZWZLZXkgPSAnX2JsYXpvckVsZW1lbnRSZWYnOyAvLyBLZWVwIGluIHN5bmMgd2l0aCBFbGVtZW50UmVmLmNzXHJcbkRvdE5ldC5hdHRhY2hSZXZpdmVyKChrZXksIHZhbHVlKSA9PiB7XHJcbiAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUuaGFzT3duUHJvcGVydHkoZWxlbWVudFJlZktleSkgJiYgdHlwZW9mIHZhbHVlW2VsZW1lbnRSZWZLZXldID09PSAnbnVtYmVyJykge1xyXG4gICAgcmV0dXJuIGdldEVsZW1lbnRCeUNhcHR1cmVJZCh2YWx1ZVtlbGVtZW50UmVmS2V5XSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiB2YWx1ZTtcclxuICB9XHJcbn0pO1xyXG4iLCJpbXBvcnQgeyBFdmVudEZvckRvdE5ldCwgVUlFdmVudEFyZ3MgfSBmcm9tICcuL0V2ZW50Rm9yRG90TmV0JztcclxuXHJcbmNvbnN0IG5vbkJ1YmJsaW5nRXZlbnRzID0gdG9Mb29rdXAoW1xyXG4gICdhYm9ydCcsICdibHVyJywgJ2NoYW5nZScsICdlcnJvcicsICdmb2N1cycsICdsb2FkJywgJ2xvYWRlbmQnLCAnbG9hZHN0YXJ0JywgJ21vdXNlZW50ZXInLCAnbW91c2VsZWF2ZScsXHJcbiAgJ3Byb2dyZXNzJywgJ3Jlc2V0JywgJ3Njcm9sbCcsICdzdWJtaXQnLCAndW5sb2FkJywgJ0RPTU5vZGVJbnNlcnRlZEludG9Eb2N1bWVudCcsICdET01Ob2RlUmVtb3ZlZEZyb21Eb2N1bWVudCdcclxuXSk7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE9uRXZlbnRDYWxsYmFjayB7XHJcbiAgKGV2ZW50OiBFdmVudCwgY29tcG9uZW50SWQ6IG51bWJlciwgZXZlbnRIYW5kbGVySWQ6IG51bWJlciwgZXZlbnRBcmdzOiBFdmVudEZvckRvdE5ldDxVSUV2ZW50QXJncz4pOiB2b2lkO1xyXG59XHJcblxyXG4vLyBSZXNwb25zaWJsZSBmb3IgYWRkaW5nL3JlbW92aW5nIHRoZSBldmVudEluZm8gb24gYW4gZXhwYW5kbyBwcm9wZXJ0eSBvbiBET00gZWxlbWVudHMsIGFuZFxyXG4vLyBjYWxsaW5nIGFuIEV2ZW50SW5mb1N0b3JlIHRoYXQgZGVhbHMgd2l0aCByZWdpc3RlcmluZy91bnJlZ2lzdGVyaW5nIHRoZSB1bmRlcmx5aW5nIGRlbGVnYXRlZFxyXG4vLyBldmVudCBsaXN0ZW5lcnMgYXMgcmVxdWlyZWQgKGFuZCBhbHNvIG1hcHMgYWN0dWFsIGV2ZW50cyBiYWNrIHRvIHRoZSBnaXZlbiBjYWxsYmFjaykuXHJcbmV4cG9ydCBjbGFzcyBFdmVudERlbGVnYXRvciB7XHJcbiAgcHJpdmF0ZSBzdGF0aWMgbmV4dEV2ZW50RGVsZWdhdG9ySWQgPSAwO1xyXG4gIHByaXZhdGUgZXZlbnRzQ29sbGVjdGlvbktleTogc3RyaW5nO1xyXG4gIHByaXZhdGUgZXZlbnRJbmZvU3RvcmU6IEV2ZW50SW5mb1N0b3JlO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG9uRXZlbnQ6IE9uRXZlbnRDYWxsYmFjaykge1xyXG4gICAgY29uc3QgZXZlbnREZWxlZ2F0b3JJZCA9ICsrRXZlbnREZWxlZ2F0b3IubmV4dEV2ZW50RGVsZWdhdG9ySWQ7XHJcbiAgICB0aGlzLmV2ZW50c0NvbGxlY3Rpb25LZXkgPSBgX2JsYXpvckV2ZW50c18ke2V2ZW50RGVsZWdhdG9ySWR9YDtcclxuICAgIHRoaXMuZXZlbnRJbmZvU3RvcmUgPSBuZXcgRXZlbnRJbmZvU3RvcmUodGhpcy5vbkdsb2JhbEV2ZW50LmJpbmQodGhpcykpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNldExpc3RlbmVyKGVsZW1lbnQ6IEVsZW1lbnQsIGV2ZW50TmFtZTogc3RyaW5nLCBjb21wb25lbnRJZDogbnVtYmVyLCBldmVudEhhbmRsZXJJZDogbnVtYmVyKSB7XHJcbiAgICAvLyBFbnN1cmUgd2UgaGF2ZSBhIHBsYWNlIHRvIHN0b3JlIGV2ZW50IGluZm8gZm9yIHRoaXMgZWxlbWVudFxyXG4gICAgbGV0IGluZm9Gb3JFbGVtZW50OiBFdmVudEhhbmRsZXJJbmZvc0ZvckVsZW1lbnQgPSBlbGVtZW50W3RoaXMuZXZlbnRzQ29sbGVjdGlvbktleV07XHJcbiAgICBpZiAoIWluZm9Gb3JFbGVtZW50KSB7XHJcbiAgICAgIGluZm9Gb3JFbGVtZW50ID0gZWxlbWVudFt0aGlzLmV2ZW50c0NvbGxlY3Rpb25LZXldID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGluZm9Gb3JFbGVtZW50Lmhhc093blByb3BlcnR5KGV2ZW50TmFtZSkpIHtcclxuICAgICAgLy8gV2UgY2FuIGNoZWFwbHkgdXBkYXRlIHRoZSBpbmZvIG9uIHRoZSBleGlzdGluZyBvYmplY3QgYW5kIGRvbid0IG5lZWQgYW55IG90aGVyIGhvdXNla2VlcGluZ1xyXG4gICAgICBjb25zdCBvbGRJbmZvID0gaW5mb0ZvckVsZW1lbnRbZXZlbnROYW1lXTtcclxuICAgICAgdGhpcy5ldmVudEluZm9TdG9yZS51cGRhdGUob2xkSW5mby5ldmVudEhhbmRsZXJJZCwgZXZlbnRIYW5kbGVySWQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gR28gdGhyb3VnaCB0aGUgd2hvbGUgZmxvdyB3aGljaCBtaWdodCBpbnZvbHZlIHJlZ2lzdGVyaW5nIGEgbmV3IGdsb2JhbCBoYW5kbGVyXHJcbiAgICAgIGNvbnN0IG5ld0luZm8gPSB7IGVsZW1lbnQsIGV2ZW50TmFtZSwgY29tcG9uZW50SWQsIGV2ZW50SGFuZGxlcklkIH07XHJcbiAgICAgIHRoaXMuZXZlbnRJbmZvU3RvcmUuYWRkKG5ld0luZm8pO1xyXG4gICAgICBpbmZvRm9yRWxlbWVudFtldmVudE5hbWVdID0gbmV3SW5mbztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyByZW1vdmVMaXN0ZW5lcihldmVudEhhbmRsZXJJZDogbnVtYmVyKSB7XHJcbiAgICAvLyBUaGlzIG1ldGhvZCBnZXRzIGNhbGxlZCB3aGVuZXZlciB0aGUgLk5FVC1zaWRlIGNvZGUgcmVwb3J0cyB0aGF0IGEgY2VydGFpbiBldmVudCBoYW5kbGVyXHJcbiAgICAvLyBoYXMgYmVlbiBkaXNwb3NlZC4gSG93ZXZlciB3ZSB3aWxsIGFscmVhZHkgaGF2ZSBkaXNwb3NlZCB0aGUgaW5mbyBhYm91dCB0aGF0IGhhbmRsZXIgaWZcclxuICAgIC8vIHRoZSBldmVudEhhbmRsZXJJZCBmb3IgdGhlIChlbGVtZW50LGV2ZW50TmFtZSkgcGFpciB3YXMgcmVwbGFjZWQgZHVyaW5nIGRpZmYgYXBwbGljYXRpb24uXHJcbiAgICBjb25zdCBpbmZvID0gdGhpcy5ldmVudEluZm9TdG9yZS5yZW1vdmUoZXZlbnRIYW5kbGVySWQpO1xyXG4gICAgaWYgKGluZm8pIHtcclxuICAgICAgLy8gTG9va3MgbGlrZSB0aGlzIGV2ZW50IGhhbmRsZXIgd2Fzbid0IGFscmVhZHkgZGlzcG9zZWRcclxuICAgICAgLy8gUmVtb3ZlIHRoZSBhc3NvY2lhdGVkIGRhdGEgZnJvbSB0aGUgRE9NIGVsZW1lbnRcclxuICAgICAgY29uc3QgZWxlbWVudCA9IGluZm8uZWxlbWVudDtcclxuICAgICAgaWYgKGVsZW1lbnQuaGFzT3duUHJvcGVydHkodGhpcy5ldmVudHNDb2xsZWN0aW9uS2V5KSkge1xyXG4gICAgICAgIGNvbnN0IGVsZW1lbnRFdmVudEluZm9zOiBFdmVudEhhbmRsZXJJbmZvc0ZvckVsZW1lbnQgPSBlbGVtZW50W3RoaXMuZXZlbnRzQ29sbGVjdGlvbktleV07XHJcbiAgICAgICAgZGVsZXRlIGVsZW1lbnRFdmVudEluZm9zW2luZm8uZXZlbnROYW1lXTtcclxuICAgICAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoZWxlbWVudEV2ZW50SW5mb3MpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgZGVsZXRlIGVsZW1lbnRbdGhpcy5ldmVudHNDb2xsZWN0aW9uS2V5XTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgb25HbG9iYWxFdmVudChldnQ6IEV2ZW50KSB7XHJcbiAgICBpZiAoIShldnQudGFyZ2V0IGluc3RhbmNlb2YgRWxlbWVudCkpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFNjYW4gdXAgdGhlIGVsZW1lbnQgaGllcmFyY2h5LCBsb29raW5nIGZvciBhbnkgbWF0Y2hpbmcgcmVnaXN0ZXJlZCBldmVudCBoYW5kbGVyc1xyXG4gICAgbGV0IGNhbmRpZGF0ZUVsZW1lbnQgPSBldnQudGFyZ2V0IGFzIEVsZW1lbnQgfCBudWxsO1xyXG4gICAgbGV0IGV2ZW50QXJnczogRXZlbnRGb3JEb3ROZXQ8VUlFdmVudEFyZ3M+IHwgbnVsbCA9IG51bGw7IC8vIFBvcHVsYXRlIGxhemlseVxyXG4gICAgY29uc3QgZXZlbnRJc05vbkJ1YmJsaW5nID0gbm9uQnViYmxpbmdFdmVudHMuaGFzT3duUHJvcGVydHkoZXZ0LnR5cGUpO1xyXG4gICAgd2hpbGUgKGNhbmRpZGF0ZUVsZW1lbnQpIHtcclxuICAgICAgaWYgKGNhbmRpZGF0ZUVsZW1lbnQuaGFzT3duUHJvcGVydHkodGhpcy5ldmVudHNDb2xsZWN0aW9uS2V5KSkge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXJJbmZvcyA9IGNhbmRpZGF0ZUVsZW1lbnRbdGhpcy5ldmVudHNDb2xsZWN0aW9uS2V5XTtcclxuICAgICAgICBpZiAoaGFuZGxlckluZm9zLmhhc093blByb3BlcnR5KGV2dC50eXBlKSkge1xyXG4gICAgICAgICAgLy8gV2UgYXJlIGdvaW5nIHRvIHJhaXNlIGFuIGV2ZW50IGZvciB0aGlzIGVsZW1lbnQsIHNvIHByZXBhcmUgaW5mbyBuZWVkZWQgYnkgdGhlIC5ORVQgY29kZVxyXG4gICAgICAgICAgaWYgKCFldmVudEFyZ3MpIHtcclxuICAgICAgICAgICAgZXZlbnRBcmdzID0gRXZlbnRGb3JEb3ROZXQuZnJvbURPTUV2ZW50KGV2dCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY29uc3QgaGFuZGxlckluZm8gPSBoYW5kbGVySW5mb3NbZXZ0LnR5cGVdO1xyXG4gICAgICAgICAgdGhpcy5vbkV2ZW50KGV2dCwgaGFuZGxlckluZm8uY29tcG9uZW50SWQsIGhhbmRsZXJJbmZvLmV2ZW50SGFuZGxlcklkLCBldmVudEFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgY2FuZGlkYXRlRWxlbWVudCA9IGV2ZW50SXNOb25CdWJibGluZyA/IG51bGwgOiBjYW5kaWRhdGVFbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vLyBSZXNwb25zaWJsZSBmb3IgYWRkaW5nIGFuZCByZW1vdmluZyB0aGUgZ2xvYmFsIGxpc3RlbmVyIHdoZW4gdGhlIG51bWJlciBvZiBsaXN0ZW5lcnNcclxuLy8gZm9yIGEgZ2l2ZW4gZXZlbnQgbmFtZSBjaGFuZ2VzIGJldHdlZW4gemVybyBhbmQgbm9uemVyb1xyXG5jbGFzcyBFdmVudEluZm9TdG9yZSB7XHJcbiAgcHJpdmF0ZSBpbmZvc0J5RXZlbnRIYW5kbGVySWQ6IHsgW2V2ZW50SGFuZGxlcklkOiBudW1iZXJdOiBFdmVudEhhbmRsZXJJbmZvIH0gPSB7fTtcclxuICBwcml2YXRlIGNvdW50QnlFdmVudE5hbWU6IHsgW2V2ZW50TmFtZTogc3RyaW5nXTogbnVtYmVyIH0gPSB7fTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBnbG9iYWxMaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcikge1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFkZChpbmZvOiBFdmVudEhhbmRsZXJJbmZvKSB7XHJcbiAgICBpZiAodGhpcy5pbmZvc0J5RXZlbnRIYW5kbGVySWRbaW5mby5ldmVudEhhbmRsZXJJZF0pIHtcclxuICAgICAgLy8gU2hvdWxkIG5ldmVyIGhhcHBlbiwgYnV0IHdlIHdhbnQgdG8ga25vdyBpZiBpdCBkb2VzXHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRXZlbnQgJHtpbmZvLmV2ZW50SGFuZGxlcklkfSBpcyBhbHJlYWR5IHRyYWNrZWRgKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluZm9zQnlFdmVudEhhbmRsZXJJZFtpbmZvLmV2ZW50SGFuZGxlcklkXSA9IGluZm87XHJcblxyXG4gICAgY29uc3QgZXZlbnROYW1lID0gaW5mby5ldmVudE5hbWU7XHJcbiAgICBpZiAodGhpcy5jb3VudEJ5RXZlbnROYW1lLmhhc093blByb3BlcnR5KGV2ZW50TmFtZSkpIHtcclxuICAgICAgdGhpcy5jb3VudEJ5RXZlbnROYW1lW2V2ZW50TmFtZV0rKztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY291bnRCeUV2ZW50TmFtZVtldmVudE5hbWVdID0gMTtcclxuXHJcbiAgICAgIC8vIFRvIG1ha2UgZGVsZWdhdGlvbiB3b3JrIHdpdGggbm9uLWJ1YmJsaW5nIGV2ZW50cywgcmVnaXN0ZXIgYSAnY2FwdHVyZScgbGlzdGVuZXIuXHJcbiAgICAgIC8vIFdlIHByZXNlcnZlIHRoZSBub24tYnViYmxpbmcgYmVoYXZpb3IgYnkgb25seSBkaXNwYXRjaGluZyBzdWNoIGV2ZW50cyB0byB0aGUgdGFyZ2V0ZWQgZWxlbWVudC5cclxuICAgICAgY29uc3QgdXNlQ2FwdHVyZSA9IG5vbkJ1YmJsaW5nRXZlbnRzLmhhc093blByb3BlcnR5KGV2ZW50TmFtZSk7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCB0aGlzLmdsb2JhbExpc3RlbmVyLCB1c2VDYXB0dXJlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyB1cGRhdGUob2xkRXZlbnRIYW5kbGVySWQ6IG51bWJlciwgbmV3RXZlbnRIYW5kbGVySWQ6IG51bWJlcikge1xyXG4gICAgaWYgKHRoaXMuaW5mb3NCeUV2ZW50SGFuZGxlcklkLmhhc093blByb3BlcnR5KG5ld0V2ZW50SGFuZGxlcklkKSkge1xyXG4gICAgICAvLyBTaG91bGQgbmV2ZXIgaGFwcGVuLCBidXQgd2Ugd2FudCB0byBrbm93IGlmIGl0IGRvZXNcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFdmVudCAke25ld0V2ZW50SGFuZGxlcklkfSBpcyBhbHJlYWR5IHRyYWNrZWRgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBTaW5jZSB3ZSdyZSBqdXN0IHVwZGF0aW5nIHRoZSBldmVudCBoYW5kbGVyIElELCB0aGVyZSdzIG5vIG5lZWQgdG8gdXBkYXRlIHRoZSBnbG9iYWwgY291bnRzXHJcbiAgICBjb25zdCBpbmZvID0gdGhpcy5pbmZvc0J5RXZlbnRIYW5kbGVySWRbb2xkRXZlbnRIYW5kbGVySWRdO1xyXG4gICAgZGVsZXRlIHRoaXMuaW5mb3NCeUV2ZW50SGFuZGxlcklkW29sZEV2ZW50SGFuZGxlcklkXTtcclxuICAgIGluZm8uZXZlbnRIYW5kbGVySWQgPSBuZXdFdmVudEhhbmRsZXJJZDtcclxuICAgIHRoaXMuaW5mb3NCeUV2ZW50SGFuZGxlcklkW25ld0V2ZW50SGFuZGxlcklkXSA9IGluZm87XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVtb3ZlKGV2ZW50SGFuZGxlcklkOiBudW1iZXIpOiBFdmVudEhhbmRsZXJJbmZvIHtcclxuICAgIGNvbnN0IGluZm8gPSB0aGlzLmluZm9zQnlFdmVudEhhbmRsZXJJZFtldmVudEhhbmRsZXJJZF07XHJcbiAgICBpZiAoaW5mbykge1xyXG4gICAgICBkZWxldGUgdGhpcy5pbmZvc0J5RXZlbnRIYW5kbGVySWRbZXZlbnRIYW5kbGVySWRdO1xyXG5cclxuICAgICAgY29uc3QgZXZlbnROYW1lID0gaW5mby5ldmVudE5hbWU7XHJcbiAgICAgIGlmICgtLXRoaXMuY291bnRCeUV2ZW50TmFtZVtldmVudE5hbWVdID09PSAwKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuY291bnRCeUV2ZW50TmFtZVtldmVudE5hbWVdO1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCB0aGlzLmdsb2JhbExpc3RlbmVyKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBpbmZvO1xyXG4gIH1cclxufVxyXG5cclxuaW50ZXJmYWNlIEV2ZW50SGFuZGxlckluZm9zRm9yRWxlbWVudCB7XHJcbiAgLy8gQWx0aG91Z2ggd2UgKmNvdWxkKiB0cmFjayBtdWx0aXBsZSBldmVudCBoYW5kbGVycyBwZXIgKGVsZW1lbnQsIGV2ZW50TmFtZSkgcGFpclxyXG4gIC8vIChzaW5jZSB0aGV5IGhhdmUgZGlzdGluY3QgZXZlbnRIYW5kbGVySWQgdmFsdWVzKSwgdGhlcmUncyBubyBwb2ludCBkb2luZyBzbyBiZWNhdXNlXHJcbiAgLy8gb3VyIHByb2dyYW1taW5nIG1vZGVsIGlzIHRoYXQgeW91IGRlY2xhcmUgZXZlbnQgaGFuZGxlcnMgYXMgYXR0cmlidXRlcy4gQW4gZWxlbWVudFxyXG4gIC8vIGNhbiBvbmx5IGhhdmUgb25lIGF0dHJpYnV0ZSB3aXRoIGEgZ2l2ZW4gbmFtZSwgaGVuY2Ugb25seSBvbmUgZXZlbnQgaGFuZGxlciB3aXRoXHJcbiAgLy8gdGhhdCBuYW1lIGF0IGFueSBvbmUgdGltZS5cclxuICAvLyBTbyB0byBrZWVwIHRoaW5ncyBzaW1wbGUsIG9ubHkgdHJhY2sgb25lIEV2ZW50SGFuZGxlckluZm8gcGVyIChlbGVtZW50LCBldmVudE5hbWUpXHJcbiAgW2V2ZW50TmFtZTogc3RyaW5nXTogRXZlbnRIYW5kbGVySW5mb1xyXG59XHJcblxyXG5pbnRlcmZhY2UgRXZlbnRIYW5kbGVySW5mbyB7XHJcbiAgZWxlbWVudDogRWxlbWVudDtcclxuICBldmVudE5hbWU6IHN0cmluZztcclxuICBjb21wb25lbnRJZDogbnVtYmVyO1xyXG4gIGV2ZW50SGFuZGxlcklkOiBudW1iZXI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRvTG9va3VwKGl0ZW1zOiBzdHJpbmdbXSk6IHsgW2tleTogc3RyaW5nXTogYm9vbGVhbiB9IHtcclxuICBjb25zdCByZXN1bHQgPSB7fTtcclxuICBpdGVtcy5mb3JFYWNoKHZhbHVlID0+IHsgcmVzdWx0W3ZhbHVlXSA9IHRydWU7IH0pO1xyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIEV2ZW50Rm9yRG90TmV0PFREYXRhIGV4dGVuZHMgVUlFdmVudEFyZ3M+IHtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgdHlwZTogRXZlbnRBcmdzVHlwZSwgcHVibGljIHJlYWRvbmx5IGRhdGE6IFREYXRhKSB7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZnJvbURPTUV2ZW50KGV2ZW50OiBFdmVudCk6IEV2ZW50Rm9yRG90TmV0PFVJRXZlbnRBcmdzPiB7XHJcbiAgICBjb25zdCBlbGVtZW50ID0gZXZlbnQudGFyZ2V0IGFzIEVsZW1lbnQ7XHJcbiAgICBzd2l0Y2ggKGV2ZW50LnR5cGUpIHtcclxuXHJcbiAgICAgIGNhc2UgJ2NoYW5nZSc6IHtcclxuICAgICAgICBjb25zdCB0YXJnZXRJc0NoZWNrYm94ID0gaXNDaGVja2JveChlbGVtZW50KTtcclxuICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IHRhcmdldElzQ2hlY2tib3ggPyAhIWVsZW1lbnRbJ2NoZWNrZWQnXSA6IGVsZW1lbnRbJ3ZhbHVlJ107XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFdmVudEZvckRvdE5ldDxVSUNoYW5nZUV2ZW50QXJncz4oJ2NoYW5nZScsIHsgdHlwZTogZXZlbnQudHlwZSwgdmFsdWU6IG5ld1ZhbHVlIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjYXNlICdjb3B5JzpcclxuICAgICAgY2FzZSAnY3V0JzpcclxuICAgICAgY2FzZSAncGFzdGUnOlxyXG4gICAgICAgIHJldHVybiBuZXcgRXZlbnRGb3JEb3ROZXQ8VUlDbGlwYm9hcmRFdmVudEFyZ3M+KCdjbGlwYm9hcmQnLCB7IHR5cGU6IGV2ZW50LnR5cGUgfSk7XHJcblxyXG4gICAgICBjYXNlICdkcmFnJzpcclxuICAgICAgY2FzZSAnZHJhZ2VuZCc6XHJcbiAgICAgIGNhc2UgJ2RyYWdlbnRlcic6XHJcbiAgICAgIGNhc2UgJ2RyYWdsZWF2ZSc6XHJcbiAgICAgIGNhc2UgJ2RyYWdvdmVyJzpcclxuICAgICAgY2FzZSAnZHJhZ3N0YXJ0JzpcclxuICAgICAgY2FzZSAnZHJvcCc6XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFdmVudEZvckRvdE5ldDxVSURyYWdFdmVudEFyZ3M+KCdkcmFnJywgcGFyc2VEcmFnRXZlbnQoZXZlbnQpKTtcclxuXHJcbiAgICAgIGNhc2UgJ2ZvY3VzJzpcclxuICAgICAgY2FzZSAnYmx1cic6XHJcbiAgICAgIGNhc2UgJ2ZvY3VzaW4nOlxyXG4gICAgICBjYXNlICdmb2N1c291dCc6XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFdmVudEZvckRvdE5ldDxVSUZvY3VzRXZlbnRBcmdzPignZm9jdXMnLCB7IHR5cGU6IGV2ZW50LnR5cGUgfSk7XHJcblxyXG4gICAgICBjYXNlICdrZXlkb3duJzpcclxuICAgICAgY2FzZSAna2V5dXAnOlxyXG4gICAgICBjYXNlICdrZXlwcmVzcyc6XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFdmVudEZvckRvdE5ldDxVSUtleWJvYXJkRXZlbnRBcmdzPigna2V5Ym9hcmQnLCBwYXJzZUtleWJvYXJkRXZlbnQoPEtleWJvYXJkRXZlbnQ+ZXZlbnQpKTtcclxuXHJcbiAgICAgIGNhc2UgJ2NvbnRleHRtZW51JzpcclxuICAgICAgY2FzZSAnY2xpY2snOlxyXG4gICAgICBjYXNlICdtb3VzZW92ZXInOlxyXG4gICAgICBjYXNlICdtb3VzZW91dCc6XHJcbiAgICAgIGNhc2UgJ21vdXNlbW92ZSc6XHJcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XHJcbiAgICAgIGNhc2UgJ21vdXNldXAnOlxyXG4gICAgICBjYXNlICdkYmxjbGljayc6XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFdmVudEZvckRvdE5ldDxVSU1vdXNlRXZlbnRBcmdzPignbW91c2UnLCBwYXJzZU1vdXNlRXZlbnQoPE1vdXNlRXZlbnQ+ZXZlbnQpKTtcclxuXHJcbiAgICAgIGNhc2UgJ2Vycm9yJzpcclxuICAgICAgICByZXR1cm4gbmV3IEV2ZW50Rm9yRG90TmV0PFVJRXJyb3JFdmVudEFyZ3M+KCdlcnJvcicsIHBhcnNlRXJyb3JFdmVudCg8RXJyb3JFdmVudD5ldmVudCkpO1xyXG5cclxuICAgICAgY2FzZSAnbG9hZHN0YXJ0JzpcclxuICAgICAgY2FzZSAndGltZW91dCc6XHJcbiAgICAgIGNhc2UgJ2Fib3J0JzpcclxuICAgICAgY2FzZSAnbG9hZCc6XHJcbiAgICAgIGNhc2UgJ2xvYWRlbmQnOlxyXG4gICAgICBjYXNlICdwcm9ncmVzcyc6XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFdmVudEZvckRvdE5ldDxVSVByb2dyZXNzRXZlbnRBcmdzPigncHJvZ3Jlc3MnLCBwYXJzZVByb2dyZXNzRXZlbnQoPFByb2dyZXNzRXZlbnQ+ZXZlbnQpKTtcclxuXHJcbiAgICAgIGNhc2UgJ3RvdWNoY2FuY2VsJzpcclxuICAgICAgY2FzZSAndG91Y2hlbmQnOlxyXG4gICAgICBjYXNlICd0b3VjaG1vdmUnOlxyXG4gICAgICBjYXNlICd0b3VjaGVudGVyJzpcclxuICAgICAgY2FzZSAndG91Y2hsZWF2ZSc6XHJcbiAgICAgIGNhc2UgJ3RvdWNoc3RhcnQnOlxyXG4gICAgICAgIHJldHVybiBuZXcgRXZlbnRGb3JEb3ROZXQ8VUlUb3VjaEV2ZW50QXJncz4oJ3RvdWNoJywgcGFyc2VUb3VjaEV2ZW50KDxUb3VjaEV2ZW50PmV2ZW50KSk7XHJcblxyXG4gICAgICBjYXNlICdnb3Rwb2ludGVyY2FwdHVyZSc6XHJcbiAgICAgIGNhc2UgJ2xvc3Rwb2ludGVyY2FwdHVyZSc6XHJcbiAgICAgIGNhc2UgJ3BvaW50ZXJjYW5jZWwnOlxyXG4gICAgICBjYXNlICdwb2ludGVyZG93bic6XHJcbiAgICAgIGNhc2UgJ3BvaW50ZXJlbnRlcic6XHJcbiAgICAgIGNhc2UgJ3BvaW50ZXJsZWF2ZSc6XHJcbiAgICAgIGNhc2UgJ3BvaW50ZXJtb3ZlJzpcclxuICAgICAgY2FzZSAncG9pbnRlcm91dCc6XHJcbiAgICAgIGNhc2UgJ3BvaW50ZXJvdmVyJzpcclxuICAgICAgY2FzZSAncG9pbnRlcnVwJzpcclxuICAgICAgICByZXR1cm4gbmV3IEV2ZW50Rm9yRG90TmV0PFVJUG9pbnRlckV2ZW50QXJncz4oJ3BvaW50ZXInLCBwYXJzZVBvaW50ZXJFdmVudCg8UG9pbnRlckV2ZW50PmV2ZW50KSk7XHJcblxyXG4gICAgICBjYXNlICd3aGVlbCc6XHJcbiAgICAgIGNhc2UgJ21vdXNld2hlZWwnOlxyXG4gICAgICAgIHJldHVybiBuZXcgRXZlbnRGb3JEb3ROZXQ8VUlXaGVlbEV2ZW50QXJncz4oJ3doZWVsJywgcGFyc2VXaGVlbEV2ZW50KDxXaGVlbEV2ZW50PmV2ZW50KSk7XHJcblxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHJldHVybiBuZXcgRXZlbnRGb3JEb3ROZXQ8VUlFdmVudEFyZ3M+KCd1bmtub3duJywgeyB0eXBlOiBldmVudC50eXBlIH0pO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VEcmFnRXZlbnQoZXZlbnQ6IGFueSkge1xyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBldmVudC50eXBlLFxyXG4gICAgZGV0YWlsOiBldmVudC5kZXRhaWwsXHJcbiAgICBkYXRhVHJhbnNmZXI6IGV2ZW50LmRhdGFUcmFuc2ZlcixcclxuICAgIHNjcmVlblg6IGV2ZW50LnNjcmVlblgsXHJcbiAgICBzY3JlZW5ZOiBldmVudC5zY3JlZW5ZLFxyXG4gICAgY2xpZW50WDogZXZlbnQuY2xpZW50WCxcclxuICAgIGNsaWVudFk6IGV2ZW50LmNsaWVudFksXHJcbiAgICBidXR0b246IGV2ZW50LmJ1dHRvbixcclxuICAgIGJ1dHRvbnM6IGV2ZW50LmJ1dHRvbnMsXHJcbiAgICBjdHJsS2V5OiBldmVudC5jdHJsS2V5LFxyXG4gICAgc2hpZnRLZXk6IGV2ZW50LnNoaWZ0S2V5LFxyXG4gICAgYWx0S2V5OiBldmVudC5hbHRLZXksXHJcbiAgICBtZXRhS2V5OiBldmVudC5tZXRhS2V5XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZVdoZWVsRXZlbnQoZXZlbnQ6IFdoZWVsRXZlbnQpIHtcclxuICByZXR1cm4ge1xyXG4gICAgLi4ucGFyc2VNb3VzZUV2ZW50KGV2ZW50KSxcclxuICAgIGRlbHRhWDogZXZlbnQuZGVsdGFYLFxyXG4gICAgZGVsdGFZOiBldmVudC5kZWx0YVksXHJcbiAgICBkZWx0YVo6IGV2ZW50LmRlbHRhWixcclxuICAgIGRlbHRhTW9kZTogZXZlbnQuZGVsdGFNb2RlXHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VFcnJvckV2ZW50KGV2ZW50OiBFcnJvckV2ZW50KSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHR5cGU6IGV2ZW50LnR5cGUsXHJcbiAgICBtZXNzYWdlOiBldmVudC5tZXNzYWdlLFxyXG4gICAgZmlsZW5hbWU6IGV2ZW50LmZpbGVuYW1lLFxyXG4gICAgbGluZW5vOiBldmVudC5saW5lbm8sXHJcbiAgICBjb2xubzogZXZlbnQuY29sbm9cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhcnNlUHJvZ3Jlc3NFdmVudChldmVudDogUHJvZ3Jlc3NFdmVudCkge1xyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBldmVudC50eXBlLFxyXG4gICAgbGVuZ3RoQ29tcHV0YWJsZTogZXZlbnQubGVuZ3RoQ29tcHV0YWJsZSxcclxuICAgIGxvYWRlZDogZXZlbnQubG9hZGVkLFxyXG4gICAgdG90YWw6IGV2ZW50LnRvdGFsXHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VUb3VjaEV2ZW50KGV2ZW50OiBUb3VjaEV2ZW50KSB7XHJcblxyXG4gIGZ1bmN0aW9uIHBhcnNlVG91Y2godG91Y2hMaXN0OiBUb3VjaExpc3QpIHtcclxuICAgIGNvbnN0IHRvdWNoZXM6IFVJVG91Y2hQb2ludFtdID0gW107XHJcbiAgICBcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG91Y2hMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IHRvdWNoID0gdG91Y2hMaXN0W2ldO1xyXG4gICAgICB0b3VjaGVzLnB1c2goe1xyXG4gICAgICAgIGlkZW50aWZpZXI6IHRvdWNoLmlkZW50aWZpZXIsXHJcbiAgICAgICAgY2xpZW50WDogdG91Y2guY2xpZW50WCxcclxuICAgICAgICBjbGllbnRZOiB0b3VjaC5jbGllbnRZLFxyXG4gICAgICAgIHNjcmVlblg6IHRvdWNoLnNjcmVlblgsXHJcbiAgICAgICAgc2NyZWVuWTogdG91Y2guc2NyZWVuWSxcclxuICAgICAgICBwYWdlWDogdG91Y2gucGFnZVgsXHJcbiAgICAgICAgcGFnZVk6IHRvdWNoLnBhZ2VZXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvdWNoZXM7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdHlwZTogZXZlbnQudHlwZSxcclxuICAgIGRldGFpbDogZXZlbnQuZGV0YWlsLFxyXG4gICAgdG91Y2hlczogcGFyc2VUb3VjaChldmVudC50b3VjaGVzKSxcclxuICAgIHRhcmdldFRvdWNoZXM6IHBhcnNlVG91Y2goZXZlbnQudGFyZ2V0VG91Y2hlcyksXHJcbiAgICBjaGFuZ2VkVG91Y2hlczogcGFyc2VUb3VjaChldmVudC5jaGFuZ2VkVG91Y2hlcyksXHJcbiAgICBjdHJsS2V5OiBldmVudC5jdHJsS2V5LFxyXG4gICAgc2hpZnRLZXk6IGV2ZW50LnNoaWZ0S2V5LFxyXG4gICAgYWx0S2V5OiBldmVudC5hbHRLZXksXHJcbiAgICBtZXRhS2V5OiBldmVudC5tZXRhS2V5XHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VLZXlib2FyZEV2ZW50KGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHR5cGU6IGV2ZW50LnR5cGUsXHJcbiAgICBrZXk6IGV2ZW50LmtleSxcclxuICAgIGNvZGU6IGV2ZW50LmNvZGUsXHJcbiAgICBsb2NhdGlvbjogZXZlbnQubG9jYXRpb24sXHJcbiAgICByZXBlYXQ6IGV2ZW50LnJlcGVhdCxcclxuICAgIGN0cmxLZXk6IGV2ZW50LmN0cmxLZXksXHJcbiAgICBzaGlmdEtleTogZXZlbnQuc2hpZnRLZXksXHJcbiAgICBhbHRLZXk6IGV2ZW50LmFsdEtleSxcclxuICAgIG1ldGFLZXk6IGV2ZW50Lm1ldGFLZXlcclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZVBvaW50ZXJFdmVudChldmVudDogUG9pbnRlckV2ZW50KSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIC4uLnBhcnNlTW91c2VFdmVudChldmVudCksXHJcbiAgICBwb2ludGVySWQ6IGV2ZW50LnBvaW50ZXJJZCxcclxuICAgIHdpZHRoOiBldmVudC53aWR0aCxcclxuICAgIGhlaWdodDogZXZlbnQuaGVpZ2h0LFxyXG4gICAgcHJlc3N1cmU6IGV2ZW50LnByZXNzdXJlLFxyXG4gICAgdGlsdFg6IGV2ZW50LnRpbHRYLFxyXG4gICAgdGlsdFk6IGV2ZW50LnRpbHRZLFxyXG4gICAgcG9pbnRlclR5cGU6IGV2ZW50LnBvaW50ZXJUeXBlLFxyXG4gICAgaXNQcmltYXJ5OiBldmVudC5pc1ByaW1hcnlcclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZU1vdXNlRXZlbnQoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuICByZXR1cm4ge1xyXG4gICAgdHlwZTogZXZlbnQudHlwZSxcclxuICAgIGRldGFpbDogZXZlbnQuZGV0YWlsLFxyXG4gICAgc2NyZWVuWDogZXZlbnQuc2NyZWVuWCxcclxuICAgIHNjcmVlblk6IGV2ZW50LnNjcmVlblksXHJcbiAgICBjbGllbnRYOiBldmVudC5jbGllbnRYLFxyXG4gICAgY2xpZW50WTogZXZlbnQuY2xpZW50WSxcclxuICAgIGJ1dHRvbjogZXZlbnQuYnV0dG9uLFxyXG4gICAgYnV0dG9uczogZXZlbnQuYnV0dG9ucyxcclxuICAgIGN0cmxLZXk6IGV2ZW50LmN0cmxLZXksXHJcbiAgICBzaGlmdEtleTogZXZlbnQuc2hpZnRLZXksXHJcbiAgICBhbHRLZXk6IGV2ZW50LmFsdEtleSxcclxuICAgIG1ldGFLZXk6IGV2ZW50Lm1ldGFLZXlcclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0NoZWNrYm94KGVsZW1lbnQ6IEVsZW1lbnQgfCBudWxsKSB7XHJcbiAgcmV0dXJuIGVsZW1lbnQgJiYgZWxlbWVudC50YWdOYW1lID09PSAnSU5QVVQnICYmIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdjaGVja2JveCc7XHJcbn1cclxuXHJcbi8vIFRoZSBmb2xsb3dpbmcgaW50ZXJmYWNlcyBtdXN0IGJlIGtlcHQgaW4gc3luYyB3aXRoIHRoZSBVSUV2ZW50QXJncyBDIyBjbGFzc2VzXHJcblxyXG50eXBlIEV2ZW50QXJnc1R5cGUgPSAnY2hhbmdlJyB8ICdjbGlwYm9hcmQnIHwgJ2RyYWcnIHwgJ2Vycm9yJyB8ICdmb2N1cycgfCAna2V5Ym9hcmQnIHwgJ21vdXNlJyB8ICdwb2ludGVyJyB8ICdwcm9ncmVzcycgfCAndG91Y2gnIHwgJ3Vua25vd24nIHwgJ3doZWVsJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVUlFdmVudEFyZ3Mge1xyXG4gIHR5cGU6IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIFVJQ2hhbmdlRXZlbnRBcmdzIGV4dGVuZHMgVUlFdmVudEFyZ3Mge1xyXG4gIHZhbHVlOiBzdHJpbmcgfCBib29sZWFuO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgVUlDbGlwYm9hcmRFdmVudEFyZ3MgZXh0ZW5kcyBVSUV2ZW50QXJncyB7XHJcbn1cclxuXHJcbmludGVyZmFjZSBVSURyYWdFdmVudEFyZ3MgZXh0ZW5kcyBVSUV2ZW50QXJncyB7XHJcbiAgZGV0YWlsOiBudW1iZXI7XHJcbiAgZGF0YVRyYW5zZmVyOiBVSURhdGFUcmFuc2ZlcjtcclxuICBzY3JlZW5YOiBudW1iZXI7XHJcbiAgc2NyZWVuWTogbnVtYmVyO1xyXG4gIGNsaWVudFg6IG51bWJlcjtcclxuICBjbGllbnRZOiBudW1iZXI7XHJcbiAgYnV0dG9uOiBudW1iZXI7XHJcbiAgYnV0dG9uczogbnVtYmVyO1xyXG4gIGN0cmxLZXk6IGJvb2xlYW47XHJcbiAgc2hpZnRLZXk6IGJvb2xlYW47XHJcbiAgYWx0S2V5OiBib29sZWFuO1xyXG4gIG1ldGFLZXk6IGJvb2xlYW47XHJcbn1cclxuXHJcbmludGVyZmFjZSBVSURhdGFUcmFuc2ZlciB7XHJcbiAgZHJvcEVmZmVjdDogc3RyaW5nO1xyXG4gIGVmZmVjdEFsbG93ZWQ6IHN0cmluZztcclxuICBmaWxlczogc3RyaW5nW107XHJcbiAgaXRlbXM6IFVJRGF0YVRyYW5zZmVySXRlbVtdO1xyXG4gIHR5cGVzOiBzdHJpbmdbXTtcclxufVxyXG5cclxuaW50ZXJmYWNlIFVJRGF0YVRyYW5zZmVySXRlbSB7XHJcbiAga2luZDogc3RyaW5nO1xyXG4gIHR5cGU6IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIFVJRXJyb3JFdmVudEFyZ3MgZXh0ZW5kcyBVSUV2ZW50QXJncyB7XHJcbiAgbWVzc2FnZTogc3RyaW5nO1xyXG4gIGZpbGVuYW1lOiBzdHJpbmc7XHJcbiAgbGluZW5vOiBudW1iZXI7XHJcbiAgY29sbm86IG51bWJlcjtcclxuXHJcbiAgLy8gb21pdHRpbmcgJ2Vycm9yJyBoZXJlIHNpbmNlIHdlJ2QgaGF2ZSB0byBzZXJpYWxpemUgaXQsIGFuZCBpdCdzIG5vdCBjbGVhciB3ZSB3aWxsIHdhbnQgdG9cclxuICAvLyBkbyB0aGF0LiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRXJyb3JFdmVudFxyXG59XHJcblxyXG5pbnRlcmZhY2UgVUlGb2N1c0V2ZW50QXJncyBleHRlbmRzIFVJRXZlbnRBcmdzIHtcclxufVxyXG5cclxuaW50ZXJmYWNlIFVJS2V5Ym9hcmRFdmVudEFyZ3MgZXh0ZW5kcyBVSUV2ZW50QXJncyB7XHJcbiAga2V5OiBzdHJpbmc7XHJcbiAgY29kZTogc3RyaW5nO1xyXG4gIGxvY2F0aW9uOiBudW1iZXI7XHJcbiAgcmVwZWF0OiBib29sZWFuO1xyXG4gIGN0cmxLZXk6IGJvb2xlYW47XHJcbiAgc2hpZnRLZXk6IGJvb2xlYW47XHJcbiAgYWx0S2V5OiBib29sZWFuO1xyXG4gIG1ldGFLZXk6IGJvb2xlYW47XHJcbn1cclxuXHJcbmludGVyZmFjZSBVSU1vdXNlRXZlbnRBcmdzIGV4dGVuZHMgVUlFdmVudEFyZ3Mge1xyXG4gIGRldGFpbDogbnVtYmVyO1xyXG4gIHNjcmVlblg6IG51bWJlcjtcclxuICBzY3JlZW5ZOiBudW1iZXI7XHJcbiAgY2xpZW50WDogbnVtYmVyO1xyXG4gIGNsaWVudFk6IG51bWJlcjtcclxuICBidXR0b246IG51bWJlcjtcclxuICBidXR0b25zOiBudW1iZXI7XHJcbiAgY3RybEtleTogYm9vbGVhbjtcclxuICBzaGlmdEtleTogYm9vbGVhbjtcclxuICBhbHRLZXk6IGJvb2xlYW47XHJcbiAgbWV0YUtleTogYm9vbGVhbjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFVJUG9pbnRlckV2ZW50QXJncyBleHRlbmRzIFVJTW91c2VFdmVudEFyZ3Mge1xyXG4gIHBvaW50ZXJJZDogbnVtYmVyO1xyXG4gIHdpZHRoOiBudW1iZXI7XHJcbiAgaGVpZ2h0OiBudW1iZXI7XHJcbiAgcHJlc3N1cmU6IG51bWJlcjtcclxuICB0aWx0WDogbnVtYmVyO1xyXG4gIHRpbHRZOiBudW1iZXI7XHJcbiAgcG9pbnRlclR5cGU6IHN0cmluZztcclxuICBpc1ByaW1hcnk6IGJvb2xlYW47XHJcbn1cclxuXHJcbmludGVyZmFjZSBVSVByb2dyZXNzRXZlbnRBcmdzIGV4dGVuZHMgVUlFdmVudEFyZ3Mge1xyXG4gIGxlbmd0aENvbXB1dGFibGU6IGJvb2xlYW47XHJcbiAgbG9hZGVkOiBudW1iZXI7XHJcbiAgdG90YWw6IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFVJVG91Y2hFdmVudEFyZ3MgZXh0ZW5kcyBVSUV2ZW50QXJncyB7XHJcbiAgZGV0YWlsOiBudW1iZXI7XHJcbiAgdG91Y2hlczogVUlUb3VjaFBvaW50W107XHJcbiAgdGFyZ2V0VG91Y2hlczogVUlUb3VjaFBvaW50W107XHJcbiAgY2hhbmdlZFRvdWNoZXM6IFVJVG91Y2hQb2ludFtdO1xyXG4gIGN0cmxLZXk6IGJvb2xlYW47XHJcbiAgc2hpZnRLZXk6IGJvb2xlYW47XHJcbiAgYWx0S2V5OiBib29sZWFuO1xyXG4gIG1ldGFLZXk6IGJvb2xlYW47XHJcbn1cclxuXHJcbmludGVyZmFjZSBVSVRvdWNoUG9pbnQge1xyXG4gIGlkZW50aWZpZXI6IG51bWJlcjtcclxuICBzY3JlZW5YOiBudW1iZXI7XHJcbiAgc2NyZWVuWTogbnVtYmVyO1xyXG4gIGNsaWVudFg6IG51bWJlcjtcclxuICBjbGllbnRZOiBudW1iZXI7XHJcbiAgcGFnZVg6IG51bWJlcjtcclxuICBwYWdlWTogbnVtYmVyO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgVUlXaGVlbEV2ZW50QXJncyBleHRlbmRzIFVJTW91c2VFdmVudEFyZ3Mge1xyXG4gIGRlbHRhWDogbnVtYmVyO1xyXG4gIGRlbHRhWTogbnVtYmVyO1xyXG4gIGRlbHRhWjogbnVtYmVyO1xyXG4gIGRlbHRhTW9kZTogbnVtYmVyO1xyXG59XHJcbiIsIi8qXHJcbiAgQSBMb2dpY2FsRWxlbWVudCBwbGF5cyB0aGUgc2FtZSByb2xlIGFzIGFuIEVsZW1lbnQgaW5zdGFuY2UgZnJvbSB0aGUgcG9pbnQgb2YgdmlldyBvZiB0aGVcclxuICBBUEkgY29uc3VtZXIuIEluc2VydGluZyBhbmQgcmVtb3ZpbmcgbG9naWNhbCBlbGVtZW50cyB1cGRhdGVzIHRoZSBicm93c2VyIERPTSBqdXN0IHRoZSBzYW1lLlxyXG5cclxuICBUaGUgZGlmZmVyZW5jZSBpcyB0aGF0LCB1bmxpa2UgcmVndWxhciBET00gbXV0YXRpb24gQVBJcywgdGhlIExvZ2ljYWxFbGVtZW50IEFQSXMgZG9uJ3QgdXNlXHJcbiAgdGhlIHVuZGVybHlpbmcgRE9NIHN0cnVjdHVyZSBhcyB0aGUgZGF0YSBzdG9yYWdlIGZvciB0aGUgZWxlbWVudCBoaWVyYXJjaHkuIEluc3RlYWQsIHRoZVxyXG4gIExvZ2ljYWxFbGVtZW50IEFQSXMgdGFrZSBjYXJlIG9mIHRyYWNraW5nIGhpZXJhcmNoaWNhbCByZWxhdGlvbnNoaXBzIHNlcGFyYXRlbHkuIFRoZSBwb2ludFxyXG4gIG9mIHRoaXMgaXMgdG8gcGVybWl0IGEgbG9naWNhbCB0cmVlIHN0cnVjdHVyZSBpbiB3aGljaCBwYXJlbnQvY2hpbGQgcmVsYXRpb25zaGlwcyBkb24ndFxyXG4gIGhhdmUgdG8gYmUgbWF0ZXJpYWxpemVkIGluIHRlcm1zIG9mIERPTSBlbGVtZW50IHBhcmVudC9jaGlsZCByZWxhdGlvbnNoaXBzLiBBbmQgdGhlIHJlYXNvblxyXG4gIHdoeSB3ZSB3YW50IHRoYXQgaXMgc28gdGhhdCBoaWVyYXJjaGllcyBvZiBCbGF6b3IgY29tcG9uZW50cyBjYW4gYmUgdHJhY2tlZCBldmVuIHdoZW4gdGhvc2VcclxuICBjb21wb25lbnRzJyByZW5kZXIgb3V0cHV0IG5lZWQgbm90IGJlIGEgc2luZ2xlIGxpdGVyYWwgRE9NIGVsZW1lbnQuXHJcblxyXG4gIENvbnN1bWVycyBvZiB0aGUgQVBJIGRvbid0IG5lZWQgdG8ga25vdyBhYm91dCB0aGUgaW1wbGVtZW50YXRpb24sIGJ1dCBob3cgaXQncyBkb25lIGlzOlxyXG4gIC0gRWFjaCBMb2dpY2FsRWxlbWVudCBpcyBtYXRlcmlhbGl6ZWQgaW4gdGhlIERPTSBhcyBlaXRoZXI6XHJcbiAgICAtIEEgTm9kZSBpbnN0YW5jZSwgZm9yIGFjdHVhbCBOb2RlIGluc3RhbmNlcyBpbnNlcnRlZCB1c2luZyAnaW5zZXJ0TG9naWNhbENoaWxkJyBvclxyXG4gICAgICBmb3IgRWxlbWVudCBpbnN0YW5jZXMgcHJvbW90ZWQgdG8gTG9naWNhbEVsZW1lbnQgdmlhICd0b0xvZ2ljYWxFbGVtZW50J1xyXG4gICAgLSBBIENvbW1lbnQgaW5zdGFuY2UsIGZvciAnbG9naWNhbCBjb250YWluZXInIGluc3RhbmNlcyBpbnNlcnRlZCB1c2luZyAnY3JlYXRlQW5kSW5zZXJ0TG9naWNhbENvbnRhaW5lcidcclxuICAtIFRoZW4sIG9uIHRoYXQgaW5zdGFuY2UgKGkuZS4sIHRoZSBOb2RlIG9yIENvbW1lbnQpLCB3ZSBzdG9yZSBhbiBhcnJheSBvZiAnbG9naWNhbCBjaGlsZHJlbidcclxuICAgIGluc3RhbmNlcywgZS5nLixcclxuICAgICAgW2ZpcnN0Q2hpbGQsIHNlY29uZENoaWxkLCB0aGlyZENoaWxkLCAuLi5dXHJcbiAgICAuLi4gcGx1cyB3ZSBzdG9yZSBhIHJlZmVyZW5jZSB0byB0aGUgJ2xvZ2ljYWwgcGFyZW50JyAoaWYgYW55KVxyXG4gIC0gVGhlICdsb2dpY2FsIGNoaWxkcmVuJyBhcnJheSBtZWFucyB3ZSBjYW4gbG9vayB1cCBpbiBPKDEpOlxyXG4gICAgLSBUaGUgbnVtYmVyIG9mIGxvZ2ljYWwgY2hpbGRyZW4gKG5vdCBjdXJyZW50bHkgaW1wbGVtZW50ZWQgYmVjYXVzZSBub3QgcmVxdWlyZWQsIGJ1dCB0cml2aWFsKVxyXG4gICAgLSBUaGUgbG9naWNhbCBjaGlsZCBhdCBhbnkgZ2l2ZW4gaW5kZXhcclxuICAtIFdoZW5ldmVyIGEgbG9naWNhbCBjaGlsZCBpcyBhZGRlZCBvciByZW1vdmVkLCB3ZSB1cGRhdGUgdGhlIHBhcmVudCdzIGFycmF5IG9mIGxvZ2ljYWwgY2hpbGRyZW5cclxuKi9cclxuXHJcbmNvbnN0IGxvZ2ljYWxDaGlsZHJlblByb3BuYW1lID0gY3JlYXRlU3ltYm9sT3JGYWxsYmFjaygnX2JsYXpvckxvZ2ljYWxDaGlsZHJlbicpO1xyXG5jb25zdCBsb2dpY2FsUGFyZW50UHJvcG5hbWUgPSBjcmVhdGVTeW1ib2xPckZhbGxiYWNrKCdfYmxhem9yTG9naWNhbFBhcmVudCcpO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRvTG9naWNhbEVsZW1lbnQoZWxlbWVudDogRWxlbWVudCkge1xyXG4gIGlmIChlbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdOZXcgbG9naWNhbCBlbGVtZW50cyBtdXN0IHN0YXJ0IGVtcHR5Jyk7XHJcbiAgfVxyXG5cclxuICBlbGVtZW50W2xvZ2ljYWxDaGlsZHJlblByb3BuYW1lXSA9IFtdO1xyXG4gIHJldHVybiBlbGVtZW50IGFzIGFueSBhcyBMb2dpY2FsRWxlbWVudDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFuZEluc2VydExvZ2ljYWxDb250YWluZXIocGFyZW50OiBMb2dpY2FsRWxlbWVudCwgY2hpbGRJbmRleDogbnVtYmVyKTogTG9naWNhbEVsZW1lbnQge1xyXG4gIGNvbnN0IGNvbnRhaW5lckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KCchJyk7XHJcbiAgaW5zZXJ0TG9naWNhbENoaWxkKGNvbnRhaW5lckVsZW1lbnQsIHBhcmVudCwgY2hpbGRJbmRleCk7XHJcbiAgcmV0dXJuIGNvbnRhaW5lckVsZW1lbnQgYXMgYW55IGFzIExvZ2ljYWxFbGVtZW50O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5zZXJ0TG9naWNhbENoaWxkKGNoaWxkOiBOb2RlLCBwYXJlbnQ6IExvZ2ljYWxFbGVtZW50LCBjaGlsZEluZGV4OiBudW1iZXIpIHtcclxuICBjb25zdCBjaGlsZEFzTG9naWNhbEVsZW1lbnQgPSBjaGlsZCBhcyBhbnkgYXMgTG9naWNhbEVsZW1lbnQ7XHJcbiAgaWYgKGNoaWxkIGluc3RhbmNlb2YgQ29tbWVudCkge1xyXG4gICAgY29uc3QgZXhpc3RpbmdHcmFuZGNoaWxkcmVuID0gZ2V0TG9naWNhbENoaWxkcmVuQXJyYXkoY2hpbGRBc0xvZ2ljYWxFbGVtZW50KTtcclxuICAgIGlmIChleGlzdGluZ0dyYW5kY2hpbGRyZW4gJiYgZ2V0TG9naWNhbENoaWxkcmVuQXJyYXkoY2hpbGRBc0xvZ2ljYWxFbGVtZW50KS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIC8vIFRoZXJlJ3Mgbm90aGluZyB0byBzdG9wIHVzIGltcGxlbWVudGluZyBzdXBwb3J0IGZvciB0aGlzIHNjZW5hcmlvLCBhbmQgaXQncyBub3QgZGlmZmljdWx0XHJcbiAgICAgIC8vIChhZnRlciBpbnNlcnRpbmcgJ2NoaWxkJyBpdHNlbGYsIGFsc28gaXRlcmF0ZSB0aHJvdWdoIGl0cyBsb2dpY2FsIGNoaWxkcmVuIGFuZCBwaHlzaWNhbGx5XHJcbiAgICAgIC8vIHB1dCB0aGVtIGFzIGZvbGxvd2luZy1zaWJsaW5ncyBpbiB0aGUgRE9NKS4gSG93ZXZlciB0aGVyZSdzIG5vIHNjZW5hcmlvIHRoYXQgcmVxdWlyZXMgaXRcclxuICAgICAgLy8gcHJlc2VudGx5LCBzbyBpZiB3ZSBkaWQgaW1wbGVtZW50IGl0IHRoZXJlJ2QgYmUgbm8gZ29vZCB3YXkgdG8gaGF2ZSB0ZXN0cyBmb3IgaXQuXHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkOiBpbnNlcnRpbmcgbm9uLWVtcHR5IGxvZ2ljYWwgY29udGFpbmVyJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAoZ2V0TG9naWNhbFBhcmVudChjaGlsZEFzTG9naWNhbEVsZW1lbnQpKSB7XHJcbiAgICAvLyBMaWtld2lzZSwgd2UgY291bGQgZWFzaWx5IHN1cHBvcnQgdGhpcyBzY2VuYXJpbyB0b28gKGluIHRoaXMgJ2lmJyBibG9jaywganVzdCBzcGxpY2VcclxuICAgIC8vIG91dCAnY2hpbGQnIGZyb20gdGhlIGxvZ2ljYWwgY2hpbGRyZW4gYXJyYXkgb2YgaXRzIHByZXZpb3VzIGxvZ2ljYWwgcGFyZW50IGJ5IHVzaW5nXHJcbiAgICAvLyBBcnJheS5wcm90b3R5cGUuaW5kZXhPZiB0byBkZXRlcm1pbmUgaXRzIHByZXZpb3VzIHNpYmxpbmcgaW5kZXgpLlxyXG4gICAgLy8gQnV0IGFnYWluLCBzaW5jZSB0aGVyZSdzIG5vdCBjdXJyZW50bHkgYW55IHNjZW5hcmlvIHRoYXQgd291bGQgdXNlIGl0LCB3ZSB3b3VsZCBub3RcclxuICAgIC8vIGhhdmUgYW55IHRlc3QgY292ZXJhZ2UgZm9yIHN1Y2ggYW4gaW1wbGVtZW50YXRpb24uXHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZDogbW92aW5nIGV4aXN0aW5nIGxvZ2ljYWwgY2hpbGRyZW4nKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IG5ld1NpYmxpbmdzID0gZ2V0TG9naWNhbENoaWxkcmVuQXJyYXkocGFyZW50KTtcclxuICBpZiAoY2hpbGRJbmRleCA8IG5ld1NpYmxpbmdzLmxlbmd0aCkge1xyXG4gICAgLy8gSW5zZXJ0XHJcbiAgICBjb25zdCBuZXh0U2libGluZyA9IG5ld1NpYmxpbmdzW2NoaWxkSW5kZXhdIGFzIGFueSBhcyBOb2RlO1xyXG4gICAgbmV4dFNpYmxpbmcucGFyZW50Tm9kZSEuaW5zZXJ0QmVmb3JlKGNoaWxkLCBuZXh0U2libGluZyk7XHJcbiAgICBuZXdTaWJsaW5ncy5zcGxpY2UoY2hpbGRJbmRleCwgMCwgY2hpbGRBc0xvZ2ljYWxFbGVtZW50KTtcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gQXBwZW5kXHJcbiAgICBhcHBlbmREb21Ob2RlKGNoaWxkLCBwYXJlbnQpO1xyXG4gICAgbmV3U2libGluZ3MucHVzaChjaGlsZEFzTG9naWNhbEVsZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgY2hpbGRBc0xvZ2ljYWxFbGVtZW50W2xvZ2ljYWxQYXJlbnRQcm9wbmFtZV0gPSBwYXJlbnQ7XHJcbiAgaWYgKCEobG9naWNhbENoaWxkcmVuUHJvcG5hbWUgaW4gY2hpbGRBc0xvZ2ljYWxFbGVtZW50KSkge1xyXG4gICAgY2hpbGRBc0xvZ2ljYWxFbGVtZW50W2xvZ2ljYWxDaGlsZHJlblByb3BuYW1lXSA9IFtdO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUxvZ2ljYWxDaGlsZChwYXJlbnQ6IExvZ2ljYWxFbGVtZW50LCBjaGlsZEluZGV4OiBudW1iZXIpIHtcclxuICBjb25zdCBjaGlsZHJlbkFycmF5ID0gZ2V0TG9naWNhbENoaWxkcmVuQXJyYXkocGFyZW50KTtcclxuICBjb25zdCBjaGlsZFRvUmVtb3ZlID0gY2hpbGRyZW5BcnJheS5zcGxpY2UoY2hpbGRJbmRleCwgMSlbMF07XHJcblxyXG4gIC8vIElmIGl0J3MgYSBsb2dpY2FsIGNvbnRhaW5lciwgYWxzbyByZW1vdmUgaXRzIGRlc2NlbmRhbnRzXHJcbiAgaWYgKGNoaWxkVG9SZW1vdmUgaW5zdGFuY2VvZiBDb21tZW50KSB7XHJcbiAgICBjb25zdCBncmFuZGNoaWxkcmVuQXJyYXkgPSBnZXRMb2dpY2FsQ2hpbGRyZW5BcnJheShjaGlsZFRvUmVtb3ZlKTtcclxuICAgIHdoaWxlIChncmFuZGNoaWxkcmVuQXJyYXkubGVuZ3RoID4gMCkge1xyXG4gICAgICByZW1vdmVMb2dpY2FsQ2hpbGQoY2hpbGRUb1JlbW92ZSwgMCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBGaW5hbGx5LCByZW1vdmUgdGhlIG5vZGUgaXRzZWxmXHJcbiAgY29uc3QgZG9tTm9kZVRvUmVtb3ZlID0gY2hpbGRUb1JlbW92ZSBhcyBhbnkgYXMgTm9kZTtcclxuICBkb21Ob2RlVG9SZW1vdmUucGFyZW50Tm9kZSEucmVtb3ZlQ2hpbGQoZG9tTm9kZVRvUmVtb3ZlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldExvZ2ljYWxQYXJlbnQoZWxlbWVudDogTG9naWNhbEVsZW1lbnQpOiBMb2dpY2FsRWxlbWVudCB8IG51bGwge1xyXG4gIHJldHVybiAoZWxlbWVudFtsb2dpY2FsUGFyZW50UHJvcG5hbWVdIGFzIExvZ2ljYWxFbGVtZW50KSB8fCBudWxsO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9naWNhbENoaWxkKHBhcmVudDogTG9naWNhbEVsZW1lbnQsIGNoaWxkSW5kZXg6IG51bWJlcik6IExvZ2ljYWxFbGVtZW50IHtcclxuICByZXR1cm4gZ2V0TG9naWNhbENoaWxkcmVuQXJyYXkocGFyZW50KVtjaGlsZEluZGV4XTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzU3ZnRWxlbWVudChlbGVtZW50OiBMb2dpY2FsRWxlbWVudCkge1xyXG4gIHJldHVybiBnZXRDbG9zZXN0RG9tRWxlbWVudChlbGVtZW50KS5uYW1lc3BhY2VVUkkgPT09ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldExvZ2ljYWxDaGlsZHJlbkFycmF5KGVsZW1lbnQ6IExvZ2ljYWxFbGVtZW50KSB7XHJcbiAgcmV0dXJuIGVsZW1lbnRbbG9naWNhbENoaWxkcmVuUHJvcG5hbWVdIGFzIExvZ2ljYWxFbGVtZW50W107XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldExvZ2ljYWxOZXh0U2libGluZyhlbGVtZW50OiBMb2dpY2FsRWxlbWVudCk6IExvZ2ljYWxFbGVtZW50IHwgbnVsbCB7XHJcbiAgY29uc3Qgc2libGluZ3MgPSBnZXRMb2dpY2FsQ2hpbGRyZW5BcnJheShnZXRMb2dpY2FsUGFyZW50KGVsZW1lbnQpISk7XHJcbiAgY29uc3Qgc2libGluZ0luZGV4ID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChzaWJsaW5ncywgZWxlbWVudCk7XHJcbiAgcmV0dXJuIHNpYmxpbmdzW3NpYmxpbmdJbmRleCArIDFdIHx8IG51bGw7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENsb3Nlc3REb21FbGVtZW50KGxvZ2ljYWxFbGVtZW50OiBMb2dpY2FsRWxlbWVudCkge1xyXG4gIGlmIChsb2dpY2FsRWxlbWVudCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcclxuICAgIHJldHVybiBsb2dpY2FsRWxlbWVudDtcclxuICB9IGVsc2UgaWYgKGxvZ2ljYWxFbGVtZW50IGluc3RhbmNlb2YgQ29tbWVudCkge1xyXG4gICAgcmV0dXJuIGxvZ2ljYWxFbGVtZW50LnBhcmVudE5vZGUhIGFzIEVsZW1lbnQ7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignTm90IGEgdmFsaWQgbG9naWNhbCBlbGVtZW50Jyk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBhcHBlbmREb21Ob2RlKGNoaWxkOiBOb2RlLCBwYXJlbnQ6IExvZ2ljYWxFbGVtZW50KSB7XHJcbiAgLy8gVGhpcyBmdW5jdGlvbiBvbmx5IHB1dHMgJ2NoaWxkJyBpbnRvIHRoZSBET00gaW4gdGhlIHJpZ2h0IHBsYWNlIHJlbGF0aXZlIHRvICdwYXJlbnQnXHJcbiAgLy8gSXQgZG9lcyBub3QgdXBkYXRlIHRoZSBsb2dpY2FsIGNoaWxkcmVuIGFycmF5IG9mIGFueXRoaW5nXHJcbiAgaWYgKHBhcmVudCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcclxuICAgIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XHJcbiAgfSBlbHNlIGlmIChwYXJlbnQgaW5zdGFuY2VvZiBDb21tZW50KSB7XHJcbiAgICBjb25zdCBwYXJlbnRMb2dpY2FsTmV4dFNpYmxpbmcgPSBnZXRMb2dpY2FsTmV4dFNpYmxpbmcocGFyZW50KSBhcyBhbnkgYXMgTm9kZTtcclxuICAgIGlmIChwYXJlbnRMb2dpY2FsTmV4dFNpYmxpbmcpIHtcclxuICAgICAgLy8gU2luY2UgdGhlIHBhcmVudCBoYXMgYSBsb2dpY2FsIG5leHQtc2libGluZywgaXRzIGFwcGVuZGVkIGNoaWxkIGdvZXMgcmlnaHQgYmVmb3JlIHRoYXRcclxuICAgICAgcGFyZW50TG9naWNhbE5leHRTaWJsaW5nLnBhcmVudE5vZGUhLmluc2VydEJlZm9yZShjaGlsZCwgcGFyZW50TG9naWNhbE5leHRTaWJsaW5nKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIFNpbmNlIHRoZSBwYXJlbnQgaGFzIG5vIGxvZ2ljYWwgbmV4dC1zaWJsaW5nLCBrZWVwIHJlY3Vyc2luZyB1cHdhcmRzIHVudGlsIHdlIGZpbmRcclxuICAgICAgLy8gYSBsb2dpY2FsIGFuY2VzdG9yIHRoYXQgZG9lcyBoYXZlIGEgbmV4dC1zaWJsaW5nIG9yIGlzIGEgcGh5c2ljYWwgZWxlbWVudC5cclxuICAgICAgYXBwZW5kRG9tTm9kZShjaGlsZCwgZ2V0TG9naWNhbFBhcmVudChwYXJlbnQpISk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIFNob3VsZCBuZXZlciBoYXBwZW5cclxuICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGFwcGVuZCBub2RlIGJlY2F1c2UgdGhlIHBhcmVudCBpcyBub3QgYSB2YWxpZCBsb2dpY2FsIGVsZW1lbnQuIFBhcmVudDogJHtwYXJlbnR9YCk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVTeW1ib2xPckZhbGxiYWNrKGZhbGxiYWNrOiBzdHJpbmcpOiBzeW1ib2wgfCBzdHJpbmcge1xyXG4gIHJldHVybiB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nID8gU3ltYm9sKCkgOiBmYWxsYmFjaztcclxufVxyXG5cclxuLy8gTm9taW5hbCB0eXBlIHRvIHJlcHJlc2VudCBhIGxvZ2ljYWwgZWxlbWVudCB3aXRob3V0IG5lZWRpbmcgdG8gYWxsb2NhdGUgYW55IG9iamVjdCBmb3IgaW5zdGFuY2VzXHJcbmV4cG9ydCBpbnRlcmZhY2UgTG9naWNhbEVsZW1lbnQgeyBMb2dpY2FsRWxlbWVudF9fRE9fTk9UX0lNUExFTUVOVDogYW55IH07XHJcbiIsImV4cG9ydCBpbnRlcmZhY2UgUmVuZGVyQmF0Y2gge1xyXG4gIHVwZGF0ZWRDb21wb25lbnRzKCk6IEFycmF5UmFuZ2U8UmVuZGVyVHJlZURpZmY+O1xyXG4gIHJlZmVyZW5jZUZyYW1lcygpOiBBcnJheVJhbmdlPFJlbmRlclRyZWVGcmFtZT47XHJcbiAgZGlzcG9zZWRDb21wb25lbnRJZHMoKTogQXJyYXlSYW5nZTxudW1iZXI+O1xyXG4gIGRpc3Bvc2VkRXZlbnRIYW5kbGVySWRzKCk6IEFycmF5UmFuZ2U8bnVtYmVyPjtcclxuXHJcbiAgdXBkYXRlZENvbXBvbmVudHNFbnRyeSh2YWx1ZXM6IEFycmF5VmFsdWVzPFJlbmRlclRyZWVEaWZmPiwgaW5kZXg6IG51bWJlcik6IFJlbmRlclRyZWVEaWZmO1xyXG4gIHJlZmVyZW5jZUZyYW1lc0VudHJ5KHZhbHVlczogQXJyYXlWYWx1ZXM8UmVuZGVyVHJlZUZyYW1lPiwgaW5kZXg6IG51bWJlcik6IFJlbmRlclRyZWVGcmFtZTtcclxuICBkaXNwb3NlZENvbXBvbmVudElkc0VudHJ5KHZhbHVlczogQXJyYXlWYWx1ZXM8bnVtYmVyPiwgaW5kZXg6IG51bWJlcik6IG51bWJlcjtcclxuICBkaXNwb3NlZEV2ZW50SGFuZGxlcklkc0VudHJ5KHZhbHVlczogQXJyYXlWYWx1ZXM8bnVtYmVyPiwgaW5kZXg6IG51bWJlcik6IG51bWJlcjtcclxuXHJcbiAgZGlmZlJlYWRlcjogUmVuZGVyVHJlZURpZmZSZWFkZXI7XHJcbiAgZWRpdFJlYWRlcjogUmVuZGVyVHJlZUVkaXRSZWFkZXI7XHJcbiAgZnJhbWVSZWFkZXI6IFJlbmRlclRyZWVGcmFtZVJlYWRlcjtcclxuICBhcnJheVJhbmdlUmVhZGVyOiBBcnJheVJhbmdlUmVhZGVyO1xyXG4gIGFycmF5U2VnbWVudFJlYWRlcjogQXJyYXlTZWdtZW50UmVhZGVyO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEFycmF5UmFuZ2VSZWFkZXIge1xyXG4gIGNvdW50PFQ+KGFycmF5UmFuZ2U6IEFycmF5UmFuZ2U8VD4pOiBudW1iZXI7XHJcbiAgdmFsdWVzPFQ+KGFycmF5UmFuZ2U6IEFycmF5UmFuZ2U8VD4pOiBBcnJheVZhbHVlczxUPjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBcnJheVNlZ21lbnRSZWFkZXIge1xyXG4gIG9mZnNldDxUPihhcnJheVNlZ21lbnQ6IEFycmF5U2VnbWVudDxUPik6IG51bWJlcjtcclxuICBjb3VudDxUPihhcnJheVNlZ21lbnQ6IEFycmF5U2VnbWVudDxUPik6IG51bWJlcjtcclxuICB2YWx1ZXM8VD4oYXJyYXlTZWdtZW50OiBBcnJheVNlZ21lbnQ8VD4pOiBBcnJheVZhbHVlczxUPjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSZW5kZXJUcmVlRGlmZlJlYWRlciB7XHJcbiAgY29tcG9uZW50SWQoZGlmZjogUmVuZGVyVHJlZURpZmYpOiBudW1iZXI7XHJcbiAgZWRpdHMoZGlmZjogUmVuZGVyVHJlZURpZmYpOiBBcnJheVNlZ21lbnQ8UmVuZGVyVHJlZUVkaXQ+O1xyXG4gIGVkaXRzRW50cnkodmFsdWVzOiBBcnJheVZhbHVlczxSZW5kZXJUcmVlRWRpdD4sIGluZGV4OiBudW1iZXIpOiBSZW5kZXJUcmVlRWRpdDtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSZW5kZXJUcmVlRWRpdFJlYWRlciB7XHJcbiAgZWRpdFR5cGUoZWRpdDogUmVuZGVyVHJlZUVkaXQpOiBFZGl0VHlwZTtcclxuICBzaWJsaW5nSW5kZXgoZWRpdDogUmVuZGVyVHJlZUVkaXQpOiBudW1iZXI7XHJcbiAgbmV3VHJlZUluZGV4KGVkaXQ6IFJlbmRlclRyZWVFZGl0KTogbnVtYmVyO1xyXG4gIHJlbW92ZWRBdHRyaWJ1dGVOYW1lKGVkaXQ6IFJlbmRlclRyZWVFZGl0KTogc3RyaW5nIHwgbnVsbDtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSZW5kZXJUcmVlRnJhbWVSZWFkZXIge1xyXG4gIGZyYW1lVHlwZShmcmFtZTogUmVuZGVyVHJlZUZyYW1lKTogRnJhbWVUeXBlO1xyXG4gIHN1YnRyZWVMZW5ndGgoZnJhbWU6IFJlbmRlclRyZWVGcmFtZSk6IG51bWJlcjtcclxuICBlbGVtZW50UmVmZXJlbmNlQ2FwdHVyZUlkKGZyYW1lOiBSZW5kZXJUcmVlRnJhbWUpOiBudW1iZXI7XHJcbiAgY29tcG9uZW50SWQoZnJhbWU6IFJlbmRlclRyZWVGcmFtZSk6IG51bWJlcjtcclxuICBlbGVtZW50TmFtZShmcmFtZTogUmVuZGVyVHJlZUZyYW1lKTogc3RyaW5nIHwgbnVsbDtcclxuICB0ZXh0Q29udGVudChmcmFtZTogUmVuZGVyVHJlZUZyYW1lKTogc3RyaW5nIHwgbnVsbDtcclxuICBhdHRyaWJ1dGVOYW1lKGZyYW1lOiBSZW5kZXJUcmVlRnJhbWUpOiBzdHJpbmcgfCBudWxsO1xyXG4gIGF0dHJpYnV0ZVZhbHVlKGZyYW1lOiBSZW5kZXJUcmVlRnJhbWUpOiBzdHJpbmcgfCBudWxsO1xyXG4gIGF0dHJpYnV0ZUV2ZW50SGFuZGxlcklkKGZyYW1lOiBSZW5kZXJUcmVlRnJhbWUpOiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQXJyYXlSYW5nZTxUPiB7IEFycmF5UmFuZ2VfX0RPX05PVF9JTVBMRU1FTlQ6IGFueSB9XHJcbmV4cG9ydCBpbnRlcmZhY2UgQXJyYXlTZWdtZW50PFQ+IHsgQXJyYXlTZWdtZW50X19ET19OT1RfSU1QTEVNRU5UOiBhbnkgfVxyXG5leHBvcnQgaW50ZXJmYWNlIEFycmF5VmFsdWVzPFQ+IHsgQXJyYXlWYWx1ZXNfX0RPX05PVF9JTVBMRU1FTlQ6IGFueSB9XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJlbmRlclRyZWVEaWZmIHsgUmVuZGVyVHJlZURpZmZfX0RPX05PVF9JTVBMRU1FTlQ6IGFueSB9XHJcbmV4cG9ydCBpbnRlcmZhY2UgUmVuZGVyVHJlZUZyYW1lIHsgUmVuZGVyVHJlZUZyYW1lX19ET19OT1RfSU1QTEVNRU5UOiBhbnkgfVxyXG5leHBvcnQgaW50ZXJmYWNlIFJlbmRlclRyZWVFZGl0IHsgUmVuZGVyVHJlZUVkaXRfX0RPX05PVF9JTVBMRU1FTlQ6IGFueSB9XHJcblxyXG5leHBvcnQgZW51bSBFZGl0VHlwZSB7XHJcbiAgLy8gVGhlIHZhbHVlcyBtdXN0IGJlIGtlcHQgaW4gc3luYyB3aXRoIHRoZSAuTkVUIGVxdWl2YWxlbnQgaW4gUmVuZGVyVHJlZUVkaXRUeXBlLmNzXHJcbiAgcHJlcGVuZEZyYW1lID0gMSxcclxuICByZW1vdmVGcmFtZSA9IDIsXHJcbiAgc2V0QXR0cmlidXRlID0gMyxcclxuICByZW1vdmVBdHRyaWJ1dGUgPSA0LFxyXG4gIHVwZGF0ZVRleHQgPSA1LFxyXG4gIHN0ZXBJbiA9IDYsXHJcbiAgc3RlcE91dCA9IDcsXHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIEZyYW1lVHlwZSB7XHJcbiAgLy8gVGhlIHZhbHVlcyBtdXN0IGJlIGtlcHQgaW4gc3luYyB3aXRoIHRoZSAuTkVUIGVxdWl2YWxlbnQgaW4gUmVuZGVyVHJlZUZyYW1lVHlwZS5jc1xyXG4gIGVsZW1lbnQgPSAxLFxyXG4gIHRleHQgPSAyLFxyXG4gIGF0dHJpYnV0ZSA9IDMsXHJcbiAgY29tcG9uZW50ID0gNCxcclxuICByZWdpb24gPSA1LFxyXG4gIGVsZW1lbnRSZWZlcmVuY2VDYXB0dXJlID0gNixcclxufVxyXG4iLCJpbXBvcnQgeyBwbGF0Zm9ybSB9IGZyb20gJy4uLy4uL0Vudmlyb25tZW50JztcclxuaW1wb3J0IHsgUmVuZGVyQmF0Y2gsIEFycmF5UmFuZ2UsIEFycmF5UmFuZ2VSZWFkZXIsIEFycmF5U2VnbWVudCwgUmVuZGVyVHJlZURpZmYsIFJlbmRlclRyZWVFZGl0LCBSZW5kZXJUcmVlRnJhbWUsIEFycmF5VmFsdWVzLCBFZGl0VHlwZSwgRnJhbWVUeXBlLCBSZW5kZXJUcmVlRnJhbWVSZWFkZXIgfSBmcm9tICcuL1JlbmRlckJhdGNoJztcclxuaW1wb3J0IHsgUG9pbnRlciwgU3lzdGVtX0FycmF5IH0gZnJvbSAnLi4vLi4vUGxhdGZvcm0vUGxhdGZvcm0nO1xyXG5cclxuLy8gVXNlZCB3aGVuIHJ1bm5pbmcgb24gTW9ubyBXZWJBc3NlbWJseSBmb3Igc2hhcmVkLW1lbW9yeSBpbnRlcm9wLiBUaGUgY29kZSBoZXJlIGVuY2Fwc3VsYXRlc1xyXG4vLyBvdXIga25vd2xlZGdlIG9mIHRoZSBtZW1vcnkgbGF5b3V0IG9mIFJlbmRlckJhdGNoIGFuZCBhbGwgcmVmZXJlbmNlZCB0eXBlcy5cclxuLy9cclxuLy8gSW4gdGhpcyBpbXBsZW1lbnRhdGlvbiwgYWxsIHRoZSBEVE8gdHlwZXMgYXJlIHJlYWxseSBoZWFwIHBvaW50ZXJzIGF0IHJ1bnRpbWUsIGhlbmNlIGFsbFxyXG4vLyB0aGUgY2FzdHMgdG8gJ2FueScgd2hlbmV2ZXIgd2UgcGFzcyB0aGVtIHRvIHBsYXRmb3JtLnJlYWQuXHJcblxyXG5leHBvcnQgY2xhc3MgU2hhcmVkTWVtb3J5UmVuZGVyQmF0Y2ggaW1wbGVtZW50cyBSZW5kZXJCYXRjaCB7XHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBiYXRjaEFkZHJlc3M6IFBvaW50ZXIpIHtcclxuICB9XHJcblxyXG4gIC8vIEtlZXAgaW4gc3luYyB3aXRoIG1lbW9yeSBsYXlvdXQgaW4gUmVuZGVyQmF0Y2guY3NcclxuICB1cGRhdGVkQ29tcG9uZW50cygpIHsgcmV0dXJuIHBsYXRmb3JtLnJlYWRTdHJ1Y3RGaWVsZDxQb2ludGVyPih0aGlzLmJhdGNoQWRkcmVzcywgMCkgYXMgYW55IGFzIEFycmF5UmFuZ2U8UmVuZGVyVHJlZURpZmY+OyB9XHJcbiAgcmVmZXJlbmNlRnJhbWVzKCkgeyByZXR1cm4gcGxhdGZvcm0ucmVhZFN0cnVjdEZpZWxkPFBvaW50ZXI+KHRoaXMuYmF0Y2hBZGRyZXNzLCBhcnJheVJhbmdlUmVhZGVyLnN0cnVjdExlbmd0aCkgYXMgYW55IGFzIEFycmF5UmFuZ2U8UmVuZGVyVHJlZURpZmY+OyB9XHJcbiAgZGlzcG9zZWRDb21wb25lbnRJZHMoKSB7IHJldHVybiBwbGF0Zm9ybS5yZWFkU3RydWN0RmllbGQ8UG9pbnRlcj4odGhpcy5iYXRjaEFkZHJlc3MsIGFycmF5UmFuZ2VSZWFkZXIuc3RydWN0TGVuZ3RoICogMikgYXMgYW55IGFzIEFycmF5UmFuZ2U8bnVtYmVyPjsgfVxyXG4gIGRpc3Bvc2VkRXZlbnRIYW5kbGVySWRzKCkgeyByZXR1cm4gcGxhdGZvcm0ucmVhZFN0cnVjdEZpZWxkPFBvaW50ZXI+KHRoaXMuYmF0Y2hBZGRyZXNzLCBhcnJheVJhbmdlUmVhZGVyLnN0cnVjdExlbmd0aCAqIDMpIGFzIGFueSBhcyBBcnJheVJhbmdlPG51bWJlcj47IH1cclxuXHJcbiAgdXBkYXRlZENvbXBvbmVudHNFbnRyeSh2YWx1ZXM6IEFycmF5VmFsdWVzPFJlbmRlclRyZWVEaWZmPiwgaW5kZXg6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIGFycmF5VmFsdWVzRW50cnkodmFsdWVzLCBpbmRleCwgZGlmZlJlYWRlci5zdHJ1Y3RMZW5ndGgpO1xyXG4gIH1cclxuICByZWZlcmVuY2VGcmFtZXNFbnRyeSh2YWx1ZXM6IEFycmF5VmFsdWVzPFJlbmRlclRyZWVGcmFtZT4sIGluZGV4OiBudW1iZXIpIHtcclxuICAgIHJldHVybiBhcnJheVZhbHVlc0VudHJ5KHZhbHVlcywgaW5kZXgsIGZyYW1lUmVhZGVyLnN0cnVjdExlbmd0aCk7XHJcbiAgfVxyXG4gIGRpc3Bvc2VkQ29tcG9uZW50SWRzRW50cnkodmFsdWVzOiBBcnJheVZhbHVlczxudW1iZXI+LCBpbmRleDogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gYXJyYXlWYWx1ZXNFbnRyeSh2YWx1ZXMsIGluZGV4LCAvKiBpbnQgbGVuZ3RoICovIDQpO1xyXG4gIH1cclxuICBkaXNwb3NlZEV2ZW50SGFuZGxlcklkc0VudHJ5KHZhbHVlczogQXJyYXlWYWx1ZXM8bnVtYmVyPiwgaW5kZXg6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIGFycmF5VmFsdWVzRW50cnkodmFsdWVzLCBpbmRleCwgLyogaW50IGxlbmd0aCAqLyA0KTtcclxuICB9XHJcblxyXG4gIGFycmF5UmFuZ2VSZWFkZXIgPSBhcnJheVJhbmdlUmVhZGVyO1xyXG4gIGFycmF5U2VnbWVudFJlYWRlciA9IGFycmF5U2VnbWVudFJlYWRlcjtcclxuICBkaWZmUmVhZGVyID0gZGlmZlJlYWRlcjtcclxuICBlZGl0UmVhZGVyID0gZWRpdFJlYWRlcjtcclxuICBmcmFtZVJlYWRlciA9IGZyYW1lUmVhZGVyO1xyXG59XHJcblxyXG4vLyBLZWVwIGluIHN5bmMgd2l0aCBtZW1vcnkgbGF5b3V0IGluIEFycmF5UmFuZ2UuY3NcclxuY29uc3QgYXJyYXlSYW5nZVJlYWRlciA9IHtcclxuICBzdHJ1Y3RMZW5ndGg6IDgsXHJcbiAgdmFsdWVzOiA8VD4oYXJyYXlSYW5nZTogQXJyYXlSYW5nZTxUPikgPT4gcGxhdGZvcm0ucmVhZE9iamVjdEZpZWxkPFN5c3RlbV9BcnJheTxUPj4oYXJyYXlSYW5nZSBhcyBhbnksIDApIGFzIGFueSBhcyBBcnJheVZhbHVlczxUPixcclxuICBjb3VudDogPFQ+KGFycmF5UmFuZ2U6IEFycmF5UmFuZ2U8VD4pID0+IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKGFycmF5UmFuZ2UgYXMgYW55LCA0KSxcclxufTtcclxuXHJcbi8vIEtlZXAgaW4gc3luYyB3aXRoIG1lbW9yeSBsYXlvdXQgaW4gQXJyYXlTZWdtZW50XHJcbmNvbnN0IGFycmF5U2VnbWVudFJlYWRlciA9IHtcclxuICBzdHJ1Y3RMZW5ndGg6IDEyLFxyXG4gIHZhbHVlczogPFQ+KGFycmF5U2VnbWVudDogQXJyYXlTZWdtZW50PFQ+KSA9PiBwbGF0Zm9ybS5yZWFkT2JqZWN0RmllbGQ8U3lzdGVtX0FycmF5PFQ+PihhcnJheVNlZ21lbnQgYXMgYW55LCAwKSBhcyBhbnkgYXMgQXJyYXlWYWx1ZXM8VD4sXHJcbiAgb2Zmc2V0OiA8VD4oYXJyYXlTZWdtZW50OiBBcnJheVNlZ21lbnQ8VD4pID0+IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKGFycmF5U2VnbWVudCBhcyBhbnksIDQpLFxyXG4gIGNvdW50OiA8VD4oYXJyYXlTZWdtZW50OiBBcnJheVNlZ21lbnQ8VD4pID0+IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKGFycmF5U2VnbWVudCBhcyBhbnksIDgpLFxyXG59O1xyXG5cclxuLy8gS2VlcCBpbiBzeW5jIHdpdGggbWVtb3J5IGxheW91dCBpbiBSZW5kZXJUcmVlRGlmZi5jc1xyXG5jb25zdCBkaWZmUmVhZGVyID0ge1xyXG4gIHN0cnVjdExlbmd0aDogNCArIGFycmF5U2VnbWVudFJlYWRlci5zdHJ1Y3RMZW5ndGgsXHJcbiAgY29tcG9uZW50SWQ6IChkaWZmOiBSZW5kZXJUcmVlRGlmZikgPT4gcGxhdGZvcm0ucmVhZEludDMyRmllbGQoZGlmZiBhcyBhbnksIDApLFxyXG4gIGVkaXRzOiAoZGlmZjogUmVuZGVyVHJlZURpZmYpID0+IHBsYXRmb3JtLnJlYWRTdHJ1Y3RGaWVsZDxQb2ludGVyPihkaWZmIGFzIGFueSwgNCkgYXMgYW55IGFzIEFycmF5U2VnbWVudDxSZW5kZXJUcmVlRWRpdD4sXHJcbiAgZWRpdHNFbnRyeTogKHZhbHVlczogQXJyYXlWYWx1ZXM8UmVuZGVyVHJlZUVkaXQ+LCBpbmRleDogbnVtYmVyKSA9PiBhcnJheVZhbHVlc0VudHJ5KHZhbHVlcywgaW5kZXgsIGVkaXRSZWFkZXIuc3RydWN0TGVuZ3RoKSxcclxufTtcclxuXHJcbi8vIEtlZXAgaW4gc3luYyB3aXRoIG1lbW9yeSBsYXlvdXQgaW4gUmVuZGVyVHJlZUVkaXQuY3NcclxuY29uc3QgZWRpdFJlYWRlciA9IHtcclxuICBzdHJ1Y3RMZW5ndGg6IDE2LFxyXG4gIGVkaXRUeXBlOiAoZWRpdDogUmVuZGVyVHJlZUVkaXQpID0+IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKGVkaXQgYXMgYW55LCAwKSBhcyBFZGl0VHlwZSxcclxuICBzaWJsaW5nSW5kZXg6IChlZGl0OiBSZW5kZXJUcmVlRWRpdCkgPT4gcGxhdGZvcm0ucmVhZEludDMyRmllbGQoZWRpdCBhcyBhbnksIDQpLFxyXG4gIG5ld1RyZWVJbmRleDogKGVkaXQ6IFJlbmRlclRyZWVFZGl0KSA9PiBwbGF0Zm9ybS5yZWFkSW50MzJGaWVsZChlZGl0IGFzIGFueSwgOCksXHJcbiAgcmVtb3ZlZEF0dHJpYnV0ZU5hbWU6IChlZGl0OiBSZW5kZXJUcmVlRWRpdCkgPT4gcGxhdGZvcm0ucmVhZFN0cmluZ0ZpZWxkKGVkaXQgYXMgYW55LCAxMiksXHJcbn07XHJcblxyXG4vLyBLZWVwIGluIHN5bmMgd2l0aCBtZW1vcnkgbGF5b3V0IGluIFJlbmRlclRyZWVGcmFtZS5jc1xyXG5jb25zdCBmcmFtZVJlYWRlciA9IHtcclxuICBzdHJ1Y3RMZW5ndGg6IDI4LFxyXG4gIGZyYW1lVHlwZTogKGZyYW1lOiBSZW5kZXJUcmVlRnJhbWUpID0+IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKGZyYW1lIGFzIGFueSwgNCkgYXMgRnJhbWVUeXBlLFxyXG4gIHN1YnRyZWVMZW5ndGg6IChmcmFtZTogUmVuZGVyVHJlZUZyYW1lKSA9PiBwbGF0Zm9ybS5yZWFkSW50MzJGaWVsZChmcmFtZSBhcyBhbnksIDgpLFxyXG4gIGVsZW1lbnRSZWZlcmVuY2VDYXB0dXJlSWQ6IChmcmFtZTogUmVuZGVyVHJlZUZyYW1lKSA9PiBwbGF0Zm9ybS5yZWFkSW50MzJGaWVsZChmcmFtZSBhcyBhbnksIDgpLFxyXG4gIGNvbXBvbmVudElkOiAoZnJhbWU6IFJlbmRlclRyZWVGcmFtZSkgPT4gcGxhdGZvcm0ucmVhZEludDMyRmllbGQoZnJhbWUgYXMgYW55LCAxMiksXHJcbiAgZWxlbWVudE5hbWU6IChmcmFtZTogUmVuZGVyVHJlZUZyYW1lKSA9PiBwbGF0Zm9ybS5yZWFkU3RyaW5nRmllbGQoZnJhbWUgYXMgYW55LCAxNiksXHJcbiAgdGV4dENvbnRlbnQ6IChmcmFtZTogUmVuZGVyVHJlZUZyYW1lKSA9PiBwbGF0Zm9ybS5yZWFkU3RyaW5nRmllbGQoZnJhbWUgYXMgYW55LCAxNiksXHJcbiAgYXR0cmlidXRlTmFtZTogKGZyYW1lOiBSZW5kZXJUcmVlRnJhbWUpID0+IHBsYXRmb3JtLnJlYWRTdHJpbmdGaWVsZChmcmFtZSBhcyBhbnksIDE2KSxcclxuICBhdHRyaWJ1dGVWYWx1ZTogKGZyYW1lOiBSZW5kZXJUcmVlRnJhbWUpID0+IHBsYXRmb3JtLnJlYWRTdHJpbmdGaWVsZChmcmFtZSBhcyBhbnksIDI0KSxcclxuICBhdHRyaWJ1dGVFdmVudEhhbmRsZXJJZDogKGZyYW1lOiBSZW5kZXJUcmVlRnJhbWUpID0+IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKGZyYW1lIGFzIGFueSwgOCksXHJcbn07XHJcblxyXG5mdW5jdGlvbiBhcnJheVZhbHVlc0VudHJ5PFQ+KGFycmF5VmFsdWVzOiBBcnJheVZhbHVlczxUPiwgaW5kZXg6IG51bWJlciwgaXRlbVNpemU6IG51bWJlcik6IFQge1xyXG4gIHJldHVybiBwbGF0Zm9ybS5nZXRBcnJheUVudHJ5UHRyKGFycmF5VmFsdWVzIGFzIGFueSBhcyBTeXN0ZW1fQXJyYXk8VD4sIGluZGV4LCBpdGVtU2l6ZSkgYXMgYW55IGFzIFQ7XHJcbn1cclxuIiwiaW1wb3J0IHsgU3lzdGVtX09iamVjdCwgU3lzdGVtX1N0cmluZywgU3lzdGVtX0FycmF5LCBNZXRob2RIYW5kbGUsIFBvaW50ZXIgfSBmcm9tICcuLi9QbGF0Zm9ybS9QbGF0Zm9ybSc7XHJcbmltcG9ydCB7IHBsYXRmb3JtIH0gZnJvbSAnLi4vRW52aXJvbm1lbnQnO1xyXG5pbXBvcnQgeyBSZW5kZXJCYXRjaCB9IGZyb20gJy4vUmVuZGVyQmF0Y2gvUmVuZGVyQmF0Y2gnO1xyXG5pbXBvcnQgeyBCcm93c2VyUmVuZGVyZXIgfSBmcm9tICcuL0Jyb3dzZXJSZW5kZXJlcic7XHJcblxyXG50eXBlIEJyb3dzZXJSZW5kZXJlclJlZ2lzdHJ5ID0geyBbYnJvd3NlclJlbmRlcmVySWQ6IG51bWJlcl06IEJyb3dzZXJSZW5kZXJlciB9O1xyXG5jb25zdCBicm93c2VyUmVuZGVyZXJzOiBCcm93c2VyUmVuZGVyZXJSZWdpc3RyeSA9IHt9O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGF0dGFjaFJvb3RDb21wb25lbnRUb0VsZW1lbnQoYnJvd3NlclJlbmRlcmVySWQ6IG51bWJlciwgZWxlbWVudFNlbGVjdG9yOiBzdHJpbmcsIGNvbXBvbmVudElkOiBudW1iZXIpIHtcclxuICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbGVtZW50U2VsZWN0b3IpO1xyXG4gIGlmICghZWxlbWVudCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBhbnkgZWxlbWVudCBtYXRjaGluZyBzZWxlY3RvciAnJHtlbGVtZW50U2VsZWN0b3J9Jy5gKTtcclxuICB9XHJcblxyXG4gIGxldCBicm93c2VyUmVuZGVyZXIgPSBicm93c2VyUmVuZGVyZXJzW2Jyb3dzZXJSZW5kZXJlcklkXTtcclxuICBpZiAoIWJyb3dzZXJSZW5kZXJlcikge1xyXG4gICAgYnJvd3NlclJlbmRlcmVyID0gYnJvd3NlclJlbmRlcmVyc1ticm93c2VyUmVuZGVyZXJJZF0gPSBuZXcgQnJvd3NlclJlbmRlcmVyKGJyb3dzZXJSZW5kZXJlcklkKTtcclxuICB9XHJcbiAgY2xlYXJFbGVtZW50KGVsZW1lbnQpO1xyXG4gIGJyb3dzZXJSZW5kZXJlci5hdHRhY2hSb290Q29tcG9uZW50VG9FbGVtZW50KGNvbXBvbmVudElkLCBlbGVtZW50KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckJhdGNoKGJyb3dzZXJSZW5kZXJlcklkOiBudW1iZXIsIGJhdGNoOiBSZW5kZXJCYXRjaCkge1xyXG4gIGNvbnN0IGJyb3dzZXJSZW5kZXJlciA9IGJyb3dzZXJSZW5kZXJlcnNbYnJvd3NlclJlbmRlcmVySWRdO1xyXG4gIGlmICghYnJvd3NlclJlbmRlcmVyKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZXJlIGlzIG5vIGJyb3dzZXIgcmVuZGVyZXIgd2l0aCBJRCAke2Jyb3dzZXJSZW5kZXJlcklkfS5gKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGFycmF5UmFuZ2VSZWFkZXIgPSBiYXRjaC5hcnJheVJhbmdlUmVhZGVyO1xyXG4gIGNvbnN0IHVwZGF0ZWRDb21wb25lbnRzUmFuZ2UgPSBiYXRjaC51cGRhdGVkQ29tcG9uZW50cygpO1xyXG4gIGNvbnN0IHVwZGF0ZWRDb21wb25lbnRzVmFsdWVzID0gYXJyYXlSYW5nZVJlYWRlci52YWx1ZXModXBkYXRlZENvbXBvbmVudHNSYW5nZSk7XHJcbiAgY29uc3QgdXBkYXRlZENvbXBvbmVudHNMZW5ndGggPSBhcnJheVJhbmdlUmVhZGVyLmNvdW50KHVwZGF0ZWRDb21wb25lbnRzUmFuZ2UpO1xyXG4gIGNvbnN0IHJlZmVyZW5jZUZyYW1lcyA9IGJhdGNoLnJlZmVyZW5jZUZyYW1lcygpO1xyXG4gIGNvbnN0IHJlZmVyZW5jZUZyYW1lc1ZhbHVlcyA9IGFycmF5UmFuZ2VSZWFkZXIudmFsdWVzKHJlZmVyZW5jZUZyYW1lcyk7XHJcbiAgY29uc3QgZGlmZlJlYWRlciA9IGJhdGNoLmRpZmZSZWFkZXI7XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdXBkYXRlZENvbXBvbmVudHNMZW5ndGg7IGkrKykge1xyXG4gICAgY29uc3QgZGlmZiA9IGJhdGNoLnVwZGF0ZWRDb21wb25lbnRzRW50cnkodXBkYXRlZENvbXBvbmVudHNWYWx1ZXMsIGkpO1xyXG4gICAgY29uc3QgY29tcG9uZW50SWQgPSBkaWZmUmVhZGVyLmNvbXBvbmVudElkKGRpZmYpO1xyXG4gICAgY29uc3QgZWRpdHMgPSBkaWZmUmVhZGVyLmVkaXRzKGRpZmYpO1xyXG4gICAgYnJvd3NlclJlbmRlcmVyLnVwZGF0ZUNvbXBvbmVudChiYXRjaCwgY29tcG9uZW50SWQsIGVkaXRzLCByZWZlcmVuY2VGcmFtZXNWYWx1ZXMpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZGlzcG9zZWRDb21wb25lbnRJZHNSYW5nZSA9IGJhdGNoLmRpc3Bvc2VkQ29tcG9uZW50SWRzKCk7XHJcbiAgY29uc3QgZGlzcG9zZWRDb21wb25lbnRJZHNWYWx1ZXMgPSBhcnJheVJhbmdlUmVhZGVyLnZhbHVlcyhkaXNwb3NlZENvbXBvbmVudElkc1JhbmdlKTtcclxuICBjb25zdCBkaXNwb3NlZENvbXBvbmVudElkc0xlbmd0aCA9IGFycmF5UmFuZ2VSZWFkZXIuY291bnQoZGlzcG9zZWRDb21wb25lbnRJZHNSYW5nZSk7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaXNwb3NlZENvbXBvbmVudElkc0xlbmd0aDsgaSsrKSB7XHJcbiAgICBjb25zdCBjb21wb25lbnRJZCA9IGJhdGNoLmRpc3Bvc2VkQ29tcG9uZW50SWRzRW50cnkoZGlzcG9zZWRDb21wb25lbnRJZHNWYWx1ZXMsIGkpO1xyXG4gICAgYnJvd3NlclJlbmRlcmVyLmRpc3Bvc2VDb21wb25lbnQoY29tcG9uZW50SWQpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZGlzcG9zZWRFdmVudEhhbmRsZXJJZHNSYW5nZSA9IGJhdGNoLmRpc3Bvc2VkRXZlbnRIYW5kbGVySWRzKCk7XHJcbiAgY29uc3QgZGlzcG9zZWRFdmVudEhhbmRsZXJJZHNWYWx1ZXMgPSBhcnJheVJhbmdlUmVhZGVyLnZhbHVlcyhkaXNwb3NlZENvbXBvbmVudElkc1JhbmdlKTtcclxuICBjb25zdCBkaXNwb3NlZEV2ZW50SGFuZGxlcklkc0xlbmd0aCA9IGFycmF5UmFuZ2VSZWFkZXIuY291bnQoZGlzcG9zZWRFdmVudEhhbmRsZXJJZHNSYW5nZSk7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaXNwb3NlZEV2ZW50SGFuZGxlcklkc0xlbmd0aDsgaSsrKSB7XHJcbiAgICBjb25zdCBldmVudEhhbmRsZXJJZCA9IGJhdGNoLmRpc3Bvc2VkRXZlbnRIYW5kbGVySWRzRW50cnkoZGlzcG9zZWRFdmVudEhhbmRsZXJJZHNWYWx1ZXMsIGkpO1xyXG4gICAgYnJvd3NlclJlbmRlcmVyLmRpc3Bvc2VFdmVudEhhbmRsZXIoZXZlbnRIYW5kbGVySWQpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY2xlYXJFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQpIHtcclxuICBsZXQgY2hpbGROb2RlOiBOb2RlIHwgbnVsbDtcclxuICB3aGlsZSAoY2hpbGROb2RlID0gZWxlbWVudC5maXJzdENoaWxkKSB7XHJcbiAgICBlbGVtZW50LnJlbW92ZUNoaWxkKGNoaWxkTm9kZSk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IHBsYXRmb3JtIH0gZnJvbSAnLi4vRW52aXJvbm1lbnQnO1xyXG5pbXBvcnQgeyBNZXRob2RIYW5kbGUsIFN5c3RlbV9TdHJpbmcsIFN5c3RlbV9BcnJheSB9IGZyb20gJy4uL1BsYXRmb3JtL1BsYXRmb3JtJztcclxuY29uc3QgaHR0cENsaWVudEFzc2VtYmx5ID0gJ01pY3Jvc29mdC5Bc3BOZXRDb3JlLkJsYXpvci5Ccm93c2VyJztcclxuY29uc3QgaHR0cENsaWVudE5hbWVzcGFjZSA9IGAke2h0dHBDbGllbnRBc3NlbWJseX0uSHR0cGA7XHJcbmNvbnN0IGh0dHBDbGllbnRUeXBlTmFtZSA9ICdCcm93c2VySHR0cE1lc3NhZ2VIYW5kbGVyJztcclxuY29uc3QgaHR0cENsaWVudEZ1bGxUeXBlTmFtZSA9IGAke2h0dHBDbGllbnROYW1lc3BhY2V9LiR7aHR0cENsaWVudFR5cGVOYW1lfWA7XHJcbmxldCByZWNlaXZlUmVzcG9uc2VNZXRob2Q6IE1ldGhvZEhhbmRsZTtcclxubGV0IGFsbG9jYXRlQXJyYXlNZXRob2Q6IE1ldGhvZEhhbmRsZTtcclxuXHJcbi8vIFRoZXNlIGFyZSB0aGUgZnVuY3Rpb25zIHdlJ3JlIG1ha2luZyBhdmFpbGFibGUgZm9yIGludm9jYXRpb24gZnJvbSAuTkVUXHJcbmV4cG9ydCBjb25zdCBpbnRlcm5hbEZ1bmN0aW9ucyA9IHtcclxuICBzZW5kQXN5bmNcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gc2VuZEFzeW5jKGlkOiBudW1iZXIsIGJvZHk6IFN5c3RlbV9BcnJheTxhbnk+LCBqc29uRmV0Y2hBcmdzOiBTeXN0ZW1fU3RyaW5nKSB7XHJcbiAgbGV0IHJlc3BvbnNlOiBSZXNwb25zZTtcclxuICBsZXQgcmVzcG9uc2VEYXRhOiBBcnJheUJ1ZmZlcjtcclxuXHJcbiAgY29uc3QgZmV0Y2hPcHRpb25zOiBGZXRjaE9wdGlvbnMgPSBKU09OLnBhcnNlKHBsYXRmb3JtLnRvSmF2YVNjcmlwdFN0cmluZyhqc29uRmV0Y2hBcmdzKSk7XHJcbiAgY29uc3QgcmVxdWVzdEluaXQ6IFJlcXVlc3RJbml0ID0gT2JqZWN0LmFzc2lnbihmZXRjaE9wdGlvbnMucmVxdWVzdEluaXQsIGZldGNoT3B0aW9ucy5yZXF1ZXN0SW5pdE92ZXJyaWRlcyk7XHJcblxyXG4gIGlmIChib2R5KSB7XHJcbiAgICByZXF1ZXN0SW5pdC5ib2R5ID0gcGxhdGZvcm0udG9VaW50OEFycmF5KGJvZHkpO1xyXG4gIH1cclxuXHJcbiAgdHJ5IHtcclxuICAgIHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goZmV0Y2hPcHRpb25zLnJlcXVlc3RVcmksIHJlcXVlc3RJbml0KTtcclxuICAgIHJlc3BvbnNlRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmFycmF5QnVmZmVyKCk7XHJcbiAgfSBjYXRjaCAoZXgpIHtcclxuICAgIGRpc3BhdGNoRXJyb3JSZXNwb25zZShpZCwgZXgudG9TdHJpbmcoKSk7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBkaXNwYXRjaFN1Y2Nlc3NSZXNwb25zZShpZCwgcmVzcG9uc2UsIHJlc3BvbnNlRGF0YSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpc3BhdGNoU3VjY2Vzc1Jlc3BvbnNlKGlkOiBudW1iZXIsIHJlc3BvbnNlOiBSZXNwb25zZSwgcmVzcG9uc2VEYXRhOiBBcnJheUJ1ZmZlcikge1xyXG4gIGNvbnN0IHJlc3BvbnNlRGVzY3JpcHRvcjogUmVzcG9uc2VEZXNjcmlwdG9yID0ge1xyXG4gICAgc3RhdHVzQ29kZTogcmVzcG9uc2Uuc3RhdHVzLFxyXG4gICAgc3RhdHVzVGV4dDogcmVzcG9uc2Uuc3RhdHVzVGV4dCxcclxuICAgIGhlYWRlcnM6IFtdXHJcbiAgfTtcclxuICByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHZhbHVlLCBuYW1lKSA9PiB7XHJcbiAgICByZXNwb25zZURlc2NyaXB0b3IuaGVhZGVycy5wdXNoKFtuYW1lLCB2YWx1ZV0pO1xyXG4gIH0pO1xyXG5cclxuICBpZiAoIWFsbG9jYXRlQXJyYXlNZXRob2QpIHtcclxuICAgIGFsbG9jYXRlQXJyYXlNZXRob2QgPSBwbGF0Zm9ybS5maW5kTWV0aG9kKFxyXG4gICAgICBodHRwQ2xpZW50QXNzZW1ibHksXHJcbiAgICAgIGh0dHBDbGllbnROYW1lc3BhY2UsXHJcbiAgICAgIGh0dHBDbGllbnRUeXBlTmFtZSxcclxuICAgICAgJ0FsbG9jYXRlQXJyYXknXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLy8gYWxsb2NhdGUgYSBtYW5hZ2VkIGJ5dGVbXSBvZiB0aGUgcmlnaHQgc2l6ZVxyXG4gIGNvbnN0IGRvdE5ldEFycmF5ID0gcGxhdGZvcm0uY2FsbE1ldGhvZChhbGxvY2F0ZUFycmF5TWV0aG9kLCBudWxsLCBbcGxhdGZvcm0udG9Eb3ROZXRTdHJpbmcocmVzcG9uc2VEYXRhLmJ5dGVMZW5ndGgudG9TdHJpbmcoKSldKSBhcyBTeXN0ZW1fQXJyYXk8YW55PjtcclxuXHJcbiAgLy8gZ2V0IGFuIFVpbnQ4QXJyYXkgdmlldyBvZiBpdFxyXG4gIGNvbnN0IGFycmF5ID0gcGxhdGZvcm0udG9VaW50OEFycmF5KGRvdE5ldEFycmF5KTtcclxuXHJcbiAgLy8gY29weSB0aGUgcmVzcG9uc2VEYXRhIHRvIG91ciBtYW5hZ2VkIGJ5dGVbXVxyXG4gIGFycmF5LnNldChuZXcgVWludDhBcnJheShyZXNwb25zZURhdGEpKTtcclxuXHJcbiAgZGlzcGF0Y2hSZXNwb25zZShcclxuICAgIGlkLFxyXG4gICAgcGxhdGZvcm0udG9Eb3ROZXRTdHJpbmcoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2VEZXNjcmlwdG9yKSksXHJcbiAgICBkb3ROZXRBcnJheSxcclxuICAgIC8qIGVycm9yTWVzc2FnZSAqLyBudWxsXHJcbiAgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGlzcGF0Y2hFcnJvclJlc3BvbnNlKGlkOiBudW1iZXIsIGVycm9yTWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgZGlzcGF0Y2hSZXNwb25zZShcclxuICAgIGlkLFxyXG4gICAgLyogcmVzcG9uc2VEZXNjcmlwdG9yICovIG51bGwsXHJcbiAgICAvKiByZXNwb25zZVRleHQgKi8gbnVsbCxcclxuICAgIHBsYXRmb3JtLnRvRG90TmV0U3RyaW5nKGVycm9yTWVzc2FnZSlcclxuICApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkaXNwYXRjaFJlc3BvbnNlKGlkOiBudW1iZXIsIHJlc3BvbnNlRGVzY3JpcHRvcjogU3lzdGVtX1N0cmluZyB8IG51bGwsIHJlc3BvbnNlRGF0YTogU3lzdGVtX0FycmF5PGFueT4gfCBudWxsLCBlcnJvck1lc3NhZ2U6IFN5c3RlbV9TdHJpbmcgfCBudWxsKSB7XHJcbiAgaWYgKCFyZWNlaXZlUmVzcG9uc2VNZXRob2QpIHtcclxuICAgIHJlY2VpdmVSZXNwb25zZU1ldGhvZCA9IHBsYXRmb3JtLmZpbmRNZXRob2QoXHJcbiAgICAgIGh0dHBDbGllbnRBc3NlbWJseSxcclxuICAgICAgaHR0cENsaWVudE5hbWVzcGFjZSxcclxuICAgICAgaHR0cENsaWVudFR5cGVOYW1lLFxyXG4gICAgICAnUmVjZWl2ZVJlc3BvbnNlJ1xyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHBsYXRmb3JtLmNhbGxNZXRob2QocmVjZWl2ZVJlc3BvbnNlTWV0aG9kLCBudWxsLCBbXHJcbiAgICBwbGF0Zm9ybS50b0RvdE5ldFN0cmluZyhpZC50b1N0cmluZygpKSxcclxuICAgIHJlc3BvbnNlRGVzY3JpcHRvcixcclxuICAgIHJlc3BvbnNlRGF0YSxcclxuICAgIGVycm9yTWVzc2FnZSxcclxuICBdKTtcclxufVxyXG5cclxuLy8gS2VlcCB0aGVzZSBpbiBzeW5jIHdpdGggdGhlIC5ORVQgZXF1aXZhbGVudCBpbiBCcm93c2VySHR0cE1lc3NhZ2VIYW5kbGVyLmNzXHJcbmludGVyZmFjZSBGZXRjaE9wdGlvbnMge1xyXG4gIHJlcXVlc3RVcmk6IHN0cmluZztcclxuICByZXF1ZXN0SW5pdDogUmVxdWVzdEluaXQ7XHJcbiAgcmVxdWVzdEluaXRPdmVycmlkZXM6IFJlcXVlc3RJbml0O1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUmVzcG9uc2VEZXNjcmlwdG9yIHtcclxuICAvLyBXZSBkb24ndCBoYXZlIEJvZHlUZXh0IGluIGhlcmUgYmVjYXVzZSBpZiB3ZSBkaWQsIHRoZW4gaW4gdGhlIEpTT04tcmVzcG9uc2UgY2FzZSAod2hpY2hcclxuICAvLyBpcyB0aGUgbW9zdCBjb21tb24gY2FzZSksIHdlJ2QgYmUgZG91YmxlLWVuY29kaW5nIGl0LCBzaW5jZSB0aGUgZW50aXJlIFJlc3BvbnNlRGVzY3JpcHRvclxyXG4gIC8vIGFsc28gZ2V0cyBKU09OIGVuY29kZWQuIEl0IHdvdWxkIHdvcmsgYnV0IGlzIHR3aWNlIHRoZSBhbW91bnQgb2Ygc3RyaW5nIHByb2Nlc3NpbmcuXHJcbiAgc3RhdHVzQ29kZTogbnVtYmVyO1xyXG4gIHN0YXR1c1RleHQ6IHN0cmluZztcclxuICBoZWFkZXJzOiBzdHJpbmdbXVtdO1xyXG59XHJcbiIsImltcG9ydCB7IHBsYXRmb3JtIH0gZnJvbSAnLi4vRW52aXJvbm1lbnQnO1xyXG5pbXBvcnQgeyBNZXRob2RIYW5kbGUsIFN5c3RlbV9TdHJpbmcgfSBmcm9tICcuLi9QbGF0Zm9ybS9QbGF0Zm9ybSc7XHJcbmNvbnN0IHJlZ2lzdGVyZWRGdW5jdGlvblByZWZpeCA9ICdNaWNyb3NvZnQuQXNwTmV0Q29yZS5CbGF6b3IuQnJvd3Nlci5TZXJ2aWNlcy5Ccm93c2VyVXJpSGVscGVyJztcclxubGV0IG5vdGlmeUxvY2F0aW9uQ2hhbmdlZE1ldGhvZDogTWV0aG9kSGFuZGxlO1xyXG5sZXQgaGFzUmVnaXN0ZXJlZEV2ZW50TGlzdGVuZXJzID0gZmFsc2U7XHJcblxyXG4vLyBUaGVzZSBhcmUgdGhlIGZ1bmN0aW9ucyB3ZSdyZSBtYWtpbmcgYXZhaWxhYmxlIGZvciBpbnZvY2F0aW9uIGZyb20gLk5FVFxyXG5leHBvcnQgY29uc3QgaW50ZXJuYWxGdW5jdGlvbnMgPSB7XHJcbiAgZW5hYmxlTmF2aWdhdGlvbkludGVyY2VwdGlvbixcclxuICBuYXZpZ2F0ZVRvLFxyXG4gIGdldEJhc2VVUkk6ICgpID0+IGRvY3VtZW50LmJhc2VVUkksXHJcbiAgZ2V0TG9jYXRpb25IcmVmOiAoKSA9PiBsb2NhdGlvbi5ocmVmLFxyXG59XHJcblxyXG5mdW5jdGlvbiBlbmFibGVOYXZpZ2F0aW9uSW50ZXJjZXB0aW9uKCkge1xyXG4gIGlmIChoYXNSZWdpc3RlcmVkRXZlbnRMaXN0ZW5lcnMpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgaGFzUmVnaXN0ZXJlZEV2ZW50TGlzdGVuZXJzID0gdHJ1ZTtcclxuXHJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICAvLyBJbnRlcmNlcHQgY2xpY2tzIG9uIGFsbCA8YT4gZWxlbWVudHMgd2hlcmUgdGhlIGhyZWYgaXMgd2l0aGluIHRoZSA8YmFzZSBocmVmPiBVUkkgc3BhY2VcclxuICAgIC8vIFdlIG11c3QgZXhwbGljaXRseSBjaGVjayBpZiBpdCBoYXMgYW4gJ2hyZWYnIGF0dHJpYnV0ZSwgYmVjYXVzZSBpZiBpdCBkb2Vzbid0LCB0aGUgcmVzdWx0IG1pZ2h0IGJlIG51bGwgb3IgYW4gZW1wdHkgc3RyaW5nIGRlcGVuZGluZyBvbiB0aGUgYnJvd3NlclxyXG4gICAgY29uc3QgYW5jaG9yVGFyZ2V0ID0gZmluZENsb3Nlc3RBbmNlc3RvcihldmVudC50YXJnZXQgYXMgRWxlbWVudCB8IG51bGwsICdBJykgYXMgSFRNTEFuY2hvckVsZW1lbnQ7XHJcbiAgICBjb25zdCBocmVmQXR0cmlidXRlTmFtZSA9ICdocmVmJztcclxuICAgIGlmIChhbmNob3JUYXJnZXQgJiYgYW5jaG9yVGFyZ2V0Lmhhc0F0dHJpYnV0ZShocmVmQXR0cmlidXRlTmFtZSkgJiYgZXZlbnQuYnV0dG9uID09PSAwKSB7XHJcbiAgICAgIGNvbnN0IGhyZWYgPSBhbmNob3JUYXJnZXQuZ2V0QXR0cmlidXRlKGhyZWZBdHRyaWJ1dGVOYW1lKSE7XHJcbiAgICAgIGNvbnN0IGFic29sdXRlSHJlZiA9IHRvQWJzb2x1dGVVcmkoaHJlZik7XHJcblxyXG4gICAgICAvLyBEb24ndCBzdG9wIGN0cmwvbWV0YS1jbGljayAoZXRjKSBmcm9tIG9wZW5pbmcgbGlua3MgaW4gbmV3IHRhYnMvd2luZG93c1xyXG4gICAgICBpZiAoaXNXaXRoaW5CYXNlVXJpU3BhY2UoYWJzb2x1dGVIcmVmKSAmJiAhZXZlbnRIYXNTcGVjaWFsS2V5KGV2ZW50KSkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgcGVyZm9ybUludGVybmFsTmF2aWdhdGlvbihhYnNvbHV0ZUhyZWYpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGhhbmRsZUludGVybmFsTmF2aWdhdGlvbik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBuYXZpZ2F0ZVRvKHVyaTogc3RyaW5nKSB7XHJcbiAgY29uc3QgYWJzb2x1dGVVcmkgPSB0b0Fic29sdXRlVXJpKHVyaSk7XHJcbiAgaWYgKGlzV2l0aGluQmFzZVVyaVNwYWNlKGFic29sdXRlVXJpKSkge1xyXG4gICAgcGVyZm9ybUludGVybmFsTmF2aWdhdGlvbihhYnNvbHV0ZVVyaSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGxvY2F0aW9uLmhyZWYgPSB1cmk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBwZXJmb3JtSW50ZXJuYWxOYXZpZ2F0aW9uKGFic29sdXRlSW50ZXJuYWxIcmVmOiBzdHJpbmcpIHtcclxuICBoaXN0b3J5LnB1c2hTdGF0ZShudWxsLCAvKiBpZ25vcmVkIHRpdGxlICovICcnLCBhYnNvbHV0ZUludGVybmFsSHJlZik7XHJcbiAgaGFuZGxlSW50ZXJuYWxOYXZpZ2F0aW9uKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUludGVybmFsTmF2aWdhdGlvbigpIHtcclxuICBpZiAoIW5vdGlmeUxvY2F0aW9uQ2hhbmdlZE1ldGhvZCkge1xyXG4gICAgbm90aWZ5TG9jYXRpb25DaGFuZ2VkTWV0aG9kID0gcGxhdGZvcm0uZmluZE1ldGhvZChcclxuICAgICAgJ01pY3Jvc29mdC5Bc3BOZXRDb3JlLkJsYXpvci5Ccm93c2VyJyxcclxuICAgICAgJ01pY3Jvc29mdC5Bc3BOZXRDb3JlLkJsYXpvci5Ccm93c2VyLlNlcnZpY2VzJyxcclxuICAgICAgJ0Jyb3dzZXJVcmlIZWxwZXInLFxyXG4gICAgICAnTm90aWZ5TG9jYXRpb25DaGFuZ2VkJ1xyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHBsYXRmb3JtLmNhbGxNZXRob2Qobm90aWZ5TG9jYXRpb25DaGFuZ2VkTWV0aG9kLCBudWxsLCBbXHJcbiAgICBwbGF0Zm9ybS50b0RvdE5ldFN0cmluZyhsb2NhdGlvbi5ocmVmKVxyXG4gIF0pO1xyXG59XHJcblxyXG5sZXQgdGVzdEFuY2hvcjogSFRNTEFuY2hvckVsZW1lbnQ7XHJcbmZ1bmN0aW9uIHRvQWJzb2x1dGVVcmkocmVsYXRpdmVVcmk6IHN0cmluZykge1xyXG4gIHRlc3RBbmNob3IgPSB0ZXN0QW5jaG9yIHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICB0ZXN0QW5jaG9yLmhyZWYgPSByZWxhdGl2ZVVyaTtcclxuICByZXR1cm4gdGVzdEFuY2hvci5ocmVmO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaW5kQ2xvc2VzdEFuY2VzdG9yKGVsZW1lbnQ6IEVsZW1lbnQgfCBudWxsLCB0YWdOYW1lOiBzdHJpbmcpIHtcclxuICByZXR1cm4gIWVsZW1lbnRcclxuICAgID8gbnVsbFxyXG4gICAgOiBlbGVtZW50LnRhZ05hbWUgPT09IHRhZ05hbWVcclxuICAgICAgPyBlbGVtZW50XHJcbiAgICAgIDogZmluZENsb3Nlc3RBbmNlc3RvcihlbGVtZW50LnBhcmVudEVsZW1lbnQsIHRhZ05hbWUpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzV2l0aGluQmFzZVVyaVNwYWNlKGhyZWY6IHN0cmluZykge1xyXG4gIGNvbnN0IGJhc2VVcmlXaXRoVHJhaWxpbmdTbGFzaCA9IHRvQmFzZVVyaVdpdGhUcmFpbGluZ1NsYXNoKGRvY3VtZW50LmJhc2VVUkkhKTsgLy8gVE9ETzogTWlnaHQgYmFzZVVSSSByZWFsbHkgYmUgbnVsbD9cclxuICByZXR1cm4gaHJlZi5zdGFydHNXaXRoKGJhc2VVcmlXaXRoVHJhaWxpbmdTbGFzaCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRvQmFzZVVyaVdpdGhUcmFpbGluZ1NsYXNoKGJhc2VVcmk6IHN0cmluZykge1xyXG4gIHJldHVybiBiYXNlVXJpLnN1YnN0cigwLCBiYXNlVXJpLmxhc3RJbmRleE9mKCcvJykgKyAxKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZXZlbnRIYXNTcGVjaWFsS2V5KGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcbiAgcmV0dXJuIGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQuc2hpZnRLZXkgfHwgZXZlbnQuYWx0S2V5IHx8IGV2ZW50Lm1ldGFLZXk7XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==