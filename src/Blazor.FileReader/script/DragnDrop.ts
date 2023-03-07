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
        const entry = webkitQueue[i];

        const entryContent = await readEntryContentAsync(entry);
        files.push(...entryContent);
    }

    // Get the content for any other files
    for (let i = 0; i < fileQueue.length; i++) {
        const entry = fileQueue[i];
        files.push(entry);
    }

    return new FileEntryList(files);;
}

// Returns a promise with all the files in the directory hierarchy
async function readEntryContentAsync(entry: FileSystemEntry): Promise<File[]> {
    return await new Promise<File[]>((resolve, reject) => {
        let reading = 0;
        const contents: File[] = [];

        return readEntry(entry);

        function readEntry(innerEntry: FileSystemEntry) {
            if (isFile(innerEntry)) {
                reading++;
                let fullPath = innerEntry.fullPath;
                if (fullPath.charAt(0) === "/" || fullPath.charAt(0) === "\\")
                    fullPath = fullPath.substring(1);

                innerEntry.file(file => {
                    reading--;
                    // overwrite the webkitRelativePath to ensure the correct path is added from the entry.
                    Object.defineProperty(file, "webkitRelativePath",
                        {
                            get() {
                                return fullPath;
                            }
                        });
                    contents.push(file);

                    if (reading === 0) {
                        resolve(contents);
                    }
                });
            } else if (isDirectory(innerEntry)) {
                readReaderContent(innerEntry.createReader());
            }
        }

        function readReaderContent(reader: FileSystemDirectoryReader) {
            reading++;

            reader.readEntries(function (entries) {
                reading--;
                for (const entry of entries) {
                    readEntry(entry);
                }

                if (reading === 0) {
                    resolve(contents);
                }
            });
        }
    });
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
    const dropHandler = async (ev: DragEvent) => {
        ev.preventDefault();

        if (ev.target instanceof HTMLElement) {
            let list = await getFilesAsync((ev.dataTransfer));
            if (registerOptions.additive) {
                const existing = this.elementDataTransfers.get(element);
                if (existing !== undefined && existing.length > 0) {
                    list = new ConcatFileList(existing, list);
                }
            }

            this.elementDataTransfers.set(element, list);
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