declare const Blazor: IBlazor;
declare const DotNet: IDotNet;
declare const Module: IModule;

interface IDotNet {
    invokeMethodAsync<T>(assemblyName: string, methodIdentifier: string, ...args: any[]): Promise<T>;
}
interface IBlazor {
    platform: IBlazorPlatform;
}
interface IModule {
    mono_bind_static_method(fqn: string, signature?: any): (...args: any[]) => any;
}
interface MethodHandle { MethodHandle__DO_NOT_IMPLEMENT: any }
interface System_Object { System_Object__DO_NOT_IMPLEMENT: any }
interface System_Array<T> extends System_Object { System_Array__DO_NOT_IMPLEMENT: any }
interface Pointer { Pointer__DO_NOT_IMPLEMENT: any }

interface IBlazorPlatform {
    toJavaScriptString(pointer: any): string;
    toUint8Array(array: System_Array<any>): Uint8Array;
    readInt16Field(baseAddress: Pointer, fieldOffset?: number): number;
    readInt32Field(baseAddress: Pointer, fieldOffset?: number): number;
    readUint64Field(baseAddress: Pointer, fieldOffset?: number): number;
    readFloatField(baseAddress: Pointer, fieldOffset?: number): number;
    readObjectField<T extends System_Object>(baseAddress: Pointer, fieldOffset?: number): T;
    readStringField(baseAddress: Pointer, fieldOffset?: number): string | null;
    readStructField<T extends Pointer>(baseAddress: Pointer, fieldOffset?: number): T;
}

interface IReadFileParams {
    taskId: number;
    bufferOffset: number;
    count: number;
    fileRef: number;
    position: number;
};

interface IBufferParams {
    taskId: number;
    buffer: System_Array<object>;
};

interface IReadFileData {
    arrayBuffer: ArrayBuffer;
    params: IReadFileParams;
}

interface ReadFileSliceResult {
    file: File;
    result: string | ArrayBuffer;
}

interface IFileInfo {
    name: string;
    nonStandardProperties: any;
    size: number;
    type: string;
    lastModified: number;
};

interface IDotNetBuffer {
    toUint8Array(): Uint8Array;
}

/**
 * Proxy class for the c# class Tewr.Blazor.FileReader.FileReaderJsInterop
 * */
class FileReaderJsInterop {
    static assembly = 'Tewr.Blazor.FileReader';
    static initialized = false;
    static initialize() {
        FileReaderJsInterop.endTask =
            Module.mono_bind_static_method(`[${this.assembly}] Tewr.Blazor.FileReader.FileReaderJsInterop:EndTask`);
        FileReaderJsInterop.initialized = true;
    }

    /**
     * Unmarshalled callback for ending the current read task
     * */
    static endTask: (taskId: number) => void;
}

interface DragEvents {
    drop: EventListenerOrEventListenerObject;
    dragover: EventListenerOrEventListenerObject;
}

interface DropEventsOptions {
    additive: boolean;
    onDropMethod: string;
    onDropScript: string;
    onDragOverMethod: string;
    onDragOverScript: string;
    onRegisterDropEventsMethod: string;
    onRegisterDropEventsScript: string;
}

type DragEventHandler = (dragEvent: DragEvent, element: HTMLElement, fileReaderComponent: FileReaderComponent) => void;

const nameof = <T>(name: keyof T) => name;

class FileReaderComponent {

    private newFileStreamReference = 0;
    private readonly fileStreams: { [reference: number]: File } = {};

    private readonly dropEvent = nameof<DragEvents>("drop");
    private readonly dragOverEvent = nameof<DragEvents>("dragover");
    private readonly dragElements: Map<HTMLElement, DragEvents> = new Map();

    private readonly elementDataTransfers: Map<HTMLElement, FileList> = new Map();
    private readonly readResultByTaskId: Map<number, IReadFileData> = new Map();

    private LogIfNull(element: HTMLElement) {
        if (element == null) {
            console.log(`${FileReaderJsInterop.assembly}: HTMLElement is null. Can't access IFileReaderRef after HTMLElement was removed from DOM.`);
        }
    }

