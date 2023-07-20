(function() { var module = (() => {
    const defines = {};
    const entry = [null];
    function define(name, dependencies, factory) {
        defines[name] = { dependencies, factory };
        entry[0] = name;
    }
    define("require", ["exports"], (exports) => {
        Object.defineProperty(exports, "__cjsModule", { value: true });
        Object.defineProperty(exports, "default", { value: (name) => resolve(name) });
    });
    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    define("FileReaderJsInterop", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.FileReaderJsInterop = void 0;
        class FileReaderJsInterop {
            static initialize() {
                FileReaderJsInterop.endTask =
                    Module.mono_bind_static_method(`[${this.assembly}] Tewr.Blazor.FileReader.FileReaderJsInterop:EndTask`);
                FileReaderJsInterop.initialized = true;
            }
        }
        exports.FileReaderJsInterop = FileReaderJsInterop;
        FileReaderJsInterop.assembly = 'Tewr.Blazor.FileReader';
        FileReaderJsInterop.initialized = false;
    });
    define("ConcatFileList", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.ConcatFileList = void 0;
        class ConcatFileList {
            item(index) {
                return this[index];
            }
            constructor(existing, additions) {
                for (let i = 0; i < existing.length; i++) {
                    this[i] = existing[i];
                }
                const eligibleAdditions = [];
                for (let i = 0; i < additions.length; i++) {
                    let exists = false;
                    const addition = additions[i];
                    for (let j = 0; j < existing.length; j++) {
                        if (existing[j] === addition) {
                            exists = true;
                            break;
                        }
                    }
                    if (!exists) {
                        eligibleAdditions[eligibleAdditions.length] = addition;
                    }
                }
                for (let i = 0; i < eligibleAdditions.length; i++) {
                    this[i + existing.length] = eligibleAdditions[i];
                }
                this.length = existing.length + eligibleAdditions.length;
            }
        }
        exports.ConcatFileList = ConcatFileList;
    });
    define("FileEntryList", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.FileEntryList = void 0;
        class FileEntryList {
            item(index) {
                return this[index];
            }
            constructor(additions) {
                for (let i = 0; i < additions.length; i++) {
                    this[i] = additions[i];
                }
                this.length = additions.length;
            }
        }
        exports.FileEntryList = FileEntryList;
    });
    define("DragnDrop", ["require", "exports", "FileReaderJsInterop", "ConcatFileList", "FileEntryList"], function (require, exports, FileReaderJsInterop_1, ConcatFileList_1, FileEntryList_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.UnregisterDropEvents = exports.RegisterDropEvents = exports.BuildDragEventHandler = void 0;
        const nameof = (name) => name;
        const dropEvent = nameof("drop");
        const dragOverEvent = nameof("dragover");
        function BuildDragEventHandler(declaredMethod, script, eventDescription) {
            let declaredHandler;
            if (declaredMethod) {
                if (!window.hasOwnProperty(declaredMethod) || typeof window[declaredMethod] !== 'function') {
                    throw (`${FileReaderJsInterop_1.FileReaderJsInterop.assembly}: BuildDragEventHandler: window.${declaredMethod} was provided as an option for event '${eventDescription}', but was not declared or was not a function. Make sure your script that defines this method is loaded before calling RegisterDropEvents.`);
                }
                else {
                    declaredHandler = window[declaredMethod];
                }
            }
            if (script) {
                const scriptHandler = Function(`return ${script}`)();
                if (!scriptHandler || typeof scriptHandler !== 'function') {
                    throw (`${FileReaderJsInterop_1.FileReaderJsInterop.assembly}: BuildDragEventHandler: script was provided as an option for event '${eventDescription}', but was not properly declared or was not a function.`);
                }
                else {
                    if (!declaredHandler) {
                        return scriptHandler;
                    }
                    return (dragEvent, element, fileReaderComponent) => {
                        declaredHandler(dragEvent, element, fileReaderComponent);
                        scriptHandler(dragEvent, element, fileReaderComponent);
                    };
                }
            }
            if (declaredHandler) {
                return declaredHandler;
            }
            return (() => { });
        }
        exports.BuildDragEventHandler = BuildDragEventHandler;
        function getFilesAsync(dataTransfer) {
            return __awaiter(this, void 0, void 0, function* () {
                const files = [];
                const len = dataTransfer.items.length;
                const webkitQueue = [];
                const fileQueue = [];
                for (let i = 0; i < len; i++) {
                    const item = dataTransfer.items[i];
                    if (item.kind === "file") {
                        if (typeof item.webkitGetAsEntry === "function") {
                            const entry = item.webkitGetAsEntry();
                            webkitQueue.push(entry);
                        }
                        else {
                            const file = item.getAsFile();
                            if (file) {
                                fileQueue.push(file);
                            }
                        }
                    }
                }
                for (let i = 0; i < webkitQueue.length; i++) {
                    const file = yield readEntryAsync(webkitQueue[i]);
                    files.push(...file);
                }
                files.push(...fileQueue);
                return new FileEntryList_1.FileEntryList(files);
            });
        }
        function readEntryAsync(innerEntry) {
            return __awaiter(this, void 0, void 0, function* () {
                const files = [];
                if (isFile(innerEntry)) {
                    let fullPath = innerEntry.fullPath;
                    if (fullPath.charAt(0) === "/" || fullPath.charAt(0) === "\\")
                        fullPath = fullPath.substring(1);
                    try {
                        const file = yield getFile(innerEntry);
                        files.push(redefineWebkitRelativePath(file, fullPath));
                    }
                    catch (err) {
                        console.error(`error on ${fullPath}`);
                        console.error(err);
                        throw err;
                    }
                }
                else if (isDirectory(innerEntry)) {
                    try {
                        const entries = yield getEntries(innerEntry.createReader());
                        for (const entry of entries) {
                            const innerFiles = yield readEntryAsync(entry);
                            files.push(...innerFiles);
                        }
                    }
                    catch (err2) {
                        console.error(err2);
                        throw err2;
                    }
                }
                return files;
            });
        }
        function getEntries(reader) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield new Promise((resolve, reject) => reader.readEntries(resolve, reject));
            });
        }
        function getFile(fileEntry) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => fileEntry.file(resolve, reject));
            });
        }
        function redefineWebkitRelativePath(file, fullPath) {
            Object.defineProperty(file, "webkitRelativePath", {
                get() {
                    return fullPath;
                }
            });
            return file;
        }
        function isDirectory(entry) {
            return entry.isDirectory;
        }
        function isFile(entry) {
            return entry.isFile;
        }
        function RegisterDropEvents(element, registerOptions) {
            this.LogIfNull(element);
            const onAfterDropHandler = BuildDragEventHandler(registerOptions.onDropMethod, registerOptions.onDropScript, dropEvent);
            const dropHandler = (ev) => {
                ev.preventDefault();
                if (ev.target instanceof HTMLElement) {
                    const existingFilePromise = this.elementDataTransfers.get(element);
                    const filePromise = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        var _a;
                        try {
                            let files = yield getFilesAsync(ev.dataTransfer);
                            if (registerOptions.additive && existingFilePromise) {
                                const existing = (_a = yield existingFilePromise) !== null && _a !== void 0 ? _a : new FileList();
                                if (existing.length > 0) {
                                    files = new ConcatFileList_1.ConcatFileList(existing, files);
                                }
                            }
                            resolve(files);
                        }
                        catch (e) {
                            reject(e);
                        }
                    }));
                    this.elementDataTransfers.set(element, filePromise);
                }
                onAfterDropHandler(ev, element, this);
            };
            const onAfterDragOverHandler = BuildDragEventHandler(registerOptions.onDragOverMethod, registerOptions.onDragOverScript, dragOverEvent);
            const dragOverHandler = (ev) => {
                ev.preventDefault();
                onAfterDragOverHandler(ev, element, this);
            };
            const onAfterRegisterHandler = BuildDragEventHandler(registerOptions.onRegisterDropEventsMethod, registerOptions.onRegisterDropEventsScript, 'RegisterDropEvents');
            const eventHandlers = { drop: dropHandler, dragover: dragOverHandler };
            this.dragElements.set(element, eventHandlers);
            element.addEventListener(dropEvent, eventHandlers.drop);
            element.addEventListener(dragOverEvent, eventHandlers.dragover);
            onAfterRegisterHandler(null, element, this);
            return true;
        }
        exports.RegisterDropEvents = RegisterDropEvents;
        function UnregisterDropEvents(element) {
            this.LogIfNull(element);
            const eventHandlers = this.dragElements.get(element);
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
        exports.FileReaderComponentInstance = exports.FileReaderComponent = void 0;
        class FileReaderComponent {
            constructor() {
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
                this.ClearValue = (element) => {
                    this.LogIfNull(element);
                    if (element instanceof HTMLInputElement) {
                        element.value = null;
                    }
                    else {
                        this.elementDataTransfers.delete(element);
                    }
                    return 0;
                };
                this.Dispose = (fileRef) => {
                    return delete (this.fileStreams[fileRef]);
                };
                this.OpenReadFile = (file, useWasmSharedBuffer) => {
                    if (useWasmSharedBuffer && !FileReaderJsInterop_2.FileReaderJsInterop.initialized) {
                        FileReaderJsInterop_2.FileReaderJsInterop.initialize();
                    }
                    const fileRef = this.newFileStreamReference++;
                    this.fileStreams[fileRef] = file;
                    return fileRef;
                };
                this.ReadFileParamsPointer = (readFileParamsPointer) => {
                    return {
                        taskId: Blazor.platform.readUint64Field(readFileParamsPointer, 0),
                        bufferOffset: Blazor.platform.readUint64Field(readFileParamsPointer, 8),
                        count: Blazor.platform.readInt32Field(readFileParamsPointer, 16),
                        fileRef: Blazor.platform.readInt32Field(readFileParamsPointer, 20),
                        position: Blazor.platform.readUint64Field(readFileParamsPointer, 24)
                    };
                };
                this.ReadBufferPointer = (readBufferPointer) => {
                    return {
                        taskId: Blazor.platform.readUint64Field(readBufferPointer, 0),
                        buffer: Blazor.platform.readInt32Field(readBufferPointer, 8)
                    };
                };
                this.ReadFileUnmarshalledAsync = (readFileParamsPointer) => {
                    const readFileParams = this.ReadFileParamsPointer(readFileParamsPointer);
                    const asyncCall = new Promise((resolve, reject) => {
                        return this.ReadFileSlice(readFileParams, (r, b) => r.readAsArrayBuffer(b))
                            .then(r => {
                            this.readResultByTaskId.set(readFileParams.taskId, {
                                arrayBuffer: r.result,
                                params: readFileParams
                            });
                            resolve();
                        }, e => reject(e));
                    });
                    asyncCall.then(() => FileReaderJsInterop_2.FileReaderJsInterop.endTask(readFileParams.taskId), error => {
                        console.error("ReadFileUnmarshalledAsync error", error);
                        DotNet.invokeMethodAsync(FileReaderJsInterop_2.FileReaderJsInterop.assembly, "EndReadFileUnmarshalledAsyncError", readFileParams.taskId, error.toString());
                    });
                    return 0;
                };
                this.FillBufferUnmarshalled = (bufferPointer) => {
                    const readBufferParams = this.ReadBufferPointer(bufferPointer);
                    const dotNetBufferView = Blazor.platform.toUint8Array(readBufferParams.buffer);
                    const data = this.readResultByTaskId.get(readBufferParams.taskId);
                    this.readResultByTaskId.delete(readBufferParams.taskId);
                    dotNetBufferView.set(new Uint8Array(data.arrayBuffer), data.params.bufferOffset);
                    const byteCount = Math.min(data.arrayBuffer.byteLength, data.params.count);
                    return byteCount;
                };
                this.ReadFileMarshalledAsync = (readFileParams) => {
                    return new Promise((resolve, reject) => {
                        return this.ReadFileSlice(readFileParams, (r, b) => r.readAsDataURL(b))
                            .then(r => {
                            const contents = r.result;
                            const data = contents ? contents.split(";base64,")[1] : null;
                            resolve(data);
                        }, e => reject(e));
                    });
                };
                this.ReadFileSlice = (readFileParams, method) => {
                    return new Promise((resolve, reject) => {
                        const file = this.fileStreams[readFileParams.fileRef];
                        try {
                            const reader = new FileReader();
                            reader.onload = ((r) => {
                                return () => {
                                    try {
                                        resolve({ result: r.result, file: file });
                                    }
                                    catch (ex) {
                                        reject(ex);
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
            LogIfNull(element) {
                if (element == null) {
                    console.log(`${FileReaderJsInterop_2.FileReaderJsInterop.assembly}: HTMLElement is null. Can't access IFileReaderRef after HTMLElement was removed from DOM.`);
                }
            }
            GetFiles(element) {
                return __awaiter(this, void 0, void 0, function* () {
                    let files = null;
                    if (element instanceof HTMLInputElement) {
                        files = element.files;
                    }
                    else {
                        const dataTransfer = this.elementDataTransfers.get(element);
                        if (dataTransfer) {
                            files = yield dataTransfer;
                        }
                    }
                    return files;
                });
            }
            GetJSObjectReference(element, fileIndex) {
                return __awaiter(this, void 0, void 0, function* () {
                    this.LogIfNull(element);
                    const files = yield this.GetFiles(element);
                    return files.item(fileIndex);
                });
            }
            GetFileCount(element) {
                return __awaiter(this, void 0, void 0, function* () {
                    this.LogIfNull(element);
                    const files = yield this.GetFiles(element);
                    if (!files) {
                        return -1;
                    }
                    const result = files.length;
                    return result;
                });
            }
            GetFileInfoFromElement(element, index) {
                return __awaiter(this, void 0, void 0, function* () {
                    this.LogIfNull(element);
                    const files = yield this.GetFiles(element);
                    if (!files) {
                        return null;
                    }
                    const file = files.item(index);
                    if (!file) {
                        return null;
                    }
                    return this.GetFileInfoFromFile(file);
                });
            }
            GetFileInfoFromFile(file) {
                const result = {
                    lastModified: file.lastModified,
                    name: file.name,
                    nonStandardProperties: null,
                    size: file.size,
                    type: file.type
                };
                const properties = {
                    "webkitRelativePath": file.webkitRelativePath
                };
                for (const property in file) {
                    if (Object.prototype.hasOwnProperty.call(file, property) && !(property in result)) {
                        properties[property] = file[property];
                    }
                }
                result.nonStandardProperties = properties;
                return result;
            }
            OpenRead(element, fileIndex, useWasmSharedBuffer) {
                return __awaiter(this, void 0, void 0, function* () {
                    this.LogIfNull(element);
                    const files = yield this.GetFiles(element);
                    if (!files) {
                        throw 'No FileList available.';
                    }
                    const file = files.item(fileIndex);
                    if (!file) {
                        throw `No file with index ${fileIndex} available.`;
                    }
                    return this.OpenReadFile(file, useWasmSharedBuffer);
                });
            }
            ReadFileSliceAsync(fileRef, position, count) {
                return __awaiter(this, void 0, void 0, function* () {
                    const file = this.fileStreams[fileRef];
                    const slice = file.slice(position, position + count);
                    return slice;
                });
            }
        }
        exports.FileReaderComponent = FileReaderComponent;
        const FileReaderComponentInstance = new FileReaderComponent();
        exports.FileReaderComponentInstance = FileReaderComponentInstance;
    });
    define("Clipboard", ["require", "exports", "ConcatFileList"], function (require, exports, ConcatFileList_2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.UnregisterPasteEvent = exports.RegisterPasteEvent = void 0;
        function RegisterPasteEvent(element, registerOptions) {
            this.LogIfNull(element);
            const pasteHandler = (ev) => __awaiter(this, void 0, void 0, function* () {
                if (ev.target instanceof HTMLElement) {
                    const listPromise = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            let list = ev.clipboardData.files;
                            if (list.length > 0) {
                                ev.preventDefault();
                                if (registerOptions.additive) {
                                    const existing = yield this.elementDataTransfers.get(element);
                                    if (existing !== undefined && existing.length > 0) {
                                        list = new ConcatFileList_2.ConcatFileList(existing, list);
                                    }
                                }
                            }
                            resolve(list);
                        }
                        catch (e) {
                            reject(e);
                        }
                    }));
                    this.elementDataTransfers.set(element, listPromise);
                }
            });
            this.pasteElements.set(element, pasteHandler);
            element.addEventListener("paste", pasteHandler);
            return true;
        }
        exports.RegisterPasteEvent = RegisterPasteEvent;
        function UnregisterPasteEvent(element) {
            this.LogIfNull(element);
            const eventHandler = this.pasteElements.get(element);
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
            const dependencies = ['exports'];
            const factory = (exports) => {
                try {
                    Object.defineProperty(exports, "__cjsModule", { value: true });
                    Object.defineProperty(exports, "default", { value: require(name) });
                }
                catch (_a) {
                    throw Error(['module "', name, '" not found.'].join(''));
                }
            };
            return { dependencies, factory };
        }
    }
    const instances = {};
    function resolve(name) {
        if (instances[name]) {
            return instances[name];
        }
        if (name === 'exports') {
            return {};
        }
        const define = get_define(name);
        if (typeof define.factory !== 'function') {
            return define.factory;
        }
        instances[name] = {};
        const dependencies = define.dependencies.map(name => resolve(name));
        define.factory(...dependencies);
        const exports = dependencies[define.dependencies.indexOf('exports')];
        instances[name] = (exports['__cjsModule']) ? exports.default : exports;
        return instances[name];
    }
    if (entry[0] !== null) {
        return resolve("FileReaderComponent");
    }
})();
window.FileReaderComponent = module.FileReaderComponentInstance })();