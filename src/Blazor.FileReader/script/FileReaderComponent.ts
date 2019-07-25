declare var Blazor: IBlazor;
declare var DotNet: IDotNet;

interface IBlazor {
    platform: IBlazorPlatform;
}

interface IBlazorPlatform {
    toJavaScriptString(pointer: any): string;
    toDotNetString(jsString: string): any;
    toUint8Array(pointer: any): Uint8Array;
}

interface IReadFileParams {
    fileRef: number;
    position: number;
    count: number;
    callBackId: number;
};

interface IFileInfo {
    name: string;
    size: number;
    type: string;
    lastModified: number;
};

interface IDotNetBuffer {
    toUint8Array(): Uint8Array;
}

interface IDotNet {
    invokeMethodAsync<T>(assemblyName: string, methodIdentifier: string, ...args: any[]): Promise<T>
}

class FileReaderComponent {

    private newFileStreamReference: number = 0;
    private readonly fileStreams: { [reference: number]: File } = {};
    private readonly dragElements: Map<HTMLElement, EventListenerOrEventListenerObject> = new Map();
    private readonly elementDataTransfers: Map<HTMLElement, DataTransfer> = new Map();

    public RegisterDropEvents = (element: HTMLElement): boolean => {
        const handler = (ev: DragEvent) => {
            ev.preventDefault();
            if (ev.target instanceof HTMLElement) {
                this.elementDataTransfers.set(ev.target, ev.dataTransfer);
                // Note that dragstart and dragend events are not fired 
                // when dragging a file into the browser from the OS.
                ev.target.ondragend(ev);
            }
        };

        this.dragElements.set(element, handler);
        element.addEventListener("drop", handler);
        return true;
    }

    public UnregisterDropEvents = (element: HTMLElement): boolean => {
        const handler = this.dragElements.get(element);
        if (handler) {
            element.removeEventListener("drop", handler);
        }
        this.elementDataTransfers.delete(element);
        this.dragElements.delete(element);
        return true;
    }

    private GetFiles(element: HTMLElement): FileList {
        var files: FileList = null;
        if (element instanceof HTMLInputElement) {
            files = (element as HTMLInputElement).files;
        } else {
            const dataTransfer = this.elementDataTransfers.get(element);
            if (dataTransfer) {
                files = dataTransfer.files;
            }
        }
        return files;
    }

    public GetFileCount = (element: HTMLElement): number => {
        const files = this.GetFiles(element);
        if (!files) {
            return -1;
        }
        const result = files.length;
        return result;
    }

    public ClearValue = (element: HTMLInputElement) => {
        if (element instanceof HTMLInputElement) {
            element.value = null;
        } else {
            this.elementDataTransfers.delete(element);
        }
    };

    public GetFileInfoFromElement = (element: HTMLElement, index: number, property: string): IFileInfo => {
        const files = this.GetFiles(element);
        if (!files) {
            return null;
        }

        const file = files.item(index);
        if (!file) {
            return null;
        }

        return this.GetFileInfoFromFile(file);
    }

    public Dispose = (fileRef: number): boolean => {
        return delete (this.fileStreams[fileRef]);
    }

    public GetFileInfoFromFile(file: File): IFileInfo {
        const result = {
            lastModified: file.lastModified,
            name: file.name,
            size: file.size,
            type: file.type
        };

        return result;
    }

    public OpenRead = (element: HTMLElement, fileIndex: number): number => {
        const files = this.GetFiles(element);
        if (!files) {
            throw 'No FileList available. Is this element a reference to an input of type="file"?';
        }
        const file = files.item(fileIndex);
        if (!file) {
            throw `No file with index ${fileIndex} available.`;
        }

        const fileRef: number = this.newFileStreamReference++;
        this.fileStreams[fileRef] = file;
        return fileRef;
    }

    public ReadFileUnmarshalled = (dotNetArrayPtr: any, readFileParamsPtr: any): boolean => {
        const readFileParams: IReadFileParams = JSON.parse(Blazor.platform.toJavaScriptString(readFileParamsPtr));
        const callBack = (bytesRead: number, exception: any) => 
            DotNet.invokeMethodAsync("Blazor.FileReader", "ReadFileUnmarshalledCallback", { callBackId: readFileParams.callBackId, bytesRead, exception });
        const resolve = (bytesRead: number) => callBack(bytesRead, undefined);
        const reject = (exception: any) => callBack(0, exception);
        const dotNetBuffer: IDotNetBuffer = { toUint8Array: (): Uint8Array => Blazor.platform.toUint8Array(dotNetArrayPtr) };
        const file: File = this.fileStreams[readFileParams.fileRef];
        try {
            const reader = new FileReader();
            reader.onload = ((r) => {
                return () => {
                    try {
                        const contents: ArrayBuffer = <ArrayBuffer>r.result;
                        const dotNetBufferView: Uint8Array = dotNetBuffer.toUint8Array();
                        dotNetBufferView.set(new Uint8Array(contents));
                        resolve(contents.byteLength);
                    } catch (e) {
                        reject(e);
                    }
                }
            })(reader);
            reader.readAsArrayBuffer(file.slice(readFileParams.position, readFileParams.position + readFileParams.count));
            return true;
        } catch (e) {
            reject(e);
        }
        return false;
    }

    public ReadFileUnmarshalledAsync(dotNetArrayPtr: any, readFileParamsPtr: any): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            const readFileParams: IReadFileParams = JSON.parse(Blazor.platform.toJavaScriptString(readFileParamsPtr));
            const dotNetBuffer: IDotNetBuffer = { toUint8Array: (): Uint8Array => Blazor.platform.toUint8Array(dotNetArrayPtr) };
            const file: File = this.fileStreams[readFileParams.fileRef];
            try {
                const reader = new FileReader();
                reader.onload = ((r) => {
                    return () => {
                        try {
                            const contents: ArrayBuffer = <ArrayBuffer>r.result;
                            const dotNetBufferView: Uint8Array = dotNetBuffer.toUint8Array();
                            dotNetBufferView.set(new Uint8Array(contents));
                            resolve(contents.byteLength);
                        } catch (e) {
                            reject(e);
                        }
                    }
                })(reader);
                reader.readAsArrayBuffer(file.slice(readFileParams.position, readFileParams.position + readFileParams.count));
            } catch (e) {
                reject(e);
            }
        });
    }

    public ReadFileMarshalledAsync = (readFileParams: IReadFileParams): Promise<string> => {
        
        return new Promise<string>((resolve, reject) => {
            const file: File = this.fileStreams[readFileParams.fileRef];
            try {
                const reader = new FileReader();
                reader.onload = ((r) => {
                    return () => {
                        try {
                            const contents = r.result as string;
                            const data = contents ? contents.split(";base64,")[1] : null;
                            resolve(data);
                        } catch (e) {
                            reject(e);
                        }
                    }
                })(reader);
                reader.readAsDataURL(file.slice(readFileParams.position, readFileParams.position + readFileParams.count));
            } catch (e) {
                reject(e);
            }
        });
    }
}

(window as any).FileReaderComponent = new FileReaderComponent();
