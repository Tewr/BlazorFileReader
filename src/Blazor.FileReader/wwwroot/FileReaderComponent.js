(function() { var module = (function () {
    var defines = {};
    var entry = [null];
    function define(name, dependencies, factory) {
        defines[name] = { dependencies: dependencies, factory: factory };
        entry[0] = name;
    }
    define("require", ["exports"], function (exports) {
        Object.defineProperty(exports, "__cjsModule", { value: true });
        Object.defineProperty(exports, "default", { value: function (name) { return resolve(name); } });
    });
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
    define("FileReaderJsInterop", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        var FileReaderJsInterop = (function () {
            function FileReaderJsInterop() {
            }
            FileReaderJsInterop.initialize = function () {
                FileReaderJsInterop.endTask =
                    Module.mono_bind_static_method("[" + this.assembly + "] Tewr.Blazor.FileReader.FileReaderJsInterop:EndTask");
                FileReaderJsInterop.initialized = true;
            };
            FileReaderJsInterop.assembly = 'Tewr.Blazor.FileReader';
            FileReaderJsInterop.initialized = false;
            return FileReaderJsInterop;
        }());
        exports.FileReaderJsInterop = FileReaderJsInterop;
    });
    define("ConcatFileList", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        var ConcatFileList = (function () {
            function ConcatFileList(existing, additions) {
                for (var i = 0; i < existing.length; i++) {
                    this[i] = existing[i];
                }
                var eligebleAdditions = [];
                for (var i = 0; i < additions.length; i++) {
                    var exists = false;
                    var addition = additions[i];
                    for (var j = 0; j < existing.length; j++) {
                        if (existing[j] === addition) {
                            exists = true;
                            break;
                        }
                    }
                    if (!exists) {
                        eligebleAdditions[eligebleAdditions.length] = addition;
                    }
                }
                for (var i = 0; i < eligebleAdditions.length; i++) {
                    this[i + existing.length] = eligebleAdditions[i];
                }
                this.length = existing.length + eligebleAdditions.length;
            }
            ConcatFileList.prototype.item = function (index) {
                return this[index];
            };
            return ConcatFileList;
        }());
        exports.ConcatFileList = ConcatFileList;
    });
    define("DragnDrop", ["require", "exports", "FileReaderJsInterop", "ConcatFileList"], function (require, exports, FileReaderJsInterop_1, ConcatFileList_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        var nameof = function (name) { return name; };
        var dropEvent = nameof("drop");
        var dragOverEvent = nameof("dragover");
        function BuildDragEventHandler(declaredMethod, script, eventDescription) {
            var declaredHandler;
            if (declaredMethod) {
                if (!window.hasOwnProperty(declaredMethod) || typeof window[declaredMethod] !== 'function') {
                    throw (FileReaderJsInterop_1.FileReaderJsInterop.assembly + ": BuildDragEventHandler: window." + declaredMethod + " was provided as an option for event '" + eventDescription + "', but was not declared or was not a function. Make sure your script that defines this method is loaded before calling RegisterDropEvents.");
                }
                else {
                    declaredHandler = window[declaredMethod];
                }
            }
            if (script) {
                var scriptHandler_1 = Function("return " + script)();
                if (!scriptHandler_1 || typeof scriptHandler_1 !== 'function') {
                    throw (FileReaderJsInterop_1.FileReaderJsInterop.assembly + ": BuildDragEventHandler: script was provided as an option for event '" + eventDescription + "', but was not properly declared or was not a function.");
                }
                else {
                    if (!declaredHandler) {
                        return scriptHandler_1;
                    }
                    return function (dragEvent, element, fileReaderComponent) {
                        declaredHandler(dragEvent, element, fileReaderComponent);
                        scriptHandler_1(dragEvent, element, fileReaderComponent);
                    };
                }
            }
            if (declaredHandler) {
                return declaredHandler;
            }
            return (function () { });
        }
        exports.BuildDragEventHandler = BuildDragEventHandler;
        function RegisterDropEvents(element, registerOptions) {
            var _this = this;
            this.LogIfNull(element);
            var onAfterDropHandler = BuildDragEventHandler(registerOptions.onDropMethod, registerOptions.onDropScript, dropEvent);
            var dropHandler = function (ev) {
                ev.preventDefault();
                if (ev.target instanceof HTMLElement) {
                    var list = ev.dataTransfer.files;
                    if (registerOptions.additive) {
                        var existing = _this.elementDataTransfers.get(element);
                        if (existing !== undefined && existing.length > 0) {
                            list = new ConcatFileList_1.ConcatFileList(existing, list);
                        }
                    }
                    _this.elementDataTransfers.set(element, list);
                }
                onAfterDropHandler(ev, element, _this);
            };
            var onAfterDragOverHandler = BuildDragEventHandler(registerOptions.onDragOverMethod, registerOptions.onDragOverScript, dragOverEvent);
            var dragOverHandler = function (ev) {
                ev.preventDefault();
                onAfterDragOverHandler(ev, element, _this);
            };
            var onAfterRegisterHandler = BuildDragEventHandler(registerOptions.onRegisterDropEventsMethod, registerOptions.onRegisterDropEventsScript, 'RegisterDropEvents');
            var eventHandlers = { drop: dropHandler, dragover: dragOverHandler };
            this.dragElements.set(element, eventHandlers);
            element.addEventListener(dropEvent, eventHandlers.drop);
            element.addEventListener(dragOverEvent, eventHandlers.dragover);
            onAfterRegisterHandler(null, element, this);
            return true;
        }
        exports.RegisterDropEvents = RegisterDropEvents;
        function UnregisterDropEvents(element) {
            this.LogIfNull(element);
            var eventHandlers = this.dragElements.get(element);
            if (eventHandlers) {
                element.removeEventListener(dropEvent, eventHandlers.drop);
                element.removeEventListener(dragOverEvent, eventHandlers.dragover);
            }
            this.elementDataTransfers.delete(element);
            this.dragElements.delete(element);
            return true;
        }
        exports.UnregisterDropEvents = UnregisterDropEvents;
    });
    define("FileReaderComponent", ["require", "exports", "DragnDrop", "Clipboard", "FileReaderJsInterop"], function (require, exports, DragnDrop_1, Clipboard_1, FileReaderJsInterop_2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        var FileReaderComponent = (function () {
            function FileReaderComponent() {
                var _this = this;
                this.newFileStreamReference = 0;
                this.fileStreams = {};
                this.dragElements = new Map();
                this.pasteElements = new Map();
                this.elementDataTransfers = new Map();
                this.readResultByTaskId = new Map();
                this.RegisterDropEvents = DragnDrop_1.RegisterDropEvents;
                this.UnregisterDropEvents = DragnDrop_1.UnregisterDropEvents;
                this.RegisterPasteEvent = Clipboard_1.RegisterPasteEvent;
                this.UnregisterPasteEvent = Clipboard_1.UnregisterPasteEvent;
                this.GetFileCount = function (element) {
                    _this.LogIfNull(element);
                    var files = _this.GetFiles(element);
                    if (!files) {
                        return -1;
                    }
                    var result = files.length;
                    return result;
                };
                this.ClearValue = function (element) {
                    _this.LogIfNull(element);
                    if (element instanceof HTMLInputElement) {
                        element.value = null;
                    }
                    else {
                        _this.elementDataTransfers.delete(element);
                    }
                    return 0;
                };
                this.GetFileInfoFromElement = function (element, index) {
                    _this.LogIfNull(element);
                    var files = _this.GetFiles(element);
                    if (!files) {
                        return null;
                    }
                    var file = files.item(index);
                    if (!file) {
                        return null;
                    }
                    return _this.GetFileInfoFromFile(file);
                };
                this.Dispose = function (fileRef) {
                    return delete (_this.fileStreams[fileRef]);
                };
                this.OpenRead = function (element, fileIndex, useWasmSharedBuffer) {
                    _this.LogIfNull(element);
                    var files = _this.GetFiles(element);
                    if (!files) {
                        throw 'No FileList available.';
                    }
                    var file = files.item(fileIndex);
                    if (!file) {
                        throw "No file with index " + fileIndex + " available.";
                    }
                    return _this.OpenReadFile(file, useWasmSharedBuffer);
                };
                this.OpenReadFile = function (file, useWasmSharedBuffer) {
                    if (useWasmSharedBuffer && !FileReaderJsInterop_2.FileReaderJsInterop.initialized) {
                        FileReaderJsInterop_2.FileReaderJsInterop.initialize();
                    }
                    var fileRef = _this.newFileStreamReference++;
                    _this.fileStreams[fileRef] = file;
                    return fileRef;
                };
                this.ReadFileParamsPointer = function (readFileParamsPointer) {
                    return {
                        taskId: Blazor.platform.readUint64Field(readFileParamsPointer, 0),
                        bufferOffset: Blazor.platform.readUint64Field(readFileParamsPointer, 8),
                        count: Blazor.platform.readInt32Field(readFileParamsPointer, 16),
                        fileRef: Blazor.platform.readInt32Field(readFileParamsPointer, 20),
                        position: Blazor.platform.readUint64Field(readFileParamsPointer, 24)
                    };
                };
                this.ReadBufferPointer = function (readBufferPointer) {
                    return {
                        taskId: Blazor.platform.readUint64Field(readBufferPointer, 0),
                        buffer: Blazor.platform.readInt32Field(readBufferPointer, 8)
                    };
                };
                this.ReadFileUnmarshalledAsync = function (readFileParamsPointer) {
                    var readFileParams = _this.ReadFileParamsPointer(readFileParamsPointer);
                    var asyncCall = new Promise(function (resolve, reject) {
                        return _this.ReadFileSlice(readFileParams, function (r, b) { return r.readAsArrayBuffer(b); })
                            .then(function (r) {
                            _this.readResultByTaskId.set(readFileParams.taskId, {
                                arrayBuffer: r.result,
                                params: readFileParams
                            });
                            resolve();
                        }, function (e) { return reject(e); });
                    });
                    asyncCall.then(function () { return FileReaderJsInterop_2.FileReaderJsInterop.endTask(readFileParams.taskId); }, function (error) {
                        console.error("ReadFileUnmarshalledAsync error", error);
                        DotNet.invokeMethodAsync(FileReaderJsInterop_2.FileReaderJsInterop.assembly, "EndReadFileUnmarshalledAsyncError", readFileParams.taskId, error.toString());
                    });
                    return 0;
                };
                this.FillBufferUnmarshalled = function (bufferPointer) {
                    var readBufferParams = _this.ReadBufferPointer(bufferPointer);
                    var dotNetBufferView = Blazor.platform.toUint8Array(readBufferParams.buffer);
                    var data = _this.readResultByTaskId.get(readBufferParams.taskId);
                    _this.readResultByTaskId.delete(readBufferParams.taskId);
                    dotNetBufferView.set(new Uint8Array(data.arrayBuffer), data.params.bufferOffset);
                    var byteCount = Math.min(data.arrayBuffer.byteLength, data.params.count);
                    return byteCount;
                };
                this.ReadFileMarshalledAsync = function (readFileParams) {
                    return new Promise(function (resolve, reject) {
                        return _this.ReadFileSlice(readFileParams, function (r, b) { return r.readAsDataURL(b); })
                            .then(function (r) {
                            var contents = r.result;
                            var data = contents ? contents.split(";base64,")[1] : null;
                            resolve(data);
                        }, function (e) { return reject(e); });
                    });
                };
                this.ReadFileSlice = function (readFileParams, method) {
                    return new Promise(function (resolve, reject) {
                        var file = _this.fileStreams[readFileParams.fileRef];
                        try {
                            var reader = new FileReader();
                            reader.onload = (function (r) {
                                return function () {
                                    try {
                                        resolve({ result: r.result, file: file });
                                    }
                                    catch (e) {
                                        reject(e);
                                    }
                                };
                            })(reader);
                            method(reader, file.slice(readFileParams.position, readFileParams.position + readFileParams.count));
                        }
                        catch (e) {
                            reject(e);
                        }
                    });
                };
            }
            FileReaderComponent.prototype.LogIfNull = function (element) {
                if (element == null) {
                    console.log(FileReaderJsInterop_2.FileReaderJsInterop.assembly + ": HTMLElement is null. Can't access IFileReaderRef after HTMLElement was removed from DOM.");
                }
            };
            FileReaderComponent.prototype.GetFiles = function (element) {
                var files = null;
                if (element instanceof HTMLInputElement) {
                    files = element.files;
                }
                else {
                    var dataTransfer = this.elementDataTransfers.get(element);
                    if (dataTransfer) {
                        files = dataTransfer;
                    }
                }
                return files;
            };
            FileReaderComponent.prototype.GetJSObjectReference = function (element, fileIndex) {
                this.LogIfNull(element);
                var files = this.GetFiles(element);
                return files.item(fileIndex);
            };
            FileReaderComponent.prototype.GetFileInfoFromFile = function (file) {
                var result = {
                    lastModified: file.lastModified,
                    name: file.name,
                    nonStandardProperties: null,
                    size: file.size,
                    type: file.type
                };
                var properties = {};
                for (var property in file) {
                    if (Object.prototype.hasOwnProperty.call(file, property) && !(property in result)) {
                        properties[property] = file[property];
                    }
                }
                result.nonStandardProperties = properties;
                return result;
            };
            FileReaderComponent.prototype.ReadFileSliceAsync = function (fileRef, position, count) {
                return __awaiter(this, void 0, void 0, function () {
                    var file, slice;
                    return __generator(this, function (_a) {
                        file = this.fileStreams[fileRef];
                        slice = file.slice(position, position + count);
                        return [2, slice];
                    });
                });
            };
            return FileReaderComponent;
        }());
        exports.FileReaderComponent = FileReaderComponent;
        var FileReaderComponentInstance = new FileReaderComponent();
        exports.FileReaderComponentInstance = FileReaderComponentInstance;
    });
    define("Clipboard", ["require", "exports", "ConcatFileList"], function (require, exports, ConcatFileList_2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        function RegisterPasteEvent(element, registerOptions) {
            var _this = this;
            this.LogIfNull(element);
            var pasteHandler = function (ev) {
                if (ev.target instanceof HTMLElement) {
                    var list = ev.clipboardData.files;
                    if (list.length > 0) {
                        ev.preventDefault();
                        if (registerOptions.additive) {
                            var existing = _this.elementDataTransfers.get(element);
                            if (existing !== undefined && existing.length > 0) {
                                list = new ConcatFileList_2.ConcatFileList(existing, list);
                            }
                        }
                    }
                    _this.elementDataTransfers.set(element, list);
                }
            };
            this.pasteElements.set(element, pasteHandler);
            element.addEventListener("paste", pasteHandler);
            return true;
        }
        exports.RegisterPasteEvent = RegisterPasteEvent;
        function UnregisterPasteEvent(element) {
            this.LogIfNull(element);
            var eventHandler = this.pasteElements.get(element);
            if (eventHandler) {
                element.removeEventListener("paste", eventHandler);
            }
            this.elementDataTransfers.delete(element);
            this.pasteElements.delete(element);
            return true;
        }
        exports.UnregisterPasteEvent = UnregisterPasteEvent;
    });
    ;
    ;
    ;
    
    'marker:resolver';

    function get_define(name) {
        if (defines[name]) {
            return defines[name];
        }
        else if (defines[name + '/index']) {
            return defines[name + '/index'];
        }
        else {
            var dependencies = ['exports'];
            var factory = function (exports) {
                try {
                    Object.defineProperty(exports, "__cjsModule", { value: true });
                    Object.defineProperty(exports, "default", { value: require(name) });
                }
                catch (_a) {
                    throw Error(['module "', name, '" not found.'].join(''));
                }
            };
            return { dependencies: dependencies, factory: factory };
        }
    }
    var instances = {};
    function resolve(name) {
        if (instances[name]) {
            return instances[name];
        }
        if (name === 'exports') {
            return {};
        }
        var define = get_define(name);
        instances[name] = {};
        var dependencies = define.dependencies.map(function (name) { return resolve(name); });
        define.factory.apply(define, dependencies);
        var exports = dependencies[define.dependencies.indexOf('exports')];
        instances[name] = (exports['__cjsModule']) ? exports.default : exports;
        return instances[name];
    }
    if (entry[0] !== null) {
        return resolve("FileReaderComponent");
    }
})();
window.FileReaderComponent = module.FileReaderComponentInstance })();