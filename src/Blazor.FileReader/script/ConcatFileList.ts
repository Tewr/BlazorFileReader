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

export { ConcatFileList }