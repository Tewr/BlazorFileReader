;
var FileReaderInteropMethods = /** @class */ (function () {
    function FileReaderInteropMethods() {
    }
    FileReaderInteropMethods.ReadFileAsyncError = function (callBackId, exception) {
        this.CallMethod("ReadFileAsyncError", [callBackId, exception]);
    };
    FileReaderInteropMethods.ReadFileAsyncCallback = function (callBackId, length) {
        this.CallMethod("ReadFileAsyncCallback", [callBackId, length.toString()]);
    };
    FileReaderInteropMethods.CallMethod = function (name, params) {
        var _this = this;
        this.platform.callMethod(this.GetExport(name), null, params.map(function (v) { return _this.platform.toDotNetString(v); }));
    };
    FileReaderInteropMethods.GetExport = function (name) {
        return this.methods[name] = this.methods[name] ||
            this.platform.findMethod(this.assemblyName, this.namespace, this.type, name);
    };
    FileReaderInteropMethods.assemblyName = "FileReaderComponent";
    FileReaderInteropMethods.namespace = "FileReaderComponent";
    FileReaderInteropMethods.type = "FileReaderJsInterop";
    FileReaderInteropMethods.methods = {};
    FileReaderInteropMethods.platform = Blazor.platform;
    return FileReaderInteropMethods;
}());
// TODO: refactor all this into a class instance
var registry = (window.FileReaderComponent = {});
registry.GetFileCount = function (element) {
    if (!element.files) {
        return -1;
    }
    return element.files.length;
};
registry.GetFileProperty =
    function (element, index, property) {
        if (!element.files) {
            return null;
        }
        var file = element.files.item(index);
        if (!file) {
            return null;
        }
        var prop = file[property];
        if (prop) {
            return prop.toString();
        }
        else {
            return null;
        }
    };
var FileStream = /** @class */ (function () {
    function FileStream() {
    }
    FileStream.OpenRead = function (element, fileIndex) {
        if (!element.files) {
            throw 'No FileList available. Is this element a reference to an input of type="file"?';
        }
        var file = element.files.item(fileIndex);
        if (!file) {
            throw "No file with index " + fileIndex + " available.";
        }
        var fileRef = this.newFileStreamReference++;
        this.fileStreams[fileRef] = file;
        return fileRef;
    };
    FileStream.ReadFileAsync = function (readFileParams, dotNetBuffer) {
        var file = this.fileStreams[readFileParams.fileRef];
        try {
            var reader = new FileReader();
            reader.onload = (function (r) {
                return function () {
                    try {
                        var contents = r.result;
                        var dotNetBufferView = dotNetBuffer.toUint8Array();
                        dotNetBufferView.set(new Uint8Array(contents));
                        FileReaderInteropMethods.ReadFileAsyncCallback(readFileParams.callBackId, contents.byteLength);
                    }
                    catch (e) {
                        FileReaderInteropMethods.ReadFileAsyncError(readFileParams.callBackId, e.message);
                    }
                };
            })(reader);
            reader.readAsArrayBuffer(file.slice(readFileParams.position, readFileParams.position + readFileParams.count));
        }
        catch (e) {
            FileReaderInteropMethods.ReadFileAsyncError(readFileParams.callBackId, e.message);
        }
        return true;
    };
    FileStream.GetProperty = function (fileRef, property) {
        var file = this.fileStreams[fileRef];
        if (!file) {
            return null;
        }
        var prop = file[property];
        if (prop) {
            return prop.toString();
        }
        else {
            return null;
        }
    };
    FileStream.Dispose = function (fileRef) {
        return delete (this.fileStreams[fileRef]);
    };
    FileStream.Name = "FileReaderComponent.FileStream";
    FileStream.newFileStreamReference = 0;
    FileStream.fileStreams = {};
    return FileStream;
}());
window[FileStream.Name + '.Dispose'] = function (fileRef) { return FileStream.Dispose(fileRef); };
window[FileStream.Name + '.GetProperty'] = function (fileRef, property) { return FileStream.GetProperty(fileRef, property); };
window[FileStream.Name + '.OpenRead'] = function (element, fileIndex) { return FileStream.OpenRead(element, fileIndex); };
window[FileStream.Name + '.ReadFileAsync'] = function (dotNetArrayPtr, readFileParamsPtr) {
    var readFileParams = JSON.parse(Blazor.platform.toJavaScriptString(readFileParamsPtr));
    var dotNetBuffer = { toUint8Array: function () { return Blazor.platform.toUint8Array(dotNetArrayPtr); } };
    return FileStream.ReadFileAsync(readFileParams, dotNetBuffer);
};
//# sourceMappingURL=FileReaderComponent.js.map