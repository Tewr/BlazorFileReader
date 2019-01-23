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

interface IBlazorMethodPointer { };

interface IDotNet {
  invokeMethodAsync<T>(assemblyName: string, methodIdentifier: string, ...args: any[]): Promise<T>
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

interface DotNetBuffer {
  toUint8Array(): Uint8Array;
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

    //console.debug("GetFileInfoFromFile", result);
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

  public ReadFileUnmarshalledAsync = (dotNetArrayPtr: any, readFileParamsPtr: any): boolean => {
    const readFileParams: IReadFileParams = JSON.parse(Blazor.platform.toJavaScriptString(readFileParamsPtr));
    const dotNetBuffer: DotNetBuffer = { toUint8Array: (): Uint8Array => Blazor.platform.toUint8Array(dotNetArrayPtr) };
    
    const file: File = this.fileStreams[readFileParams.fileRef];
    try {
      const reader = new FileReader();
      reader.onload = ((r) => {
        return () => {
          try {
            const contents: ArrayBuffer = <ArrayBuffer>r.result;
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

  public ReadFileMarshalledAsync = (readFileParams: IReadFileParams): number => {
    const file: File = this.fileStreams[readFileParams.fileRef];
    try {
      const reader = new FileReader();
      reader.onload = ((r) => {
        return () => {
          try {
            const contents = r.result as string;
            const data = contents.split(";base64,")[1];
            FileReaderInteropMethods.ReadFileMarshalledAsyncCallback(readFileParams.callBackId, data);
          } catch (e) {
            FileReaderInteropMethods.ReadFileAsyncError(readFileParams.callBackId, e.message);
          }
        }
      })(reader);
      reader.readAsDataURL(file.slice(readFileParams.position, readFileParams.position + readFileParams.count));
    } catch (e) {
      FileReaderInteropMethods.ReadFileAsyncError(readFileParams.callBackId, e.message);
    }

    return 0;
  }
}

class FileReaderInteropMethods {

  private static assemblyName: string = "Blazor.FileReader";
  private static methods: { [key: string]: any } = {};
  private static dotNet: IDotNet = DotNet;

  public static ReadFileAsyncError(callBackId: number, exception: string) {
    this.CallMethod("ReadFileAsyncError", { callBackId, exception });
  }

  public static ReadFileAsyncCallback(callBackId: number, bytesRead: number) {
    this.CallMethod("ReadFileAsyncCallback", { callBackId, bytesRead });
  }

  public static ReadFileMarshalledAsyncCallback(callBackId: number, data: string) {
    this.CallMethod("ReadFileMarshalledAsyncCallback", { callBackId, data });
  }

  private static CallMethod(name: string, params: any): any {
    this.dotNet.invokeMethodAsync(this.assemblyName, name, params);
  }
}

(window as any).FileReaderComponent = new FileReaderComponent();