    private BuildDragEventHandler = (declaredMethod: string, script: string, eventDescription: string) : DragEventHandler => {

        let declaredHandler: DragEventHandler;
        if (declaredMethod) {
            if (!window.hasOwnProperty(declaredMethod) || typeof window[declaredMethod] !== 'function') {
                throw (`${FileReaderJsInterop.assembly}.BuildDragEventHandler: window.${declaredMethod} was provided as an option for event '${eventDescription}', but was not declared or was not a function. Make sure your script that defines this method is loaded before calling RegisterDropEvents.`);
            }
            else {
                declaredHandler = window[declaredMethod];
            }
        }

        if (script) {
            const scriptHandler = Function(`return ${script}`)() as DragEventHandler;
            if (!scriptHandler || typeof scriptHandler !== 'function') {
                throw (`${FileReaderJsInterop.assembly}.BuildDragEventHandler: plugin was provided as an option for event '${eventDescription}', but was not properly declared or was not a function.`);
            }
            else {
                if (!declaredHandler) {
                    return scriptHandler;
                }

                // Executes declared handler first, then script handler.
                return (dragEvent: DragEvent, element: HTMLElement, fileReaderComponent: FileReaderComponent) => {
                    declaredHandler(dragEvent, element, fileReaderComponent);
                    scriptHandler(dragEvent, element, fileReaderComponent);
                }
            }
        }

        if (declaredHandler) {
            return declaredHandler;
        }

        return (() => { }) as DragEventHandler;
    }

    public RegisterDropEvents = (element: HTMLElement, registerOptions: DropEventsOptions): boolean => {
        this.LogIfNull(element);

        const onAfterDropHandler = this.BuildDragEventHandler(registerOptions.onDropMethod, registerOptions.onDropScript, this.dropEvent);
        const dropHandler = (ev: DragEvent) => {
            this.PreventDefaultHandler(ev);
            if (ev.target instanceof HTMLElement) {
                let list = ev.dataTransfer.files;

                if (registerOptions.additive) {
                    const existing = this.elementDataTransfers.get(element);
                    if (existing !== undefined && existing.length > 0) {
                        list = new FileReaderComponent.ConcatFileList(existing, list);
                    }
                }
                
                this.elementDataTransfers.set(element, list);
            }

            onAfterDropHandler(ev, element, this);
        };

        const onAfterDragOverHandler = this.BuildDragEventHandler(registerOptions.onDragOverMethod, registerOptions.onDragOverScript, this.dragOverEvent);
        const dragOverHandler = (ev: DragEvent) => {
            this.PreventDefaultHandler(ev);
            onAfterDragOverHandler(ev, element, this);
        };

        const onAfterRegisterHandler = this.BuildDragEventHandler(registerOptions.onRegisterDropEventsMethod, registerOptions.onRegisterDropEventsScript, 'RegisterDropEvents');

        const eventHandlers = { drop: dropHandler, dragover: dragOverHandler };
        this.dragElements.set(element, eventHandlers);
        element.addEventListener(this.dropEvent, eventHandlers.drop);
        element.addEventListener(this.dragOverEvent, eventHandlers.dragover);

        onAfterRegisterHandler(null, element, this);
        return true;
    }

    public UnregisterDropEvents = (element: HTMLElement): boolean => {
        this.LogIfNull(element);
        const eventHandlers = this.dragElements.get(element);
        if (eventHandlers) {
            element.removeEventListener(this.dropEvent, eventHandlers.drop);
            element.removeEventListener(this.dragOverEvent, eventHandlers.dragover);
        }
        this.elementDataTransfers.delete(element);
        this.dragElements.delete(element);
        return true;
    }

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
        if (useWasmSharedBuffer && !FileReaderJsInterop.initialized) {
            FileReaderJsInterop.initialize();
        }

        const files = this.GetFiles(element);
        if (!files) {
            throw 'No FileList available.';
        }
        const file = files.item(fileIndex);
        if (!file) {
            throw `No file with index ${fileIndex} available.`;
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

    private PreventDefaultHandler = (ev: DragEvent) => {
        ev.preventDefault();
    }

    static ConcatFileList = class implements FileList {
        [index: number]: File;

        length: number;

        item(index: number): File {
            return this[index];
        }

        constructor(existing: FileList, additions: FileList) {
            for (let i = 0; i < existing.length; i++) {
                this[i] = existing[i];
            }

            const eligebleAdditions = [];

            // Check for doubles
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
                    eligebleAdditions[eligebleAdditions.length] = addition;
                }
            }

            for (let i = 0; i < eligebleAdditions.length; i++) {
                this[i + existing.length] = eligebleAdditions[i];
            }

            this.length = existing.length + eligebleAdditions.length;
        }
    }
}

(window as any).FileReaderComponent = new FileReaderComponent();
