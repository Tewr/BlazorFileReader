declare var Blazor: any;

interface ReadFileParams {
    fileRef: number,
    position: number,
    count: number,
    callBackId: number
};

interface FileInfo {
    name: string,
    size: number,
    type: string,
    lastModified: number
};


interface DotNetBuffer {
    toUint8Array(): Uint8Array
}

class FileReaderComponent {

    private newFileStreamReference: number = 0;
    private readonly fileStreams: { [reference: number]: File } = {};

    public GetFileCount(element: HTMLInputElement): number {
        if (!element.files) {
            return -1;
        }
        var result = element.files.length;
        return result;
    }

    public GetFileInfoFromElement = (element: HTMLInputElement, index: number, property: string): string => {
        if (!element.files) {
            return null;
        }

        let file = element.files.item(index);
        if (!file) {
            return null;
        }
        console.debug(this);
        return this.GetFileInfoFromFile(file);
    }

    public Dispose = (fileRef: number): boolean => {
        return delete (this.fileStreams[fileRef]);
    }

    public GetFileInfoFromReference = (fileRef: number): string => {
        const file: File = this.fileStreams[fileRef];
        if (!file) {
            return null;
        }
        return this.GetFileInfoFromFile(file);
    }

    public GetFileInfoFromFile(file: File): string {
        var result = JSON.stringify({
            lastModified: file.lastModified,
            name: file.name,
            size: file.size,
            type: file.type
        });

        console.debug("GetFileInfoFromFile", result);
        return result;
    }
    
    public OpenRead = (element: HTMLInputElement, fileIndex: number): number => {

        if (!element.files) {
            throw 'No FileList available. Is this element a reference to an input of type="file"?';
        }
        const file = element.files.item(fileIndex);
        if (!file) {
            throw `No file with index ${fileIndex} available.`;
        }

        const fileRef: number = this.newFileStreamReference++;
        this.fileStreams[fileRef] = file;
        return fileRef;
    }

    public ReadFileAsync = (dotNetArrayPtr: any, readFileParamsPtr: any): boolean => {
        const readFileParams: ReadFileParams = JSON.parse(Blazor.platform.toJavaScriptString(readFileParamsPtr));
        const dotNetBuffer: DotNetBuffer = { toUint8Array: () => Blazor.platform.toUint8Array(dotNetArrayPtr) };
        
        const file: File = this.fileStreams[readFileParams.fileRef];
        try {
            const reader = new FileReader();
            reader.onload = ((r) => {
                return () => {
                    try {
                        const contents: ArrayBuffer = r.result;
                        const dotNetBufferView: Uint8Array = dotNetBuffer.toUint8Array();
                        dotNetBufferView.set(new Uint8Array(contents));
                        FileReaderInteropMethods.ReadFileAsyncCallback(readFileParams.callBackId, contents.byteLength);
                    } catch (e) {
                        FileReaderInteropMethods.ReadFileAsyncError(readFileParams.callBackId, e.message);
                    }
                }
            })(reader);
            reader.readAsArrayBuffer(file.slice(readFileParams.position, readFileParams.position + readFileParams.count));
        } catch (e) {
            FileReaderInteropMethods.ReadFileAsyncError(readFileParams.callBackId, e.message);
        }

        return true;
    }   
}

class FileReaderInteropMethods {

    private static assemblyName: string = "Blazor.FileReader";
    private static namespace: string = "Blazor.FileReader";
    private static type: string = "FileReaderJsInterop";
    private static methods: { [key: string]: any } = {};
    private static platform = Blazor.platform;
    
    public static ReadFileAsyncError(callBackId: number, exception: string) {
        this.CallMethod("ReadFileAsyncError", { callBackId: callBackId, exception: exception });
    }

    public static ReadFileAsyncCallback(callBackId: number, bytesRead: number) { 
        this.CallMethod("ReadFileAsyncCallback", { callBackId: callBackId, bytesRead: bytesRead });
    }

    private static CallMethod(name: string, params: any): any {
        console.debug("CallMethod", name, params);
        this.platform.callMethod(this.GetExport(name), null, [this.platform.toDotNetString(JSON.stringify(params))]);
    }

    private static GetExport(name: string): any {
        return this.methods[name] = this.methods[name] ||
            this.platform.findMethod(this.assemblyName, this.namespace, this.type, name);
    }
}

(window as any).FileReader = new FileReaderComponent();