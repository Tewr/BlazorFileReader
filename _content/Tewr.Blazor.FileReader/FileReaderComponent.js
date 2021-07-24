;
;
;
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
var FileReaderComponent = (function () {
    function FileReaderComponent() {
        var _this = this;
        this.newFileStreamReference = 0;
        this.fileStreams = {};
        this.dragElements = new Map();
        this.elementDataTransfers = new Map();
        this.readResultByTaskId = new Map();
        this.RegisterDropEvents = function (element, additive) {
            _this.LogIfNull(element);
            var handler = function (ev) {
                _this.PreventDefaultHandler(ev);
                if (ev.target instanceof HTMLElement) {
                    var list = ev.dataTransfer.files;
                    if (additive) {
                        var existing = _this.elementDataTransfers.get(element);
                        if (existing !== undefined && existing.length > 0) {
                            list = new FileReaderComponent.ConcatFileList(existing, list);
                        }
                    }
                    _this.elementDataTransfers.set(element, list);
                }
            };
            _this.dragElements.set(element, handler);
            element.addEventListener("drop", handler);
            element.addEventListener("dragover", _this.PreventDefaultHandler);
            return true;
        };
        this.UnregisterDropEvents = function (element) {
            _this.LogIfNull(element);
            var handler = _this.dragElements.get(element);
            if (handler) {
                element.removeEventListener("drop", handler);
                element.removeEventListener("dragover", _this.PreventDefaultHandler);
            }
            _this.elementDataTransfers.delete(element);
            _this.dragElements.delete(element);
            return true;
        };
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
            if (useWasmSharedBuffer && !FileReaderJsInterop.initialized) {
                FileReaderJsInterop.initialize();
            }
            var files = _this.GetFiles(element);
            if (!files) {
                throw 'No FileList available.';
            }
            var file = files.item(fileIndex);
            if (!file) {
                throw "No file with index " + fileIndex + " available.";
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
            asyncCall.then(function () { return FileReaderJsInterop.endTask(readFileParams.taskId); }, function (error) {
                console.error("ReadFileUnmarshalledAsync error", error);
                DotNet.invokeMethodAsync(FileReaderJsInterop.assembly, "EndReadFileUnmarshalledAsyncError", readFileParams.taskId, error.toString());
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
        this.PreventDefaultHandler = function (ev) {
            ev.preventDefault();
        };
    }
    FileReaderComponent.prototype.LogIfNull = function (element) {
        if (element == null) {
            console.log(FileReaderJsInterop.assembly + ": HTMLElement is null. Can't access IFileReaderRef after HTMLElement was removed from DOM.");
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
    FileReaderComponent.ConcatFileList = (function () {
        function class_1(existing, additions) {
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
        class_1.prototype.item = function (index) {
            return this[index];
        };
        return class_1;
    }());
    return FileReaderComponent;
}());
window.FileReaderComponent = new FileReaderComponent();
//# sourceMappingURL=FileReaderComponent.js.map