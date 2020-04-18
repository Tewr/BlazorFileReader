declare const Blazor: IBlazor;

interface IBlazor {
    platform: IBlazorPlatform;
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
    buffer: System_Array<any>;
    bufferOffset: number;
    count: number;
    fileRef: number;
    position: number;
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

class FileReaderComponent {

    private newFileStreamReference = 0;
    private readonly fileStreams: { [reference: number]: { file: File, arrayBuffer: ArrayBuffer } } = {};
    private readonly dragElements: Map<HTMLElement, EventListenerOrEventListenerObject> = new Map();
    private readonly elementDataTransfers: Map<HTMLElement, FileList> = new Map();

    public RegisterDropEvents = (element: HTMLElement, additive: boolean): boolean => {

        const handler = (ev: DragEvent) => {
            this.PreventDefaultHandler(ev);
            if (ev.target instanceof HTMLElement) {
                let list = ev.dataTransfer.files;

                if (additive) {
                    const existing = this.elementDataTransfers.get(element);
                    if (existing !== undefined && existing.length > 0) {
                        list = new FileReaderComponent.ConcatFileList(existing, list);
                    }
                }
                
                this.elementDataTransfers.set(element, list);
            }
        };

        this.dragElements.set(element, handler);
        element.addEventListener("drop", handler);
        element.addEventListener("dragover", this.PreventDefaultHandler);
        return true;
    }

    public UnregisterDropEvents = (element: HTMLElement): boolean => {
        const handler = this.dragElements.get(element);
        if (handler) {
            element.removeEventListener("drop", handler);
            element.removeEventListener("dragover", this.PreventDefaultHandler);
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
        const files = this.GetFiles(element);
        if (!files) {
            return -1;
        }
        const result = files.length;
        return result;
    }

    public ClearValue = (element: HTMLInputElement): number => {
        if (element instanceof HTMLInputElement) {
            element.value = null;
        } else {
            this.elementDataTransfers.delete(element);
        }

        return 0;
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

    public OpenRead = (element: HTMLElement, fileIndex: number): Promise<number> => {
        return new Promise<number>((resolve, reject) => {
            const files = this.GetFiles(element);
            if (!files) {
                throw 'No FileList available.';
            }
            const file = files.item(fileIndex);
            if (!file) {
                throw `No file with index ${fileIndex} available.`;
            }

            const fileRef: number = this.newFileStreamReference++;
            const reader = new FileReader();
            reader.onload = ((r) => {
                return () => {
                    try {
                        const arrayBuffer: ArrayBuffer = r.result as ArrayBuffer;
                        this.fileStreams[fileRef] = { file, arrayBuffer };
                        
                        resolve(fileRef);
                    } catch (e) {
                        reject(e);
                    }
                }
            })(reader);
            reader.readAsArrayBuffer(file);
            
            return fileRef;
        });
    }
    public ReadFileParamsPointer = (readFileParamsPointer: Pointer): IReadFileParams => {
        return {
            bufferOffset: Blazor.platform.readUint64Field(readFileParamsPointer, 0),
            count: Blazor.platform.readInt32Field(readFileParamsPointer, 8),
            fileRef: Blazor.platform.readInt32Field(readFileParamsPointer, 12),
            position: Blazor.platform.readUint64Field(readFileParamsPointer, 16),
            buffer: Blazor.platform.readInt32Field(readFileParamsPointer, 24) as unknown as System_Array<any>
        };
    }
    public ReadFileUnmarshalledAsync = (readFileParamsPointer: Pointer) => {
        const readFileParams = this.ReadFileParamsPointer(readFileParamsPointer);
        const fileStream = this.fileStreams[readFileParams.fileRef];
        const dotNetBuffer = readFileParams.buffer;
        const dotNetBufferView: Uint8Array = Blazor.platform.toUint8Array(dotNetBuffer);
        const byteCount = Math.min(fileStream.arrayBuffer.byteLength - readFileParams.position, readFileParams.count);
        dotNetBufferView.set(new Uint8Array(fileStream.arrayBuffer, readFileParams.position, byteCount), readFileParams.bufferOffset);
        return byteCount;
    }

    public ReadFileMarshalledAsync = (readFileParams: IReadFileParams): Promise<string> => {
        
        return new Promise<string>((resolve, reject) => {
            const file: File = this.fileStreams[readFileParams.fileRef].file;
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
