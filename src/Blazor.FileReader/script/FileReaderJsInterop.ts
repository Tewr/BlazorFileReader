declare const Module: IModule;

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

export { FileReaderJsInterop }