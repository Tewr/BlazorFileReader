// FileList from File[]
class FileEntryList implements FileList {
    [index: number]: File;

    length: number;

    item(index: number): File {
        return this[index];
    }

    constructor(additions: File[]) {
        for (let i = 0; i < additions.length; i++) {
            this[i] = additions[i];
        }

        this.length = additions.length;
    }
}

export { FileEntryList }