import { RegisterDropEvents, UnregisterDropEvents } from "./DragnDrop"
import { RegisterPasteEvent, UnregisterPasteEvent } from "./Clipboard"
import { FileReaderJsInterop } from "./FileReaderJsInterop"

declare const Blazor: IBlazor;
declare const DotNet: IDotNet;

class FileReaderComponent {

    private newFileStreamReference = 0;
    private readonly fileStreams: { [reference: number]: File } = {};

    protected readonly dragElements: Map<HTMLElement, DragEvents> = new Map();
    protected readonly pasteElements: Map<HTMLElement, EventListenerOrEventListenerObject> = new Map();
    protected readonly elementDataTransfers: Map<HTMLElement, FileList> = new Map();
    private readonly readResultByTaskId: Map<number, IReadFileData> = new Map();

    protected LogIfNull(element: HTMLElement) {
        if (element == null) {
            console.log(`${FileReaderJsInterop.assembly}: HTMLElement is null. Can't access IFileReaderRef after HTMLElement was removed from DOM.`);
        } 
    }

    public RegisterDropEvents = RegisterDropEvents;

    public UnregisterDropEvents = UnregisterDropEvents;

    public RegisterPasteEvent = RegisterPasteEvent;

    public UnregisterPasteEvent = UnregisterPasteEvent;

    private GetFiles(element: HTMLElement): FileList {
        let files: FileList = null;
        if (element instanceof HTMLInputElement) {
            files = (element as HTMLInputElement).files;
        } else {
            const dataTransfer = this.elementDataTransfers.get(element);
            if (dataTransfer) {
                files = dataTransfer;
            }
        }
        return files;
    }

    public GetJSObjectReference(element: HTMLElement, fileIndex: number): File {
        this.LogIfNull(element);
        const files = this.GetFiles(element);
        return files.item(fileIndex);
    }

    public GetFileCount = (element: HTMLElement): number => {
        this.LogIfNull(element);
        const files = this.GetFiles(element);
        if (!files) {
            return -1;
        }
        const result = files.length;
        return result;
    }

    public ClearValue = (element: HTMLInputElement): number => {
        this.LogIfNull(element);
        if (element instanceof HTMLInputElement) {
            element.value = null;
        } else {
            this.elementDataTransfers.delete(element);
        }

        return 0;
    };

    public GetFileInfoFromElement = (element: HTMLElement, index: number): IFileInfo => {
        this.LogIfNull(element);
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
            nonStandardProperties: null,
            size: file.size,
            type: file.type
        };
        const properties: { [propertyName: string]: object } = {};
        for (const property in file) {
            if (Object.prototype.hasOwnProperty.call(file, property) && !(property in result)) {
                properties[property] = file[property];
            }
        }
        result.nonStandardProperties = properties;
        return result;
    }

    public OpenRead = (element: HTMLElement, fileIndex: number, useWasmSharedBuffer: boolean): number => {
        this.LogIfNull(element);

        const files = this.GetFiles(element);
        if (!files) {
            throw 'No FileList available.';
        }
        const file = files.item(fileIndex);
        if (!file) {
            throw `No file with index ${fileIndex} available.`;
        }

        return this.OpenReadFile(file, useWasmSharedBuffer);
    }

    public OpenReadFile = (file: File, useWasmSharedBuffer: boolean): number => {
        if (useWasmSharedBuffer && !FileReaderJsInterop.initialized) {
            FileReaderJsInterop.initialize();
        }

        const fileRef: number = this.newFileStreamReference++;
        this.fileStreams[fileRef] = file;
        return fileRef;
    }


    public ReadFileParamsPointer = (readFileParamsPointer: Pointer): IReadFileParams => {
        return {
            taskId: Blazor.platform.readUint64Field(readFileParamsPointer, 0),
            bufferOffset: Blazor.platform.readUint64Field(readFileParamsPointer, 8),
            count: Blazor.platform.readInt32Field(readFileParamsPointer, 16),
            fileRef: Blazor.platform.readInt32Field(readFileParamsPointer, 20),
            position: Blazor.platform.readUint64Field(readFileParamsPointer, 24)
        };
    }

    public ReadBufferPointer = (readBufferPointer: Pointer): IBufferParams => {
        return {
            taskId: Blazor.platform.readUint64Field(readBufferPointer, 0),
            buffer: Blazor.platform.readInt32Field(readBufferPointer, 8) as unknown as System_Array<any>
        };
    }

    public ReadFileUnmarshalledAsync = (readFileParamsPointer: Pointer) => {
        const readFileParams = this.ReadFileParamsPointer(readFileParamsPointer);

        const asyncCall = new Promise<void>((resolve, reject) => {
            return this.ReadFileSlice(readFileParams, (r,b) => r.readAsArrayBuffer(b))
                .then(r => {
                    this.readResultByTaskId.set(readFileParams.taskId,
                    {
                        arrayBuffer: r.result as ArrayBuffer,
                        params: readFileParams
                    });
                    resolve();
                }, e => reject(e));
        });
        
        asyncCall.then(
            () => FileReaderJsInterop.endTask(readFileParams.taskId),
            error => {
                console.error("ReadFileUnmarshalledAsync error", error);
                DotNet.invokeMethodAsync(FileReaderJsInterop.assembly, "EndReadFileUnmarshalledAsyncError", readFileParams.taskId, error.toString());
            });

        return 0;
    }

    public FillBufferUnmarshalled = (bufferPointer: Pointer) => {
        const readBufferParams = this.ReadBufferPointer(bufferPointer);

        const dotNetBufferView = Blazor.platform.toUint8Array(readBufferParams.buffer);
        const data = this.readResultByTaskId.get(readBufferParams.taskId);
        this.readResultByTaskId.delete(readBufferParams.taskId);

        dotNetBufferView.set(new Uint8Array(data.arrayBuffer), data.params.bufferOffset);

        const byteCount = Math.min(data.arrayBuffer.byteLength, data.params.count);
        return byteCount;
    }

    public ReadFileMarshalledAsync = (readFileParams: IReadFileParams): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            return this.ReadFileSlice(readFileParams, (r,b) => r.readAsDataURL(b))
                .then(r => {
                    const contents = r.result as string;
                    const data = contents ? contents.split(";base64,")[1] : null;
                    resolve(data);
                }, e => reject(e));
        });
    }

    private ReadFileSlice = (readFileParams: IReadFileParams, method: (reader: FileReader, blob: Blob) => void): Promise<ReadFileSliceResult> => {
        return new Promise<ReadFileSliceResult>((resolve, reject) => {
            const file: File = this.fileStreams[readFileParams.fileRef];
            try {
                const reader = new FileReader();
                reader.onload = ((r) => {
                    return () => {
                        try {
                            resolve({result: r.result, file: file });
                        } catch (e) {
                            reject(e);
                        }
                    }
                })(reader);
                method(reader, file.slice(readFileParams.position, readFileParams.position + readFileParams.count));
            } catch (e) {
                reject(e);
            }
        });
    }
}

const FileReaderComponentInstance = new FileReaderComponent();

export { FileReaderComponent, FileReaderComponentInstance }