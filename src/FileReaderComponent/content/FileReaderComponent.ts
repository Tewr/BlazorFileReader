
declare var Blazor: any;

interface ReadFileParams {
    fileRef: number,
    position: number,
    count: number,
    callBackId: string
};

interface DotNetBuffer {
    toUint8Array(): Uint8Array
}

interface IFileStream {
    Dispose(fileRef: number): boolean,
    GetProperty(fileRef: number, property: string): string,
    OpenRead(element: HTMLInputElement, fileIndex: number): number,
    ReadFileAsync(dotNetArrayPtr: any, readFileParamsPtr: any): boolean 
}

interface FileReaderComponent {
    GetFileCount(element: HTMLInputElement): number,
    GetFileProperty(element: HTMLInputElement, index: number, property: string): string,
    FileStream:IFileStream 
}

class FileReaderInteropMethods {

    private static assemblyName: string = "FileReaderComponent";
    private static namespace: string = "FileReaderComponent";
    private static type: string = "FileReaderJsInterop";
    private static methods: { [key: string]: any } = {};
    private static platform = Blazor.platform;
    
    public static ReadFileAsyncError(callBackId: string, exception: string) {
        this.CallMethod("ReadFileAsyncError", [callBackId, exception]);
    }

    public static ReadFileAsyncCallback(callBackId: string, length: number) { 
        this.CallMethod("ReadFileAsyncCallback", [callBackId, length.toString()]);
    }

    private static CallMethod(name: string, params: any[]): any {
        this.platform.callMethod(this.GetExport(name), null, params.map((v) => this.platform.toDotNetString(v)));
    }

    private static GetExport(name: string): any {
        return this.methods[name] = this.methods[name] ||
            this.platform.findMethod(this.assemblyName, this.namespace, this.type, name);
    }
}

// TODO: refactor all this into a class instance
var registry = ((window as any).FileReaderComponent = {}) as FileReaderComponent;
registry.GetFileCount = (element: HTMLInputElement):number => {
    if (!element.files) {
        return -1;
    }

    return element.files.length;
};

registry.GetFileProperty =
    (element: HTMLInputElement, index: number, property: string): string => {
    if (!element.files) {
        return null;
    }
        
    let file = element.files.item(index);
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


class FileStream {
    public static readonly Name: string = "FileReaderComponent.FileStream";

    private static newFileStreamReference: number = 0;
    private static readonly fileStreams: { [reference: number]: File } = {};

    public static OpenRead(element: HTMLInputElement, fileIndex: number): number {
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

    public static ReadFileAsync(readFileParams: ReadFileParams, dotNetBuffer: DotNetBuffer): boolean {
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

    public static GetProperty(fileRef: number, property: string): string|null {
        const file: File = this.fileStreams[fileRef];
        if (!file) {
            return null;
        }
        const prop = file[property];
        if (prop) {
            return prop.toString();
        }
        else {
            return null;
        }
    }

    public static Dispose(fileRef: number): boolean {
        return delete (this.fileStreams[fileRef]);
    }
}

window[FileStream.Name + '.Dispose'] = (fileRef: number):boolean => FileStream.Dispose(fileRef);
window[FileStream.Name + '.GetProperty'] = (fileRef: number, property: string):string => FileStream.GetProperty(fileRef, property);
window[FileStream.Name + '.OpenRead'] = (element: HTMLInputElement, fileIndex: number):number => FileStream.OpenRead(element, fileIndex);
window[FileStream.Name + '.ReadFileAsync'] = (dotNetArrayPtr: any, readFileParamsPtr: any):boolean => {
        const readFileParams: ReadFileParams = JSON.parse(Blazor.platform.toJavaScriptString(readFileParamsPtr));
        const dotNetBuffer: DotNetBuffer = { toUint8Array: () => Blazor.platform.toUint8Array(dotNetArrayPtr) };
        return FileStream.ReadFileAsync(readFileParams, dotNetBuffer);
    };
