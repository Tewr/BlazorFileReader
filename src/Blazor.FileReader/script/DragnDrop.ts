import { FileReaderComponent } from "./FileReaderComponent"
import { FileReaderJsInterop } from "./FileReaderJsInterop"
import { ConcatFileList } from "./ConcatFileList"
import { FileEntryList } from "./FileEntryList"

const nameof = <T>(name: keyof T) => name;
const dropEvent = nameof<DragEvents>("drop");
const dragOverEvent = nameof<DragEvents>("dragover");
type DragEventHandler = (dragEvent: DragEvent, element: HTMLElement, fileReaderComponent: FileReaderComponent) => void;

function BuildDragEventHandler(declaredMethod: string, script: string, eventDescription: string): DragEventHandler {

    let declaredHandler: DragEventHandler;
    if (declaredMethod) {
        if (!window.hasOwnProperty(declaredMethod) || typeof window[declaredMethod] !== 'function') {
            throw (`${FileReaderJsInterop.assembly}: BuildDragEventHandler: window.${declaredMethod} was provided as an option for event '${eventDescription}', but was not declared or was not a function. Make sure your script that defines this method is loaded before calling RegisterDropEvents.`);
        }
        else {
            declaredHandler = window[declaredMethod];
        }
    }

    if (script) {
        const scriptHandler = Function(`return ${script}`)() as DragEventHandler;
        if (!scriptHandler || typeof scriptHandler !== 'function') {
            throw (`${FileReaderJsInterop.assembly}: BuildDragEventHandler: script was provided as an option for event '${eventDescription}', but was not properly declared or was not a function.`);
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

// Go through the data transfer object to pull out the files and folders
async function getFilesAsync(dataTransfer: DataTransfer): Promise<FileList> {
    //return await new Promise<FileList>((resolve, reject) => {
    const files: File[] = [];
    const len = dataTransfer.items.length;
    const webkitQueue: FileSystemEntry[] = [];
    const fileQueue: File[] = [];

    // First must save off all the files
    for (let i = 0; i < len; i++) {
        const item = dataTransfer.items[i];
        if (item.kind === "file") {
            if (typeof item.webkitGetAsEntry === "function") {
                const entry = item.webkitGetAsEntry();
                webkitQueue.push(entry);
            } else {
                const file = item.getAsFile();
                if (file) {
                    fileQueue.push(file);
                }
            }
        }
    }

    // Get the content for the web kit files
    for (let i = 0; i < webkitQueue.length; i++) {
        const file = await readEntryAsync(webkitQueue[i]);
        files.push(...file);
    }

    // Get the content for any other files
    files.push(...fileQueue);

    return new FileEntryList(files);
}

async function readEntryAsync(innerEntry: FileSystemEntry): Promise<File[]> {
    const files: File[] = [];

    if (isFile(innerEntry)) {
        let fullPath = innerEntry.fullPath;
        if (fullPath.charAt(0) === "/" || fullPath.charAt(0) === "\\")
            fullPath = fullPath.substring(1);
        try {
            const file = await getFile(innerEntry);
            files.push(redefineWebkitRelativePath(file, fullPath));
        } catch (err) {
            console.error(`error on ${fullPath}`);
            console.error(err);
            throw err;
        }
    } else if (isDirectory(innerEntry)) {
        try {
            const entries = await getEntries(innerEntry.createReader());
            for (const entry of entries) {
                const innerFiles = await readEntryAsync(entry);
                files.push(...innerFiles);
            }
        } catch (err2) {
            console.error(err2);
            throw err2;
        }
    }

    return files;
}

async function getEntries(reader): Promise<FileSystemFileEntry[]> {
    return await new Promise((resolve, reject) => reader.readEntries(resolve, reject));
}

async function getFile(fileEntry: FileSystemFileEntry): Promise<File> {
    return new Promise((resolve, reject) => fileEntry.file(resolve, reject));
}

function redefineWebkitRelativePath(file: File, fullPath: string): File {
    // overwrite the webkitRelativePath to ensure the correct path is added from the entry.
    Object.defineProperty(file, "webkitRelativePath",
        {
            get() {
                return fullPath;
            }
        });

    return file;
}

// for TypeScript typing (type guard function)
// https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
function isDirectory(entry: FileSystemEntry): entry is FileSystemDirectoryEntry {
    return entry.isDirectory;
}

function isFile(entry: FileSystemEntry): entry is FileSystemFileEntry {
    return entry.isFile;
}

function RegisterDropEvents(this: FileReaderComponent, element: HTMLElement, registerOptions: DropEventsOptions): boolean {
    this.LogIfNull(element);

    const onAfterDropHandler = BuildDragEventHandler(registerOptions.onDropMethod, registerOptions.onDropScript, dropEvent);
    const dropHandler = (ev: DragEvent) => {
        ev.preventDefault();
        this.elementDataTransfers.clear();
        if (ev.target instanceof HTMLElement) {
            const filePromise = new Promise<FileList>(async (resolve, reject) => {
                try {
$                    let files = await getFilesAsync((ev.dataTransfer));
                    if (registerOptions.additive) {
                        const existing = await this.elementDataTransfers.get(element) ?? new FileList();
                        if (existing.length > 0) {
                            files = new ConcatFileList(existing, files);
                        }
                    }
                        resolve(files);
                } catch (e) {
                    reject(e);
                }
            });

            this.elementDataTransfers.set(element, filePromise);
        }

        onAfterDropHandler(ev, element, this);
    };

    const onAfterDragOverHandler = BuildDragEventHandler(registerOptions.onDragOverMethod, registerOptions.onDragOverScript, dragOverEvent);
    const dragOverHandler = (ev: DragEvent) => {
        ev.preventDefault();
        onAfterDragOverHandler(ev, element, this);
    };

    const onAfterRegisterHandler = BuildDragEventHandler(registerOptions.onRegisterDropEventsMethod, registerOptions.onRegisterDropEventsScript, 'RegisterDropEvents');

    const eventHandlers = { drop: dropHandler, dragover: dragOverHandler };
    this.dragElements.set(element, eventHandlers);
    element.addEventListener(dropEvent, eventHandlers.drop);
    element.addEventListener(dragOverEvent, eventHandlers.dragover);

    onAfterRegisterHandler(null, element, this);
    return true;
}


function UnregisterDropEvents(this: FileReaderComponent, element: HTMLElement): boolean {
    this.LogIfNull(element);
    const eventHandlers = this.dragElements.get(element);
    if (eventHandlers) {
        element.removeEventListener(dropEvent, eventHandlers.drop);
        element.removeEventListener(dragOverEvent, eventHandlers.dragover);
    }
    this.elementDataTransfers.delete(element);
    this.dragElements.delete(element);
    return true;
}

export { BuildDragEventHandler, RegisterDropEvents, UnregisterDropEvents }