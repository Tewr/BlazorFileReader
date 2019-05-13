;
;
var FileReaderComponent = /** @class */ (function () {
    function FileReaderComponent() {
        var _this = this;
        this.newFileStreamReference = 0;
        this.fileStreams = {};
        this.GetFileInfoFromElement = function (element, index, property) {
            if (!element.files) {
                return null;
            }
            var file = element.files.item(index);
            if (!file) {
                return null;
            }
            return _this.GetFileInfoFromFile(file);
        };
        this.Dispose = function (fileRef) {
            return delete (_this.fileStreams[fileRef]);
        };
        this.GetFileInfoFromReference = function (fileRef) {
            var file = _this.fileStreams[fileRef];
            if (!file) {
                return null;
            }
            return _this.GetFileInfoFromFile(file);
        };
        this.OpenRead = function (element, fileIndex) {
            if (!element.files) {
                throw 'No FileList available. Is this element a reference to an input of type="file"?';
            }
            var file = element.files.item(fileIndex);
            if (!file) {
                throw "No file with index " + fileIndex + " available.";
            }
            var fileRef = _this.newFileStreamReference++;
            _this.fileStreams[fileRef] = file;
            return fileRef;
        };
        this.ReadFileUnmarshalledAsync = function (dotNetArrayPtr, readFileParamsPtr) {
            var readFileParams = JSON.parse(Blazor.platform.toJavaScriptString(readFileParamsPtr));
            var dotNetBuffer = { toUint8Array: function () { return Blazor.platform.toUint8Array(dotNetArrayPtr); } };
            var onError = function (e) {
                return FileReaderInteropMethods.ReadFileAsyncError(readFileParams.callBackId, e.message)
                    .catch(function (err2level) { return console.error(e, err2level); });
            };
            var file = _this.fileStreams[readFileParams.fileRef];
            try {
                var reader = new FileReader();
                reader.onload = (function (r) {
                    return function () {
                        try {
                            var contents = r.result;
                            var dotNetBufferView = dotNetBuffer.toUint8Array();
                            dotNetBufferView.set(new Uint8Array(contents));
                            FileReaderInteropMethods.ReadFileAsyncCallback(readFileParams.callBackId, contents.byteLength)
                                .catch(onError);
                        }
                        catch (e) {
                            onError(e);
                        }
                    };
                })(reader);
                reader.readAsArrayBuffer(file.slice(readFileParams.position, readFileParams.position + readFileParams.count));
            }
            catch (e) {
                onError(e);
            }
            return true;
        };
        this.ReadFileMarshalledAsync = function (readFileParams) {
            var file = _this.fileStreams[readFileParams.fileRef];
            var onError = function (e) {
                return FileReaderInteropMethods.ReadFileMarshalledAsyncError(readFileParams.callBackId, e.message)
                    .catch(function (err2level) { return console.error(e, err2level); });
            };
            try {
                var reader = new FileReader();
                reader.onload = (function (r) {
                    return function () {
                        try {
                            var contents = r.result;
                            var data = contents ? contents.split(";base64,")[1] : null;
                            FileReaderInteropMethods.ReadFileMarshalledAsyncCallback(readFileParams.callBackId, data)
                                .catch(onError);
                        }
                        catch (e) {
                            onError(e);
                        }
                    };
                })(reader);
                reader.readAsDataURL(file.slice(readFileParams.position, readFileParams.position + readFileParams.count));
            }
            catch (e) {
                onError(e);
            }
            return 0;
        };
    }
    FileReaderComponent.prototype.GetFileCount = function (element) {
        if (!element.files) {
            return -1;
        }
        var result = element.files.length;
        return result;
    };
    FileReaderComponent.prototype.ClearValue = function (input) {
        input.value = null;
    };
    ;
    FileReaderComponent.prototype.GetFileInfoFromFile = function (file) {
        var result = JSON.stringify({
            lastModified: file.lastModified,
            name: file.name,
            size: file.size,
            type: file.type
        });
        return result;
    };
    return FileReaderComponent;
}());
var FileReaderInteropMethods = /** @class */ (function () {
    function FileReaderInteropMethods() {
    }
    FileReaderInteropMethods.ReadFileAsyncError = function (callBackId, exception) {
        return this.CallMethod("ReadFileAsyncError", { callBackId: callBackId, exception: exception });
    };
    FileReaderInteropMethods.ReadFileMarshalledAsyncError = function (callBackId, exception) {
        return this.CallMethod("ReadFileMarshalledAsyncError", { callBackId: callBackId, exception: exception });
    };
    FileReaderInteropMethods.ReadFileAsyncCallback = function (callBackId, bytesRead) {
        return this.CallMethod("ReadFileAsyncCallback", { callBackId: callBackId, bytesRead: bytesRead });
    };
    FileReaderInteropMethods.ReadFileMarshalledAsyncCallback = function (callBackId, data) {
        return this.CallMethod("ReadFileMarshalledAsyncCallback", { callBackId: callBackId, data: data });
    };
    FileReaderInteropMethods.CallMethod = function (name, params) {
        return this.dotNet.invokeMethodAsync(this.assemblyName, name, params);
    };
    FileReaderInteropMethods.assemblyName = "Blazor.FileReader";
    FileReaderInteropMethods.dotNet = DotNet;
    return FileReaderInteropMethods;
}());
window.FileReaderComponent = new FileReaderComponent();
//# sourceMappingURL=FileReaderComponent.js.map