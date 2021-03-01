import { FileReaderComponent } from "./FileReaderComponent"
import { FileReaderJsInterop } from "./FileReaderJsInterop"

const nameof = <T>(name: keyof T) => name;
const dropEvent = nameof<DragEvents>("drop");
const dragOverEvent = nameof<DragEvents>("dragover");
type DragEventHandler = (dragEvent: DragEvent, element: HTMLElement, fileReaderComponent: FileReaderComponent) => void;

class ConcatFileList implements FileList {
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

function RegisterDropEvents(this: FileReaderComponent, element: HTMLElement, registerOptions: DropEventsOptions): boolean {
    this.LogIfNull(element);

    const onAfterDropHandler = BuildDragEventHandler(registerOptions.onDropMethod, registerOptions.onDropScript, dropEvent);
    const dropHandler = (ev: DragEvent) => {
        ev.preventDefault();
        if (ev.target instanceof HTMLElement) {
            let list = ev.dataTransfer.files;
            
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