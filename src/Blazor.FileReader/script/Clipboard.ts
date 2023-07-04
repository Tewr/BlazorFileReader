import { FileReaderComponent } from "./FileReaderComponent"
import { ConcatFileList } from "./ConcatFileList"

function RegisterPasteEvent(this: FileReaderComponent, element: HTMLElement, registerOptions: PasteEventOptions): boolean {
    this.LogIfNull(element);

    const pasteHandler = async (ev: ClipboardEvent) => {
        if (ev.target instanceof HTMLElement) {
            const listPromise = new Promise<FileList>(async (resolve, reject) => {
                try {
                    let list = ev.clipboardData.files;
                    if (list.length > 0) {
                        ev.preventDefault();
                        if (registerOptions.additive) {
                            const existing = await this.elementDataTransfers.get(element);
                            if (existing !== undefined && existing.length > 0) {
                                list = new ConcatFileList(existing, list);
                            }
                        }
                    }

                    resolve(list);
                }
                catch (e) {
                    reject(e);
                }
            });

            this.elementDataTransfers.set(element, listPromise);
        }
    };

    this.pasteElements.set(element, pasteHandler);
    element.addEventListener("paste", pasteHandler);
    return true;
}


function UnregisterPasteEvent(this: FileReaderComponent, element: HTMLElement): boolean {
    this.LogIfNull(element);
    const eventHandler = this.pasteElements.get(element);
    if (eventHandler) {
        element.removeEventListener("paste", eventHandler);
    }

    this.elementDataTransfers.delete(element);
    this.pasteElements.delete(element);
    return true;
}

export { RegisterPasteEvent, UnregisterPasteEvent }