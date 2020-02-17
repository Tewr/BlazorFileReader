;
;
var FileReaderComponent = (function () {
    function FileReaderComponent() {
        var _this = this;
        this.newFileStreamReference = 0;
        this.fileStreams = {};
        this.dragElements = new Map();
        this.elementDataTransfers = new Map();
        this.RegisterDropEvents = function (element, additive) {
            var handler = function (ev) {
                _this.PreventDefaultHandler(ev);
                if (ev.target instanceof HTMLElement) {
                    var list = ev.dataTransfer.files;
                    if (additive) {
                        var existing = _this.elementDataTransfers.get(ev.target);
                        if (existing != null && existing.length > 0) {
                            list = new FileReaderComponent.ConcatFileList(existing, list);
                        }
                    }
                    _this.elementDataTransfers.set(ev.target, list);
                }
            };
            _this.dragElements.set(element, handler);
            element.addEventListener("drop", handler);
            element.addEventListener("dragover", _this.PreventDefaultHandler);
            return true;
        };
        this.UnregisterDropEvents = function (element) {
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
            var files = _this.GetFiles(element);
            if (!files) {
                return -1;
            }
            var result = files.length;
            return result;
        };
        this.ClearValue = function (element) {
            if (element instanceof HTMLInputElement) {
                element.value = null;
            }
            else {
                _this.elementDataTransfers.delete(element);
            }
            return 0;
        };
        this.GetFileInfoFromElement = function (element, index, property) {
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
        this.OpenRead = function (element, fileIndex) {
            return new Promise(function (resolve, reject) {
                var files = _this.GetFiles(element);
                if (!files) {
                    throw 'No FileList available.';
                }
                var file = files.item(fileIndex);
                if (!file) {
                    throw "No file with index " + fileIndex + " available.";
                }
                var fileRef = _this.newFileStreamReference++;
                var reader = new FileReader();
                reader.onload = (function (r) {
                    return function () {
                        try {
                            var arrayBuffer = r.result;
                            _this.fileStreams[fileRef] = { file: file, arrayBuffer: arrayBuffer };
                            resolve(fileRef);
                        }
                        catch (e) {
                            reject(e);
                        }
                    };
                })(reader);
                reader.readAsArrayBuffer(file);
                return fileRef;
            });
        };
        this.ReadFileParamsPointer = function (readFileParamsPointer) {
            return {
                bufferOffset: Blazor.platform.readUint64Field(readFileParamsPointer, 0),
                count: Blazor.platform.readInt32Field(readFileParamsPointer, 8),
                fileRef: Blazor.platform.readInt32Field(readFileParamsPointer, 12),
                position: Blazor.platform.readUint64Field(readFileParamsPointer, 16),
                buffer: Blazor.platform.readInt32Field(readFileParamsPointer, 24)
            };
        };
        this.ReadFileUnmarshalledAsync = function (readFileParamsPointer) {
            var readFileParams = _this.ReadFileParamsPointer(readFileParamsPointer);
            var fileStream = _this.fileStreams[readFileParams.fileRef];
            var dotNetBuffer = readFileParams.buffer;
            var dotNetBufferView = Blazor.platform.toUint8Array(dotNetBuffer);
            var byteCount = Math.min(fileStream.arrayBuffer.byteLength - readFileParams.position, readFileParams.count);
            dotNetBufferView.set(new Uint8Array(fileStream.arrayBuffer, readFileParams.position, byteCount), readFileParams.bufferOffset);
            return byteCount;
        };
        this.ReadFileMarshalledAsync = function (readFileParams) {
            return new Promise(function (resolve, reject) {
                var file = _this.fileStreams[readFileParams.fileRef].file;
                try {
                    var reader = new FileReader();
                    reader.onload = (function (r) {
                        return function () {
                            try {
                                var contents = r.result;
                                var data = contents ? contents.split(";base64,")[1] : null;
                                resolve(data);
                            }
                            catch (e) {
                                reject(e);
                            }
                        };
                    })(reader);
                    reader.readAsDataURL(file.slice(readFileParams.position, readFileParams.position + readFileParams.count));
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
            size: file.size,
            type: file.type
        };
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