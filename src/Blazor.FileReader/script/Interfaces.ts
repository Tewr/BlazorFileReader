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


